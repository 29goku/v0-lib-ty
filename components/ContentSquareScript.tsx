export default function ContentSquareScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.CONTENTSQUARE_SETTINGS = {projectId: 701840};
          (function(d) {
            var s = d.createElement('script');
            s.src = 'https://t.contentsquare.net/uxa/30128e1ba16f9.js';
            s.async = true;
            d.documentElement.appendChild(s);
          })(document);
        `,
      }}
    />
  )
}
