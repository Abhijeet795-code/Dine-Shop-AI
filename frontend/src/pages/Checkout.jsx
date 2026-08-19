import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";

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
    return <div className="p-8 text-center text-muted-foreground">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      <h1 className="text-lg font-bold mb-4">Your Order</h1>

      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-3">
            <div>
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-muted-foreground">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.id, item.qty - 1)} className="border rounded-full p-1">
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm w-4 text-center">{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)} className="border rounded-full p-1">
                <Plus className="w-3 h-3" />
              </button>
              <button onClick={() => removeItem(item.id)} className="text-red-500 ml-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bill summary */}
      <div className="bg-card border rounded-lg p-4 mb-6 space-y-1 text-sm">
        <div className="flex justify-between"><span>Subtotal</span><span>₹{total}</span></div>
        <div className="flex justify-between text-muted-foreground"><span>Tax (5%)</span><span>₹{tax}</span></div>
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total</span><span>₹{grandTotal}</span>
        </div>
      </div>

      {!paymentEnabled && (
        <div className="bg-muted border rounded-lg p-3 mb-6 text-xs text-muted-foreground">
          Online payment is temporarily unavailable. Your order will be placed directly — pay the vendor at pickup/table.
        </div>
      )}

      {/* Customer details */}
      <div className="space-y-3 mb-6">
        <div>
          <Label>Your Name</Label>
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="For order updates" required />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button onClick={handlePayment} disabled={placing} className="w-full" size="lg">
          {placing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {placing
            ? "Processing..."
            : paymentEnabled
            ? `Pay ₹${grandTotal}`
            : `Place Order · ₹${grandTotal}`}
        </Button>
      </div>
    </div>
  );
}