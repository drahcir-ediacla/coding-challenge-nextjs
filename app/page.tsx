'use client'; // Only needed if you're using the App Router

import { useState } from 'react';

type TimeUnit = 'seconds' | 'minutes' | 'hours';

const timeUnits: Record<TimeUnit, number> = {
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
};

export default function SlackSchedulerPage() {
  const [delayAmount, setDelayAmount] = useState<number | ''>('');
  const [delayUnit, setDelayUnit] = useState<TimeUnit>('minutes');
  const [message, setMessage] = useState<string>('');
  const [hookUrl, setHookUrl] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const isFormValid = delayAmount !== '' && message.trim() !== '' && hookUrl.trim() !== '';

  const handleSend = async () => {
    if (!isFormValid || isSending) return;

    const delayInMs = Number(delayAmount) * timeUnits[delayUnit];

    setIsSending(true);

    setTimeout(async () => {
      try {
        const response = await fetch(hookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: message }),
        });

        if (!response.ok) {
          console.error('Slack message failed to send.');
          alert('Failed to send Slack message.');
        } else {
          alert('Slack message sent!');
        }
      } catch (error) {
        console.error('Error sending Slack message:', error);
        alert('Something went wrong!');
      } finally {
        setIsSending(false);
      }
    }, delayInMs);
  };

  const buttonLabel =
    delayAmount === ''
      ? 'Send'
      : `Send in ${delayAmount} ${delayUnit}${delayAmount === 1 ? '' : 's'}`;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">Slack Message Scheduler</h1>

      <div className="w-full max-w-md space-y-4 bg-white p-6 rounded shadow">
        {/* Delay Input */}
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="Delay"
            min="0"
            value={delayAmount}
            onChange={(e) =>
              setDelayAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border p-2 rounded w-1/2"
          />
          <select
            value={delayUnit}
            onChange={(e) => setDelayUnit(e.target.value as TimeUnit)}
            className="border p-2 rounded w-1/2"
          >
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>

        {/* Slack Message Input */}
        <input
          type="text"
          placeholder="Slack Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Slack Webhook URL Input */}
        <input
          type="text"
          placeholder="Slack Webhook URL"
          value={hookUrl}
          onChange={(e) => setHookUrl(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {/* Send Button */}
        <button
          disabled={!isFormValid || isSending}
          onClick={handleSend}
          className={`w-full py-2 px-4 rounded text-white ${
            isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
          }`}
        >
          {isSending ? 'Scheduling...' : buttonLabel}
        </button>
      </div>
    </main>
  );
}
