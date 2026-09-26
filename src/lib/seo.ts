import type { Metadata } from "next";

const socialImage =
  "https://res.cloudinary.com/dtgvkkgbk/image/upload/c_limit,w_1200,q_auto,f_jpg/v1790323217/ezgif-frame-237_g9we74.png";

export function openGraphForPage(
  url: string,
  title: string,
  description: string,
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: "en_US",
    url,
    siteName: "Vyara Amoghya Technologies",
    title,
    description,
    images: [
      {
        url: socialImage,
        width: 1200,
        height: 675,
        alt: "AMO at the Amoghya Technologies studio",
      },
    ],
  };
}
