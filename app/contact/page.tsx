'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-sub">Questions, feedback, or corrections? We&apos;d love to hear from you.</p>
      </div>

      <section className="section">
        <div className="contact-layout">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>
              PinCodeFinder is maintained by a small independent team. Whether you have a question about a
              specific PIN code, want to report incorrect data, or have a general inquiry — fill in the form
              and we&apos;ll get back to you as soon as possible.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-card-icon">⏱</div>
                <div>
                  <div className="contact-card-label">Response Time</div>
                  <div className="contact-card-value">Within 2–3 business days</div>
                </div>
              </div>
              <div className="contact-card">
                <div className="contact-card-icon">📍</div>
                <div>
                  <div className="contact-card-label">Service</div>
                  <div className="contact-card-value">India PIN Code Directory</div>
                </div>
              </div>
            </div>

            <div className="contact-note">
              <strong>Note:</strong> PinCodeFinder is an independent service and is <em>not</em> affiliated
              with India Post. For official postal queries — lost mail, money orders, or speed post tracking —
              please contact{' '}
              <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer">India Post directly</a>.
            </div>
          </div>

          <div className="contact-form-wrap">
            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">✓</div>
                <h3>Message received!</h3>
                <p>Thank you for reaching out. We&apos;ll review your message and get back to you within 2–3 business days.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <label className="form-label" htmlFor="name">Your Name</label>
                  <input
                    id="name" name="name" type="text" required
                    className="form-input" placeholder="Full name"
                    value={form.name} onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    id="email" name="email" type="email" required
                    className="form-input" placeholder="you@example.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <select
                    id="subject" name="subject" required
                    className="form-input"
                    value={form.subject} onChange={handleChange}
                  >
                    <option value="">Select a topic</option>
                    <option value="Incorrect PIN code data">Incorrect PIN code data</option>
                    <option value="Missing post office">Missing post office</option>
                    <option value="General question">General question</option>
                    <option value="Partnership or advertising">Partnership or advertising</option>
                    <option value="Privacy or data concern">Privacy or data concern</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea
                    id="message" name="message" required rows={5}
                    className="form-input form-textarea"
                    placeholder="Describe your query in detail..."
                    value={form.message} onChange={handleChange}
                  />
                </div>
                <button type="submit" className="form-submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
