import jsPDF from "jspdf";

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

interface RecommendedStay {
  type: string;
  name: string;
  estimatedCost: string;
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
  recommendedStays?: RecommendedStay[];
}

function cleanMoney(value?: string) {
  const num = parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(num)) return "Rs. 0";
  return `Rs. ${Math.round(num).toLocaleString("en-IN")}`;
}

export function generateItineraryPDF(itinerary: Itinerary) {
  const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const left = 15;
  const right = pageWidth - 15;
  const contentWidth = right - left;

  let y = 20;

  const ensureSpace = (needed = 18) => {
    if (y + needed > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
  };

  const writeWrapped = (
    text: string,
    x: number,
    yPos: number,
    width: number,
    lineHeight = 6
  ) => {
    const lines = doc.splitTextToSize(text, width);
    doc.text(lines, x, yPos);
    return yPos + lines.length * lineHeight;
  };

  const drawDivider = () => {
    doc.line(left, y, right, y);
    y += 6;
  };

  // COVER PAGE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("PLANMYWAY-AI", pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(20);
  doc.text(itinerary.title || `${itinerary.destination} Itinerary`, pageWidth / 2, 55, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(
    `${itinerary.duration} • ${cleanMoney(itinerary.totalEstimatedCost)}`,
    pageWidth / 2,
    68,
    { align: "center" }
  );

  doc.setFontSize(11);
  const coverSummary = doc.splitTextToSize(
    itinerary.summary || `A personalized trip plan for ${itinerary.destination}.`,
    150
  );
  doc.text(coverSummary, pageWidth / 2, 90, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Destination: ${itinerary.destination}`, pageWidth / 2, 130, {
    align: "center",
  });
  doc.text(`Budget: ${cleanMoney(itinerary.budget)}`, pageWidth / 2, 138, {
    align: "center",
  });
  doc.text(`Estimated Cost: ${cleanMoney(itinerary.totalEstimatedCost)}`, pageWidth / 2, 146, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Generated personalized itinerary", pageWidth / 2, 270, {
    align: "center",
  });

  // NEW PAGE - SNAPSHOT
  doc.addPage();
  y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Trip Snapshot", left, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Destination: ${itinerary.destination}`, left, y);
  y += 7;
  doc.text(`Duration: ${itinerary.duration}`, left, y);
  y += 7;
  doc.text(`Budget: ${cleanMoney(itinerary.budget)}`, left, y);
  y += 7;
  doc.text(`Estimated Cost: ${cleanMoney(itinerary.totalEstimatedCost)}`, left, y);
  y += 10;

  drawDivider();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Trip Summary", left, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y = writeWrapped(itinerary.summary, left, y, contentWidth, 6);
  y += 4;

  if (itinerary.recommendedStays?.length) {
    ensureSpace(28);
    drawDivider();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Recommended Stays", left, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    itinerary.recommendedStays.forEach((stay) => {
      ensureSpace(10);
      doc.text(
        `• ${stay.type}: ${stay.name} (${cleanMoney(stay.estimatedCost)})`,
        left,
        y
      );
      y += 7;
    });

    y += 3;
  }

  if (itinerary.tips?.length) {
    ensureSpace(35);
    drawDivider();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Travel Tips", left, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    itinerary.tips.forEach((tip) => {
      ensureSpace(10);
      y = writeWrapped(`• ${tip}`, left, y, contentWidth, 6);
      y += 1;
    });
  }

  // DAY-WISE PAGES
  itinerary.days.forEach((day) => {
    doc.addPage();
    y = 20;

    let dayTotal = 0;
    day.activities.forEach((a) => {
      dayTotal += parseFloat(String(a.cost || "").replace(/[^0-9.]/g, "")) || 0;
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Day ${day.day}`, left, y);
    y += 8;

    doc.setFontSize(14);
    y = writeWrapped(day.title, left, y, contentWidth, 7);
    y += 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Day Total: ${cleanMoney(String(dayTotal))}`, left, y);
    y += 8;

    drawDivider();

    day.activities.forEach((activity) => {
      ensureSpace(24);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      y = writeWrapped(`${activity.time} — ${activity.activity}`, left, y, contentWidth, 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      y = writeWrapped(`Location: ${activity.location}`, left + 4, y, contentWidth - 4, 5);
      y = writeWrapped(`Cost: ${cleanMoney(activity.cost)}`, left + 4, y, contentWidth - 4, 5);

      y += 4;
    });
  });

  // FINAL PAGE - BUDGET BREAKDOWN
  doc.addPage();
  y = 20;

  let stayTotal = 0;
  let foodTotal = 0;
  let activityTotal = 0;

  itinerary.days.forEach((day) => {
    day.activities.forEach((a) => {
      const value = parseFloat(String(a.cost || "").replace(/[^0-9.]/g, "")) || 0;
      const text = `${a.activity} ${a.location}`.toLowerCase();

      if (text.includes("check-in") || text.includes("hotel") || text.includes("hostel") || text.includes("dorm")) {
        stayTotal += value;
      } else if (
        text.includes("breakfast") ||
        text.includes("lunch") ||
        text.includes("dinner") ||
        text.includes("cafe")
      ) {
        foodTotal += value;
      } else {
        activityTotal += value;
      }
    });
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Budget Breakdown", left, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Stay: ${cleanMoney(String(stayTotal))}`, left, y);
  y += 8;
  doc.text(`Food: ${cleanMoney(String(foodTotal))}`, left, y);
  y += 8;
  doc.text(`Activities: ${cleanMoney(String(activityTotal))}`, left, y);
  y += 12;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Grand Total: ${cleanMoney(itinerary.totalEstimatedCost)}`, left, y);

  const safeName = (itinerary.destination || "trip")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  doc.save(`${safeName}_itinerary.pdf`);
}