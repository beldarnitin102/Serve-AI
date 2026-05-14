import { useState } from "react";

import Sidebar from "../componets/Sidebar";
import MobileNavbar from "../componets/MobileNavbar";
import Header from "../componets/Header";
import CategoryCard from "../componets/CategoryCard";

import {
  Droplets,
  Zap,
  Wrench,
  Fan,
  Hammer,
  Paintbrush,
  Refrigerator,
  Bug,
  Truck,
  Shirt,
  Trees,
  Camera,
  Droplet,
  Scissors,
} from "lucide-react";

export default function CategoriesPage() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const categories = [
  {
    title: "Plumbing",
    subtitle: "Expert plumbing services",
    icon: (
      <Droplets
        size={36}
        className="text-white"
      />
    ),
    gradient: "from-blue-500 to-cyan-400",
  },

  {
    title: "Electrician",
    subtitle: "All electrical solutions",
    icon: (
      <Zap
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-yellow-400 to-orange-500",
  },

  {
    title: "Cleaning",
    subtitle: "Home and office cleaning",
    icon: (
      <Wrench
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-green-400 to-emerald-500",
  },

  {
    title: "AC Repair",
    subtitle: "Installation and repair",
    icon: (
      <Fan
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-indigo-500 to-blue-500",
  },

  {
    title: "Carpentry",
    subtitle: "Furniture and wood work",
    icon: (
      <Hammer
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-orange-500 to-red-500",
  },

  {
    title: "Painting",
    subtitle: "Interior and exterior paint",
    icon: (
      <Paintbrush
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-pink-500 to-rose-500",
  },

  {
    title: "Appliance Repair",
    subtitle: "Repair all home appliances",
    icon: (
      <Refrigerator
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-slate-500 to-gray-700",
  },

  {
    title: "Pest Control",
    subtitle: "Protect home from pests",
    icon: (
      <Bug
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-lime-500 to-green-600",
  },

  {
    title: "Home Shifting",
    subtitle: "Safe moving services",
    icon: (
      <Truck
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-cyan-500 to-sky-500",
  },

  {
    title: "Laundry",
    subtitle: "Wash and ironing services",
    icon: (
      <Shirt
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-violet-500 to-purple-600",
  },

  {
    title: "Gardening",
    subtitle: "Garden maintenance experts",
    icon: (
      <Trees
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-green-500 to-lime-500",
  },

  {
    title: "CCTV Installation",
    subtitle: "Security camera setup",
    icon: (
      <Camera
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-gray-700 to-slate-900",
  },

  {
    title: "Water Purifier",
    subtitle: "RO service and repair",
    icon: (
      <Droplet
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-sky-500 to-blue-600",
  },

  {
    title: "Salon At Home",
    subtitle: "Beauty services at home",
    icon: (
      <Scissors
        size={36}
        className="text-white"
      />
    ),
    gradient:
      "from-fuchsia-500 to-pink-600",
  },
];

  return (
    <div className="min-h-screen bg-[#eef3ff]">
      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 z-50 hidden h-screen transition-all duration-300 lg:block ${
          sidebarOpen
            ? "w-[280px]"
            : "w-[95px]"
        }`}
      >
        <Sidebar sidebarOpen={sidebarOpen} />
      </div>

      {/* MOBILE NAVBAR */}
      <MobileNavbar />

      {/* CONTENT */}
      <div
        className={`pb-28 transition-all duration-300 ${
          sidebarOpen
            ? "lg:ml-[280px]"
            : "lg:ml-[95px]"
        } p-5 lg:p-10`}
      >
        {/* HEADER */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 md:text-5xl">
            All Categories
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Explore professional home
            services
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((item, index) => (
            <CategoryCard
              key={index}
              title={item.title}
              subtitle={item.subtitle}
              icon={item.icon}
              gradient={item.gradient}
            />
          ))}
        </div>
      </div>
    </div>
  );
}