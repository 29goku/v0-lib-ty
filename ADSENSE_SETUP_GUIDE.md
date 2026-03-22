# Google AdSense Setup Guide

This guide explains how to set up Google AdSense monetization on your Leben in Deutschland Test app.

## Overview

The app now includes Google AdSense integration with ad placements on:
- **Homepage**: After hero section and before final CTA
- **Ready for expansion**: Practice page, test page, review page

## Step 1: Create Google AdSense Account

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign in with your Google account
3. Click "Get Started"
4. Enter your website URL: `https://lebeninde.com`
5. Accept terms and complete verification

> **Note**: Google will verify your website ownership and check content quality. This typically takes 24-48 hours.

## Step 2: Get Your Publisher ID

Once approved:
1. Go to **Settings** → **Account**
2. Find "Publisher ID" (format: `ca-pub-xxxxxxxxxxxxxxxx`)
3. Copy this ID

## Step 3: Configure Environment Variable

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Publisher ID:
   ```
   NEXT_PUBLIC_GOOGLE_AD_CLIENT=ca-pub-xxxxxxxxxxxxxxxx
   ```

3. Save the file (never commit `.env.local` to git)

## Step 4: Optional - Create Ad Units

For better performance tracking, create custom ad units in AdSense:

1. Go to **Ads** → **Ad units**
2. Click **New ad unit**
3. Configure:
   - **Name**: e.g., "Homepage Top"
   - **Format**: Responsive
   - **Type**: Display ads
4. Get the slot ID from the ad unit settings
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_AD_SLOT_HOMEPAGE_TOP=1234567890
   ```

## Step 5: Deploy and Monitor

1. Deploy to production:
   ```bash
   git add .env.local
   npm run build
   npm run start
   ```

2. Wait 5-10 minutes for ads to appear (Google needs time to crawl and match content)

3. Monitor in AdSense dashboard:
   - **Performance**: Views, clicks, earnings
   - **Coverage**: How much traffic gets ads
   - **Optimization**: Get recommendations

## Ad Placement Components

### AdBanner Component
Simple responsive ad banner that appears anywhere on your page:

```tsx
import AdBanner from '@/components/AdBanner'

export default function MyPage() {
  return (
    <>
      <h1>My Page</h1>
      <AdBanner
        slot="YOUR_SLOT_ID"
        format="auto"
        responsive={true}
      />
    </>
  )
}
```

### GoogleAdSense Component
Global AdSense initialization - already included in `app/layout.tsx`:

```tsx
import GoogleAdSense from '@/components/GoogleAdSense'
// This initializes AdSense globally
```

## Revenue Optimization Tips

### 1. Placement Strategy
- **Above fold (visible without scrolling)**: 30-40% higher CTR
- **Between content**: Natural reading breaks
- **Multiple units**: Test different positions
- **Avoid**: Too many ads (90% CTR drop after 3 units)

### 2. Content Optimization
- Target high-CPC keywords (education content pays well)
- Increase organic traffic to increase impressions
- Keep content quality high (AdSense penalizes low-quality sites)

### 3. Current Placements
- Homepage top: After hero section
- Homepage bottom: Before final CTA

### 4. Recommended Additional Placements
- Practice page: After every 5 questions
- Test results page: After score display
- Review page: Between question sections
- Stats page: In sidebar or after charts

## Monitoring & Debugging

### Check if Ads Are Loading

1. Open your site in browser
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Run:
   ```javascript
   console.log((window).adsbygoogle)
   ```
   Should show an array with your ad configuration

### Common Issues

| Issue | Solution |
|-------|----------|
| Ads not showing | Wait 24-48h for approval, check ad density |
| Very low CTR | Improve content, check ad placement, test colors |
| Account disabled | Check AdSense policies, review content |
| Slow page load | Ads load asynchronously; monitor performance |

## AdSense Policies

⚠️ **Important**: Violating AdSense policies can result in account suspension.

### Allowed
✅ Educational content
✅ Multiple ad units per page
✅ Automatic ad optimization
✅ Native ads and display ads mixed

### Not Allowed
❌ Clicking your own ads
❌ Encouraging clicks
❌ Placing ads in iframes without disclosure
❌ Ad networks competing with AdSense (unless allowed)
❌ Excessive ads that reduce content visibility

## Earnings Estimates

Google AdSense earnings vary by:
- **Traffic volume**: More visitors = more impressions
- **Content niche**: Education typically $5-15 CPM
- **Audience location**: US/UK traffic pays more
- **Time of year**: Q4 pays more (holiday spending)

For a German citizenship test app:
- **1,000 monthly visitors**: $5-15/month
- **10,000 monthly visitors**: $50-150/month
- **100,000 monthly visitors**: $500-1,500/month

## Next Steps

1. ✅ [Create AdSense account](https://www.google.com/adsense)
2. ✅ Get Publisher ID
3. ✅ Add to `.env.local`
4. ✅ Deploy to production
5. ✅ Monitor performance
6. ✅ Optimize placement based on data

## Support

- [Google AdSense Help Center](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Optimization Guide](https://support.google.com/adsense/answer/11455166)

---

**Note**: This app uses automatic ad placement. All ads are family-safe and comply with Google AdSense policies.
