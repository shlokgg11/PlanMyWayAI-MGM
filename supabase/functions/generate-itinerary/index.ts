import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Activity {
  time: string;
  activity: string;
  location: string;
  cost: string;
}

interface Day {
  day: number;
  title: string;
  activities: Activity[];
}

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface Itinerary {
  title: string;
  destination: string;
  duration: string;
  budget: string;
  summary: string;
  locations: Location[];
  days: Day[];
  tips: string[];
  totalEstimatedCost: string;
}

type DestinationInfo = {
  coords: [number, number];
  summary: string;
  minimumRecommendedDailyBudget: number;
  locations: { name: string; lat: number; lng: number; description: string }[];
  activities: string[][];
  tips: string[];
};

const DESTINATION_DATA: Record<string, DestinationInfo> = {
  kerala: {
    coords: [10.8505, 76.2711],
    summary:
      "Kerala, God's Own Country, enchants visitors with serene backwaters, lush hill stations, pristine beaches, and rich cultural heritage. This tropical paradise offers a perfect blend of nature, wellness, and history.",
    minimumRecommendedDailyBudget: 2500,
    locations: [
      { name: "Alleppey Backwaters", lat: 9.4981, lng: 76.3388, description: "Famous houseboat cruise destination" },
      { name: "Munnar", lat: 10.0889, lng: 77.0595, description: "Scenic hill station with tea gardens" },
      { name: "Fort Kochi", lat: 9.9639, lng: 76.2429, description: "Historic waterfront with Chinese fishing nets" },
      { name: "Periyar Wildlife Sanctuary", lat: 9.4641, lng: 77.1723, description: "Tiger reserve and elephant sightings" },
    ],
    activities: [
      ["Arrive and check into budget stay", "Alleppey backwaters cruise (shared)", "Sunset on the backwaters", "Simple local dinner"],
      ["Munnar tea plantation tour", "Eravikulam National Park", "Tea museum visit", "Sunset viewpoint"],
      ["Fort Kochi heritage walk", "Chinese fishing nets viewing", "St. Francis Church", "Mattancherry Palace"],
      ["Ayurvedic wellness session", "Periyar lake boat safari", "Spice plantation visit"],
      ["Local market shopping", "Kathakali dance performance", "Farewell dinner"],
    ],
    tips: [
      "Book stays in advance during peak season (Oct–Feb).",
      "Carry mosquito repellent for backwater areas.",
      "Try a traditional Kerala Sadhya meal.",
      "Best time to visit: October to March.",
      "Carry light cotton clothes for most of the year.",
    ],
  },
  goa: {
    coords: [15.2993, 74.124],
    summary:
      "Goa is India's premier beach destination, offering golden sands, azure waters, vibrant nightlife, Portuguese colonial architecture, and fresh seafood. A perfect mix of relaxation and adventure.",
    minimumRecommendedDailyBudget: 3000,
    locations: [
      { name: "Baga Beach", lat: 15.5523, lng: 73.7518, description: "Popular beach with water sports and nightlife" },
      { name: "Old Goa", lat: 15.5007, lng: 73.9175, description: "UNESCO heritage Portuguese churches" },
      { name: "Dudhsagar Falls", lat: 15.3144, lng: 74.3151, description: "Spectacular four-tiered waterfall" },
      { name: "Palolem Beach", lat: 15.01, lng: 74.0237, description: "Serene crescent-shaped beach in South Goa" },
    ],
    activities: [
      ["Arrive and check into budget stay", "Beach walk", "Beach shack dinner", "Relaxed evening"],
      ["Old Goa churches tour", "Basilica of Bom Jesus", "Se Cathedral", "Fontainhas walk"],
      ["Dudhsagar shared trip", "Spice plantation lunch", "Evening local market"],
      ["Water sports (budget choice)", "Dolphin spotting cruise", "Sunset at the beach"],
    ],
    tips: [
      "November to February is peak season.",
      "A scooter is useful for moving around cheaply.",
      "Try fish curry rice and bebinca.",
      "Keep valuables safe at crowded beaches.",
    ],
  },
  amritsar: {
    coords: [31.634, 74.8723],
    summary:
      "Amritsar is the spiritual heart of Sikhism and one of India's most iconic cities. The Golden Temple, Wagah Border ceremony, and legendary street food make it unforgettable.",
    minimumRecommendedDailyBudget: 1800,
    locations: [
      { name: "Golden Temple", lat: 31.62, lng: 74.8765, description: "Holiest Sikh shrine" },
      { name: "Wagah Border", lat: 31.6046, lng: 74.5768, description: "Flag-lowering ceremony" },
      { name: "Jallianwala Bagh", lat: 31.6218, lng: 74.88, description: "Historic memorial garden" },
      { name: "Durgiana Temple", lat: 31.6264, lng: 74.8737, description: "Temple complex on a lake" },
    ],
    activities: [
      ["Arrive in Amritsar", "Golden Temple visit", "Langar meal", "Street food walk"],
      ["Sunrise temple visit", "Jallianwala Bagh", "Partition Museum", "Wagah Border ceremony"],
      ["Local market shopping", "Durgiana Temple", "Kulcha breakfast", "Departure"],
    ],
    tips: [
      "Cover your head at the Golden Temple.",
      "Reach Wagah early for good seats.",
      "Try Amritsari kulcha and lassi.",
      "The Golden Temple is especially beautiful at night.",
    ],
  },
  manali: {
    coords: [32.2396, 77.1887],
    summary:
      "Manali is a Himalayan getaway known for mountain views, temples, adventure sports, and cozy cafés. Great for both nature lovers and thrill-seekers.",
    minimumRecommendedDailyBudget: 2800,
    locations: [
      { name: "Rohtang Pass", lat: 32.3696, lng: 77.2403, description: "High altitude pass with snow" },
      { name: "Solang Valley", lat: 32.3195, lng: 77.1542, description: "Adventure sports destination" },
      { name: "Hadimba Temple", lat: 32.238, lng: 77.1771, description: "Historic temple in cedar forest" },
      { name: "Old Manali", lat: 32.26, lng: 77.1723, description: "Village area with cafés" },
    ],
    activities: [
      ["Arrive in Manali", "Mall Road stroll", "Hadimba Temple", "Old Manali cafés"],
      ["Rohtang Pass day trip", "Snow photography", "Beas River views", "Local market"],
      ["Solang Valley activities", "Paragliding or short adventure", "Vashisht hot springs", "Sunset views"],
      ["Naggar Castle", "Jana Falls", "Shopping"],
      ["Monastery visit", "Departure preparation"],
    ],
    tips: [
      "Carry warm clothes even in summer.",
      "Book permits in advance for certain routes.",
      "Best snow season: December to February.",
      "Try local Himachali food and trout.",
    ],
  },
};

