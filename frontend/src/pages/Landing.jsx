import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  QrCode,
  UtensilsCrossed,
  Radio,
  Palette,
} from "lucide-react";

const FEATURES = [
  {
    icon: QrCode,
    title: "A table, a scan, a menu",
    body: "Every table gets its own code. Customers scan, browse your branded menu, and order without waiting on staff.",
  },
  {
    icon: Radio,
    title: "Orders land live",
    body: "Tickets hit your queue the moment they're placed — no refreshing, no relayed orders, no guessing what's next.",
  },
  {
    icon: Palette,
    title: "Looks like your shop, not ours",
    body: "Pick a template, set your colors and logo, choose dine-in or counter-only. Live in minutes, not weeks.",
  },
];

function OrderTicket() {
  return (
    <div className="relative mx-auto w-full max-w-[300px] rotate-[-2deg] select-none">
      <div className="ticket-notch-top ticket-notch-bottom relative rounded-sm bg-card px-5 pt-7 pb-6 shadow-[0_18px_40px_-12px_hsl(var(--ink)/0.35)]">
        <div className="flex items-center justify-between text-xs font-mono-ticket text-muted-foreground">
          <span>NO. 0148</span>
          <span className="flex items-center gap-1 text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            LIVE
          </span>
        </div>
        <p className="mt-1 font-heading text-lg font-semibold">Table 04 · Dine-in</p>

        <div className="dashed-divider my-4" />

        <ul className="space-y-2 text-sm">
          <li className="flex justify-between">
            <span>2× Paneer Tikka Wrap</span>
            <span className="font-mono-ticket">₹398</span>
          </li>
          <li className="flex justify-between">
            <span>1× Cold Brew</span>
            <span className="font-mono-ticket">₹149</span>
          </li>
          <li className="flex justify-between">
            <span>1× Loaded Fries</span>
            <span className="font-mono-ticket">₹179</span>
          </li>
        </ul>

        <div className="dashed-divider my-4" />

        <div className="flex items-center justify-between">
          <span className="font-heading text-sm font-semibold uppercase tracking-wide">
            Total
          </span>
          <span className="font-mono-ticket text-lg font-semibold text-primary">
            ₹726
          </span>
        </div>
      </div>

      <div className="absolute -right-5 -top-5 flex h-16 w-16 rotate-12 items-center justify-center rounded-full border-2 border-accent/70 bg-background/80 text-[10px] font-heading font-semibold uppercase tracking-wide text-accent shadow-sm">
        Placed
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <span className="font-heading text-lg font-semibold">QROder</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-16 px-6 pb-24 pt-8 md:grid-cols-2 md:pt-16">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono-ticket text-xs uppercase tracking-wide text-muted-foreground">
            <QrCode className="h-3.5 w-3.5" /> No app to download
          </span>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.05] sm:text-5xl">
            Scan the table.
            <br />
            <span className="text-primary">Skip the wait.</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-muted-foreground">
            QROder turns any table or counter into a branded ordering point.
            Customers scan, order, and pay — your kitchen sees it the instant
            it's placed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button size="lg">
                Start free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Log in
              </Button>
            </Link>
          </div>

          <p className="mt-4 font-mono-ticket text-xs text-muted-foreground">
            No card required · Dine-in or counter-only
          </p>
        </div>

        <OrderTicket />
      </main>

      <section className="border-t border-border/70 bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="mt-3 font-heading text-base font-semibold">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8">
        <p className="font-mono-ticket text-xs text-muted-foreground">
          © {new Date().getFullYear()} QROder
        </p>
      </footer>
    </div>
  );
}