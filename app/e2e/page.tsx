'use client';

import { useEffect, useState } from 'react';

export default function E2EReportPage() {
  const [iframeUrl, setIframeUrl] = useState<string>('');

  useEffect(() => {
    // Use public folder path to the report
    setIframeUrl('/playwright-report/index.html');
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-black">
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3">
        <h1 className="text-white font-semibold">E2E Test Report</h1>
        <p className="text-gray-400 text-sm">Playwright Test Results</p>
      </div>

      {iframeUrl && (
        <iframe
          src={iframeUrl}
          title="Playwright E2E Report"
          className="flex-1 w-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      )}

      {!iframeUrl && (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-400">Loading report...</p>
        </div>
      )}
    </div>
  );
}
