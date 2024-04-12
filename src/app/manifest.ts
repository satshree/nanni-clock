import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nanny Clock",
    short_name: "Nanny Clock",
    description: "Clock in your nanny's work and generate invoices easily",
    start_url: ".",
    // author: "Satshree Shrestha",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#f2f2f2",
    background_color: "#ffffff",
    display: "standalone",
  };
}
