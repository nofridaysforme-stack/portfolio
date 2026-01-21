import Link from 'next/link'
import { HeroBlock } from '@/components/blocks/HeroBlock'

export default function Home() {
  return (
    <>
      {/* Hero Section with GSAP Animations */}
      <HeroBlock
        headline="Crafting Digital Experiences That Inspire"
        subheadline="Creative developer & designer specializing in modern web applications, immersive interfaces, and pixel-perfect design systems."
        ctaText="Explore My Work"
        ctaLink="#projects"
        height="fullscreen"
        overlay={true}
        alignment="center"
      />

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-light">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark font-serif mb-4">
              Featured Work
            </h2>
            <p className="text-xl text-dark/70 max-w-2xl mx-auto leading-relaxed">
              A selection of projects that showcase creativity, technical excellence, and user-centered design.
            </p>
          </div>

          {/* Placeholder for project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-6xl opacity-50">🎨</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors">
                    Project {i}
                  </h3>
                  <p className="text-dark/70 mb-4">
                    A beautiful project showcasing modern design and development.
                  </p>
                  <Link
                    href="/projects"
                    className="inline-flex items-center text-primary hover:text-primary-600 font-medium"
                  >
                    View Details
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark font-serif mb-4">
              Built With Modern Tech
            </h2>
            <p className="text-xl text-dark/70 max-w-2xl mx-auto">
              Powered by cutting-edge technologies for performance, scalability, and developer experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-light rounded-lg border border-dark/10 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-3 font-serif">
                Next.js 14
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Built with the latest App Router and Server Components for optimal performance and SEO.
              </p>
            </div>

            <div className="p-8 bg-light rounded-lg border border-dark/10 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-3 font-serif">
                Payload CMS
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Powerful headless CMS with flexible content blocks and media management.
              </p>
            </div>

            <div className="p-8 bg-light rounded-lg border border-dark/10 hover:border-primary/30 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="text-2xl font-semibold text-dark mb-3 font-serif">
                GSAP Animations
              </h3>
              <p className="text-dark/70 leading-relaxed">
                Smooth, professional animations powered by GSAP and ScrollTrigger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Demo Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                🎨 Animation Showcase
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 font-serif">
              Hero Block with GSAP Animations
            </h2>
            <p className="text-dark/70 mb-8 leading-relaxed text-lg">
              The hero section above features professional GSAP animations including:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-dark/10">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-dark mb-1">Fade In + Slide Up</h4>
                  <p className="text-sm text-dark/70">Headline and subheadline with staggered delays</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-dark/10">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-dark mb-1">Scale & Zoom</h4>
                  <p className="text-sm text-dark/70">Background image zoom effect on load</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-dark/10">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-dark mb-1">Bounce Animation</h4>
                  <p className="text-sm text-dark/70">Scroll indicator with infinite loop</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-dark/10">
                <span className="text-primary text-xl">✓</span>
                <div>
                  <h4 className="font-semibold text-dark mb-1">Smooth Scroll</h4>
                  <p className="text-sm text-dark/70">Click scroll indicator for smooth transition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary to-primary-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-light mb-6 font-serif">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-light/90 text-xl mb-8 max-w-2xl mx-auto">
            Let's work together to bring your vision to life with beautiful design and cutting-edge technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-light text-primary rounded-lg hover:bg-light/90 transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 duration-300"
            >
              Get In Touch
            </Link>
            <Link
              href="/projects"
              className="px-8 py-4 bg-primary-800 text-light rounded-lg hover:bg-primary-900 transition-all font-semibold text-lg border-2 border-light/20 hover:border-light/40"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
