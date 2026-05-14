import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BriefcaseBusiness,
  CalendarDays,
  IndianRupee,
  BarChart3,
  Settings,
  Bell,
  Menu,
  X,
  Home,
  UserCog,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const cards = [
    {
      title: "Total Users",
      value: "12,458",
      icon: <Users size={18} />,
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      title: "Professionals",
      value: "3,245",
      icon: <BriefcaseBusiness size={18} />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "Total Bookings",
      value: "18,742",
      icon: <CalendarDays size={18} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Revenue",
      value: "₹35,42,300",
      icon: <IndianRupee size={18} />,
      color: "bg-orange-100 text-orange-500",
    },
  ];

  const services = [
    { name: "AC Repair", progress: "w-[32%]" },
    { name: "Cleaning", progress: "w-[24%]" },
    { name: "Plumbing", progress: "w-[18%]" },
    { name: "Electrician", progress: "w-[16%]" },
  ];

  const sidebarItems = [
    {
      icon: <Home size={20} />,
      label: "Dashboard",
      active: true,
    },
    {
      icon: <Users size={20} />,
      label: "Users",
    },
    {
      icon: <BriefcaseBusiness size={20} />,
      label: "Professionals",
    },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08162c] via-[#0b1e3d] to-[#13294b] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[150px]" />

      <div className="relative flex min-h-screen">
        {/* ===========================
            DESKTOP SIDEBAR
        ============================ */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 border-r border-white/10 backdrop-blur-2xl bg-white/5
          ${sidebarOpen ? "w-[270px]" : "w-[92px]"}`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                <LayoutDashboard className="text-white" size={22} />
              </div>

              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-lg">
                    Admin Panel
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Dashboard Suite
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

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300
                ${
                  item.active
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-2xl"
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
            <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <UserCog className="text-white" size={22} />
                </div>

                {sidebarOpen && (
                  <div>
                    <h3 className="text-white font-semibold">
                      Admin Access
                    </h3>
                    <p className="text-white/70 text-sm">
                      Full management control
                    </p>
                  </div>
                )}
              </div>

              {sidebarOpen && (
                <button className="mt-5 w-full py-3 rounded-2xl bg-white text-indigo-600 font-semibold hover:scale-[1.02] transition">
                  Manage Team
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* ===========================
            MAIN CONTENT
        ============================ */}
        <main className="flex-1">
          {/* Topbar */}
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
                    Admin Dashboard
                  </h1>

                  <p className="text-slate-400 text-sm mt-1">
                    Business overview & analytics
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
                    alt="admin"
                    className="w-10 h-10 rounded-xl object-cover"
                  />

                  <div>
                    <h4 className="text-white text-sm font-semibold">
                      Admin User
                    </h4>
                    <p className="text-slate-400 text-xs">
                      Super Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-10">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {cards.map((card, idx) => (
                <div
                  key={idx}
                  className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[28px] p-6 shadow-2xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.color}`}
                    >
                      {card.icon}
                    </div>

                    <ChevronRight
                      size={18}
                      className="text-slate-400"
                    />
                  </div>

                  <div className="mt-5">
                    <p className="text-slate-400 text-sm">
                      {card.title}
                    </p>

                    <h2 className="text-white text-3xl font-bold mt-2">
                      {card.value}
                    </h2>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts + Services */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {/* Chart */}
              <div className="xl:col-span-2 backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      Bookings Overview
                    </h3>

                    <p className="text-slate-400 text-sm mt-1">
                      Weekly analytics report
                    </p>
                  </div>

                  <button className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 text-sm hover:bg-white/20 transition">
                    This Week
                  </button>
                </div>

                {/* Graph */}
                <div className="mt-8 h-[300px] relative">
                  <svg
                    viewBox="0 0 600 260"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Grid */}
                    {[50, 100, 150, 200].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="600"
                        y2={y}
                        stroke="rgba(255,255,255,0.06)"
                      />
                    ))}

                    {/* Path */}
                    <path
                      d="
                      M20 190
                      C70 180, 90 140, 130 130
                      S200 70, 260 120
                      S350 100, 420 80
                      S500 130, 580 70
                      "
                      fill="none"
                      stroke="#4f7cff"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />

                    {/* Dots */}
                    {[
                      [20, 190],
                      [130, 130],
                      [260, 120],
                      [420, 80],
                      [580, 70],
                    ].map((dot, idx) => (
                      <circle
                        key={idx}
                        cx={dot[0]}
                        cy={dot[1]}
                        r="7"
                        fill="#4f7cff"
                      />
                    ))}
                  </svg>

                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-400">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <span key={day}>{day}</span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-lg font-semibold">
                    Top Services
                  </h3>

                  <button className="text-slate-400 text-sm hover:text-white transition">
                    View All
                  </button>
                </div>

                <div className="mt-8 space-y-7">
                  {services.map((service, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-slate-300 text-sm font-medium">
                          {service.name}
                        </span>

                        <span className="text-slate-400 text-sm">
                          {service.progress
                            .replace("w-[", "")
                            .replace("%]", "%")}
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 ${service.progress}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Extra Mini Card */}
                <div className="mt-10 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 shadow-xl">
                  <h4 className="text-white font-semibold text-lg">
                    Growth Rate
                  </h4>

                  <div className="flex items-end gap-2 mt-4">
                    <h2 className="text-white text-4xl font-bold">
                      +24%
                    </h2>

                    <span className="text-white/70 pb-1">
                      this month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===========================
              MOBILE BOTTOM NAV
          ============================ */}
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