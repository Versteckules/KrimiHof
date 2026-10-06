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

  // OpenStreetMap mit Dark-Filter (siehe CSS) anstelle von Carto (API Key nötig)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

  L.control.zoom({ position: 'topright' }).addTo(map);

  // Markierungen zeichnen
  renderMarkers();

  // Bei Status-Updates Marker aktualisieren
  subscribe(() => {
    renderMarkers();
  });
}

function getIcon(status, customColor) {
  let color = '#d4af37'; // Amber (active)
  if (status === 'locked') color = '#555555';
  if (status === 'solved') color = '#2e8b57'; // Green
  if (status === 'bonus') color = '#c0c0c0'; // Silver
  if (status === 'suspect') color = '#3b82f6'; // Blue
  if (customColor) color = customColor;

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
  const state = getState();
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
        icon: getIcon(status, st.markerColor)
      }).addTo(map);

      marker.customStatus = status;
      marker.bindPopup(`<b>${st.name}</b><br><small>${status.toUpperCase()}</small>`);
      
      marker.on('click', () => {
        const currentStatus = marker.customStatus;
        if (currentStatus === 'active' || currentStatus === 'bonus') {
          setActiveTarget(st.id);
          
          const currentState = getState();
          if (currentState.isTestingMode) {
            console.log('[Testing] Öffne Station direkt ohne GPS (Test-Modus)');
            import('./station.js').then(module => {
              module.openStation(st.id);
            });
          }
        } else if (currentStatus === 'locked') {
          alert('Löse zuerst das Rätsel am Rathaus, bevor du hierher kommst.');
        } else if (currentStatus === 'solved') {
          alert('Diese Station hast du bereits abgeschlossen.');
        }
      });
      
      markers[st.id] = marker;
    } else {
      markers[st.id].customStatus = status;
      markers[st.id].setIcon(getIcon(status, st.markerColor));
      markers[st.id].setPopupContent(`<b>${st.name}</b><br><small>${status.toUpperCase()}</small>`);
    }
  });

  // Suspects rendern
  if (state.suspectsUnlocked) {
    import('../config-loader.js').then(module => {
       const story = module.getStory();
       if(story && story.suspects) {
          import('../coords.js').then(coordsModule => {
            Object.values(story.suspects).forEach(suspect => {
              if (suspect.coords && !markers['suspect_'+suspect.id]) {
                const parsed = coordsModule.parseCoords(suspect.coords);
                if (parsed) {
                  const marker = L.marker([parsed.lat, parsed.lng], {
                    icon: getIcon('suspect')
                  }).addTo(map);

                  const popupDiv = document.createElement('div');
                  popupDiv.className = 'suspect-map-popup';
                  popupDiv.innerHTML = `
                    <div style="width: 220px; font-family: sans-serif; color: #fff;">
                      <div style="position: relative; width: 100%; height: 130px; border-radius: 6px; overflow: hidden; margin-bottom: 8px; border: 1px solid rgba(212, 175, 55, 0.4);">
                        <img src="${suspect.image}" alt="${suspect.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        <span style="position: absolute; top: 6px; right: 6px; background: rgba(10, 14, 23, 0.85); border: 1px solid #8b0000; color: #ff5555; font-size: 0.65rem; padding: 2px 6px; border-radius: 3px; font-weight: bold; letter-spacing: 1px;">HAUPTVERDACHT</span>
                      </div>
                      <div style="font-family: serif; font-size: 1.15rem; color: #d4af37; font-weight: bold; margin-bottom: 2px;">${suspect.name}</div>
                      <div style="font-size: 0.78rem; color: #aaa; margin-bottom: 6px;">${suspect.role} (${suspect.age} J.)</div>
                      <div style="font-size: 0.75rem; color: #ddd; line-height: 1.35; margin-bottom: 10px; max-height: 55px; overflow-y: auto;">${suspect.motive}</div>
                      <button class="btn-interrogate-popup" id="btn-interrogate-map-${suspect.id}" style="width: 100%; padding: 8px 12px; font-size: 0.85rem; font-weight: bold; border-radius: 4px; background: linear-gradient(135deg, #d4af37, #8c6d23); color: #05080f; border: 1px solid #d4af37; cursor: pointer;">🗣️ Verhör / Konfrontation</button>
                    </div>
                  `;

                  marker.bindPopup(popupDiv);
                  marker.on('popupopen', () => {
                    const btn = document.getElementById(`btn-interrogate-map-${suspect.id}`);
                    if (btn) {
                      btn.onclick = () => {
                        marker.closePopup();
                        import('./dialogue.js').then(dMod => {
                          const treeKey = 'interrogate_' + suspect.id;
                          if (story.dialogueTrees && story.dialogueTrees[treeKey]) {
                            dMod.openDialogue(story.dialogueTrees[treeKey], () => {
                              import('../main.js').then(m => m.showView('view-dashboard'));
                            });
                          }
                        });
                      };
                    }
                  });

                  markers['suspect_'+suspect.id] = marker;
                }
              }
            });
          });
       }
    });
  }
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
