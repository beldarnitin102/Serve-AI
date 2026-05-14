// src/pages/Home.jsx

import { useState } from "react";

import Sidebar from "../componets/Sidebar";
import MobileNavbar from "../componets/MobileNavbar";

import {
  Bell,
  Search,
  Menu,
  X,
  Fan,
  Zap,
  Wrench,
  Paintbrush,
  Hammer,
  Droplets,
} from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const categories = [
    {
      name: "Plumbing",
      icon: Droplets,
      color: "from-blue-500 to-cyan-400",
    },
    {
      name: "Electrician",
      icon: Zap,
      color: "from-yellow-400 to-orange-500",
    },
    {
      name: "Cleaning",
      icon: Wrench,
      color: "from-green-400 to-emerald-500",
    },
    {
      name: "AC Repair",
      icon: Fan,
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "Carpentry",
      icon: Hammer,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Painting",
      icon: Paintbrush,
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef3ff]">
      {/* DESKTOP SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 h-screen transition-all duration-300 ${
          sidebarOpen
            ? "w-[280px]"
            : "w-[95px]"
        } hidden lg:block`}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* MOBILE NAVBAR */}
      <MobileNavbar />

      {/* MAIN CONTENT */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen
            ? "lg:ml-[280px]"
            : "lg:ml-[95px]"
        } p-5 lg:p-10 pb-28`}
      >
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-4">
          {/* SIDEBAR BUTTON */}
          <button
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
            className="rounded-2xl bg-white p-4 shadow-md transition hover:scale-105"
          >
            {sidebarOpen ? (
              <X
                size={24}
                className="text-gray-700"
              />
            ) : (
              <Menu
                size={24}
                className="text-gray-700"
              />
            )}
          </button>

          {/* SEARCH BAR */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search services, bookings..."
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

        {/* HERO SECTION */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* LEFT HERO */}
          <div className="relative overflow-hidden rounded-[35px] bg-gradient-to-r from-[#071952] via-[#0B5ED7] to-[#3B82F6] p-8 shadow-2xl xl:col-span-2 xl:p-12">
            <div className="relative z-10 max-w-[400px]">
              <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
                Get 20% OFF
              </h1>

              <p className="mt-4 text-lg text-blue-100 md:text-xl">
                on your first booking service
              </p>

              <button className="mt-8 rounded-2xl bg-white px-7 py-4 text-lg font-bold text-blue-700 transition hover:scale-105">
                Use Code: SERV20
              </button>
            </div>

            <img
              src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="absolute bottom-0 right-0 hidden h-full w-[45%] object-cover xl:block"
            />
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-[35px] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                AI Recommended
              </h2>

              <button className="font-semibold text-blue-600">
                View All
              </button>
            </div>

            <div className="space-y-5">
              <div className="rounded-3xl bg-[#f7faff] p-4 transition hover:shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=800&auto=format&fit=crop"
                  className="h-48 w-full rounded-2xl object-cover"
                />

                <h3 className="mt-4 text-xl font-bold text-gray-800">
                  AC Repair
                </h3>

                <p className="mt-1 text-gray-500">
                  Starting ₹199
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-14">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black text-gray-800 md:text-4xl">
              Popular Categories
            </h2>

            <button className="font-bold text-blue-600">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-6">
            {categories.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="rounded-[30px] bg-white p-6 text-center shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div
                    className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r ${item.color}`}
                  >
                    <Icon
                      size={34}
                      className="text-white"
                    />
                  </div>

                  <h3 className="text-lg font-bold text-gray-700">
                    {item.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}