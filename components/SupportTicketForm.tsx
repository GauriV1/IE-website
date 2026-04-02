'use client';

import { useState } from 'react';

const categories = [
  'General Question',
  'Budget/Finance',
  'Chrome River Help',
  'Policy Clarification',
  'Technical Issue',
  'Other',
] as const;

export default function SupportTicketForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<string>(categories[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/support-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, category, subject, description, priority }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      setStatus('ok');
      setMessage('Thank you. Your ticket has been received.');
      setSubject('');
      setDescription('');
    } catch {
      setStatus('err');
      setMessage('Something went wrong. Please email blakena@whitman.edu directly.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-whitman-navy rounded-xl p-6 md:p-8 shadow-sm max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-whitman-navy mb-6 text-center">Submit a Support Ticket</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="ticket-name" className="block text-sm font-medium text-whitman-navy mb-1">
            Name
          </label>
          <input
            id="ticket-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-whitman-blue"
          />
        </div>
        <div>
          <label htmlFor="ticket-email" className="block text-sm font-medium text-whitman-navy mb-1">
            Email
          </label>
          <input
            id="ticket-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-whitman-blue"
          />
        </div>
        <div>
          <label htmlFor="ticket-category" className="block text-sm font-medium text-whitman-navy mb-1">
            Category
          </label>
          <select
            id="ticket-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-whitman-blue"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ticket-subject" className="block text-sm font-medium text-whitman-navy mb-1">
            Subject
          </label>
          <input
            id="ticket-subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-whitman-blue"
          />
        </div>
        <div>
          <label htmlFor="ticket-desc" className="block text-sm font-medium text-whitman-navy mb-1">
            Description
          </label>
          <textarea
            id="ticket-desc"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-whitman-blue"
          />
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-whitman-navy mb-2">Priority</legend>
          <div className="flex flex-wrap gap-4">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <label key={p} className="inline-flex items-center gap-2 text-whitman-gray">
                <input type="radio" name="priority" value={p} checked={priority === p} onChange={() => setPriority(p)} />
                <span className="capitalize">{p}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-3 rounded-md bg-whitman-navy text-white font-semibold hover:bg-whitman-blue transition-colors disabled:opacity-60"
        >
          {status === 'sending' ? 'Submitting…' : 'Submit Ticket'}
        </button>
        {message && (
          <p className={`text-sm text-center ${status === 'ok' ? 'text-green-800' : 'text-red-800'}`}>{message}</p>
        )}
        <p className="text-xs text-whitman-gray text-center">
          Tickets are sent to the division support inbox. For urgent matters, contact your supervisor or{' '}
          <a href="mailto:blakena@whitman.edu" className="text-whitman-blue hover:underline">
            blakena@whitman.edu
          </a>
          .
        </p>
      </div>
    </form>
  );
}
