import React, { useState, useEffect, useRef } from 'react';

const chatIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const ChatWidget: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-open feedback on first visit after a short delay (only once)
  useEffect(() => {
    try {
      const alreadyOpened = localStorage.getItem('feedbackAutoOpened');
      if (!alreadyOpened) {
        const timer = window.setTimeout(() => {
          setOpen(true);
          // mark that we've auto-opened so this only happens once
          try {
            localStorage.setItem('feedbackAutoOpened', '1');
          } catch (e) {
            // ignore storage errors
          }
        }, 13000); // 3s delay before auto-opening

        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage not available; do nothing
    }
  }, []);

  // Focus textarea whenever the widget is opened
  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/chat-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setTimeout(() => {
          setOpen(false);
          setSent(false);
          setInput('');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send message.');
      }
    } catch (err) {
      setError('Network error.');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Floating feedback button */}
      {!open && (
        <button
          aria-label="Open feedback"
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-white border border-gray-200 shadow-lg rounded-full w-14 h-14 flex items-center justify-center hover:shadow-xl transition"
        >
          {chatIcon}
        </button>
      )}

      {/* Feedback popup */}
      {open && (
        <div className="fixed bottom-8 right-8 z-50 w-[350px] max-w-[90vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[chatOpen_0.3s_cubic-bezier(.4,2,.6,1)] border border-gray-200 font-sans">
          {/* Header */}
          <div className="bg-blue-600 text-white px-5 py-4 font-semibold text-lg flex items-center justify-between">
            <span></span>
            <button aria-label="Close feedback" onClick={() => setOpen(false)} className="bg-transparent border-none text-white text-2xl cursor-pointer font-normal">&times;</button>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 bg-gray-50">
            {!sent ? (
              <form onSubmit={sendMessage} className="w-full flex flex-col gap-4">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Your feedback or message..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base bg-gray-100 resize-none font-sans"
                  rows={4}
                  disabled={loading}
                  // autofocus handled via ref when opened
                 />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white rounded-lg px-5 py-2 font-semibold text-base shadow hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            ) : (
              <div className="text-center w-full">
                <div className="text-blue-600 text-lg font-semibold mb-2">Message sent!</div>
                <div className="text-gray-700 text-base">Our team will look into it. Thank you for your feedback.</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Animation keyframes */}
      <style>{`
        @keyframes chatOpen {
          0% { transform: scale(0.8) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
