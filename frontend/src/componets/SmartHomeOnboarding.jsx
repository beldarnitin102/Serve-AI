export default function SmartHomeOnboarding() {
  const features = [
    'AI-Powered Matching',
    'Verified Professionals',
    'Live Tracking',
    'Transparent Pricing',
  ];

  return (
    <div className="min-h-screen bg-[#07152b] text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1f4ed8_0%,transparent_35%)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#2563eb_0%,transparent_30%)] opacity-20" />

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
        <div className="w-full max-w-[360px] rounded-[40px] bg-[#f7f8fc] shadow-[0_25px_60px_rgba(0,0,0,0.45)] border-[8px] border-black overflow-hidden relative">
          {/* Status */}
          <div className="flex items-center justify-between px-6 pt-4 text-[10px] text-black font-semibold">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 rounded-sm border border-black" />
            </div>
          </div>

          <div className="px-7 pt-6 pb-8 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#edf2ff] text-[#2458e6] text-xs font-semibold mb-6 shadow-sm">
              Onboarding
            </div>

            <h1 className="text-[31px] leading-[38px] font-bold text-[#101828]">
              Smart Home Services Made Simple
            </h1>

            <p className="mt-4 text-[#667085] text-[15px] leading-6 px-2">
              AI-powered matching, verified professionals, transparent pricing,
              and real-time tracking.
            </p>

            {/* Illustration Area */}
            <div className="relative mt-10 flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-br from-[#dfe9ff] to-[#ffffff] opacity-80 blur-sm" />
              </div>

              {/* Floating Icons */}
              <div className="absolute left-0 top-10 w-11 h-11 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-[#edf1f7] hover:scale-105 transition-transform">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2458e6" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L15 12l-5.25-5" />
                </svg>
              </div>

              <div className="absolute right-0 top-4 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-[#edf1f7] hover:-translate-y-1 transition-all">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#2458e6" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10m-10 5h16" />
                </svg>
              </div>

              <div className="absolute right-3 bottom-5 w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-[#edf1f7] hover:scale-105 transition-transform">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#2458e6" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              </div>

              {/* Main Illustration */}
              <div className="relative z-10 w-[220px] h-[220px] flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-b from-[#2b6cf0] to-[#1c4fd8] shadow-2xl flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-[#f4b183] flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-[#0f172a]" />
                    </div>
                  </div>

                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-44 h-16 rounded-[30px] bg-[#2458e6] shadow-xl" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-10 space-y-4 text-left">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-white shadow-sm border border-[#edf1f7] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#edf2ff] flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[#2458e6]" />
                  </div>
                  <span className="text-[#1d2939] text-[15px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between mt-10">
              <button className="text-[#98a2b3] font-medium text-sm hover:text-[#2458e6] transition-colors">
                Skip
              </button>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#2458e6]" />
                <div className="w-2 h-2 rounded-full bg-[#d0d5dd]" />
                <div className="w-2 h-2 rounded-full bg-[#d0d5dd]" />
              </div>

              <button className="px-7 py-3 rounded-2xl bg-gradient-to-r from-[#2f6cf3] to-[#2458e6] text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300">
                Next
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-[5px] bg-black/10 rounded-full mx-auto mb-2 w-28" />
        </div>
      </div>

      {/* Tablet + Desktop */}
      <div className="hidden lg:flex relative z-10 min-h-screen">
        {/* Main Content */}
        <div className="flex-1 p-8 xl:p-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-sm text-[#d0ddff] font-medium shadow-lg">
                Smart Home Platform
              </div>

              <h1 className="mt-5 text-5xl xl:text-6xl font-bold leading-tight max-w-3xl">
                Smart Home Services
                <span className="block text-[#7aa2ff]">Made Simple</span>
              </h1>

              <p className="mt-6 text-[#c7d2fe] text-lg leading-8 max-w-2xl">
                AI-powered service discovery, verified professionals,
                transparent pricing, and seamless live tracking experience.
              </p>
            </div>

            {/* Glass Card */}
            <div className="w-[340px] rounded-[32px] bg-white/10 backdrop-blur-2xl border border-white/10 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] hover:-translate-y-2 transition-all duration-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#d0ddff] text-sm">Active Users</p>
                  <h2 className="text-4xl font-bold mt-2">24K+</h2>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2f6cf3] to-[#4f86ff] shadow-lg" />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <p className="text-xs text-[#c7d2fe]">Professionals</p>
                  <h3 className="mt-2 text-2xl font-bold">1.2K</h3>
                </div>

                <div className="rounded-2xl bg-white/10 p-4 border border-white/10">
                  <p className="text-xs text-[#c7d2fe]">Bookings</p>
                  <h3 className="mt-2 text-2xl font-bold">18K</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Grid */}
          <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
            {/* Left Section */}
            <div className="space-y-8">
              {/* Hero Card */}
              <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#f7f9ff] to-[#eef4ff] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.25)]">
                <div className="absolute right-10 top-10 w-44 h-44 rounded-full bg-[#2f6cf3]/20 blur-3xl" />

                <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
                  <div>
                    <span className="inline-flex px-4 py-2 rounded-full bg-[#2458e6] text-white text-sm font-medium shadow-md">
                      AI Powered Experience
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-[#101828] leading-tight">
                      Seamless Professional Service Booking
                    </h2>

                    <p className="mt-5 text-[#667085] text-lg leading-8">
                      Find trusted professionals instantly with transparent
                      pricing and real-time service updates.
                    </p>

                    <div className="flex gap-4 mt-8">
                      <button className="px-6 py-4 rounded-2xl bg-gradient-to-r from-[#2f6cf3] to-[#2458e6] text-white font-semibold shadow-lg hover:scale-105 transition-transform">
                        Get Started
                      </button>

                      <button className="px-6 py-4 rounded-2xl border border-[#d0d5dd] text-[#344054] font-semibold bg-white hover:bg-[#f9fafb] transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>

                  {/* Illustration */}
                  <div className="flex justify-center">
                    <div className="relative w-[320px] h-[320px]">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#dbe7ff] to-white" />

                      <div className="absolute top-8 right-0 w-16 h-16 rounded-3xl bg-white shadow-xl border border-[#edf1f7]" />
                      <div className="absolute bottom-8 left-0 w-14 h-14 rounded-3xl bg-white shadow-xl border border-[#edf1f7]" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <div className="w-56 h-56 rounded-full bg-gradient-to-b from-[#2f6cf3] to-[#1c4fd8] shadow-2xl flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full bg-[#f4b183] flex items-center justify-center">
                              <div className="w-28 h-28 rounded-full bg-[#0f172a]" />
                            </div>
                          </div>

                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-20 rounded-[40px] bg-[#2458e6] shadow-2xl" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div
                    key={feature}
                    className="group rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/10 p-6 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2 shadow-lg"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2f6cf3] to-[#2458e6] shadow-lg group-hover:scale-110 transition-transform duration-300" />

                    <h3 className="mt-5 text-xl font-semibold">{feature}</h3>

                    <p className="mt-3 text-[#c7d2fe] leading-7 text-sm">
                      Experience enterprise-grade smart home service management
                      with seamless user interaction.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side */}
            <div className="space-y-8">
              <div className="rounded-[32px] bg-white/10 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <h3 className="text-2xl font-bold">Live Insights</h3>

                <div className="mt-8 space-y-5">
                  {[72, 88, 64].map((value, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#d0ddff]">
                          Service Efficiency
                        </span>
                        <span className="text-sm font-semibold">{value}%</span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#2f6cf3] to-[#7aa2ff]"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] bg-gradient-to-br from-[#2458e6] to-[#183fb5] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />

                <div className="relative z-10">
                  <h3 className="text-3xl font-bold leading-tight">
                    Upgrade Your Home Service Experience
                  </h3>

                  <p className="mt-5 text-[#dbe7ff] leading-7">
                    Access premium professionals, AI-powered automation, and
                    seamless live tracking.
                  </p>

                  <button className="mt-8 px-6 py-4 rounded-2xl bg-white text-[#2458e6] font-semibold shadow-lg hover:scale-105 transition-transform">
                    Explore Platform
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
