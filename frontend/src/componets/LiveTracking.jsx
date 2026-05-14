import {
  ChevronLeft,
  Phone,
  MessageCircle,
  Star,
} from "lucide-react";

export default function LiveTracking() {
  const steps = [
    "Accepted",
    "On The Way",
    "Arrived",
    "In Progress",
    "Completed",
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
            Tracking Your Professional
          </h1>

          <p className="mt-1 text-sm text-[#6b7280]">
            Your professional is on the way
          </p>
        </div>
      </div>

      {/* MAP */}
      <div className="relative mb-8 overflow-hidden rounded-[32px] bg-[#eef3ff]">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop"
          className="h-[320px] w-full object-cover opacity-80"
        />

        {/* PATH */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 500 300"
          fill="none"
        >
          <path
            d="M90 220 C170 200, 190 160, 260 170 S360 130, 420 90"
            stroke="#2563eb"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>

        {/* START */}
        <div className="absolute left-[80px] top-[210px] h-6 w-6 rounded-full border-4 border-white bg-[#2563eb] shadow-xl" />

        {/* END */}
        <div className="absolute right-[70px] top-[80px] h-7 w-7 rounded-full border-4 border-white bg-[#ef4444] shadow-xl" />
      </div>

      {/* PROFILE CARD */}
      <div className="mb-10 rounded-[30px] border border-[#eef2ff] bg-white p-5 shadow-md">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <img
              src="https://i.pravatar.cc/150?img=12"
              className="h-20 w-20 rounded-3xl object-cover"
            />

            <div>
              <h2 className="text-[24px] font-black text-[#111827]">
                Ramesh Kumar
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <Star
                  size={16}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="font-semibold text-[#111827]">
                  4.8
                </span>

                <span className="text-[#6b7280]">
                  AC Specialist
                </span>
              </div>
            </div>
          </div>

          {/* ETA */}
          <div className="text-left md:text-right">
            <p className="text-sm text-[#6b7280]">
              ETA
            </p>

            <h1 className="mt-1 text-[42px] font-black text-[#111827]">
              12 mins
            </h1>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 rounded-2xl border border-[#d1fae5] bg-[#ecfdf5] py-4 font-bold text-[#10b981] transition hover:scale-105">
            <Phone size={20} />
            Call
          </button>

          <button className="flex items-center justify-center gap-3 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] py-4 font-bold text-[#2563eb] transition hover:scale-105">
            <MessageCircle size={20} />
            Chat
          </button>
        </div>
      </div>

      {/* PROGRESS */}
      <div>
        <h2 className="mb-8 text-[24px] font-black text-[#111827]">
          Service Progress
        </h2>

        <div className="flex items-start justify-between gap-2 overflow-x-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex min-w-[90px] flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                <div
                  className={`h-5 w-5 rounded-full border-4 ${
                    index <= 2
                      ? "border-[#10b981] bg-white"
                      : "border-[#d1d5db] bg-white"
                  }`}
                />

                {index !== steps.length - 1 && (
                  <div
                    className={`h-[4px] flex-1 ${
                      index < 2
                        ? "bg-[#10b981]"
                        : "bg-[#d1d5db]"
                    }`}
                  />
                )}
              </div>

              <p className="mt-4 text-center text-xs font-semibold text-[#6b7280]">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}