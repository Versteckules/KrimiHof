/**
 * map.js - Leaflet-Karte & Dark-Noir Theme (AP6)
 */

import { getStations, getConfig } from '../config-loader.js';
import { getState, subscribe, isStationSolved } from '../state.js';

let map = null;
let markers = {};
let playerMarker = null;
let activeTargetId = null;

export function initMap() {
  if (map) return; // Bereits initialisiert
  
  if (typeof L === 'undefined') {
    console.warn("Leaflet noch nicht geladen.");
    return;
  }

  const config = getConfig();
  const { lat, lng } = config.referenceLocation;

  // Leaflet Karte initialisieren
  map = L.map('map-container', {
    zoomControl: false,
    attributionControl: false
  }).setView([lat, lng], 15);

  // CARTO Dark Matter Kacheln
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  // Markierungen zeichnen
  renderMarkers();

  // Bei Status-Updates Marker aktualisieren
  subscribe(() => {
    renderMarkers();
  });
}

function getIcon(status) {
  let color = '#d4af37'; // Amber (active)
  if (status === 'locked') color = '#555555';
  if (status === 'solved') color = '#2e8b57'; // Green
  if (status === 'bonus') color = '#c0c0c0'; // Silver

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="24" height="36">
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0zm0 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" fill="${color}"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-pin',
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });
}

function renderMarkers() {
  const stations = getStations();
  if (!stations) return;
  const startSolved = isStationSolved('rathaus');

  stations.forEach(st => {
    if (!st.coordsDecimal) return;
    
    let status = 'locked';
    if (isStationSolved(st.id)) {
      status = 'solved';
    } else if (st.id === 'rathaus') {
      status = 'active'; // Immer aktiv, wenn nicht solved
    } else if (st.id.startsWith('saale_') || st.id.startsWith('altstadt_')) {
      status = 'bonus';
    } else if (startSolved) {
      status = 'active'; // Pflicht nach Rathaus frei
    }

    if (!markers[st.id]) {
      const marker = L.marker([st.coordsDecimal.lat, st.coordsDecimal.lng], {
        icon: getIcon(status)
      }).addTo(map);

      marker.bindPopup(`<b>${st.name}</b><br><small>${status.toUpperCase()}</small>`);
      
      marker.on('click', () => {
        if (status === 'active' || status === 'bonus') {
          setActiveTarget(st.id);
          
          const state = getState();
          if (state.isTestingMode) {
            console.log('[Testing] Öffne Station direkt ohne GPS (Test-Modus)');
            import('./station.js').then(module => {
              module.openStation(st.id);
            });
          }
        } else if (status === 'locked') {
          alert('Löse zuerst das Rätsel am Rathaus, bevor du hierher kommst.');
        } else if (status === 'solved') {
          alert('Diese Station hast du bereits abgeschlossen.');
        }
      });
      
      markers[st.id] = marker;
    } else {
      markers[st.id].setIcon(getIcon(status));
    }
  });
}

function setActiveTarget(id) {
  activeTargetId = id;
  document.dispatchEvent(new CustomEvent('targetChanged', { detail: id }));
  console.log(`[Map] Ziel gesetzt auf: ${id}`);
}

export function updatePlayerMarker(lat, lng) {
  if (!map) return;
  
  if (!playerMarker) {
    playerMarker = L.circleMarker([lat, lng], {
      radius: 6,
      fillColor: '#3b82f6',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 1
    }).addTo(map);
  } else {
    playerMarker.setLatLng([lat, lng]);
  }
}

export function getActiveTargetId() {
  return activeTargetId;
}
