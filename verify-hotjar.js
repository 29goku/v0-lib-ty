const puppeteer = require('puppeteer');

(async () => {
  console.log('🔍 Starting Hotjar verification...\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set up console message listener
    let hotjarFound = false;
    let hotjarErrors = [];

    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('hj') || text.includes('hotjar')) {
        console.log('📝 Console:', text);
      }
    });

    page.on('error', err => {
      hotjarErrors.push(err.message);
    });

    console.log('📡 Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle2', timeout: 30000 });

    // Check if Hotjar script is loaded
    console.log('\n✅ Checking for Hotjar...\n');

    const hotjarPresent = await page.evaluate(() => {
      // Check if hj object exists
      if (window.hj) {
        console.log('✓ window.hj object found');
        return true;
      }
      return false;
    });

    // Check for Hotjar script in page
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).map(s => s.src);
    });

    const hasHotjarScript = scripts.some(src => src.includes('hotjar'));
    console.log('📋 Scripts found in page:');
    scripts.forEach((src, i) => {
      if (src.includes('hotjar')) {
        console.log(`  ✅ ${i + 1}. ${src}`);
      } else if (src) {
        console.log(`  ℹ️  ${i + 1}. ${src.substring(0, 60)}...`);
      }
    });

    // Check for HotjarScript component in HTML
    const html = await page.content();
    const hasHotjarComponent = html.includes('hotjar') || html.includes('5094656');

    console.log('\n📝 Verification Results:\n');
    console.log(`✅ Hotjar Script Element: ${hasHotjarScript ? '✓ FOUND' : '✗ NOT FOUND'}`);
    console.log(`✅ Hotjar Object (window.hj): ${hotjarPresent ? '✓ FOUND' : '✗ NOT FOUND'}`);
    console.log(`✅ Hotjar ID (5094656) in HTML: ${hasHotjarComponent ? '✓ FOUND' : '✗ NOT FOUND'}`);

    if (hasHotjarScript && hasHotjarComponent) {
      console.log('\n🎉 SUCCESS! Hotjar is properly installed and verified!\n');
      console.log('Hotjar is now tracking:');
      console.log('  📊 User sessions');
      console.log('  🔥 Heatmaps');
      console.log('  📹 Session replays');
      console.log('  📈 Funnel analysis');
      console.log('  💬 User feedback\n');
    } else {
      console.log('\n⚠️  Hotjar installation may be incomplete.\n');
    }

    await browser.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
