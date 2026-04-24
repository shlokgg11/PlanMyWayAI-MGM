PlanMyWay-AI – Smart Travel Itinerary Generator

 Overview

PlanMyWay-AI is a full-stack AI-powered travel itinerary generator that creates optimized, day-wise travel plans for any destination worldwide.
It uses real-time travel data and AI to automatically suggest attractions, hotels, restaurants, and activities based on user preferences such as budget, duration, and interests.

The system eliminates manual trip planning by combining live APIs with AI-based decision-making.

---

 Features

*  AI-generated day-wise travel itineraries
*  Budget-based trip planning and cost estimation
*  Real hotel and restaurant suggestions
*  Live attractions data using APIs
*  Map-based visualization (Leaflet integration)
*  Download itinerary as PDF
*  User authentication and saved trips
*  Supports global destinations

---
 Tech Stack

### Frontend

* React + Vite
* TypeScript
* Tailwind CSS
* React Router

### Backend

* Supabase (Database + Authentication)
* Supabase Edge Functions

### APIs Used

* Geoapify API → Attractions & places data
* Groq API → AI itinerary generation
* Supabase API → Auth & database
* OpenStreetMap / Leaflet → Maps

---

##  How It Works

1. User enters:

   * Destination
   * Duration (days)
   * Budget
   * Preferences

2. System fetches:

   * Attractions, hotels, restaurants (Geoapify API)

3. AI processes data:

   * Generates optimized day-wise itinerary (Groq API)

4. System outputs:

   * Structured travel plan
   * Budget distribution
   * Route & activity sequence

5. User can:

   * View itinerary
   * Save trip
   * Download PDF

---

##  Project Structure

```
PlanMyWay-AI/
│── src/
│── components/
│── pages/
│── supabase/
│── public/
│── README.md
│── package.json
```

---

## Screenshots

* Home Page
![Home](screenshots/home.png)
* Trip Planner Form
![Planner](screenshots/planner.png)
* Generated Itinerary
![Itinerary](screenshots/itinerary.png)
* Map View
![Map](screenshots/map.png)
---

#Live Demo

🔗https://planmywayai.netlify.app

---

 Testing

* ✔ Login & Signup functionality tested
* ✔ API responses validated
* ✔ Itinerary generation tested for multiple destinations
* ✔ Budget calculation verified
* ✔ Responsive design tested (mobile & desktop)

---

 Limitations

* Depends on external APIs (rate limits may apply)
* AI-generated suggestions may not always be 100% accurate
* Real-time changes (traffic/weather) are limited

---

 Future Scope

* Flight & hotel booking integration
* Real-time weather & traffic updates
* Multi-city trip planning
* Advanced route optimization
* Trip sharing & collaboration features

---
 Team Members

* Shlok Gawde
* Aabhas Mhatre
* Paras Bhingare
* Aaryan Yadav

---

 References

* https://arxiv.org
* https://ijctjournal.org
* https://www.ijraset.com

---

 Acknowledgment

Under the guidance of **Prof. Dhanashri Kane**

---

 Conclusion

PlanMyWay-AI demonstrates how AI and real-time APIs can be combined to build a fully automated, intelligent travel planning system that simplifies trip organization and enhances user experience.

---
