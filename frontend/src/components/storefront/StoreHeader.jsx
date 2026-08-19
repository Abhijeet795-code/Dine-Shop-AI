import { Phone, MapPin } from "lucide-react";

export default function StoreHeader({ shop, theme }) {
  const accent = theme && theme.primaryColor ? theme.primaryColor : "#111827";

  return (
    <header>
      {theme && theme.bannerUrl ? (
        <div className="w-full h-32 overflow-hidden">
          <img src={theme.bannerUrl} alt="" className="w-full h-full object-cover" />
        </div>
      ) : null}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: accent }}>
        {theme && theme.logoUrl ? (
          <img src={theme.logoUrl} alt="" className="w-11 h-11 rounded-full object-cover border" style={{ borderColor: accent }} />
        ) : null}
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-base truncate">{shop && shop.name ? shop.name : "Your Shop"}</h1>
          {theme && theme.tagline ? (
            <p className="text-xs text-muted-foreground truncate">{theme.tagline}</p>
          ) : null}
        </div>
        {theme && theme.contactPhone ? (
          <a href={"tel:" + theme.contactPhone} className="flex items-center gap-1 text-xs rounded-full px-2 py-1" style={{ color: accent, borderColor: accent, border: "1px solid" }}>
            <Phone className="w-3 h-3" />
            Call
          </a>
        ) : null}
      </div>
      {theme && theme.contactAddress ? (
        <div className="flex items-center gap-1 px-4 py-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {theme.contactAddress}
        </div>
      ) : null}
    </header>
  );
}
