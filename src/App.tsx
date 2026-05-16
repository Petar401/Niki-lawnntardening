import { lazy, Suspense } from 'react';
import { Button, Container, Icon } from '@/components/primitives';
import { Leaf } from 'lucide-react';

const Styleguide = lazy(() => import('@/dev/Styleguide'));

function isStyleguideRoute(): boolean {
  if (typeof window === 'undefined') return false;
  if (!import.meta.env.DEV) return false;
  return window.location.pathname.replace(/\/$/, '') === '/dev/styleguide';
}

export default function App() {
  if (isStyleguideRoute()) {
    return (
      <Suspense fallback={<div className="p-10 text-ink/60">Loading styleguide…</div>}>
        <Styleguide />
      </Suspense>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-ink">
      <Container as="section" className="py-24 sm:py-32">
        <p className="text-eyebrow font-medium uppercase text-forest/75">Phase 3 · Design system</p>
        <h1 className="mt-4 font-display text-display-lg text-forest">
          Niki Lawn &amp; Gardening
        </h1>
        <p className="mt-6 max-w-prose text-lg text-ink/75">
          Friendly, expert garden design, lawn care, planting and seasonal maintenance.
          Primitives and brand tokens are ready — the page sections come next.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Button leadingIcon={<Icon icon={Leaf} size="sm" />}>Request a quote</Button>
          <Button variant="secondary">See our work</Button>
        </div>
      </Container>
    </main>
  );
}
