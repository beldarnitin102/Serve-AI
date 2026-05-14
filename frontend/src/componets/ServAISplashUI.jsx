export default function ServAISplashUI() {
  const navItems = [
    { name: 'Home' },
    { name: 'Services' },
    { name: 'Bookings' },
    { name: 'Profile' },
  ];

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#04102b] text-white relative">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(30,64,175,0.45),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.28),transparent_40%),linear-gradient(to_bottom,#020817,#04173d,#05142f)]" />

      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 right-[-100px] h-[400px] w-[400px] rounded-full bg-blue-500 blur-3xl opacity-20" />
        <div className="absolute bottom-[-120px] left-[-100px] h-[420px] w-[420px] rounded-full bg-blue-700 blur-3xl opacity-30" />
      </div>

      {/* LIGHT WAVES */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-10%] h-[2px] w-[130%] rotate-[-10deg] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-sm" />
        <div className="absolute top-[40%] left-[-15%] h-[2px] w-[140%] rotate-[8deg] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm" />
        <div className="absolute bottom-[28%] left-[-10%] h-[2px] w-[120%] rotate-[-8deg] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-sm" />
      </div>

      {/* MOBILE/TABLET UI */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 lg:hidden">
        <div className="mb-5 rounded-full border border-blue-400/20 bg-white/10 px-5 py-1 text-xs font-semibold tracking-wide text-blue-100 backdrop-blur-xl shadow-[0_0_30px_rgba(59,130,246,0.25)]">
          Splash Screen
        </div>

        <div className="relative w-full max-w-[370px] rounded-[42px] border border-white/10 bg-white/5 p-3 shadow-[0_25px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#04102b] px-6 py-8 min-h-[760px] flex flex-col justify-between shadow-inner">
            <div>
              <div className="mb-10 flex items-center justify-between text-xs text-white/60">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-white/80" />
                  <div className="h-2 w-2 rounded-full bg-white/60" />
                  <div className="h-2 w-6 rounded-full border border-white/40" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center pt-20 text-center">
                {/* LOGO */}
                <div className="relative mb-10 flex h-28 w-28 items-center justify-center rounded-[30px] bg-gradient-to-br from-white via-slate-100 to-blue-100 shadow-[0_15px_60px_rgba(59,130,246,0.45)]">
                  <div className="absolute inset-0 rounded-[30px] bg-gradient-to-br from-white/50 to-blue-300/10 blur-md" />

                  <div className="relative h-16 w-16 rotate-45 rounded-2xl border-[10px] border-[#0a58ff] border-t-white border-l-white bg-white shadow-inner" />

                  <div className="absolute bottom-4 left-4 h-5 w-5 rounded-full bg-[#005eff] shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                </div>

                <h1 className="text-[44px] font-black tracking-tight leading-none">
                  <span className="text-white">Serv</span>
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    AI
                  </span>
                </h1>

                <p className="mt-5 max-w-[220px] text-base leading-7 text-blue-100/90 font-medium">
                  Smart Home Services
                  <br />
                  in Seconds
                </p>
              </div>
            </div>

            {/* BOTTOM NAV */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-2 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
              <div className="grid grid-cols-4 gap-2">
                {navItems.map((item, index) => (
                  <button
                    key={item.name}
                    className={`rounded-2xl px-2 py-3 text-xs font-medium transition-all duration-300 ${
                      index === 0
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP PREMIUM 3D UI */}
      <div className="relative z-10 hidden min-h-screen lg:flex">
        {/* LEFT PANEL */}
        <div className="relative flex w-[42%] items-center justify-center overflow-hidden border-r border-white/10 bg-white/[0.03] backdrop-blur-3xl">
          <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="relative z-10 max-w-lg px-10">
            <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold tracking-wide text-blue-100 shadow-xl backdrop-blur-xl">
              AI Powered Smart Home Platform
            </div>

            <h1 className="text-7xl font-black tracking-tight leading-[0.95]">
              <span className="text-white">Serv</span>
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>

            <p className="mt-8 max-w-md text-xl leading-9 text-blue-100/80">
              Premium smart-home service experience with modern AI-driven interactions and elegant real-time dashboard design.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-5">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                <div className="text-4xl font-black text-cyan-300">24/7</div>
                <div className="mt-2 text-sm text-white/70">Instant Smart Support</div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
                <div className="text-4xl font-black text-blue-400">AI</div>
                <div className="mt-2 text-sm text-white/70">Automation Enabled</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PREMIUM DEVICE SHOWCASE */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden p-16">
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />

          {/* 3D floating glass layers */}
          <div className="absolute left-[12%] top-[18%] h-48 w-48 rounded-[40px] border border-white/10 bg-white/[0.04] backdrop-blur-3xl rotate-[-12deg] shadow-[0_25px_80px_rgba(0,0,0,0.45)]" />
          <div className="absolute right-[14%] bottom-[18%] h-56 w-56 rounded-[50px] border border-white/10 bg-white/[0.05] backdrop-blur-3xl rotate-[14deg] shadow-[0_25px_80px_rgba(0,0,0,0.45)]" />

          {/* PHONE */}
          <div className="relative rounded-[50px] border border-white/10 bg-black/40 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.75)] backdrop-blur-3xl transition-all duration-500 hover:-translate-y-2 hover:rotate-1">
            <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-[#04102b] w-[360px] h-[760px] px-8 py-10 shadow-inner">
              {/* Waves */}
              <div className="absolute inset-0">
                <div className="absolute top-[20%] left-[-20%] h-[2px] w-[140%] rotate-[-12deg] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent blur-sm" />
                <div className="absolute top-[48%] left-[-20%] h-[2px] w-[140%] rotate-[12deg] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent blur-sm" />
                <div className="absolute bottom-[18%] left-[-10%] h-[2px] w-[130%] rotate-[-8deg] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-sm" />
              </div>

              <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                {/* LOGO */}
                <div className="relative mb-12 flex h-32 w-32 items-center justify-center rounded-[36px] bg-gradient-to-br from-white via-slate-100 to-blue-100 shadow-[0_20px_80px_rgba(59,130,246,0.5)]">
                  <div className="relative h-20 w-20 rotate-45 rounded-3xl border-[12px] border-[#0a58ff] border-t-white border-l-white bg-white shadow-inner" />
                  <div className="absolute bottom-5 left-5 h-6 w-6 rounded-full bg-[#005eff] shadow-[0_0_25px_rgba(59,130,246,0.9)]" />
                </div>

                <h2 className="text-6xl font-black tracking-tight leading-none">
                  <span className="text-white">Serv</span>
                  <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                    AI
                  </span>
                </h2>

                <p className="mt-7 text-xl leading-9 text-blue-100/90 font-medium">
                  Smart Home Services
                  <br />
                  in Seconds
                </p>

                <button className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 text-base font-semibold shadow-[0_15px_40px_rgba(59,130,246,0.45)] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(59,130,246,0.6)]">
                  Launch Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
