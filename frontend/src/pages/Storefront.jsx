import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import StoreHeader from "@/components/storefront/StoreHeader";
import StoreFooter from "@/components/storefront/StoreFooter";
import { TEMPLATE_COMPONENTS } from "@/lib/templateComponents";

export default function Storefront() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { shop, menu, loading, loadShop } = useStore();
  const { addItem, count, total } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (slug) loadShop(slug);
  }, [slug]);

  const categories = ["All", ...new Set(menu.map((m) => m.category))];
  const filtered = menu.filter(
    (m) =>
      (category === "All" || m.category === category) &&
      m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (item) => {
    addItem(item);
    toast.success(`${item.name} added to cart`);
  };

  if (loading) return <div className="p-8 text-center">Loading menu...</div>;

  const Template = TEMPLATE_COMPONENTS[shop?.templateId] || TEMPLATE_COMPONENTS.classic;

  return (
    <div className="pb-24">
      <StoreHeader shop={shop} theme={shop?.theme} />

      {/* Search + category filter bar */}
      <div className="p-4 sticky top-0 bg-background z-10 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for items..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                category === c ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Template-specific rendering */}
      <Template shop={shop} items={filtered} onAdd={handleAdd} theme={shop?.theme} />

      <StoreFooter shop={shop} theme={shop?.theme} />

      {count > 0 && (
        <button
          onClick={() => navigate(`/store/${slug}/checkout`)}
          className="fixed bottom-0 left-0 right-0 p-4 bg-primary text-primary-foreground flex justify-between items-center"
        >
          <span>View Cart · {count} items</span>
          <span className="font-bold">₹{total}</span>
        </button>
      )}
    </div>
  );
}