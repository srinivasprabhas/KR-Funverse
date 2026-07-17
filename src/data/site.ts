/**
 * KR Funverse — single source of site content.
 * ---------------------------------------------------------------------------
 * VERIFIED facts (safe, researched): business name, tagline, the three
 * activities, area, phone, and Instagram.
 *
 * ⚠️  PLACEHOLDER blocks below (pricing, opening hours, stats, testimonials,
 *     any extra features) are NOT confirmed by the owner. Edit them here in
 *     ONE place before going live. They are written to look complete but must
 *     be replaced with real numbers.
 * ---------------------------------------------------------------------------
 */

export const site = {
  name: "KR Funverse",
  tagline: "Race. Play. Repeat.",
  intro:
    "Hyderabad's newest go-karting & fun arena in Ghatkesar — pin the throttle on the track, smash sixes in box cricket, and take on friends across a floor of indoor games.",

  // ---- VERIFIED contact ----
  contact: {
    phoneDisplay: "+91 78429 37383",
    phoneDigits: "917842937383", // for tel: and wa.me
    // PLACEHOLDER — no public email found; update with the real one.
    email: "hello@krfunverse.com",
    instagram: "https://www.instagram.com/krfunverse/",
    instagramHandle: "@krfunverse",
  },

  // ---- VERIFIED area (street-level venue address not public) ----
  location: {
    area: "Rampally, Yamnampet",
    city: "Ghatkesar, Hyderabad",
    state: "Telangana",
    pincode: "501301", // area-level pincode
    coords: { lat: 17.4570677, lng: 78.6575659 },
    mapEmbed:
      "https://maps.google.com/maps?q=17.4570677,78.6575659&z=15&output=embed",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=17.4570677,78.6575659",
    mapsUrl:
      "https://www.google.com/maps/place/KR+Funverse+%7C+Go+Karting/@17.4570677,78.6575659,15z",
  },

  // ---- PLACEHOLDER — confirm real opening hours with owner ----
  hours: [
    { days: "Monday – Thursday", time: "11:00 AM – 10:00 PM" },
    { days: "Friday – Sunday", time: "11:00 AM – 11:00 PM" },
  ],
} as const;

export type NavLink = { label: string; href: string };

/** Sections on the home page double as in-page anchors. */
export const navLinks: NavLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Arena", href: "/#attractions" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Visit", href: "/#visit" },
];

export type Attraction = {
  id: string;
  name: string;
  kicker: string;
  blurb: string;
  image: string;
  category: "Race" | "Play";
  features: string[]; // experience copy — intentionally non-specific
};

/** VERIFIED: these three activities come from the venue's own listing. */
export const attractions: Attraction[] = [
  {
    id: "go-karting",
    name: "Go-Karting",
    kicker: "Race",
    blurb:
      "Grip the wheel, drop the visor and chase the apex. Our karts turn first-timers into rivals and rivals into legends — lap after adrenaline-soaked lap.",
    image: "/images/attraction-karting.jpg",
    category: "Race",
    features: ["Adrenaline-packed laps", "First-timers & pros welcome", "Race your crew"],
  },
  {
    id: "box-cricket",
    name: "Box Cricket",
    kicker: "Play",
    blurb:
      "Fast-format, floodlit box cricket built for big hits and bigger bragging rights. Grab your gang and turn an evening into a tournament.",
    image: "/images/attraction-cricket.jpg",
    category: "Play",
    features: ["Team vs team", "Perfect for groups", "Book by the hour"],
  },
  {
    id: "indoor-games",
    name: "Indoor Games",
    kicker: "Play",
    blurb:
      "When you're between races, our indoor games floor keeps the fun rolling — friendly competition for every age, all under one roof.",
    image: "/images/attraction-games.jpg",
    category: "Play",
    features: ["Fun for all ages", "Great for parties", "Beat the heat indoors"],
  },
];

