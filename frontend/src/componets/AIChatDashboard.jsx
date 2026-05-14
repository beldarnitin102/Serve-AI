import { useState } from "react";
import axios from "axios";

import {
  Send,
  Mic,
  Bell,
  Phone,
  BadgePercent,
  Calendar,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

export default function AIChatDashboard() {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  // =========================
  // STATES
  // =========================

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello 👋\nHow can I help you today?",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // QUICK ACTIONS
  // =========================

  const quickActions = [
    {
      label: "Book a Service",
      icon: Calendar,
    },
    {
      label: "Check Booking",
      icon: Bell,
    },
    {
      label: "Offers & Discounts",
      icon: BadgePercent,
    },
    {
      label: "Call Support",
      icon: Phone,
    },
  ];

  // =========================
  // AI FUNCTION
  // =========================

  const sendMessageToAI = async (
    message
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        {
          message,
        }
      );

      return response.data.reply;
    } catch (error) {
      console.log(
        "FRONTEND ERROR:",
        error.response?.data || error.message
      );

      return "Server error. Please try again.";
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    const currentInput = input;

    setInput("");

    setLoading(true);

    const aiReply = await sendMessageToAI(
      currentInput
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: aiReply,
      },
    ]);

    setLoading(false);
  };

  // =========================
  // QUICK ACTION
  // =========================

  const handleQuickAction = async (
    text
  ) => {
    if (loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setLoading(true);

    const aiReply = await sendMessageToAI(
      text
    );

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: aiReply,
      },
    ]);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#071226] relative overflow-hidden text-white">
      {/* Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px]" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-400/10 blur-[120px]" />

      {/* Layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        {/* Mobile Header */}

        <header className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5">
          <div>
            <h1 className="text-lg font-semibold">
              ServAI Assistant
            </h1>

            <p className="text-xs text-slate-300">
              AI Customer Support
            </p>
          </div>

          <button
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
            className="p-2 rounded-xl bg-white/10"
          >
            {mobileMenu ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </header>

        {/* Mobile Menu */}

        {mobileMenu && (
          <div className="lg:hidden px-5 pt-4">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 space-y-3 shadow-2xl">
              {quickActions.map(
                (item, index) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={index}
                      disabled={loading}
                      onClick={() =>
                        handleQuickAction(
                          item.label
                        )
                      }
                      className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-2xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20">
                          <Icon size={18} />
                        </div>

                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>

                      <ChevronRight
                        size={16}
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* Desktop Panel */}

        <div className="hidden lg:flex w-[360px] border-r border-white/10 bg-white/5 backdrop-blur-3xl flex-col p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
              <Bell size={22} />
            </div>

            <div>
              <h2 className="font-semibold text-xl">
                ServAI Assistant
              </h2>

              <p className="text-sm text-slate-300">
                AI Powered Support
              </p>
            </div>
          </div>

          {/* Welcome */}

          <div className="mt-8 bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-white/10 rounded-3xl p-5">
            <p className="text-sm text-slate-300">
              Welcome Back 👋
            </p>

            <h3 className="text-2xl font-semibold mt-2">
              Your Smart Customer
              Service Assistant
            </h3>
          </div>
        </div>

        {/* Chat */}

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[520px]">
            <div className="bg-[#F8F8FB] text-black rounded-[38px] shadow-[0_20px_80px_rgba(0,0,0,0.35)] overflow-hidden">
              {/* Header */}

              <div className="bg-gradient-to-r from-[#0A1B35] to-[#132A4D] text-white px-6 py-5">
                <h2 className="font-semibold text-lg">
                  ServAI Assistant
                </h2>
              </div>

              {/* Messages */}

              <div className="p-5 space-y-5 bg-[#F7F8FC] min-h-[500px] max-h-[500px] overflow-y-auto">
                {messages.map(
                  (msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-3 rounded-2xl max-w-[260px] ${
                          msg.role === "user"
                            ? "bg-gradient-to-r from-[#3575FF] to-[#4C8DFF] text-white"
                            : "bg-white text-slate-700"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  )
                )}

                {loading && (
                  <p className="text-sm text-slate-500">
                    AI is typing...
                  </p>
                )}
              </div>

              {/* Input */}

              <div className="bg-white border-t border-slate-200 px-5 py-4">
                <div className="flex items-center gap-3 bg-[#F3F5FA] rounded-2xl px-4 py-3">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) =>
                      setInput(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      handleSend()
                    }
                    className="bg-transparent outline-none flex-1 text-sm"
                  />

                  <button>
                    <Mic size={20} />
                  </button>

                  <button
                    disabled={loading}
                    onClick={handleSend}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#3575FF] to-[#4C8DFF] text-white flex items-center justify-center"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}