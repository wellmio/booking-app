import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#333333]">
      {/* Header */}
      <header className="w-full border-b border-[#ececec] bg-white">
        <div className="max-w-[1400px] mx-auto w-[90%] py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Wellmio"
              width={168}
              height={42}
              className="h-[42px] w-auto"
              priority
            />
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#features" className="hover:underline">
              Features
            </a>
            <a href="#how-it-works" className="hover:underline">
              How it works
            </a>
            <a href="#team" className="hover:underline">
              Team
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
            <a
              href="/book"
              className="inline-block bg-[#D8794F] text-white px-4 py-2 rounded-full font-semibold hover:bg-[#c76b40]"
            >
              Book now
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center" id="hero">
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-[1400px] mx-auto w-[90%] py-24">
          <h1 className="text-white text-4xl md:text-6xl font-bold drop-shadow">
            Your Private Oasis Awaits.
          </h1>
          <p className="text-white/95 text-lg md:text-2xl mt-4 max-w-[600px] drop-shadow">
            Premium massage chairs. Seamless access. Pure relaxation when you
            want it.
          </p>
          <div className="mt-8 flex gap-4">
            <a
              href="#contact"
              className="inline-block bg-[#D8794F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c76b40]"
            >
              Join the Waitlist
            </a>
            <a
              href="/book"
              className="inline-block bg-white text-[#333333] px-6 py-3 rounded-full font-semibold hover:bg-[#f3f3f3]"
            >
              Book now
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-[#f1d4af] text-center">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-6">
            Escape the Everyday with Wellmio
          </h2>
          <p className="max-w-[700px] mx-auto mb-4">
            Wellmio is reimagining personal wellness. We provide serene, private
            studios equipped with state-of-the-art massage chairs, accessible
            seamlessly through our intuitive web app.
          </p>
          <p className="max-w-[700px] mx-auto">
            Our mission is to make premium relaxation accessible and convenient,
            blending cutting-edge technology with a deep understanding of your
            need for peace and comfort.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-[960px] mx-auto w-[90%] text-center">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-6">
            Why You&apos;ll Love Wellmio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">📱</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">
                Seamless & Contactless
              </h3>
              <p>
                Access your private massage session effortlessly. Open the door,
                select your program, and relax.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">🛋️</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">
                Premium Comfort
              </h3>
              <p>
                Top-of-the-line massage chairs offering programs tailored to
                your needs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl text-[#d26d3e] mb-3">⏰</div>
              <h3 className="text-[#d26d3e] font-semibold mb-2">
                On Your Schedule
              </h3>
              <p>
                Whether a quick refresh or a longer unwind, Wellmio is available
                when you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-[1000px] mx-auto w-[90%] text-center">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-12">
            Simple Steps to Serenity
          </h2>
          <div className="flex flex-col items-center gap-12">
            {[
              {
                icon: '📲',
                title: '1. Download the App',
                desc: 'Get the Wellmio app and sign up easily.',
              },
              {
                icon: '📍',
                title: '2. Check Availability',
                desc: 'Locate a Wellmio studio near you and see real-time chair availability.',
              },
              {
                icon: '🔓',
                title: '3. Unlock & Enter',
                desc: 'Use the app to unlock the studio door.',
              },
              {
                icon: '▶️',
                title: '4. Select & Relax',
                desc: 'Choose your preferred massage program via the app and let the chair do the rest.',
              },
              {
                icon: '💳',
                title: '5. Pay Seamlessly',
                desc: 'Payment is handled securely through the app after your session.',
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`flex items-center gap-6 w-full max-w-[700px] ${i % 2 === 1 ? 'flex-row-reverse text-right' : ''}`}
              >
                <div className="bg-[#d26d3e] text-white w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {s.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[#687258] font-semibold mb-1">
                    {s.title}
                  </h3>
                  <p className="text-[#333333]">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-16 bg-[#f1d4af]">
        <div className="max-w-[960px] mx-auto w-[90%] text-center">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-4">
            Meet the Team
          </h2>
          <p className="max-w-[600px] mx-auto mb-8">
            We&apos;re a passionate team dedicated to bringing you the ultimate
            relaxation experience through innovative technology and thoughtful
            design.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Joseph Le Pluart',
                role: 'CEO',
                img: '/images/team/joseph.jpeg',
                email: 'joseph@wellmio.se',
              },
              {
                name: 'Melina Tsapolice',
                role: 'Head of Marketing',
                img: '/images/team/melina.jpeg',
                email: 'melina@wellmio.se',
              },
              {
                name: 'Henry Bergström',
                role: 'CTO',
                img: '/images/team/henry.jpeg',
                email: 'henry@wellmio.se',
              },
            ].map(m => (
              <div
                key={m.email}
                className="bg-white rounded-lg shadow p-6 text-center"
              >
                <Image
                  src={m.img}
                  alt={m.name}
                  width={120}
                  height={120}
                  className="w-[120px] h-[120px] rounded-full object-cover mx-auto mb-4 border-4 border-[#d26d3e]"
                />
                <h3 className="text-[#687258] font-semibold">{m.name}</h3>
                <div className="text-[#d26d3e] font-medium mb-2">{m.role}</div>
                <p className="text-[#333333] text-sm mb-3">
                  {m.role === 'CEO'
                    ? 'Passionate about wellness technology and creating seamless user experiences.'
                    : m.role === 'Head of Marketing'
                      ? 'Marketing strategist focused on building the Wellmio brand.'
                      : 'Tech innovator focused on scalable solutions for wellness.'}
                </p>
                <a
                  href={`mailto:${m.email}`}
                  className="text-[#d26d3e] underline"
                >
                  {m.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section id="contact" className="py-16 bg-[#f1d4af] text-center">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <h2 className="text-3xl font-bold text-[#737D6F] mb-4">
            Be the First to Experience Wellmio
          </h2>
          <p className="mb-6">
            We&apos;re launching soon! Enter your email to get updates.
          </p>
          <form className="max-w-[400px] mx-auto grid grid-cols-1 gap-3">
            <input
              type="email"
              className="w-full px-4 py-3 rounded-full border-2 border-[#b2bb73]"
              placeholder="Enter your email"
            />
            <button className="w-full inline-block bg-[#D8794F] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#c76b40]">
              Keep Me Informed
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#687258] text-[#f1d4af] text-center py-8">
        <div className="max-w-[960px] mx-auto w-[90%]">
          <p>
            Write us at{' '}
            <a className="underline" href="mailto:hey@wellmio.se">
              hey@wellmio.se
            </a>
          </p>
          <p>© {new Date().getFullYear()} Wellmio. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
