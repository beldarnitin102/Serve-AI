import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Clock, Check, CheckCheck } from 'lucide-react';
import { chatAPI } from '../services/api';
import { subscribeToMessages } from '../sockets/socket';
import { useAuth } from '../context/AuthContext';

const Chat = ({ bookingId, receiverId, receiverName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    const unsubscribe = subscribeToMessages((data) => {
      if (data.bookingId === bookingId) {
        setMessages(prev => [...prev, data]);
      }
    });
    return () => unsubscribe();
  }, [bookingId]);

  useEffect(scrollToBottom, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages(bookingId);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const msgData = {
        bookingId,
        receiverId,
        text: newMessage
      };
      const response = await chatAPI.sendMessage(msgData);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
          <User size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-white">{receiverName}</h4>
          <p className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Online
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.sender === user?._id || msg.senderId === user?._id;
          return (
            <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-2xl text-sm relative group ${
                isMe 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                {msg.isAI && (
                  <div className="absolute -top-5 left-0 flex items-center gap-1 text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                    AI Assistant
                  </div>
                )}
                <p>{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1 opacity-50 text-[10px]">
                  <Clock size={10} />
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && <CheckCheck size={12} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          disabled={loading || !newMessage.trim()}
          className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl transition-all"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