function getDestinationKey(dest: string): string | null {
  const lower = dest.toLowerCase();
  for (const key of Object.keys(DESTINATION_DATA)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

function parseBudget(budget: string): number {
  const num = Number(String(budget).replace(/[^0-9.]/g, ""));
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount));
  return `₹${safeAmount.toLocaleString("en-IN")}`;
}

function getInterestList(interests: string): string[] {
  const list = interests
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return list.length > 0 ? list : ["sightseeing", "food", "culture"];
}

function getFeasibilityNote(
  destination: string,
  days: number,
  budget: number,
  minDailyBudget: number
): string | null {
  const recommended = days * minDailyBudget;
  if (budget >= recommended) return null;

  return `This budget is quite low for a ${days}-day trip to ${destination}. So this itinerary focuses on low-cost activities, shared transport, simple meals, and budget stays. A more comfortable recommended budget would be around ${formatCurrency(
    recommended
  )}.`;
}

function generateLowBudgetActivities(
  destination: string,
  day: number,
  perDayBudget: number,
  interests: string[]
): Activity[] {
  const templates = [
    {
      time: "8:00 AM",
      activity: `Budget breakfast and local area walk`,
      location: `${destination} local neighborhood`,
    },
    {
      time: "10:30 AM",
      activity: `Visit a free or low-cost ${interests[day % interests.length]} spot`,
      location: `${destination} city attraction`,
    },
    {
      time: "1:30 PM",
      activity: `Affordable local lunch`,
      location: `${destination} budget eatery`,
    },
    {
      time: "4:00 PM",
      activity: `Explore local market / public viewpoint / walking trail`,
      location: `${destination}`,
    },
    {
      time: "7:30 PM",
      activity: `Simple dinner and rest`,
      location: `${destination}`,
    },
  ];

  const activityCount = templates.length;
  const perActivityBudget = perDayBudget / activityCount;

  return templates.map((item) => ({
    ...item,
    cost: formatCurrency(perActivityBudget),
  }));
}

