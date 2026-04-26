import jsPDF from "jspdf";

interface Activity {
  time: string;
  activity: string;
  location: string;
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
  summary: string;
  locations: Location[];
  days: Day[];
  tips: string[];
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

  // ================= COVER PAGE =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("PLANMYWAY-AI", pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(20);
  doc.text(itinerary.title || `${itinerary.destination} Itinerary`, pageWidth / 2, 55, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text(`${itinerary.duration}`, pageWidth / 2, 68, {
    align: "center",
  });

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

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Generated personalized itinerary", pageWidth / 2, 270, {
    align: "center",
  });

  // ================= SNAPSHOT PAGE =================
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

  // ================= DAY-WISE =================
  itinerary.days.forEach((day) => {
    doc.addPage();
    y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Day ${day.day}`, left, y);
    y += 8;

    doc.setFontSize(14);
    y = writeWrapped(day.title, left, y, contentWidth, 7);
    y += 4;

    drawDivider();

    day.activities.forEach((activity) => {
      ensureSpace(20);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      y = writeWrapped(`${activity.time} — ${activity.activity}`, left, y, contentWidth, 6);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      y = writeWrapped(`Location: ${activity.location}`, left + 4, y, contentWidth - 4, 5);

      y += 4;
    });
  });

  const safeName = (itinerary.destination || "trip")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  doc.save(`${safeName}_itinerary.pdf`);
}