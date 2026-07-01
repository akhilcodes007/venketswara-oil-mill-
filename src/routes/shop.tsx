import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart, ImageOff } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCTS, type Product } from "@/lib/products";
import { useShop } from "@/lib/store";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { SEO } from "@/components/SEO";
import { Breadcrumbs, generateBreadcrumbJsonLd } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/shop")({
  component: Shop,
});

type Cat = "all" | "oils" | "dryfruits" | "palm-products" | "honey" | "millets";
type Sort = "featured" | "price-asc" | "price-desc" | "name";

function Shop() {
  const navigate = useNavigate();
  const [cat, setCat] = useState<Cat>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("featured");

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s));
    }
    if (sort === "price-asc")
      list = [...list].sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sort === "price-desc")
      list = [...list].sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [cat, search, sort]);

  const breadcrumbs = [
    { label: "Shop", href: "/shop" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Shop — SRI VENKETESWARA OIL MILL"
        description="Shop traditional cold-pressed oils, premium dry fruits, natural honey, and millets from SRI VENKETESWARA OIL MILL."
        jsonLd={generateBreadcrumbJsonLd(breadcrumbs)}
      />
      <SiteHeader />

      <section
        className="border-b border-border"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-4 pt-6 md:px-8">
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
          <p className="text-xs tracking-[0.3em] text-[var(--gold-deep)]">
            FROM OUR MILL TO YOUR TABLE
          </p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl text-foreground">
            Cold-pressed oils, premium dry fruits, pure natural honey & millets
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Traditionally wood-pressed, naturally filtered, lovingly bottled. Choose
            your size and add to cart.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {(["all", "oils", "dryfruits", "palm-products", "honey", "millets"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  cat === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {c === "all"
                  ? "All Products"
                  : c === "oils"
                  ? "Cold Pressed Oils"
                  : c === "dryfruits"
                  ? "Dry Fruits & Nuts"
                  : c === "palm-products"
                  ? "Palm Products"
                  : c === "honey"
                  ? "Natural Honey"
                  : "Millets & Traditional Grains"}
              </button>
            ))}
          </div>
          <div className="ml-auto flex flex-1 gap-3 md:flex-none">
            <Input
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:w-64"
            />
            <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name">Name (A–Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No products match your search.
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [variantIdx, setVariantIdx] = useState(0);
  const [qty, setQty] = useState(0);
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const variant = product.variants[variantIdx];
  const wishlisted = isWishlisted(product.id, variant.size);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-[var(--shadow-elegant)]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--cream)]">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt ?? product.name}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageOff className="h-10 w-10 opacity-40" />
            <span className="text-xs tracking-wide">Image coming soon</span>
          </div>
        )}
        {product.tags?.map((t) => (
          <Badge
            key={t}
            className="absolute left-3 top-3 border-0 bg-[var(--gold)] text-[oklch(0.22_0.04_50)]"
          >
            {t}
          </Badge>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-foreground">{product.name}</h3>
              {product.tamilName ? (
                <p className="text-sm text-muted-foreground">{product.tamilName}</p>
              ) : null}
            </div>
            {product.rating ? (
              <div className="flex items-center gap-1 text-[0.75rem] text-[var(--gold)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating || 0) ? "★" : "☆"}</span>
                ))}
              </div>
            ) : null}
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v, i) => (
              <button
                key={v.size}
                onClick={() => setVariantIdx(i)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  i === variantIdx
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                {v.size}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-serif text-2xl font-semibold text-foreground">
                ₹{variant.price}
              </div>
              <div className="text-xs text-muted-foreground">per {variant.size}</div>
            </div>
            <div className="flex items-center rounded-full border border-border">
              <button
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                disabled={qty === 0}
                className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {typeof product.stock === "number" ? (
                <span className="rounded-full bg-muted px-2 py-1">{product.stock} left</span>
              ) : null}
              {product.category === "honey" ? (
                <Badge className="rounded-full bg-[var(--peach)] text-[var(--brown)]">Premium</Badge>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Button
                onClick={() => {
                  if (qty === 0) {
                    toast.error("Please increase the quantity before adding to cart.");
                    return;
                  }
                  addToCart({
                    id: product.id,
                    name: product.name,
                    size: variant.size,
                    price: variant.price,
                    qty,
                    image: product.image,
                  });
                  toast.success(`${product.name} (${variant.size}) added to cart`);
                }}
                className="w-full"
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  if (qty === 0) {
                    toast.error("Please increase the quantity before buying.");
                    return;
                  }
                  addToCart({
                    id: product.id,
                    name: product.name,
                    size: variant.size,
                    price: variant.price,
                    qty,
                    image: product.image,
                  });
                  toast.success(`${product.name} (${variant.size}) added to cart`);
                  navigate({ to: "/checkout" });
                }}
                className="w-full"
              >
                Buy Now
              </Button>
            </div>
            <Button
              variant={wishlisted ? "secondary" : "outline"}
              onClick={() => {
                toggleWishlist({ id: product.id, size: variant.size });
                toast.success(
                  wishlisted
                    ? `${product.name} (${variant.size}) removed from wishlist`
                    : `${product.name} (${variant.size}) added to wishlist`,
                );
              }}
              className="w-full"
            >
              <Heart className="mr-2 h-4 w-4" />
              {wishlisted ? "Remove from wishlist" : "Save for later"}
            </Button>
          </div>
          
          <div className="pt-2">
            <CollapsibleReviewsWrapper productId={product.id} initialRating={product.rating} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CollapsibleReviewsWrapper({ productId, initialRating }: { productId: string, initialRating?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState<{ averageRating: number, totalReviews: number } | null>(null);

  useEffect(() => {
    supabase.rpc("get_product_reviews_summary", { p_product_id: productId }).then(({ data, error }) => {
      if (!error && data) {
        setSummary(data as any);
      }
    });
  }, [productId]);

  const rating = summary?.averageRating || initialRating || 0;
  const count = summary?.totalReviews || 0;

  return (
    <div className="w-full">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-[var(--cream)] py-3 text-sm font-semibold text-foreground hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-300 shadow-sm"
      >
        {isExpanded ? (
          "▲ Hide Customer Reviews"
        ) : count > 0 ? (
          `⭐ Customer Reviews (${rating.toFixed(1)} • ${count} Review${count !== 1 ? "s" : ""}) ▼`
        ) : (
          "⭐ Customer Reviews (No Reviews Yet) ▼"
        )}
      </button>

      <div 
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <ProductReviews productId={productId} />
        </div>
      </div>
    </div>
  );
}
