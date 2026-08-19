import { motion } from "framer-motion";
import { Camera, Link2, MessageCircle } from "lucide-react";

export default function StoreFooter({ shop, theme }) {
  const accent = theme && theme.primaryColor ? theme.primaryColor : "#111827";

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="px-4 py-8 text-center border-t mt-8 bg-gradient-to-b from-transparent to-muted/40"
      style={{ fontFamily: theme && theme.font }}
    >
      {(theme && (theme.instagramUrl || theme.facebookUrl || theme.whatsapp)) ? (
        <div className="flex justify-center gap-4 mb-3">
          {theme.instagramUrl ? (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href={theme.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border p-2"
              style={{ borderColor: accent }}
            >
              <Camera className="w-4 h-4" style={{ color: accent }} />
            </motion.a>
          ) : null}
          {theme.facebookUrl ? (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href={theme.facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border p-2"
              style={{ borderColor: accent }}
            >
              <Link2 className="w-4 h-4" style={{ color: accent }} />
            </motion.a>
          ) : null}
          {theme.whatsapp ? (
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
              href={"https://wa.me/" + theme.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border p-2"
              style={{ borderColor: accent }}
            >
              <MessageCircle className="w-4 h-4" style={{ color: accent }} />
            </motion.a>
          ) : null}
        </div>
      ) : null}
      {theme && theme.footerNote ? (
        <p className="text-xs text-muted-foreground mb-1">{theme.footerNote}</p>
      ) : null}
      <p className="text-[10px] text-muted-foreground tracking-wide">
        {shop && shop.name} · Powered by QROder
      </p>
    </motion.footer>
  );
}
