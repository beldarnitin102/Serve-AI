import {
  LayoutGrid,
  Wrench,
  CalendarDays,
  Bell,
  User,
  Settings,
  Menu,
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
}) {
  const items = [
    {
      name: "Dashboard",
      icon: LayoutGrid,
      active: true,
    },
    {
      name: "Services",
      icon: Wrench,
    },
    {
      name: "Bookings",
      icon: CalendarDays,
    },
    {
      name: "Notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      icon: User,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#071952] via-[#0B5ED7] to-[#3B82F6] text-white shadow-2xl">
      {/* TOP */}
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/20 p-3">
            <Menu size={24} />
          </div>

          {sidebarOpen && (
            <div>
              <h1 className="text-3xl font-black">
                SERVAI
              </h1>

              <p className="text-sm text-blue-100">
                Smart Services
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MENU */}
      <div className="mt-8 flex flex-col gap-3 px-3">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`flex items-center rounded-2xl px-4 py-4 transition-all duration-300 ${
                item.active
                  ? "bg-white text-[#0B5ED7] shadow-xl"
                  : "hover:bg-white/10"
              } ${
                sidebarOpen
                  ? "justify-start gap-4"
                  : "justify-center"
              }`}
            >
              <Icon size={24} />

              {sidebarOpen && (
                <span className="font-semibold">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* PRO CARD */}
      {sidebarOpen && (
        <div className="mt-auto p-5">
          <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur-xl">
            <h2 className="text-2xl font-bold">
              Upgrade Pro
            </h2>

            <p className="mt-2 text-sm text-blue-100">
              Unlock premium AI recommendations
            </p>

            <button className="mt-5 w-full rounded-2xl bg-white py-3 font-bold text-blue-700 transition hover:scale-105">
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}