/** Site-wide media. Replace files in /public/images to change them. */
export const HERO_IMAGE = {
  src: "/images/hero-perfusionists.webp",
  width: 960,
  height: 1280,
  alt: "Two perfusionists in green scrubs operating a heart-lung machine in a cardiac operating theatre",
  caption: "Perfusionists at the heart-lung machine",
};

/**
 * Cinematic films cut from TaCPA members' own theatre footage and photographs
 * (everyone shown has consented). Files live in /public/videos.
 */
export const HERO_VIDEO = {
  mp4: "/videos/hero-loop.mp4",
  poster: "/videos/hero-loop-poster.jpg",
  caption: "Inside the cardiac theatre",
  alt: "A short silent film loop: perfusionists at the heart-lung machine, blood flowing through the bypass circuit, pump heads and reservoirs",
};

export const PROMO_FILM = {
  title: "Tanzania Perfusionists: the film",
  src: "/videos/tanzania-perfusionists-film-720p.mp4",
  poster: "/videos/tanzania-perfusionists-film-poster.jpg",
  credit: "Footage and photos: TaCPA members",
};

/** Photographs from TaCPA members. Publish only with consent from everyone shown. */
export const THEATRE_PHOTOS = [
  { src: "/images/gallery/priming-circuit.webp", width: 1050, height: 1080, caption: "Priming the CPB circuit", alt: "A perfusionist in maroon scrubs and a teal cap priming the tubing of a cardiopulmonary bypass circuit" },
  { src: "/images/gallery/cardiac-surgery.webp", width: 710, height: 559, caption: "Cardiac surgery in progress", alt: "Surgeons in caps, masks and loupes operating during open-heart surgery" },
  { src: "/images/gallery/primed-cpb-circuit.webp", width: 896, height: 1119, caption: "A primed CPB circuit", alt: "Close-up of a heart-lung machine with blood-filled red tubing, pump heads and oxygenator" },
  { src: "/images/gallery/hlm-console.webp", width: 563, height: 553, caption: "At the heart-lung machine", alt: "A perfusionist in green scrubs working behind the reservoir and tubing of a heart-lung machine" },
  { src: "/images/gallery/perfusion-record.webp", width: 960, height: 1280, caption: "Recording the perfusion chart", alt: "A perfusionist writing the perfusion record while colleagues in scrubs look on" },
] as const;

/** "Perfusionists" in Kiswahili: literally, specialists who stop and restart the heart. */
export const SWAHILI_NAME = "Wataalamu wa Kusimamisha na Kuamsha Moyo";

/**
 * Public address of the site, used for the sitemap, robots.txt, canonical links and
 * social previews. Set NEXT_PUBLIC_SITE_URL when you add a custom domain; otherwise
 * Vercel's production domain is used, falling back to the current live address.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  "https://tanzania-perfusionist.vercel.app"
).replace(/\/$/, "");

/** Public contact email shown in the footer and on the Contact page. */
export const CONTACT_EMAIL = "alfredluvakule@gmail.com";
