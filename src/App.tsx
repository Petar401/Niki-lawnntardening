export default function App() {
  return (
    <main className="min-h-screen bg-cream text-ink">
      <section className="container py-24 sm:py-32">
        <p className="font-sans text-eyebrow uppercase text-forest/80">Phase 2 · Foundation</p>
        <h1 className="mt-4 font-display text-display-lg text-forest">
          Niki Lawn &amp; Gardening
        </h1>
        <p className="mt-6 max-w-prose text-lg text-ink/80">
          Friendly, expert garden design, lawn care, planting and seasonal maintenance.
          This scaffold confirms the foundation builds cleanly. The full site is built in the
          next phases.
        </p>
        <div className="mt-10 inline-flex items-center gap-3 rounded-md bg-forest/5 px-4 py-3 text-sm text-forest">
          <span className="h-2 w-2 rounded-full bg-leaf" aria-hidden="true" />
          Foundation OK — Vite + React + TS + Tailwind + tokens.css wired up.
        </div>
      </section>
    </main>
  );
}
