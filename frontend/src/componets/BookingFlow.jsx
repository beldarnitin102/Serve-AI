import {
  ChevronLeft,
  ChevronDown,
  MapPin,
  Plus,
} from "lucide-react";

export default function BookingFlow() {
  const dates = [
    {
      day: "Today",
      date: "15 May",
      active: true,
    },
    {
      day: "Thu",
      date: "16 May",
    },
    {
      day: "Fri",
      date: "17 May",
    },
    {
      day: "Sat",
      date: "18 May",
    },
  ];

  return (
    <div className="w-full rounded-[38px] bg-white p-5 shadow-[0_15px_60px_rgba(0,0,0,0.08)] md:p-7 xl:p-8">
      {/* TOP */}
      <div className="mb-8 flex items-center gap-4">
        <button className="rounded-xl bg-[#f5f7ff] p-3 transition hover:bg-[#edf2ff]">
          <ChevronLeft
            size={22}
            className="text-[#111827]"
          />
        </button>

        <div>
          <h1 className="text-[26px] font-black text-[#111827] md:text-[32px]">
            Book Your Service
          </h1>

          <p className="mt-1 text-sm text-[#6b7280]">
            Easy booking in few steps
          </p>
        </div>
      </div>

      {/* DATE */}
      <div className="mb-7">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
          Select Date & Time
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {dates.map((item, index) => (
            <button
              key={index}
              className={`rounded-2xl p-4 text-left transition-all duration-300 ${
                item.active
                  ? "bg-[#2563eb] text-white shadow-xl"
                  : "bg-[#f5f7ff] hover:bg-[#edf2ff]"
              }`}
            >
              <p className="text-[13px] font-semibold">
                {item.day}
              </p>

              <p className="mt-2 text-[17px] font-black">
                {item.date}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* TIME */}
      <div className="mb-7">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
          Time
        </h2>

        <button className="flex w-full items-center justify-between rounded-2xl bg-[#f5f7ff] px-5 py-5 transition hover:bg-[#edf2ff]">
          <span className="font-semibold text-[#111827]">
            10:00 AM
          </span>

          <ChevronDown
            size={20}
            className="text-[#6b7280]"
          />
        </button>
      </div>

      {/* ADDRESS */}
      <div className="mb-7">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
          Service Address
        </h2>

        <button className="flex w-full items-center justify-between rounded-2xl bg-[#f5f7ff] px-5 py-5 transition hover:bg-[#edf2ff]">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <MapPin
                size={20}
                className="text-[#2563eb]"
              />
            </div>

            <div className="text-left">
              <h3 className="font-bold text-[#111827]">
                Home
              </h3>

              <p className="mt-1 text-sm text-[#6b7280]">
                Z/18, Baker Street, Mumbai
              </p>
            </div>
          </div>

          <ChevronDown
            size={20}
            className="text-[#6b7280]"
          />
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-7">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
          Describe Your Problem
        </h2>

        <textarea
          rows="4"
          placeholder="AC is not cooling properly and making noise."
          className="w-full resize-none rounded-2xl bg-[#f5f7ff] p-5 text-[15px] outline-none"
        />
      </div>

      {/* PHOTOS */}
      <div className="mb-8">
        <h2 className="mb-4 text-[16px] font-bold text-[#111827]">
          Upload Photos
        </h2>

        <div className="flex gap-4 overflow-x-auto">
          <img
            src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?q=80&w=500&auto=format&fit=crop"
            className="h-24 w-24 rounded-2xl object-cover"
          />

          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop"
            className="h-24 w-24 rounded-2xl object-cover"
          />

          <img
            src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&auto=format&fit=crop"
            className="h-24 w-24 rounded-2xl object-cover"
          />

          <button className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#f5f7ff] transition hover:bg-[#edf2ff]">
            <Plus
              size={28}
              className="text-[#2563eb]"
            />
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-5 rounded-[30px] bg-[#f5f7ff] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-[#6b7280]">
            Estimated Price
          </p>

          <h1 className="mt-1 text-[42px] font-black text-[#111827]">
            ₹1099
          </h1>
        </div>

        <button className="rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:scale-105">
          Continue
        </button>
      </div>
    </div>
  );
}