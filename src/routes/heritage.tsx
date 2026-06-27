import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.asset.json";
import { Sparkles, Leaf, Award, Heart, Building2, Compass } from "lucide-react";

export const Route = createFileRoute("/heritage")({
  head: () => ({
    meta: [
      { title: "Our Heritage — Sri Venkateshwara Oil Mill" },
      {
        name: "description",
        content:
          "A century of tradition since 1919 — from a bullock-driven Chekku in Neikuppi to modern cold-press machines across Tamil Nadu.",
      },
      { property: "og:title", content: "Our Heritage · Since 1919" },
      {
        property: "og:description",
        content: "A Century of Tradition, A Legacy of Trust, A Commitment to Purity.",
      },
      { property: "og:image", content: hero.url },
    ],
  }),
  component: Heritage,
});

const MILESTONES = [
  {
    year: "1919",
    icon: Building2,
    title: "The Foundation",
    body: "Our journey began in 1919 in Neikuppi, Tindivanam, when our great-grandfather established a traditional oil extraction business. Oil was extracted using a bullock-driven wooden Chekku — a method that preserved the oil's natural nutrients, aroma and quality. This commitment to purity became the cornerstone of our family business.",
  },
  {
    year: "Generations",
    icon: Heart,
    title: "Building Customer Trust",
    body: "Over the decades, our family earned a reputation for delivering high-quality cold-pressed oils. Through consistent quality, honesty and dedication to customer satisfaction, we became a trusted name among households that valued natural and traditionally produced oils.",
  },
  {
    year: "Industrial Era",
    icon: Compass,
    title: "Adapting to Changing Times",
    body: "As industrialisation transformed the edible oil industry and large commercial brands gained market share, traditional oil producers faced increasing competition. Despite these challenges, our family remained committed to preserving the authenticity and quality that had defined our business for generations.",
  },
  {
    year: "2015",
    icon: Sparkles,
    title: "Revival and Renewal",
    body: "In 2015, recognising the growing awareness of health-conscious living and the renewed demand for natural products, our family revitalised the business. Drawing upon nearly a century of experience, we modernised our operations while staying true to the traditional principles established by our ancestors.",
  },
  {
    year: "Today",
    icon: Leaf,
    title: "Tradition Meets Innovation",
    body: "The traditional bullock-operated Chekku evolved into modern wooden and metal cold-press machines. While embracing technological advancements to improve efficiency and consistency, we continue to follow the same core philosophy of producing pure, chemical-free and nutrient-rich oils.",
  },
  {
    year: "Expansion",
    icon: Award,
    title: "Growth and Expansion",
    body: "From our humble beginnings in Neikuppi, Tindivanam, we have expanded our presence and today proudly serve customers through our branches in Old Pallavaram, Madipakkam and Old Pallavaram (Main Unit).",
  },
];

function Heritage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8 md:py-24">
          <p className="text-xs tracking-[0.4em] text-[var(--gold-deep)]">EST. 1919 · NEIKUPPI, TINDIVANAM</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground md:text-6xl">
            Our Legacy: Preserving Tradition,
            <br />
            <span className="text-primary">Delivering Purity Since 1919</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            A century of cold-pressed oils — extracted with the same care, conviction and craft
            passed down through four generations of our family.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <ol className="relative space-y-10 border-l border-border pl-8">
          {MILESTONES.map(({ year, icon: Icon, title, body }) => (
            <li key={title} className="relative">
              <span
                className="absolute -left-[2.6rem] flex h-10 w-10 items-center justify-center rounded-full text-[oklch(0.22_0.04_50)] shadow-[var(--shadow-gold)]"
                style={{ background: "var(--gradient-gold)" }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">{year}</div>
              <h2 className="mt-1 font-serif text-2xl text-foreground md:text-3xl">{title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center md:px-8">
          <h2 className="font-serif text-3xl text-foreground md:text-4xl">A Legacy of Purity and Trust</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            For more than a century, our family has remained dedicated to delivering authentic
            cold-pressed oils that promote health and well-being. Every product reflects the
            knowledge, values and craftsmanship passed down through generations — making our brand
            a symbol of quality and trust.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14 text-center md:px-8">
        <h2 className="font-serif text-3xl text-foreground md:text-4xl">Vision for the Future</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          As we move forward, we aim to preserve our rich heritage while embracing innovation and
          sustainable practices. Our mission is to continue providing pure cold-pressed oils to
          future generations and expand our reach without compromising the values that have guided
          us since 1919.
        </p>

        <figure className="mt-10 rounded-3xl border border-border bg-[var(--cream)]/40 p-10">
          <blockquote className="font-serif text-2xl text-foreground md:text-3xl">
            “A Century of Tradition,
            <br className="hidden md:block" /> A Legacy of Trust,
            <br className="hidden md:block" /> A Commitment to Purity.”
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase tracking-[0.4em] text-[var(--gold-deep)]">
            — Our Motto
          </figcaption>
        </figure>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/shop">Shop our oils</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}