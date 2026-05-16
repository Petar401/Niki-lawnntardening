import { lazy, Suspense } from 'react';
import { Button, Container, Icon } from '@/components/primitives';
import { HeroVisual } from '@/components/three/HeroVisual';
import { ArrowRight, Leaf } from 'lucide-react';
import { site } from '@/content/site';

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
      <Container as="section" className="py-20 sm:py-28">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-eyebrow font-medium uppercase text-forest/75">Phase 5 · 3D scene</p>
            <h1 className="mt-4 font-display text-display-xl text-forest">
              A tidy, planted garden — <span className="text-leaf">cared for, year after year</span>.
            </h1>
            <p className="mt-6 max-w-prose text-lg text-ink/75">
              {site.promise}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href={site.cta.primary.href}
                trailingIcon={<Icon icon={ArrowRight} size="sm" />}
              >
                {site.cta.primary.label}
              </Button>
              <Button
                as="a"
                href={site.cta.secondary.href}
                variant="secondary"
                leadingIcon={<Icon icon={Leaf} size="sm" />}
              >
                {site.cta.secondary.label}
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </Container>
    </main>
  );
}
