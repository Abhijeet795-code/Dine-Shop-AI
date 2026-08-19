import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { IndianRupee, ShoppingCart, Users, QrCode, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { useStore } from "@/context/StoreContext";

const PIE_COLORS = ["#FA4616", "#FACC15", "#22C55E", "#3B82F6", "#A855F7"];

export default function Dashboard() {
  const { shop } = useStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const isDineIn = shop?.serviceType === "DINE_IN";

  useEffect(() => {
    api.get("/analytics/overview")
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const kpis = [
    { label: "Total Orders", value: stats?.totalOrders ?? "-", icon: ShoppingCart },
    { label: "Total Sales", value: `₹${stats?.totalSales ?? "-"}`, icon: IndianRupee },
    { label: "Avg Order Value", value: `₹${stats?.avgOrderValue ?? "-"}`, icon: TrendingUp },
    { label: "New Customers", value: stats?.newCustomers ?? "-", icon: Users },
  ];

  return (
    <div>
      <h1 className="text-xl font-heading font-bold mb-4">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border rounded-lg p-4">
            <Icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Counter-only QR block — only shown when shop has no dine-in tables */}
      {!isDineIn && (
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            <QrCode className="w-4 h-4" /> Your Order QR Code
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Since you're counter/takeaway only, customers scan this single QR to order — no table needed.
          </p>
          <div className="flex justify-center bg-white rounded-md p-4 w-fit mx-auto">
            <QrCode className="w-32 h-32" />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Links to: /store/{shop?.slug}
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-2">Order Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats?.orderTrend ?? []}>
              <XAxis dataKey="date" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#FA4616" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-2">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats?.statusBreakdown ?? []}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
              >
                {(stats?.statusBreakdown ?? []).map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders + top items */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Recent Orders</h3>
          <div className="space-y-2">
            {(stats?.recentOrders ?? []).map((order) => (
              <div key={order.id} className="flex justify-between text-sm border-b pb-2">
                <span>#ORD-{order.id}</span>
                <span className="text-muted-foreground">{order.itemCount} items</span>
                <span className="font-medium">₹{order.total}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-medium mb-3">Top Items</h3>
          <div className="space-y-2">
            {(stats?.topItems ?? []).map((item) => (
              <div key={item.name} className="flex justify-between text-sm border-b pb-2">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.orderCount} sold</span>
              </div>
            ))}
            {(!stats?.topItems || stats.topItems.length === 0) && (
              <p className="text-sm text-muted-foreground">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}