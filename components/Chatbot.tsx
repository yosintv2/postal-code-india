'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  from: 'bot' | 'user';
  text: string;
}

const QUICK_QUESTIONS = [
  'What is a PIN code?',
  'How do I find my PIN code?',
  'What does H.O mean?',
  'How to write an address?',
  'How many post offices in India?',
];

function getResponse(q: string): string {
  const lq = q.toLowerCase();

  if (lq.includes('what is') && (lq.includes('pin code') || lq.includes('pincode'))) {
    return 'A PIN (Postal Index Number) code is a 6-digit number used by India Post to identify individual post offices and delivery zones. It was introduced in 1972 and covers all of India.';
  }
  if (lq.includes('find') || lq.includes('search') || lq.includes('look up') || lq.includes('lookup')) {
    return 'You can find any PIN code using the search bar at the top of the homepage. Type a post office name, locality, district, or 6-digit PIN code and results will appear instantly!';
  }
  if (lq.includes('h.o') || lq.includes('head office') || lq.includes('s.o') || lq.includes('b.o') || lq.includes('sub office') || lq.includes('branch office')) {
    return 'H.O = Head Office (main post office of a district)\nS.O = Sub Office (branch serving a larger area)\nB.O = Branch Office (smallest unit, usually in a village)\n\nThese three types form India Post\'s three-tier network.';
  }
  if (lq.includes('address') || lq.includes('write') || lq.includes('format')) {
    return 'Write an Indian address like this:\n[Recipient Name]\n[Building / Street / Locality]\n[District], [State] — [PIN CODE]\nINDIA\n\nAlways include the 6-digit PIN code!';
  }
  if (lq.includes('how many') || lq.includes('total') || lq.includes('count')) {
    return 'India has over 1,50,000 post offices — the largest postal network in the world! These include Head Offices, Sub Offices, and Branch Offices across all 35 states and union territories.';
  }
  if (lq.includes('digit') || lq.includes('6 digit') || lq.includes('six digit')) {
    return 'Indian PIN codes are exactly 6 digits. The 1st digit = postal zone (1–9), the 2nd = sub-zone (state), the 3rd = sorting district, and the last 3 identify the specific post office.';
  }
  if (lq.includes('delivery') || lq.includes('deliver')) {
    return 'On each PIN code detail page, you can see the delivery status of every post office. "Delivery" means active mail delivery. "Non-Delivery" means the office handles administrative/relay tasks only.';
  }
  if (lq.includes('state') || lq.includes('district')) {
    return 'PinCodeFinder covers all 35 states and union territories of India. Browse states on the homepage or use the navigation bar to find PIN codes by state → district → post office.';
  }
  if (lq.includes('contact') || lq.includes('report') || lq.includes('wrong') || lq.includes('incorrect') || lq.includes('error')) {
    return 'Found a wrong PIN code or missing office? Please contact us at mail.yosintv@gmail.com or use the Contact page. We appreciate corrections!';
  }
  if (lq.includes('free') || lq.includes('cost') || lq.includes('register') || lq.includes('login')) {
    return 'Yes! PinCodeFinder is completely free to use. No registration, no login, no fees — ever.';
  }
  if (lq.includes('india post') || lq.includes('indiapost')) {
    return 'PinCodeFinder is an independent directory — we are not affiliated with India Post. Our data is sourced from India Post records. For official postal services, visit indiapost.gov.in.';
  }
  if (lq.includes('hello') || lq.includes('hi') || lq.includes('hey')) {
    return 'Hi there! 👋 I\'m the PinCodeFinder assistant. Ask me anything about PIN codes, post offices, or how to use this site!';
  }
  if (lq.includes('thank')) {
    return 'You\'re welcome! Happy to help. Feel free to ask if you have more questions. 😊';
  }

  return 'I\'m not sure about that one. Try searching for your PIN code using the search bar on the homepage, or browse by state. You can also contact us at mail.yosintv@gmail.com for specific queries!';
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: 'bot', text: 'Hi! 👋 I\'m the PinCodeFinder assistant. Ask me anything about PIN codes, or choose a quick question below.' },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  function send(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = { from: 'user', text: text.trim() };
    const botMsg: Message = { from: 'bot', text: getResponse(text.trim()) };
    setMessages(m => [...m, userMsg, botMsg]);
    setInput('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot-fab${open ? ' chatbot-fab-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat assistant'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="chatbot-panel" role="dialog" aria-label="Chat assistant">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">📍</div>
              <div>
                <div className="chatbot-name">PinCode Assistant</div>
                <div className="chatbot-status">Online</div>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg chat-msg-${m.from}`}>
                <div className="chat-bubble">{m.text}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 3 && (
            <div className="chatbot-quick">
              {QUICK_QUESTIONS.map(q => (
                <button key={q} className="chatbot-quick-btn" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <form className="chatbot-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              className="chatbot-input"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="chatbot-send" disabled={!input.trim()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
