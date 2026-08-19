import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/context/StoreContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  QrCode,
  Palette,
  LogOut,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { shop, setShop } = useStore();

  useEffect(() => {
    if (!shop) {
      api
        .get("/shops/theme")
        .then((res) => setShop(res.data))
        .catch((err) => console.error("Failed to load your shop", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDineIn = shop?.serviceType === "DINE_IN";

  const links = [
    { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/queue", icon: ShoppingBag, label: "Live Queue" },
    { to: "/admin/menu", icon: Utensils, label: "Menu" },
    ...(isDineIn ? [{ to: "/admin/tables", icon: QrCode, label: "Tables" }] : []),
    { to: "/admin/customize", icon: Palette, label: "Customize" },
  ];

  const storeLink = shop && shop.slug ? "/store/" + shop.slug : null;

  const openStore = () => {
    if (storeLink) window.open(storeLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 border-r p-4 flex flex-col">
        <h2 className="font-heading font-bold mb-1">{shop?.name || "QROder"}</h2>

        {storeLink ? (
          <button
            type="button"
            onClick={openStore}
            className="mb-5 flex items-center gap-1 text-xs text-primary hover:underline"
          >
            View store <ExternalLink className="w-3 h-3" />
          </button>
        ) : null}

        <nav className="flex-1 space-y-1">
          {links.map(({ to, end, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                }`
              }
            >
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t pt-3">
          <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 bg-secondary/20">
        <Outlet />
      </main>
    </div>
  );
}