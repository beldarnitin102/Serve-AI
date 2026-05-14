import {
  Home,
  LayoutGrid,
  CalendarDays,
  Bell,
  User,
} from "lucide-react";

export default function MobileNavbar() {
  const navItems = [
    {
      name: "Home",
      icon: Home,
      active: true,
    },
    {
      name: "Categories",
      icon: LayoutGrid,
    },
    {
      name: "Bookings",
      icon: CalendarDays,
    },
    {
      name: "Alerts",
      icon: Bell,
    },
    {
      name: "Profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 lg:hidden">
      <div className="flex items-center gap-6 rounded-[28px] border border-white/20 bg-white/90 px-6 py-4 shadow-2xl backdrop-blur-xl">
        {navItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`flex flex-col items-center gap-1 ${
                item.active
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`rounded-2xl p-2 ${
                  item.active ? "bg-blue-100" : ""
                }`}
              >
                <Icon size={22} />
              </div>

              <span className="text-xs font-semibold">
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}