import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ImageOff, ShoppingCart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useShop } from "@/lib/store";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Sri Venkateshwara Oil Mill" },
      { name: "description", content: "Save products to your wishlist for later." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart, isWishlisted } = useShop();

  const items = wishlist
    .map((item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      if (!product) return null;
      const variant = product.variants.find((v) => v.size === item.size) ?? product.variants[0];
      return { product, variant, size: item.size };
    })
    .filter(Boolean) as {
      product: typeof PRODUCTS[number];
      variant: { size: string; price: number };
      size: string;
    }[];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Your Wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Save favorite products and return to them later.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/shop">Continue shopping</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/checkout">View cart</Link>
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Heart className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-xl text-foreground">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products from the shop and they will appear here.
            </p>
            <Button asChild className="mt-6">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {items.map(({ product, variant, size }) => (
              <article key={`${product.id}-${size}`} className="overflow-hidden rounded-3xl border border-border bg-card p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-[var(--cream)]">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="h-full w-full object-contain p-3" />
                    ) : (
                      <ImageOff className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {product.tags?.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <h2 className="mt-2 font-serif text-xl text-foreground">{product.name}</h2>
                      <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Size</div>
                        <div className="font-medium text-foreground">{size}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Price</div>
                        <div className="font-medium text-foreground">₹{variant.price}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          size,
                          price: variant.price,
                          qty: 1,
                          image: product.image,
                        })}
                        className="min-w-[160px]"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => removeFromWishlist(product.id, size)}
                        className="min-w-[160px]"
                      >
                        Remove from wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
