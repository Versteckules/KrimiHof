const locations = [
  "Rathaus, Hof (Saale)",
  "Hauptbahnhof, Hof (Saale)",
  "Sophienschule, Hof (Saale)",
  "St. Lorenz, Hof (Saale)",
  "Biengäßchen, Hof (Saale)",
  "Ludwigstraße 18, Hof (Saale)",
  "Karolinenstraße 12, Hof (Saale)",
  "Schloßplatz 12, Hof (Saale)",
  "Sonnenplatz, Hof (Saale)",
  "Marienkirche, Hof (Saale)",
  "Michaeliskirche, Hof (Saale)",
  "Hospitalkirche, Hof (Saale)",
  "Saaleufer, Hof (Saale)",
  "Spital, Hof (Saale)"
];

async function geocode() {
  for (const loc of locations) {
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(loc)}&format=json&limit=1`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'AntigravityIDE/1.0 (test@example.com)' }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        
        // Convert to DMM (Degrees Decimal Minutes) N 50° 19.182 E 011° 55.074
        const latDeg = Math.floor(lat);
        const latMin = ((lat - latDeg) * 60).toFixed(3);
        const lonDeg = Math.floor(lon);
        const lonMin = ((lon - lonDeg) * 60).toFixed(3);
        
        console.log(`${loc}: N ${latDeg}° ${latMin} E 0${lonDeg}° ${lonMin}`);
      } else {
        console.log(`${loc}: NOT FOUND`);
      }
    } catch (e) {
      console.log(`${loc}: ERROR`, e.message);
    }
    // sleep
    await new Promise(r => setTimeout(r, 1000));
  }
}

geocode();
