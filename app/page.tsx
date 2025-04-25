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
  const [candidateName, setCandidateName] = useState<string>('');

  console.log('hookUrl:', hookUrl)
  const [isSending, setIsSending] = useState<boolean>(false);

  const isFormValid = delayAmount !== '' && message.trim() !== '' && hookUrl.trim() !== '';

  const handleSend = async () => {
    if (!isFormValid || isSending) return;

    const delayInMs = Number(delayAmount) * timeUnits[delayUnit];
    setIsSending(true);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/send-slack-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl: hookUrl,
            message: `From ${candidateName}'s Slack Bot: ${message}`
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('Failed:', data.error);
          alert('Failed to send Slack message.');
        } else {
          alert('Slack message sent!');
        }
      } catch (err) {
        console.error('Error sending:', err);
        alert('Something went wrong.');
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

      <div className="flex flex-col gap-[20px] w-[900px] bg-white p-[20px] rounded shadow">
        {/* Delay Input */}
        <div className="flex gap-[10px] m-[10px]">
          <input
            type="number"
            placeholder="Delay"
            min="0"
            value={delayAmount}
            onChange={(e) =>
              setDelayAmount(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border p-[20px] rounded w-1/2"
          />
          <select
            value={delayUnit}
            onChange={(e) => setDelayUnit(e.target.value as TimeUnit)}
            className="border p-[5px] rounded w-1/2"
          >
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Your Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="border p-2 rounded w-full"
        />

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
          className={`w-full py-2 px-4 rounded text-white ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400'
            }`}
        >
          {isSending ? 'Scheduling...' : buttonLabel}
        </button>
      </div>
    </main>
  );
}
