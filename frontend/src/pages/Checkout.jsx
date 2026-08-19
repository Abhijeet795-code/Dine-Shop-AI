import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, Loader2, ShoppingBag, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const { items, updateQty, removeItem, total } = useCart();
  const { shop } = useStore();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  // Temporary while Razorpay isn't wired up yet: null while loading, then
  // true/false from GET /payments/config. Defaults to "off" on error so
  // checkout still works if the config call fails for any reason.
  const [paymentEnabled, setPaymentEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/payments/config")
      .then((res) => {
        if (!cancelled) setPaymentEnabled(!!res.data?.paymentEnabled);
      })
      .catch(() => {
        if (!cancelled) setPaymentEnabled(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const taxRate = 0.05; // adjust as needed
  const tax = Math.round(total * taxRate);
  const grandTotal = total + tax;

  const handlePayment = async () => {
    if (!customerPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    setPlacing(true);
    try {
      // Step A: create a pending order on the backend (no login required)
      const orderRes = await api.post("/orders/guest", {
        shopId: shop.id,
        items: items.map((i) => ({ itemId: i.id, qty: i.qty, price: i.price })),
        customerName,
        customerPhone,
        totalAmount: grandTotal,
      });

      const order = orderRes.data;

      // Step B: create a Razorpay payment order (backend returns razorpayOrderId)
      const paymentRes = await api.post(`/payments/create`, {
        orderId: order.id,
        amount: grandTotal,
      });

      // Payment Off (temporary, until Razorpay is available): backend
      // returns mock=true and we skip the real payment widget entirely,
      // verifying directly so the order still goes through. Once
      // PAYMENT_PROVIDER=razorpay and real keys are set on the backend,
      // paymentRes.data.mock will be false and the real widget below runs.
      if (paymentRes.data.mock) {
        await api.post("/payments/verify", {
          orderId: order.id,
          razorpay_payment_id: paymentRes.data.razorpayOrderId,
          razorpay_order_id: paymentRes.data.razorpayOrderId,
          razorpay_signature: "mock",
        });
        toast.success("Order placed!");
        navigate(`/order/${order.id}`);
        return;
      }

      // Step C: open Razorpay checkout
      const options = {
        key: paymentRes.data.razorpayKeyId,
        amount: paymentRes.data.amount,
        currency: "INR",
        name: shop?.name || "QROder",
        description: `Order #${order.id}`,
        order_id: paymentRes.data.razorpayOrderId,
        handler: async (response) => {
          // Step D: verify payment on backend
          await api.post("/payments/verify", {
            orderId: order.id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success("Payment successful!");
          navigate(`/order/${order.id}`);
        },
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: shop?.theme?.primaryColor || "#FA4616" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex h-[60vh] flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground"
      >
        <ShoppingBag className="h-8 w-8 opacity-40" />
        Your cart is empty.
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="max-w-md mx-auto p-4 pb-32"
    >
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-lg font-bold mb-4"
      >
        Your Order
      </motion.h1>

      <div className="space-y-3 mb-6">
        <AnimatePresence initial={false}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24, height: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="border rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <Minus className="w-3 h-3" />
                </motion.button>
                <motion.span
                  key={item.qty}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm w-4 text-center"
                >
                  {item.qty}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="border rounded-full p-1 transition-colors hover:bg-muted"
                >
                  <Plus className="w-3 h-3" />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 ml-1"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bill summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border rounded-lg p-4 mb-6 space-y-1 text-sm shadow-sm"
      >
        <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Tax (5%)</span><span>₹{tax}</span></div>
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total</span>
          <motion.span key={grandTotal} initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 0.25 }}>
            ₹{grandTotal}
          </motion.span>
        </div>
      </motion.div>

      {!paymentEnabled && (
        <div className="bg-muted border rounded-lg p-3 mb-6 text-xs text-muted-foreground">
          Online payment is temporarily unavailable. Your order will be placed directly — pay the vendor at pickup/table.
        </div>
      )}

      {/* Customer details */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="space-y-3 mb-6"
      >
        <div>
          <Label>Your Name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="For order updates" required />
        </div>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure payment powered by Razorpay
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.2 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      >
        <Button onClick={handlePayment} disabled={placing} className="w-full transition-transform active:scale-[0.98]" size="lg">
          {placing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {placing
            ? "Processing..."
            : paymentEnabled
            ? `Pay ₹${grandTotal}`
            : `Place Order · ₹${grandTotal}`}
        </Button>
      </motion.div>
    </motion.div>
  );
}
