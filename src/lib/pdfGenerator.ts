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

interface Itinerary {
  title: string;
  destination: string;
  duration: string;
  budget: string;
  summary: string;
  days: Day[];
  tips: string[];
  totalEstimatedCost: string;
}

export function generateItineraryPDF(itinerary: Itinerary) {
  const lines: string[] = [];

  lines.push(`PLANMYWAY AI - TRAVEL ITINERARY`);
  lines.push(`================================`);
  lines.push(``);
  lines.push(`${itinerary.title}`);
  lines.push(`Destination: ${itinerary.destination}`);
  lines.push(`Duration: ${itinerary.duration}`);
  lines.push(`Estimated Cost: ${itinerary.totalEstimatedCost}`);
  lines.push(``);
  lines.push(`SUMMARY`);
  lines.push(`-------`);
  lines.push(itinerary.summary);
  lines.push(``);

  itinerary.days.forEach((day) => {
    lines.push(`DAY ${day.day}: ${day.title}`);
    lines.push(`${'─'.repeat(40)}`);
    day.activities.forEach((act) => {
      lines.push(`  ${act.time} | ${act.activity}`);
      lines.push(`         Location: ${act.location}`);
      if (act.cost && act.cost !== '₹0') {
        lines.push(`         Cost: ${act.cost}`);
      }
    });
    lines.push(``);
  });

  if (itinerary.tips && itinerary.tips.length > 0) {
    lines.push(`TRAVEL TIPS`);
    lines.push(`-----------`);
    itinerary.tips.forEach((tip, i) => {
      lines.push(`${i + 1}. ${tip}`);
    });
  }

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${itinerary.destination.replace(/\s+/g, '-')}-itinerary.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