export type Stat = { value: number; suffix?: string; prefix?: string; label: string };

/** PLACEHOLDER — illustrative figures. Replace with the venue's real specs. */
export const stats: Stat[] = [
  { value: 60, suffix: "+", label: "km/h top speed" },
  { value: 3, label: "ways to play" },
  { value: 7, label: "days a week" },
  { value: 100, suffix: "%", label: "pure adrenaline" },
];

export type RateTier = {
  name: string;
  price: number; // ₹
  unit: string;
  note: string;
  features: string[];
  popular?: boolean;
};

/** PLACEHOLDER — sample rate card. Confirm real prices & packages with owner. */
export const rateCard: RateTier[] = [
  {
    name: "Rookie",
    price: 300,
    unit: "per person",
    note: "Single karting session",
    features: ["1 karting session", "Safety gear included", "Track briefing"],
  },
  {
    name: "Racer",
    price: 500,
    unit: "per person",
    note: "The crowd favourite",
    features: ["2 karting sessions", "Priority track slot", "Safety gear included", "Lap timing"],
    popular: true,
  },
  {
    name: "Squad",
    price: 1800,
    unit: "up to 5 people",
    note: "Bring the whole crew",
    features: ["Group karting", "Box cricket hour", "Indoor games access", "Best value for groups"],
  },
];

export type Safety = { title: string; desc: string; icon: string };

export const safety: Safety[] = [
  { title: "Certified Marshals", desc: "Trained staff track-side for every session.", icon: "ShieldCheck" },
  { title: "Full Safety Gear", desc: "Helmets and protective gear for every racer.", icon: "HardHat" },
  { title: "CCTV Monitored", desc: "The whole arena is under watchful eyes.", icon: "Cctv" },
  { title: "Age & Height Guided", desc: "Sessions matched to age and height for safe fun.", icon: "Ruler" },
];

export type EventCard = { title: string; desc: string; image: string; icon: string };

export const events: EventCard[] = [
  {
    title: "Birthday Parties",
    desc: "Give them a birthday they'll brag about — racing, cricket and games with the whole squad.",
    image: "/images/events.jpg",
    icon: "Cake",
  },
  {
    title: "Corporate Days",
    desc: "Team-building with a throttle. Grand-prix formats, leaderboards and pure competition.",
    image: "/images/gallery-3.jpg",
    icon: "Briefcase",
  },
  {
    title: "Group Bookings",
    desc: "College crews, friend groups and celebrations — book the arena and make it yours.",
    image: "/images/gallery-6.jpg",
    icon: "Users",
  },
];

/** Local gallery images (populated in /public/images). */
export const gallery: string[] = [
  "/images/gallery-1.jpg",
  "/images/gallery-2.jpg",
  "/images/gallery-3.jpg",
  "/images/gallery-4.jpg",
  "/images/gallery-5.jpg",
  "/images/gallery-6.jpg",
  "/images/gallery-7.jpg",
  "/images/gallery-8.jpg",
];

export type Testimonial = { name: string; role: string; quote: string; rating: number };

/**
 * PLACEHOLDER — illustrative reviews only (no real customer reviews were found).
 * Do NOT present these as genuine testimonials once real ones exist. Names are
 * generic first-name + city descriptors, not real customers.
 */
export const testimonials: Testimonial[] = [
  {
    name: "Aarav",
    role: "Karting first-timer",
    quote:
      "Went for one race, stayed for three. The karts are quick and the whole place has this proper race-day buzz.",
    rating: 5,
  },
  {
    name: "Sneha",
    role: "Birthday group",
    quote:
      "Booked it for my brother's birthday — karting, then box cricket. Easily the most fun we've had as a group.",
    rating: 5,
  },
  {
    name: "Rohit",
    role: "Weekend regular",
    quote:
      "Close to home, well organised, and the staff actually care about safety. My new weekend spot.",
    rating: 5,
  },
];
