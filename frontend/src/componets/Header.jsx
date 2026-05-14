import {
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <div className="mb-10 flex items-center gap-4">
      {/* SIDEBAR BUTTON */}
      <button
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
        className="rounded-2xl bg-white p-4 shadow-md transition hover:scale-105"
      >
        {sidebarOpen ? (
          <X size={22} />
        ) : (
          <Menu size={22} />
        )}
      </button>

      {/* SEARCH */}
      <div className="relative flex-1">
        <Search
          size={20}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search categories..."
          className="w-full rounded-2xl border border-gray-100 bg-white py-4 pl-14 pr-5 shadow-md outline-none"
        />
      </div>

      {/* NOTIFICATION */}
      <button className="rounded-2xl bg-white p-4 shadow-md transition hover:scale-105">
        <Bell
          size={22}
          className="text-gray-700"
        />
      </button>

      {/* PROFILE */}
      <img
        src="https://i.pravatar.cc/150?img=12"
        alt=""
        className="h-14 w-14 rounded-2xl object-cover shadow-md"
      />
    </div>
  );
}