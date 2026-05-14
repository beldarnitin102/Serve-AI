import { useState } from "react";
import {
  User,
  ShieldCheck,
  Wallet,
  Bookmark,
  BadgeDollarSign,
  Settings,
  HelpCircle,
  ChevronRight,
  Bell,
  Menu,
  X,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
} from "lucide-react";

export default function ProfileSettingsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    {
      title: "Edit Profile",
      subtitle: "Update your personal information",
      icon: <User size={18} />,
    },
    {
      title: "Saved Addresses",
      subtitle: "Manage delivery & work addresses",
      icon: <Bookmark size={18} />,
    },
    {
      title: "Payment Methods",
      subtitle: "Cards, UPI & billing methods",
      icon: <Wallet size={18} />,
    },
    {
      title: "My Bookings",
      subtitle: "Track and manage appointments",
      icon: <LayoutDashboard size={18} />,
    },
    {
      title: "Refer & Earn",
      subtitle: "Earn rewards by inviting friends",
      icon: <BadgeDollarSign size={18} />,
    },
    {
      title: "Settings",
      subtitle: "Dark mode, language & privacy",
      icon: <Settings size={18} />,
    },
    {
      title: "Help & Support",
      subtitle: "FAQs and customer support",
      icon: <HelpCircle size={18} />,
    },
  ];

  const sidebarItems = [
    {
      icon: <Home size={20} />,
      label: "Home",
    },
    {
      icon: <User size={20} />,
      label: "Profile",
      active: true,
    },
    {
      icon: <Wallet size={20} />,
      label: "Payments",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081226] via-[#0d1d36] to-[#152849] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[150px]" />

      <div className="relative flex min-h-screen">
        {/* =========================
            DESKTOP SIDEBAR
        ========================== */}
        <aside
          className={`hidden lg:flex flex-col transition-all duration-300 border-r border-white/10 bg-white/5 backdrop-blur-2xl
          ${sidebarOpen ? "w-[270px]" : "w-[92px]"}`}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl">
                <User className="text-white" size={22} />
              </div>

              {sidebarOpen && (
                <div>
                  <h1 className="text-white text-lg font-bold">
                    My Profile
                  </h1>
                  <p className="text-slate-400 text-xs">
                    Account & Settings
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
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl"
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
                  <ShieldCheck className="text-white" size={22} />
                </div>

                {sidebarOpen && (
                  <div>
                    <h3 className="text-white font-semibold">
                      Account Secure
                    </h3>

                    <p className="text-white/70 text-sm">
                      Protected with 2FA
                    </p>
                  </div>
                )}
              </div>

              {sidebarOpen && (
                <button className="mt-5 w-full py-3 rounded-2xl bg-white text-indigo-600 font-semibold hover:scale-[1.02] transition">
                  Security Center
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
                    Profile & Settings
                  </h1>

                  <p className="text-slate-400 text-sm mt-1">
                    Manage your account preferences
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
                  <Moon size={20} />
                </button>

                <button className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition">
                  <Bell size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="p-4 sm:p-6 lg:p-10">
            {/* Profile Header */}
            <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[32px] p-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/200?img=12"
                    alt="profile"
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white/10"
                  />

                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-green-500 border-4 border-[#10203d]" />
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <h2 className="text-white text-3xl font-bold">
                    John Doe
                  </h2>

                  <p className="text-slate-400 mt-2">
                    +91 98765 43210
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <span className="px-4 py-2 rounded-2xl bg-blue-500/20 text-blue-300 text-sm">
                      Premium User
                    </span>

                    <span className="px-4 py-2 rounded-2xl bg-green-500/20 text-green-300 text-sm">
                      Verified Account
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Settings Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
              {/* Left Section */}
              <div className="xl:col-span-2 space-y-5">
                {menuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="group backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[28px] p-5 shadow-xl hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 group-hover:scale-110 transition">
                          {item.icon}
                        </div>

                        <div>
                          <h3 className="text-white font-semibold">
                            {item.title}
                          </h3>

                          <p className="text-slate-400 text-sm mt-1">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className="text-slate-400 group-hover:translate-x-1 transition"
                        size={20}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                {/* Security Card */}
                <div className="backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[30px] p-6 shadow-2xl">
                  <h3 className="text-white text-lg font-semibold">
                    Account Security
                  </h3>

                  <div className="mt-8 flex items-center justify-center">
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
                          stroke="#4f7cff"
                          strokeWidth="14"
                          fill="none"
                          strokeDasharray="408"
                          strokeDashoffset="55"
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-white text-5xl font-bold">
                          92%
                        </h2>

                        <p className="text-slate-400 text-sm mt-1">
                          Secure
                        </p>
                      </div>
                    </div>
                  </div>

                  <button className="mt-8 w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-[1.02] transition">
                    Security Settings
                  </button>
                </div>

                {/* Logout */}
                <button className="w-full backdrop-blur-2xl bg-red-500/10 border border-red-500/20 rounded-[28px] p-5 shadow-xl hover:bg-red-500/20 transition flex items-center justify-center gap-3 text-red-300 font-semibold">
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
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