import { useEffect, useState } from "react";
import { toast } from "sonner";
import api, { apiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

const EMPTY = { name: "", description: "", price: "", category: "", active: true };

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
        toast.success("Item updated");
      } else {
        await api.post("/menu", form);
        toast.success("Item added");
      }
      setForm(EMPTY);
      setEditingId(null);
      fetchItems();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      toast.success("Item removed");
      fetchItems();
    } catch (err) {
      toast.error(apiError(err));
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-xl font-heading font-bold mb-4">Menu Management</h1>

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-4 mb-6 grid grid-cols-2 gap-3">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div>
          <Label>Category</Label>
          <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        </div>
        <div>
          <Label>Price (₹)</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        </div>
        <div>
          <Label>Description</Label>
          <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <Button type="submit" className="col-span-2">
          <Plus className="w-4 h-4 mr-2" /> {editingId ? "Update Item" : "Add Item"}
        </Button>
      </form>

      <div className="bg-card border rounded-lg divide-y">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-3">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.category} · ₹{item.price}</p>
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => handleEdit(item)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}