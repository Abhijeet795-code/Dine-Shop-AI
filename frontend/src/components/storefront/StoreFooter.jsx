import { Camera, Link2, MessageCircle } from "lucide-react";

export default function StoreFooter({ shop, theme }) {
  const accent = theme && theme.primaryColor ? theme.primaryColor : "#111827";

  return (
    <footer className="px-4 py-6 text-center border-t mt-8" style={{ fontFamily: theme && theme.font }}>
      {(theme && (theme.instagramUrl || theme.facebookUrl || theme.whatsapp)) ? (
        <div className="flex justify-center gap-4 mb-3">
          {theme.instagramUrl ? (
            <a href={theme.instagramUrl} target="_blank" rel="noreferrer">
              <Camera className="w-5 h-5" style={{ color: accent }} />
            </a>
          ) : null}
          {theme.facebookUrl ? (
            <a href={theme.facebookUrl} target="_blank" rel="noreferrer">
              <Link2 className="w-5 h-5" style={{ color: accent }} />
            </a>
          ) : null}
          {theme.whatsapp ? (
            <a href={"https://wa.me/" + theme.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle className="w-5 h-5" style={{ color: accent }} />
            </a>
          ) : null}
        </div>
      ) : null}
      {theme && theme.footerNote ? (
        <p className="text-xs text-muted-foreground mb-1">{theme.footerNote}</p>
      ) : null}
      <p className="text-[10px] text-muted-foreground">
        {shop && shop.name} · Powered by QROder
      </p>
    </footer>
  );
}