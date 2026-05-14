import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am your ServAI assistant. Ask me to book a service, estimate pricing, or get emergency support.' }
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInput(text);
      setListening(false);
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
  }, []);

  const sendMessage = async (message) => {
    if (!message) return;
    setMessages((prev) => [...prev, { id: prev.length + 1, role: 'user', text: message }]);
    setInput('');

    try {
      const response = await chatAPI.sendMessage(message);
      setMessages((prev) => [...prev, { id: prev.length + 2, role: 'assistant', text: response.data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { id: prev.length + 2, role: 'assistant', text: 'I could not process your request. Please try again.' }]);
    }
  };

  const startVoice = () => {
    if (!recognitionRef.current) return;
    setListening(true);
    recognitionRef.current.start();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">ServAI Chat</h1>
        <p className="text-slate-300">Talk to the AI for booking assistance, pricing estimates, complaint support, or emergency guidance.</p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {messages.map((message) => (
              <div key={message.id} className={`rounded-3xl p-4 text-sm ${message.role === 'assistant' ? 'bg-slate-900 text-slate-100 self-start' : 'bg-blue-500/10 text-blue-100 self-end'}`}>
                <div className="font-semibold mb-2 text-slate-300">{message.role === 'assistant' ? 'ServAI' : 'You'}</div>
                <div>{message.text}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ServAI for help..."
              className="w-full px-4 py-3 bg-slate-950/70 border border-slate-800 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={() => sendMessage(input)} disabled={!input}>
              Send
            </Button>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-sm">
            <div>{listening ? 'Listening...' : 'Tap microphone for voice input'}</div>
            <Button variant="secondary" onClick={startVoice}>
              {listening ? 'Listening...' : 'Voice Input'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIChat;
