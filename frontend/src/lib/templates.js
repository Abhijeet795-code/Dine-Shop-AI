export const TEMPLATES = [
  {
    id: "night-market",
    name: "A — Night Market",
    description: "Dark, bold, street-food energy with a photo collage feel",
    preview: { bg: "#141319", accent: "#D85A30" },
    font: "Space Grotesk",
  },
  {
    id: "electric-pop",
    name: "B — Electric Pop",
    description: "Cream background, hard shadows, playful bold type",
    preview: { bg: "#FBF8F0", accent: "#E0562B" },
    font: "Poppins",
  },
  {
    id: "classic",
    name: "C — Classic",
    description: "Traditional menu list, clean and simple",
    preview: { bg: "#FFF8F0", accent: "#B45309" },
    font: "Playfair Display",
  },
  {
    id: "grid",
    name: "D — Modern Grid",
    description: "Image-forward cards, great for photo-heavy menus",
    preview: { bg: "#F8FAFC", accent: "#2563EB" },
    font: "Plus Jakarta Sans",
  },
  {
    id: "minimal",
    name: "E — Minimal",
    description: "Compact text-first list — fastest to scan and order",
    preview: { bg: "#FFFFFF", accent: "#111827" },
    font: "Outfit",
  },
  {
    id: "vibrant",
    name: "F — Vibrant",
    description: "Warm dark theme with bold accent pops — great for late-night spots",
    preview: { bg: "#1C1917", accent: "#FA4616" },
    font: "Outfit",
  },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];