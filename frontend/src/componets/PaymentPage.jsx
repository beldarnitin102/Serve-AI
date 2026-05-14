// src/components/PaymentPage.jsx

import {
  ChevronLeft,
  ShieldCheck,
  CreditCard,
  Wallet,
  BadgePercent,
  Circle,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

export default function PaymentPage() {
  const paymentMethods = [
    {
      title: "UPI",
      subtitle: "Pay using any UPI app",
      icon: Smartphone,
      active: true,
      color: "bg-blue-100 text-blue-600",
    },

    {
      title: "Cards",
      subtitle: "Debit / Credit Card",
      icon: CreditCard,
      active: false,
      color: "bg-red-100 text-red-500",
    },

    {
      title: "Wallets",
      subtitle: "Pay using wallet",
      icon: Wallet,
      active: false,
      color: "bg-yellow-100 text-yellow-600",
    },

    {
      title: "Promo Code",
      subtitle: "Apply offers & coupons",
      icon: BadgePercent,
      active: false,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#eef3ff] p-4 md:p-8 xl:p-12">
      {/* RESPONSIVE CONTAINER */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        {/* LEFT PAYMENT CARD */}
        <div className="rounded-[38px] bg-white p-5 shadow-[0_15px_60px_rgba(0,0,0,0.08)] md:p-8 xl:p-10">
          {/* HEADER */}
          <div className="mb-10 flex items-center gap-4">
            <button className="rounded-2xl bg-[#f5f7ff] p-3 transition hover:bg-[#edf2ff]">
              <ChevronLeft
                size={22}
                className="text-[#111827]"
              />
            </button>

            <div>
              <h1 className="text-[28px] font-black text-[#111827] md:text-[36px]">
                Payment
              </h1>

              <p className="mt-1 text-sm text-[#6b7280]">
                Complete your secure payment
              </p>
            </div>
          </div>

          {/* TOTAL */}
          <div className="mb-8 rounded-[30px] bg-gradient-to-r from-[#2563eb] to-[#3b82f6] p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">
                  Total Amount
                </p>

                <h1 className="mt-2 text-[44px] font-black">
                  ₹1099
                </h1>
              </div>

              <button className="rounded-2xl bg-white/20 px-5 py-3 text-sm font-bold backdrop-blur-xl transition hover:bg-white/30">
                View Details
              </button>
            </div>
          </div>

          {/* PAYMENT METHODS */}
          <div className="space-y-5">
            {paymentMethods.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={index}
                  className={`flex w-full items-center justify-between rounded-[28px] border p-5 transition-all duration-300 ${
                    item.active
                      ? "border-[#2563eb] bg-[#f8fbff] shadow-lg"
                      : "border-[#eef2ff] bg-white hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-2xl p-4 ${item.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    <div className="text-left">
                      <h2 className="text-[18px] font-black text-[#111827]">
                        {item.title}
                      </h2>

                      <p className="mt-1 text-sm text-[#6b7280]">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* RADIO */}
                  {item.active ? (
                    <CheckCircle2
                      size={24}
                      className="text-[#2563eb]"
                    />
                  ) : (
                    <Circle
                      size={22}
                      className="text-[#cbd5e1]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* BUTTON */}
          <button className="mt-10 w-full rounded-[24px] bg-gradient-to-r from-[#2563eb] to-[#3b82f6] py-5 text-[18px] font-black text-white shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-[1.02]">
            Pay ₹1099
          </button>

          <p className="mt-4 text-center text-sm font-medium text-[#6b7280]">
            Secure Payment
          </p>

          {/* FOOTER */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <ShieldCheck
              size={20}
              className="text-[#10b981]"
            />

            <span className="text-sm font-semibold text-[#6b7280]">
              100% Secure Payments
            </span>
          </div>
        </div>

        {/* RIGHT SIDE DESKTOP PANEL */}
        <div className="hidden xl:block">
          <div className="sticky top-10 rounded-[38px] bg-gradient-to-br from-[#071952] via-[#0B5ED7] to-[#3B82F6] p-8 text-white shadow-[0_20px_80px_rgba(0,0,0,0.15)]">
            {/* TOP */}
            <div>
              <h1 className="text-[40px] font-black leading-tight">
                Fast &
                <br />
                Secure
                <br />
                Payments
              </h1>

              <p className="mt-5 text-lg leading-8 text-blue-100">
                Pay securely using UPI,
                Cards, Wallets and
                Coupons with encrypted
                payment protection.
              </p>
            </div>

            {/* CARD */}
            <div className="mt-10 rounded-[32px] bg-white/10 p-6 backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">
                    Selected Method
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    UPI
                  </h2>
                </div>

                <div className="rounded-2xl bg-white/20 p-4">
                  <Smartphone size={30} />
                </div>
              </div>

              {/* FEATURES */}
              <div className="mt-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-400" />

                  <p className="font-medium">
                    Instant Payment
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-yellow-300" />

                  <p className="font-medium">
                    Encrypted Security
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-pink-300" />

                  <p className="font-medium">
                    Cashback Available
                  </p>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <img
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1200&auto=format&fit=crop"
              alt=""
              className="mt-10 h-[320px] w-full rounded-[32px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}