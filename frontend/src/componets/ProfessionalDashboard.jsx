import { useState } from "react";
import {
  LayoutDashboard,
  Bell,
  Wallet,
  BriefcaseBusiness,
  CheckCircle2,
  Menu,
  X,
  Home,
  BarChart3,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";

export default function ProfessionalDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    {
      title: "New Requests",
      value: "12",
      icon: <BriefcaseBusiness size={18} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "In Progress",
      value: "5",
      icon: <Wallet size={18} />,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "Completed",
      value: "23",
      icon: <CheckCircle2 size={18} />,
      color: "bg-green-100 text-green-600",
    },
  ];

  const sidebarItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      active: true,
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
    },
    {
      icon: <Wallet size={20} />,
      label: "Payments",
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
    <div className="min-h-screen bg-gradient-to-br from-[#081225] via-[#0d1b34] to-[#111827] text-slate-800 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-400/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400/20 blur-[140px]" />

      <div className="relative flex min-h-screen">
        {/* =========================
            DESKTOP SIDEBAR
        ========================== */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 border-r border-white/10 backdrop-blur-xl bg-white/5
          ${
            sidebarOpen ? "w-[260px]" : "w-[92px]"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <LayoutDashboard className="text-white" size={22} />
              </div>

              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-lg">
                    Pro Dashboard
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Professional Suite
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-xl transition"
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
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl"
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

          {/* Bottom Card */}
          <div className="p-4">
            <div className="rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 p-5 text-white shadow-2xl">
              <h3 className="font-semibold text-lg">Premium Access</h3>
              {sidebarOpen && (
                <p className="text-sm text-white/80 mt-2">
                  Unlock advanced analytics & AI insights.
                </p>
              )}

              <button className="mt-4 bg-white text-emerald-600 px-4 py-2 rounded-xl font-semibold text-sm hover:scale-105 transition">
                Upgrade
              </button>
            </div>
          </div>
        </aside>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <main className="flex-1 transition-all duration-300">
          {/* Topbar */}
          <div className="sticky top-0 z-20 backdrop-blur-xl bg-white/5 border-b border-white/10">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-10 py-5">
              {/* Left */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex text-white p-2 rounded-xl hover:bg-white/10 transition"
                >
                  <Menu size={20} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-white/10">
                    <img
                      src="https://i.pravatar.cc/100?img=12"
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <h2 className="text-white font-bold text-lg sm:text-xl">
                      Hi, Ramesh 👋
                    </h2>
                    <p className="text-slate-400 text-sm">
                      Professional Dashboard
                    </p>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-2">
                  <span className="text-green-400 font-semibold text-sm">
                    Available
                  </span>

                  <div className="w-12 h-6 rounded-full bg-green-400 relative">
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white" />
                  </div>
                </div>

                <button className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
                  <Bell size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-10">
            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[28px] p-6 shadow-2xl hover:-translate-y-1 transition">
                <p className="text-slate-300 text-sm font-medium">
                  Today's Earnings
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-white">₹2,350</h2>
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[28px] p-6 shadow-2xl hover:-translate-y-1 transition">
                <p className="text-slate-300 text-sm font-medium">
                  This Week
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <h2 className="text-4xl font-bold text-white">₹12,450</h2>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[26px] p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}
                  >
                    {item.icon}
                  </div>

                  <h4 className="text-slate-300 mt-5 text-sm">
                    {item.title}
                  </h4>

                  <p className="text-3xl font-bold text-white mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Graph + Score */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {/* Graph */}
              <div className="xl:col-span-2 backdrop-blur-xl bg-white/10 border border-white/10 rounded-[30px] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">
                    Earnings Overview
                  </h3>

                  <button className="text-slate-300 flex items-center gap-1 text-sm">
                    Weekly <ChevronDown size={16} />
                  </button>
                </div>

                {/* Fake Chart */}
                <div className="mt-8 h-[260px] relative">
                  <svg
                    viewBox="0 0 500 200"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="lineGradient"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M0 150 C50 170, 80 80, 120 100 
                      S200 180, 250 90
                      S340 50, 400 120
                      S470 100, 500 70"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* Dots */}
                    {[0, 120, 250, 400, 500].map((x, i) => (
                      <circle
                        key={i}
                        cx={x}
                        cy={[150, 100, 90, 120, 70][i]}
                        r="6"
                        fill="#4ade80"
                      />
                    ))}
                  </svg>

                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-slate-400 px-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (d) => (
                        <span key={d}>{d}</span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Trust Score */}
              <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[30px] p-6 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">
                    AI Trust Score
                  </h3>

                  <span className="px-3 py-1 rounded-full bg-green-400/20 text-green-400 text-sm font-semibold">
                    Excellent
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center flex-1 py-10">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full rotate-[-90deg]">
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="14"
                        fill="none"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="65"
                        stroke="#4ade80"
                        strokeWidth="14"
                        fill="none"
                        strokeDasharray="408"
                        strokeDashoffset="60"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <h2 className="text-5xl font-bold text-white">4.7</h2>
                      <p className="text-slate-400 mt-1">/5 score</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold hover:scale-[1.02] transition">
                  View Full Report
                </button>
              </div>
            </div>
          </div>

          {/* =========================
              MOBILE BOTTOM NAV
          ========================== */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 px-4 pb-4">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl">
              <div className="flex justify-around items-center py-4">
                {sidebarItems.map((item, idx) => (
                  <button
                    key={idx}
                    className={`flex flex-col items-center gap-1 transition
                    ${
                      item.active
                        ? "text-green-400"
                        : "text-slate-400"
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px]">{item.label}</span>
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