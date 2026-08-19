import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/context/StoreContext";
import { useCart } from "@/context/CartContext";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag } from "lucide-react";

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

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm text-muted-foreground"
        >
          Loading menu...
        </motion.div>
      </div>
    );
  }

  const Template = TEMPLATE_COMPONENTS[shop?.templateId] || TEMPLATE_COMPONENTS.classic;

  return (
    <div className="pb-24">
      <StoreHeader shop={shop} theme={shop?.theme} />

      {/* Search + category filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="p-4 sticky top-0 bg-background/90 backdrop-blur-md z-10 border-b"
      >
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search for items..."
            className="pl-9 transition-shadow focus-visible:shadow-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {categories.map((c, i) => (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary hover:opacity-80"
              }`}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Template-specific rendering — fades in regardless of which template is active */}
      <AnimatePresence mode="wait">
        <motion.div
          key={shop?.templateId || "classic"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Template shop={shop} items={filtered} onAdd={handleAdd} theme={shop?.theme} />
        </motion.div>
      </AnimatePresence>

      <StoreFooter shop={shop} theme={shop?.theme} />

      <AnimatePresence>
        {count > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/store/${slug}/checkout`)}
            className="fixed bottom-0 left-0 right-0 p-4 bg-primary text-primary-foreground flex justify-between items-center shadow-[0_-4px_16px_rgba(0,0,0,0.12)]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              View Cart · {count} items
            </span>
            <span className="font-bold">₹{total}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
