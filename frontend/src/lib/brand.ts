export const BRAND = {
  name: "Yango Wing Fleet",
  short: "YWF",
  tagline: "Pakistan's Premier Yango Rider Registration Partner",
  phones: ["0323-1213999", "0324-4110141"],
  whatsapp: "923231213999",
  email: "support@yangowingfleet.pk",
  address: "Yango Wing Fleet Office, Lahore, Pakistan",
  hours: "24/7 Driver Support",
};

export const WHATSAPP_URL = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
  "Assalam-o-Alaikum, I want to register as a Yango rider with Yango Wing Fleet."
)}`;

export const CITIES = [
  { slug: "lahore", name: "Lahore", blurb: "Yango's largest market in Punjab" },
  { slug: "karachi", name: "Karachi", blurb: "Pakistan's commercial capital" },
  { slug: "islamabad", name: "Islamabad", blurb: "The capital city" },
  { slug: "rawalpindi", name: "Rawalpindi", blurb: "Twin city hub" },
  { slug: "faisalabad", name: "Faisalabad", blurb: "Industrial heartland" },
  { slug: "multan", name: "Multan", blurb: "City of saints" },
] as const;

export const SERVICES = [
  {
    slug: "bike",
    title: "Bike Registration",
    icon: "bike",
    intro: "Earn on your motorcycle with quick Yango onboarding.",
    requirements: ["Valid CNIC", "Bike registration book", "Driving license", "Smartphone"],
    steps: ["Fill the form", "Document verification", "Account activation", "Start earning"],
    note: "Free registration • Same-day processing in most cases.",
  },
  {
    slug: "car",
    title: "Car Registration",
    icon: "car",
    intro: "Register your car as a Yango partner driver and maximize earnings.",
    requirements: ["Valid CNIC", "Car registration book", "Driving license", "Vehicle photos"],
    steps: ["Submit details", "Vehicle inspection", "Profile activation", "Accept rides"],
    note: "Free registration • Eligible for performance bonuses.",
  },
  {
    slug: "rickshaw",
    title: "Rickshaw Registration",
    icon: "truck",
    intro: "Onboard your rickshaw and serve riders across your city.",
    requirements: ["Valid CNIC", "Rickshaw registration", "Route license", "Smartphone"],
    steps: ["Apply online", "Verification call", "Driver training", "Go online"],
    note: "Free registration • Dedicated rickshaw driver support.",
  },
] as const;
