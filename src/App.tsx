import { lazy, Suspense } from 'react';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';

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
    <div className="min-h-screen bg-cream text-ink">
      <Header />
      <main>
        <Hero />
        <Services />
        <Projects />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
