import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-[oklch(0.11_0.05_95)] text-[var(--cream)]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.95fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              SRI VENKETESWARA OIL MILL
            </p>
            <div className="space-y-3 text-sm leading-7 text-[var(--cream)]/90">
              <div>
                <p>FSSAI License Number: 12423008003379</p>
                <p>GSTIN: 33BHFPN6749G1Z5</p>
              </div>
              <div>
                <div className="font-semibold text-[var(--cream)]">Phone</div>
                <div className="space-y-1">
                  <a
                    href="tel:+919840256318"
                    className="block transition-colors hover:text-[var(--gold)]"
                  >
                    +91 98402 56318
                  </a>
                  <a
                    href="tel:+919384607213"
                    className="block transition-colors hover:text-[var(--gold)]"
                  >
                    +91 9384607213
                  </a>
                </div>
              </div>
              <div>
                <div className="font-semibold text-[var(--cream)]">Email</div>
                <a
                  href="mailto:shreedhana2005@gmail.com"
                  className="inline-block transition-colors hover:text-[var(--gold)] hover:underline"
                >
                  shreedhana2005@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Our Branches
            </p>
            <div className="space-y-6 text-sm leading-7 text-[var(--cream)]/90">
              <div className="space-y-1">
                <p className="font-semibold text-[var(--cream)]">
                  Old Pallavaram (Main Branch)
                </p>
                <p>
                  Zamin Pallavaram,
                  <br />
                  P.V. Vaithiyalingam Road,
                  <br />
                  Pallavaram, Chennai – 600043,
                  <br />
                  Tamil Nadu.
                </p>
                <p className="text-[var(--cream)]/75">Landmark: Next to ICICI Bank.</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-[var(--cream)]">
                  Zamin Pallavaram Branch
                </p>
                <p>
                  No. 80, Darga Road,
                  <br />
                  Zamin Pallavaram,
                  <br />
                  Chennai – 600043,
                  <br />
                  Tamil Nadu.
                </p>
                <p className="text-[var(--cream)]/75">Landmark: Opposite Gupta Bhavan.</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-[var(--cream)]">Madipakkam Branch</p>
                <p>
                  No. 78, Ponniamman Koil 1st Ram Nagar,
                  <br />
                  Puzhuthivakkam, Madipakkam,
                  <br />
                  Chennai – 600091,
                  <br />
                  Tamil Nadu.
                </p>
                <p className="text-[var(--cream)]/75">Landmark: Near Ponniamman Koil.</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--gold)]">
              Quick Links
            </p>
            <div className="flex flex-col gap-3 text-sm leading-7 text-[var(--cream)]/90">
              <Link to="/" className="transition-colors hover:text-[var(--gold)]">
                Home
              </Link>
              <Link to="/shop" className="transition-colors hover:text-[var(--gold)]">
                Shop
              </Link>
              <Link to="/heritage" className="transition-colors hover:text-[var(--gold)]">
                Heritage
              </Link>
              <a
                href="mailto:shreedhana2005@gmail.com"
                className="transition-colors hover:text-[var(--gold)]"
              >
                Contact Us
              </a>
              <a href="/privacy-policy" className="transition-colors hover:text-[var(--gold)]">
                Privacy Policy
              </a>
              <a href="/terms" className="transition-colors hover:text-[var(--gold)]">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] bg-[oklch(0.11_0.05_95/0.95)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-center text-xs tracking-[0.22em] text-[var(--cream)]/70 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} SRI VENKETESWARA OIL MILL. All Rights Reserved.</p>
          <p className="max-w-xl">
            Traditional Cold-Pressed Oils • Dry Fruits • Palm Products & Traditional Sweeteners
          </p>
        </div>
      </div>
    </footer>
  );
}
