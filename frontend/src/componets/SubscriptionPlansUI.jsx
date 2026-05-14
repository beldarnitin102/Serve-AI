import React, { useState } from "react";
import {
  Crown,
  Check,
  Sparkles,
  Menu,
  X,
  Home,
  CreditCard,
  User,
  Settings,
  Bell,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function SubscriptionPlansUI() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "pro",
      title: "ServAI Plus",
      price: "₹299 / month",
      badge: "Most Popular",
      gradient: "from-blue-500 to-indigo-600",
      features: [
        "Priority Booking",
        "Exclusive Discounts",
        "Free Cancellation",
        "24/7 Support",
      ],
    },
    {
      id: "proplus",
      title: "ServAI Pro",
      price: "₹599 / month",
      badge: "Premium",
      gradient: "from-indigo-500 to-purple-600",
      features: [
        "VIP Priority Access",
        "Monthly Cashback",
        "AI Smart Recommendations",
        "Dedicated Support",
      ],
    },
    {
      id: "elite",
      title: "ServAI Elite",
      price: "₹999 / month",
      badge: "Enterprise",
      gradient: "from-cyan-500 to-blue-600",
      features: [
        "Unlimited Premium Access",
        "Business Dashboard",
        "Advanced Analytics",
        "Personal Account Manager",
      ],
    },
  ];

  const sidebarItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Subscriptions",
      active: true,
    },
    {
      icon: <User size={20} />,
      label: "Profile",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071325] via-[#0c1d39] to-[#12284b] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[150px]" />

      <div className="relative flex min-h-screen">
        {/* =========================
            SIDEBAR
        ========================== */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 border-r border-white/10 bg-white/5 backdrop-blur-2xl
          ${sidebarOpen ? "w-[270px]" : "w-[92px]"}`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <Sparkles className="text-white" size={22} />
              </div>

              {sidebarOpen && (
                <div>
                  <h1 className="text-white text-lg font-bold">
                    Subscription
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Plans & Billing
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white p-2 rounded-xl hover:bg-white/10 transition"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          {/* Nav */}
          <div className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                ${
                  item.active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-2xl"
                    : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {item.icon}

                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* Premium Card */}
          <div className="p-4">
            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Crown className="text-white" size={22} />
                </div>

                {sidebarOpen && (
                  <div>
                    <h3 className="text-white font-semibold">
                      Upgrade Plan
                    </h3>

                    <p className="text-white/70 text-sm">
                      Unlock premium benefits
                    </p>
                  </div>
                )}
              </div>

              {sidebarOpen && (
                <button className="mt-5 w-full py-3 rounded-2xl bg-white text-indigo-600 font-semibold hover:scale-[1.02] transition">
                  View Benefits
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <main className="flex-1">
          {/* TOPBAR */}
          <div className="sticky top-0 z-30 backdrop-blur-2xl bg-white/5 border-b border-white/10">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-5">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex text-white p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <Menu size={20} />
                </button>

                <div>
                  <h1 className="text-white text-2xl font-bold">
                    Subscription Plans
                  </h1>

                  <p className="text-slate-400 text-sm mt-1">
                    Choose the best plan for your needs
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
                  <Bell size={20} />
                </button>

                <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 border border-white/10">
                  <img
                    src="https://i.pravatar.cc/100?img=14"
                    alt="user"
                    className="w-10 h-10 rounded-xl object-cover"
                  />

                  <div>
                    <h4 className="text-white text-sm font-semibold">
                      John Doe
                    </h4>
                    <p className="text-slate-400 text-xs">
                      Premium Member
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 lg:p-10">
            {/* Heading */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
              <div>
                <h2 className="text-white text-3xl font-bold">
                  Choose Your Plan
                </h2>

                <p className="text-slate-400 mt-2">
                  Flexible subscriptions designed for individuals &
                  businesses
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10 text-slate-300 flex items-center gap-2 w-fit">
                <ShieldCheck size={18} className="text-green-400" />
                Secure Payments Enabled
              </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`relative group backdrop-blur-2xl border rounded-[32px] p-6 shadow-2xl transition-all duration-300 cursor-pointer
                  ${
                    selectedPlan === plan.id
                      ? "bg-white/15 border-blue-500/40 scale-[1.02]"
                      : "bg-white/10 border-white/10 hover:bg-white/15 hover:-translate-y-1"
                  }`}
                >
                  {/* Badge */}
                  <div
                    className={`absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${plan.gradient}`}
                  >
                    {plan.badge}
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-xl`}
                    >
                      <Crown className="text-white" size={24} />
                    </div>

                    <div>
                      <h3 className="text-white text-xl font-bold">
                        {plan.title}
                      </h3>

                      <p className="text-slate-400 text-sm mt-1">
                        Subscription Plan
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-8">
                    <h2 className="text-white text-4xl font-bold">
                      {plan.price}
                    </h2>

                    <p className="text-slate-400 text-sm mt-2">
                      Cancel anytime • No hidden fees
                    </p>
                  </div>

                  {/* Features */}
                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center`}
                        >
                          <Check size={14} className="text-white" />
                        </div>

                        <span className="text-slate-200 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`mt-8 w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
                    ${
                      selectedPlan === plan.id
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-xl`
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {selectedPlan === plan.id
                      ? "Current Plan"
                      : "Select Plan"}

                    <ChevronRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* =========================
              MOBILE BOTTOM NAV
          ========================== */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pb-4">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl">
              <div className="flex justify-around items-center py-4">
                {sidebarItems.map((item, idx) => (
                  <button
                    key={idx}
                    className={`flex flex-col items-center gap-1 transition
                    ${
                      item.active
                        ? "text-blue-400"
                        : "text-slate-400"
                    }`}
                  >
                    {item.icon}

                    <span className="text-[11px]">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}