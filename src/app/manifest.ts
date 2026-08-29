import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "U-Pioneers | مسرعة الأعمال الرقمية",
    short_name: "U-Pioneers",
    description:
      "مسرعة أعمال رقمية لمرافقة مشاريع التخرج الابتكارية لطلبة الجامعات الجزائرية وفق القرار الوزاري 1275.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f0",
    theme_color: "#1f7a4d",
    orientation: "any",
    icons: [
      {
        src: "/icons/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
