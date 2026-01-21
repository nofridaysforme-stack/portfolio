import Link from 'next/link'

export default function Home() {
  return (
    <div className="container py-20 px-4 sm:px-6 lg:px-8">
      <section className="text-center space-y-6 py-12 md:py-20">
        <h1 className="text-5xl md:text-6xl font-bold text-primary font-serif">
          Welcome to Your Portfolio
        </h1>
        <p className="text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed">
          A modern portfolio powered by Next.js 14, Payload CMS, and Firebase.
        </p>
        <div className="flex gap-4 justify-center pt-8">
          <Link
            href="/projects"
            className="px-8 py-3 bg-primary text-light rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 bg-secondary text-dark rounded-lg hover:bg-secondary-600 transition-colors font-medium"
          >
            Contact Me
          </Link>
        </div>
      </section>

      <section className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10 hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-semibold text-primary mb-3 font-serif">
            Next.js 14
          </h3>
          <p className="text-dark/70 leading-relaxed">
            Built with the latest App Router and Server Components for optimal performance.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10 hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-semibold text-primary mb-3 font-serif">
            Payload CMS
          </h3>
          <p className="text-dark/70 leading-relaxed">
            Powerful headless CMS for managing your portfolio content with ease.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10 hover:shadow-md transition-shadow">
          <h3 className="text-2xl font-semibold text-primary mb-3 font-serif">
            Firebase
          </h3>
          <p className="text-dark/70 leading-relaxed">
            Secure authentication and cloud storage for media assets.
          </p>
        </div>
      </section>

      <section className="mt-16 md:mt-20 text-center">
        <div className="max-w-3xl mx-auto p-8 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-3xl font-bold text-dark mb-4 font-serif">
            Layout Components Loaded
          </h2>
          <p className="text-dark/70 mb-6 leading-relaxed">
            The Header and Footer components are now integrated into the root layout.
            Try scrolling to see the sticky header effect, or resize your browser
            to test the responsive mobile menu.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm text-dark/60">
            <span className="px-3 py-1 bg-white rounded-full border border-dark/10">
              ✓ Header with Navigation
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-dark/10">
              ✓ Mobile Menu with GSAP
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-dark/10">
              ✓ Sticky Scroll Effect
            </span>
            <span className="px-3 py-1 bg-white rounded-full border border-dark/10">
              ✓ Footer with Social Links
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
