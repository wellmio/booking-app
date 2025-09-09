export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333]">
      {/* Header */}
      <header className="w-full border-b border-[#ececec] bg-white">
        <div className="max-w-[1400px] mx-auto w-[90%] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="Wellmio" className="h-[42px] w-auto" />
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">About</a>
            <a href="#features" className="hover:underline">Features</a>
            <a href="#how-it-works" className="hover:underline">How it works</a>
            <a href="#team" className="hover:underline">Team</a>
            <a href="#contact" className="hover:underline">Contact</a>
            <a href="/book" className="inline-block bg-[#D8794F] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#c76b40]">Book now</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center" id="hero">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-[90%] py-24">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow">Your Private Oasis Awaits.</h1>
          <p className="text-white/95 text-lg md:text-2xl mt-4 max-w-[600px] drop-shadow">
            Premium massage chairs. Seamless access. Pure relaxation when you want it.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#contact" className="inline-block bg-[#D8794F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c76b40]">Join the Waitlist</a>
            <a href="/book" className="inline-block bg-white text-[#333333] px-6 py-3 rounded-full font-semibold hover:bg-[#f3f3f3]">Book now</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-[#f1d4af] text-center">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-6">Escape the Everyday with Wellmio</h2>
          <p className="max-w-[700px] mx-auto mb-4">
            Wellmio is reimagining personal wellness. We provide serene, private studios equipped with state-of-the-art massage chairs, accessible seamlessly through our intuitive web app.
          </p>
          <p className="max-w-[700px] mx-auto">
            Our mission is to make premium relaxation accessible and convenient, blending cutting-edge technology with a deep understanding of your need for peace and comfort.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-[960px] mx-auto w-[90%] text-center">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-6">Why You'll Love Wellmio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">📱</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">Seamless & Contactless</h3>
              <p>Access your private massage session effortlessly. Open the door, select your program, and relax.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">🛋️</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">Premium Comfort</h3>
              <p>Top-of-the-line massage chairs offering programs tailored to your needs.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">⏰</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">On Your Schedule</h3>
              <p>Whether a quick refresh or a longer unwind, Wellmio is available when you are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-16 bg-[#f1d4af] text-center">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-4">Be the First to Experience Wellmio</h2>
          <p className="mb-6">We're launching soon! Enter your email to get updates.</p>
          <form className="max-w-[400px] mx-auto grid grid-cols-1 gap-3">
            <input type="email" className="w-full px-4 py-3 rounded-full border-2 border-[#b2bb73]" placeholder="Enter your email" />
            <button className="w-full inline-block bg-[#D8794F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c76b40]">Keep Me Informed</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#687258] text-[#f1d4af] text-center py-8">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <p>
            Write us at <a className="underline" href="mailto:hey@wellmio.se">hey@wellmio.se</a>
          </p>
          <p>© {new Date().getFullYear()} Wellmio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
