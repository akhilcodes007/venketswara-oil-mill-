import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-new.png";
import { SEO } from "@/components/SEO";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SRI VENKETESWARA OIL MILL",
    "image": "https://sriVENKETESWARAoilmill.com/lovable-uploads/27fb6e0b-d2c6-4d2c-801c-6d149de1e604.png",
    "@id": "https://sriVENKETESWARAoilmill.com",
    "url": "https://sriVENKETESWARAoilmill.com",
    "telephone": "+910000000000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road",
      "addressLocality": "India",
      "addressRegion": "KA",
      "postalCode": "560001",
      "addressCountry": "IN"
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <SEO 
        title="SRI VENKETESWARA OIL MILL — Tradition, Purity & Health"
        description="Premium cold-pressed groundnut, sesame, coconut and traditional oils from SRI VENKETESWARA OIL MILL — established 1919."
        jsonLd={jsonLd}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.04_50/0.85)] via-[oklch(0.18_0.04_50/0.55)] to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-start justify-between px-6 py-8 md:px-12">
          <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-4 duration-1000 ease-out z-20">
            <span className="text-[var(--gold)] tracking-[0.3em] text-[0.7rem] md:text-xs font-semibold">
              ESTD · 1919
            </span>
            <span className="text-white/90 tracking-[0.2em] text-[0.6rem] md:text-[0.7rem] mt-1 font-medium drop-shadow-sm">
              100% NATURAL • FARM FRESH
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/heritage"
              className="text-[var(--cream)] text-sm tracking-wide hover:text-[var(--gold)] transition-colors"
            >
              Our Heritage
            </Link>
            <Link
              to="/shop"
              className="text-[var(--cream)] text-sm tracking-wide hover:text-[var(--gold)] transition-colors"
            >
              Skip →
            </Link>
          </div>
        </header>

        <section className="flex flex-1 items-center px-6 md:px-16">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out z-10">

            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[var(--cream)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150 fill-mode-both drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              <span className="block text-3xl md:text-4xl text-white/90 font-medium mb-2">Pure Traditional</span>
              <span className="block font-bold tracking-wide">SRI VENKETESWARA</span>
              <span className="block text-[var(--gold)] font-bold tracking-widest">OIL MILL</span>
              <span className="block text-3xl md:text-4xl text-[var(--gold)]/90 font-medium mt-2">Cold Pressed Oils</span>
            </h1>

            <p className="max-w-lg text-[var(--cream)]/90 text-lg md:text-xl font-medium animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
              Freshly extracted using traditional methods. 100% Natural. Farm Fresh. Delivered to your doorstep.
            </p>

            <div className="flex flex-wrap gap-4 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
              <Button
                asChild
                size="lg"
                className="bg-[var(--gradient-gold)] text-[oklch(0.22_0.04_50)] hover:scale-105 transition-all shadow-[var(--shadow-gold)] h-14 px-10 text-base tracking-wide"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Link to="/shop">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 border-[var(--cream)]/40 bg-transparent text-[var(--cream)] hover:bg-[var(--cream)]/10 hover:border-[var(--cream)] hover:scale-105 transition-all"
              >
                <Link to="/shop">Explore Products</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
