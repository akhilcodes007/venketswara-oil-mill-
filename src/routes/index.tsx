import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Venkateshwara Oil Mill — Tradition, Purity & Health" },
      {
        name: "description",
        content:
          "Premium cold-pressed groundnut, sesame, coconut and traditional oils from Sri Venkateshwara Oil Mill — established 1919.",
      },
      { property: "og:title", content: "Sri Venkateshwara Oil Mill" },
      {
        property: "og:description",
        content: "Tradition, Purity & Health in Every Drop.",
      },
      { property: "og:image", content: hero.url },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero.url})` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.04_50/0.85)] via-[oklch(0.18_0.04_50/0.55)] to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-6 md:px-12">
          <div className="text-[var(--gold)] tracking-[0.3em] text-xs md:text-sm">
            ESTD · 1919
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
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-black/20 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              <span className="text-xs tracking-[0.25em] text-[var(--gold)]">
                TRADITIONAL WOOD-PRESSED OILS
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-[var(--cream)]">
              Sri
              <br />
              <span className="text-[var(--gold)]">Venkateshwara</span>
              <br />
              Oil Mill
            </h1>

            <p className="text-lg md:text-xl text-[var(--cream)]/85 italic font-serif">
              Tradition of Purity. Promise of Wellness.
            </p>
            <p className="max-w-lg text-[var(--cream)]/75">
              From our traditional village mill to your family table — cold-pressed
              groundnut, sesame, coconut and more, since 1919.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[var(--gradient-gold)] text-[oklch(0.22_0.04_50)] hover:opacity-90 shadow-[var(--shadow-gold)] h-14 px-10 text-base tracking-wide"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Link to="/shop">Enter Shop →</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 border-[var(--cream)]/40 bg-transparent text-[var(--cream)] hover:bg-[var(--cream)]/10"
              >
                <Link to="/heritage">Our Heritage</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