function generateGenericItinerary(
  destination: string,
  days: number,
  budget: number,
  interests: string
): Itinerary {
  const interestList = getInterestList(interests);
  const perDayBudget = Math.max(200, budget / days);
  const dayPlans: Day[] = [];

  for (let i = 1; i <= days; i++) {
    const isLast = i === days;
    const activities = generateLowBudgetActivities(
      destination,
      i,
      perDayBudget,
      interestList
    );

    dayPlans.push({
      day: i,
      title: isLast ? "Departure Day" : `Day ${i} Exploration`,
      activities,
    });
  }

  const genericMinDailyBudget = 2500;
  const feasibilityNote = getFeasibilityNote(
    destination,
    days,
    budget,
    genericMinDailyBudget
  );

  return {
    title: `${days} Days in ${destination}`,
    destination,
    duration: `${days} Day${days > 1 ? "s" : ""} / ${Math.max(days - 1, 1)} Night${days > 1 ? "s" : ""}`,
    budget: formatCurrency(budget),
    summary:
      `TEST BACKEND LIVE - ` +
      (feasibilityNote
        ? feasibilityNote
        : `Discover ${destination} in ${days} days with a plan tailored to your interests: ${interestList.join(", ")}.`),
    locations: [
      {
        name: `${destination} City Center`,
        lat: 0,
        lng: 0,
        description: "Central area of the destination",
      },
      {
        name: `${destination} Local Market`,
        lat: 0,
        lng: 0,
        description: "Budget shopping and food area",
      },
      {
        name: `${destination} Main Attraction`,
        lat: 0,
        lng: 0,
        description: "Popular sightseeing area",
      },
    ],
    days: dayPlans,
    tips: [
      "Use public transport or shared rides to save money.",
      "Choose simple local eateries over premium restaurants.",
      "Book budget accommodation in advance.",
      "Keep some cash for small vendors and local transport.",
      ...(feasibilityNote
        ? [
            "Consider increasing the budget or reducing the duration for a more comfortable experience.",
          ]
        : []),
    ],
    totalEstimatedCost: formatCurrency(budget),
  };
}

function generateKnownItinerary(
  destKey: string,
  destination: string,
  days: number,
  budget: number,
  interests: string
): Itinerary {
  const data = DESTINATION_DATA[destKey];
  const perDayBudget = Math.max(200, budget / days);
  const feasibilityNote = getFeasibilityNote(
    destination,
    days,
    budget,
    data.minimumRecommendedDailyBudget
  );

  const dayPlans: Day[] = [];

  for (let i = 0; i < days; i++) {
    const dayActivities = data.activities[i % data.activities.length];
    const activityCount = dayActivities.length;
    const perActivityBudget = perDayBudget / activityCount;

    const activities: Activity[] = dayActivities.map((act, j) => {
      const times = ["7:00 AM", "10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"];

      return {
        time: times[j] || `${8 + j * 2}:00 AM`,
        activity:
          feasibilityNote && j === 1 ? `${act} (budget version)` : act,
        location: data.locations[j % data.locations.length]?.name || destination,
        cost: formatCurrency(perActivityBudget),
      };
    });

    dayPlans.push({
      day: i + 1,
      title: i === days - 1 ? "Farewell & Departure" : `Day ${i + 1} Highlights`,
      activities,
    });
  }

  return {
    title: `${days} Days in ${destination}`,
    destination,
    duration: `${days} Day${days > 1 ? "s" : ""} / ${Math.max(days - 1, 1)} Night${days > 1 ? "s" : ""}`,
    budget: formatCurrency(budget),
    summary:
      `TEST BACKEND LIVE - ` +
      (feasibilityNote ? `${data.summary} ${feasibilityNote}` : data.summary),
    locations: data.locations.slice(0, Math.min(days + 1, data.locations.length)),
    days: dayPlans,
    tips: [
      ...data.tips,
      ...(feasibilityNote
        ? ["This plan has been adjusted to stay within your stated budget."]
        : []),
    ],
    totalEstimatedCost: formatCurrency(budget),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { destination, duration, budget, interests } = body as {
      destination: string;
      duration: number;
      budget: string;
      interests?: string;
    };

    if (!destination || !duration || !budget) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: destination, duration, budget",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const days = Math.min(Math.max(parseInt(String(duration), 10) || 3, 1), 14);
    const budgetNum = parseBudget(String(budget));

    if (!Number.isFinite(budgetNum) || budgetNum <= 0) {
      return new Response(
        JSON.stringify({
          error: "Please enter a valid budget greater than 0.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const destKey = getDestinationKey(destination);
    const itinerary = destKey
      ? generateKnownItinerary(destKey, destination, days, budgetNum, interests || "")
      : generateGenericItinerary(destination, days, budgetNum, interests || "");

    return new Response(JSON.stringify({ itinerary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});