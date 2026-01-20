export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container py-20">
        <section className="text-center space-y-6">
          <h1 className="text-6xl font-bold text-primary">
            Welcome to Your Portfolio
          </h1>
          <p className="text-xl text-dark/70 max-w-2xl mx-auto">
            A modern portfolio powered by Next.js 14, Payload CMS, and Firebase.
          </p>
          <div className="flex gap-4 justify-center pt-8">
            <button className="btn-primary">
              View Projects
            </button>
            <button className="btn-secondary">
              Contact Me
            </button>
          </div>
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10">
            <h3 className="text-2xl font-semibold text-primary mb-3">
              Next.js 14
            </h3>
            <p className="text-dark/70">
              Built with the latest App Router and Server Components for optimal performance.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10">
            <h3 className="text-2xl font-semibold text-primary mb-3">
              Payload CMS
            </h3>
            <p className="text-dark/70">
              Powerful headless CMS for managing your portfolio content with ease.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-dark/10">
            <h3 className="text-2xl font-semibold text-primary mb-3">
              Firebase
            </h3>
            <p className="text-dark/70">
              Secure authentication and cloud storage for media assets.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
