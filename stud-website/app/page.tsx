export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Unicorn Studio Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div
          data-us-project="xsEyiHskDOyEOmvRLfGy"
          style={{ width: "1440px", height: "900px" }}
        />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6">
        <div className="rounded-3xl bg-white/80 px-12 py-16 backdrop-blur-md">
          <h1
            className="text-center text-5xl tracking-tight text-zinc-900 md:text-7xl"
            style={{ fontFamily: "Raster, sans-serif" }}
          >
            Cursor for Roblox Studio
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-center text-lg text-zinc-600 md:text-xl"
            style={{ fontFamily: "Beretta, sans-serif" }}
          >
            AI-powered development for Roblox. Build games faster with 28
            specialized tools that work directly in Studio.
          </p>

          {/* Waitlist Form */}
          <form className="mx-auto mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-12 flex-1 rounded-full border border-zinc-300 bg-white px-5 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="h-12 rounded-full bg-zinc-900 px-6 text-base font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Join Waitlist
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
