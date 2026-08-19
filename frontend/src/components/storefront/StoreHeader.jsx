import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

export default function StoreHeader({ shop, theme }) {
  const accent = theme && theme.primaryColor ? theme.primaryColor : "#111827";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 bg-background shadow-sm"
    >
      {theme && theme.bannerUrl ? (
        <motion.div
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative h-32 w-full overflow-hidden"
        >
          <img src={theme.bannerUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
        </motion.div>
      ) : null}

      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: accent }}
      >
        {theme && theme.logoUrl ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            src={theme.logoUrl}
            alt=""
            className="w-11 h-11 rounded-full object-cover border-2 shadow-sm"
            style={{ borderColor: accent }}
          />
        ) : null}

        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          <h1 className="font-bold text-base truncate">{shop && shop.name ? shop.name : "Your Shop"}</h1>
          {theme && theme.tagline ? (
            <p className="text-xs text-muted-foreground truncate">{theme.tagline}</p>
          ) : null}
        </motion.div>

        {theme && theme.contactPhone ? (
          <motion.a
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            whileTap={{ scale: 0.93 }}
            href={"tel:" + theme.contactPhone}
            className="flex items-center gap-1 text-xs rounded-full px-2.5 py-1.5 transition-colors hover:bg-black/5"
            style={{ color: accent, borderColor: accent, border: "1px solid" }}
          >
            <Phone className="w-3 h-3" />
            Call
          </motion.a>
        ) : null}
      </div>

      {theme && theme.contactAddress ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-1 px-4 py-1 text-xs text-muted-foreground"
        >
          <MapPin className="w-3 h-3" />
          {theme.contactAddress}
        </motion.div>
      ) : null}
    </motion.header>
  );
}
