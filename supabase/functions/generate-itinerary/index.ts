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

const DESTINATION_DATA: Record<string, {
  coords: [number, number];
  summary: string;
  locations: { name: string; lat: number; lng: number; description: string }[];
  activities: string[][];
  tips: string[];
}> = {
  kerala: {
    coords: [10.8505, 76.2711],
    summary: "Kerala, God's Own Country, enchants visitors with serene backwaters, lush hill stations, pristine beaches, and rich cultural heritage. This tropical paradise offers a perfect blend of nature, wellness, and history.",
    locations: [
      { name: "Alleppey Backwaters", lat: 9.4981, lng: 76.3388, description: "Famous houseboat cruise destination" },
      { name: "Munnar", lat: 10.0889, lng: 77.0595, description: "Scenic hill station with tea gardens" },
      { name: "Fort Kochi", lat: 9.9639, lng: 76.2429, description: "Historic waterfront with Chinese fishing nets" },
      { name: "Periyar Wildlife Sanctuary", lat: 9.4641, lng: 77.1723, description: "Tiger reserve and elephant sightings" },
    ],
    activities: [
      ["Arrive and check into houseboat", "Alleppey backwaters cruise", "Sunset on the backwaters", "Seafood dinner on the houseboat"],
      ["Munnar tea plantation tour", "Eravikulam National Park", "Tea museum visit", "Sunset at Top Station viewpoint"],
      ["Fort Kochi heritage walk", "Chinese fishing nets viewing", "St. Francis Church", "Mattancherry Palace"],
      ["Ayurvedic spa and wellness session", "Periyar lake boat safari", "Spice plantation visit"],
      ["Local market shopping", "Kathakali dance performance", "Farewell seafood dinner"],
    ],
    tips: [
      "Book houseboats in advance, especially during peak season (Oct–Feb)",
      "Carry mosquito repellent for backwater stays",
      "Try the traditional Kerala Sadhya meal on a banana leaf",
      "Best time to visit: October to March for pleasant weather",
      "Hire a local guide in Periyar for better wildlife sightings",
      "Carry light cotton clothes — it's hot and humid throughout the year",
    ],
  },
  goa: {
    coords: [15.2993, 74.124],
    summary: "Goa is India's premier beach destination, offering golden sands, azure waters, vibrant nightlife, Portuguese colonial architecture, and some of India's freshest seafood. A perfect mix of relaxation and adventure.",
    locations: [
      { name: "Baga Beach", lat: 15.5523, lng: 73.7518, description: "Popular beach with water sports and nightlife" },
      { name: "Old Goa", lat: 15.5007, lng: 73.9175, description: "UNESCO heritage Portuguese churches" },
      { name: "Dudhsagar Falls", lat: 15.3144, lng: 74.3151, description: "Spectacular four-tiered waterfall" },
      { name: "Palolem Beach", lat: 15.0100, lng: 74.0237, description: "Serene crescent-shaped beach in South Goa" },
    ],
    activities: [
      ["Arrive and beach check-in", "Baga/Calangute beach walk", "Beach shacks dinner", "Nightlife at Tito's Lane"],
      ["Old Goa UNESCO churches", "Basilica of Bom Jesus", "Se Cathedral", "Fontainhas Latin Quarter"],
      ["Dudhsagar Falls jeep safari", "Spice plantation lunch", "Swimming at the falls", "Evening at Anjuna flea market"],
      ["Water sports: parasailing, jet ski, banana boat", "Dolphin spotting cruise", "Sunset at Vagator Beach"],
    ],
    tips: [
      "November to February is peak season — book accommodation early",
      "Rent a scooter for easy beach-hopping across North and South Goa",
      "Try sorpotel, fish curry rice, and bebinca (local Goan dessert)",
      "Keep valuables locked in your hotel — crowded beaches can attract pickpockets",
      "Dudhsagar Falls are best visited July to October (monsoon season)",
    ],
  },
  amritsar: {
    coords: [31.634, 74.8723],
    summary: "Amritsar is the spiritual heart of Sikhism and one of India's most iconic cities. The magnificent Golden Temple, the emotional Wagah Border ceremony, and some of the country's most delicious street food await you.",
    locations: [
      { name: "Golden Temple (Harmandir Sahib)", lat: 31.6200, lng: 74.8765, description: "Holiest Sikh shrine, open 24 hours" },
      { name: "Wagah Border", lat: 31.6046, lng: 74.5768, description: "Daily flag-lowering ceremony at India-Pakistan border" },
      { name: "Jallianwala Bagh", lat: 31.6218, lng: 74.8800, description: "Historic memorial garden" },
      { name: "Durgiana Temple", lat: 31.6264, lng: 74.8737, description: "Beautiful Hindu temple on a lake" },
    ],
    activities: [
      ["Arrive in Amritsar", "Golden Temple evening visit and Palki Sahib ceremony", "Langar (community meal) at the temple", "Lawrence Road street food tour"],
      ["Early morning Golden Temple visit at sunrise", "Jallianwala Bagh memorial", "Partition Museum", "Wagah Border flag ceremony at sunset"],
      ["Local market (Hall Bazaar) shopping", "Durgiana Temple visit", "Amritsari kulcha breakfast", "Depart"],
    ],
    tips: [
      "Cover your head and remove shoes before entering the Golden Temple",
      "Arrive at Wagah Border 2 hours early to get a good seat",
      "Must-try foods: Amritsari kulcha, lassi at Kulcha Land, fish fry",
      "The Golden Temple is most magical at night — plan an evening visit",
      "Photography is allowed everywhere except inside the sanctum sanctorum",
    ],
  },
  manali: {
    coords: [32.2396, 77.1887],
    summary: "Manali is the adventure capital of North India, nestled in the Himalayas with stunning snow-capped peaks, ancient temples, adventure sports, and the legendary Rohtang Pass. Perfect for nature lovers and thrill-seekers.",
    locations: [
      { name: "Rohtang Pass", lat: 32.3696, lng: 77.2403, description: "High altitude pass with snow throughout the year" },
      { name: "Solang Valley", lat: 32.3195, lng: 77.1542, description: "Adventure sports hub: skiing, zorbing, paragliding" },
      { name: "Hadimba Temple", lat: 32.2380, lng: 77.1771, description: "Ancient wooden temple surrounded by cedar forest" },
      { name: "Old Manali", lat: 32.2600, lng: 77.1723, description: "Charming village with cafes and backpacker culture" },
    ],
    activities: [
      ["Arrive in Manali", "Mall Road stroll", "Hadimba Temple visit", "Old Manali cafes"],
      ["Rohtang Pass day trip", "Snow play and photography", "Beas River rafting", "Local market"],
      ["Solang Valley adventure sports", "Paragliding", "Vashisht hot springs", "Sunset views"],
      ["Naggar Castle visit", "Jana Falls trek", "Mall Road shopping"],
      ["Local monastery visit", "Departure preparation"],
    ],
    tips: [
      "Rohtang Pass requires a permit — book online in advance at https://rohtangpermits.nic.in",
      "Best time for snow: December to February; best for roads: May to October",
      "Carry warm clothes even in summer — temperatures drop significantly at night",
      "Try Sidu (local bread), Dham (traditional meal), and Trout fish",
      "Book inner line permits in advance if traveling to Spiti Valley or Leh",
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
  const num = parseFloat(budget.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 20000 : num;
}

function formatCurrency(amount: number): string {
  if (amount <= 0) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

function generateGenericItinerary(destination: string, days: number, budget: number, interests: string): Itinerary {
  const interestList = interests ? interests.split(',').map(s => s.trim()) : ['sightseeing', 'food', 'culture'];
  const perDayBudget = budget / days;

  const dayPlans: Day[] = [];
  for (let i = 1; i <= days; i++) {
    const isFirst = i === 1;
    const isLast = i === days;
    const activities: Activity[] = [
      {
        time: isFirst ? '2:00 PM' : '7:00 AM',
        activity: isFirst ? `Arrive in ${destination} and check into hotel` : `Morning walk and breakfast at a local café`,
        location: isFirst ? `${destination} Airport/Station` : `Near hotel`,
        cost: isFirst ? formatCurrency(perDayBudget * 0.4) : formatCurrency(perDayBudget * 0.08),
      },
      {
        time: isFirst ? '5:00 PM' : '10:00 AM',
        activity: isFirst
          ? `Explore the main market and grab dinner`
          : `Visit key attraction — ${interestList[i % interestList.length]} focused tour`,
        location: `${destination} city center`,
        cost: formatCurrency(perDayBudget * 0.15),
      },
      {
        time: '1:00 PM',
        activity: `Lunch at a popular local restaurant`,
        location: `${destination} restaurant district`,
        cost: formatCurrency(perDayBudget * 0.1),
      },
      {
        time: '3:00 PM',
        activity: isLast
          ? `Last-minute shopping and souvenir hunting`
          : `Afternoon exploration — ${interestList[(i + 1) % interestList.length]} experience`,
        location: isLast ? `${destination} local market` : `${destination} attractions`,
        cost: formatCurrency(perDayBudget * 0.15),
      },
      {
        time: '7:00 PM',
        activity: isLast ? `Farewell dinner and depart` : `Evening dinner and leisure`,
        location: `${destination}`,
        cost: formatCurrency(perDayBudget * 0.12),
      },
    ];

    const titles = [
      'Arrival & First Impressions',
      'Culture & Heritage Exploration',
      'Nature & Adventure',
      'Local Life & Hidden Gems',
      'Markets & Culinary Journey',
      'Relaxation & Leisure',
      'Farewell & Memories',
    ];

    dayPlans.push({
      day: i,
      title: isLast ? 'Departure Day' : titles[(i - 1) % titles.length],
      activities,
    });
  }

  return {
    title: `${days} Days in ${destination}`,
    destination,
    duration: `${days} Day${days > 1 ? 's' : ''} / ${Math.max(days - 1, 1)} Night${days > 1 ? 's' : ''}`,
    budget: formatCurrency(budget),
    summary: `Discover the best of ${destination} in ${days} days with this carefully curated itinerary covering top sights, local cuisine, and authentic experiences tailored to your interests: ${interestList.join(', ')}.`,
    locations: [
      { name: `${destination} City Center`, lat: 0, lng: 0, description: 'Main hub of the city' },
      { name: `${destination} Attractions`, lat: 0, lng: 0, description: 'Key tourist spots' },
      { name: `${destination} Local Market`, lat: 0, lng: 0, description: 'Shopping and street food' },
    ],
    days: dayPlans,
    tips: [
      `Research local customs and dress code before visiting ${destination}`,
      `Carry cash as many local vendors may not accept cards`,
      `Book accommodation in advance, especially during peak season`,
      `Try the local street food — it's often the most authentic experience`,
      `Download offline maps of ${destination} in case you lose connectivity`,
      `Keep emergency contacts and your hotel address handy at all times`,
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
  const perDay = budget / days;

  const dayPlans: Day[] = [];
  for (let i = 0; i < days; i++) {
    const dayActivities = data.activities[i % data.activities.length];
    const activities: Activity[] = dayActivities.map((act, j) => {
      const times = ['7:00 AM', '10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '9:00 PM'];
      const costRatios = [0.05, 0.15, 0.12, 0.15, 0.13, 0.0];
      return {
        time: times[j] || `${8 + j * 2}:00 AM`,
        activity: act,
        location: data.locations[j % data.locations.length]?.name || destination,
        cost: formatCurrency(perDay * (costRatios[j] || 0.1)),
      };
    });

    const titles = ['Arrival & Orientation', 'Cultural Immersion', 'Nature & Wildlife', 'Adventure & Activities', 'Local Experiences', 'Shopping & Relaxation', 'Farewell'];
    dayPlans.push({
      day: i + 1,
      title: i === days - 1 ? 'Farewell & Departure' : titles[i % titles.length],
      activities,
    });
  }

  return {
    title: `${days} Magical Days in ${destination}`,
    destination,
    duration: `${days} Day${days > 1 ? 's' : ''} / ${Math.max(days - 1, 1)} Night${days > 1 ? 's' : ''}`,
    budget: formatCurrency(budget),
    summary: data.summary,
    locations: data.locations.slice(0, Math.min(days + 1, data.locations.length)),
    days: dayPlans,
    tips: data.tips,
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
        JSON.stringify({ error: "Missing required fields: destination, duration, budget" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const days = Math.min(Math.max(parseInt(String(duration)) || 3, 1), 14);
    const budgetNum = parseBudget(String(budget));
    const destKey = getDestinationKey(destination);

    let itinerary: Itinerary;
    if (destKey) {
      itinerary = generateKnownItinerary(destKey, destination, days, budgetNum, interests || '');
    } else {
      itinerary = generateGenericItinerary(destination, days, budgetNum, interests || '');
    }

    return new Response(
      JSON.stringify({ itinerary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
