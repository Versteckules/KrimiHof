/**
 * map.js - Leaflet-Karte & Dark-Noir Theme (AP6)
 */

import { getStations, getConfig } from '../config-loader.js';
import { getState, subscribe, isStationSolved, getPlayerRank } from '../state.js';
import { showNoirAlert } from '../main.js';

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

  // Leaflet Karte initialisieren, Zoom auf Mobile anpassen
  const isMobile = window.innerWidth < 768;
  const initialZoom = isMobile ? 16 : 15;
  
  map = L.map('map-container', {
    zoomControl: false,
    attributionControl: false
  }).setView([lat, lng], initialZoom);

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
    updateRankDisplay();
  });

  // Initiale Rank-Berechnung
  updateRankDisplay();

  // Sherlock Hint Listener
  const hintBtn = document.getElementById('btn-sherlock-hint');
  if (hintBtn) {
    hintBtn.addEventListener('click', () => {
      const state = getState();

      // Easter Egg Chance via Sherlock (15%)
      if (playerMarker && Math.random() < 0.15) {
        const eggs = [
          { id: 'ghost_jean_paul', name: 'Jean Pauls Geist', desc: 'Du hast den Geist der Stadt gefunden! (+50 Punkte)', points: 50 },
          { id: 'secret_donut', name: 'Versteckte Bäckerei', desc: 'Ein heißer Kaffee und frische Donuts! (+30 Punkte)', points: 30 },
          { id: 'noir_cat', name: 'Schwarze Katze', desc: 'Sie schnurrt geheimnisvoll und verschwindet im Nebel... (+20 Punkte)', points: 20 },
          { id: 'lost_badge', name: 'Verlorene Polizeimarke', desc: 'Du hast eine alte Marke im Laub gefunden! (+40 Punkte)', points: 40 }
        ];
        
        const availableEggs = eggs.filter(e => !state['easterEgg_' + e.id] && !markers[e.id]);
        
        if (availableEggs.length > 0) {
          const egg = availableEggs[Math.floor(Math.random() * availableEggs.length)];
          
          // Wir snappen das Easter Egg an eine existierende Station, um sicherzugehen,
          // dass es auf einer Straße/öffentlich zugänglichen Fläche liegt.
          const validStations = stations.filter(s => s.coordsDecimal);
          const snapStation = validStations[Math.floor(Math.random() * validStations.length)];
          
          // Winziger Offset (ca. 10-15 Meter), damit der Pin nicht exakt über der Station liegt
          const offsetLat = (Math.random() > 0.5 ? 1 : -1) * 0.00015;
          const offsetLng = (Math.random() > 0.5 ? 1 : -1) * 0.00015;
          
          const eggLat = snapStation.coordsDecimal.lat + offsetLat;
          const eggLng = snapStation.coordsDecimal.lng + offsetLng;
          
          const marker = L.marker([eggLat, eggLng], {
            icon: getIcon('bonus', '#8b008b') // Lila Marker
          }).addTo(map);
          
          marker.bindPopup(`<b>${egg.name}</b><br>Klicke hier, um es einzusammeln!`);
          marker.on('click', () => {
            import('../state.js').then(mod => {
              const currentState = mod.getState();
              alert(`EASTER EGG GEFUNDEN: ${egg.desc}`);
              mod.saveState({ [`easterEgg_${egg.id}`]: true, score: (currentState.score || 0) + egg.points });
              marker.remove();
              delete markers[egg.id];
              updateRankDisplay();
            });
          });
          
          markers[egg.id] = marker;
          showNoirAlert(`Mein Spürsinn hat etwas Verstecktes ganz in der Nähe entdeckt! Sieh auf die Karte.`, 'Sherlock-Geheimnis');
          return; // Beende den Klick, damit nur das Easter Egg getriggert wird
        }
      }

      const stations = getStations();
      
      // Finde alle Stationen, die aktuell auf der Karte 'active' oder 'bonus' sind
      const available = stations.filter(s => {
        const m = markers[s.id];
        return m && (m.customStatus === 'active' || m.customStatus === 'bonus');
      });

      if (available.length > 0) {
        let targetStation = available[0];
        
        // Finde die nächstgelegene Station per GPS
        if (playerMarker) {
          const playerPos = playerMarker.getLatLng();
          let minDistance = Infinity;
          
          available.forEach(st => {
            const dist = map.distance(playerPos, [st.coordsDecimal.lat, st.coordsDecimal.lng]);
            if (dist < minDistance) {
              minDistance = dist;
              targetStation = st;
            }
          });
        }
        
        showNoirAlert(`Mein Spürsinn sagt mir, wir sollten uns den Ort "${targetStation.name}" genauer ansehen.`, 'Sherlock-Tipp');
      } else {
        showNoirAlert('Es gibt aktuell keine neuen Orte zu untersuchen. Überprüfe dein Dossier!', 'Sherlock-Tipp');
      }
    });
  }

  // Rank Info Modal Listener
  const infoBtn = document.getElementById('btn-rank-info');
  const infoModal = document.getElementById('rank-info-modal');
  const infoCloseBtn = document.getElementById('btn-rank-info-close');
  
  if (infoBtn && infoModal && infoCloseBtn) {
    infoBtn.addEventListener('click', () => {
      infoModal.classList.remove('hidden');
    });
    infoCloseBtn.addEventListener('click', () => {
      infoModal.classList.add('hidden');
    });
  }
}

function updateRankDisplay() {
  const rank = getPlayerRank();
  const state = getState();
  const nameEl = document.getElementById('player-rank-name');
  const scoreEl = document.getElementById('player-score-val');
  const hintBtn = document.getElementById('btn-sherlock-hint');

  if (nameEl) nameEl.textContent = rank.name;
  if (scoreEl) scoreEl.textContent = state.score || 0;

  // Vorteil: Sherlock-Button ab Rang 3
  if (hintBtn) {
    if (rank.level >= 3) {
      hintBtn.classList.remove('hidden');
    } else {
      hintBtn.classList.add('hidden');
    }
  }
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
      status = startSolved ? 'bonus' : 'locked';
    } else if (startSolved) {
      status = 'active'; // Pflicht nach Rathaus frei
    }

    if (!markers[st.id]) {
      const marker = L.marker([st.coordsDecimal.lat, st.coordsDecimal.lng], {
        icon: getIcon(status, st.markerColor)
      }).addTo(map);

      marker.customStatus = status;
      marker.bindPopup(`<b>${st.name}</b>`);
      
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
          showNoirAlert('Löse zuerst das Rätsel am Rathaus, bevor du hierher kommst.', 'Gesperrt');
        } else if (currentStatus === 'solved') {
          showNoirAlert('Diese Station hast du bereits abgeschlossen.', 'Abgeschlossen');
        }
      });
      
      markers[st.id] = marker;
    } else {
      markers[st.id].customStatus = status;
      markers[st.id].setIcon(getIcon(status, st.markerColor));
      markers[st.id].setPopupContent(`<b>${st.name}</b>`);
    }
  });

  // Suspects rendern
  if (state.suspectsUnlocked) {
    import('../config-loader.js').then(module => {
       const story = module.getStory();
       if(story && story.suspects) {
          import('../coords.js').then(coordsModule => {
            Object.values(story.suspects).forEach(suspect => {
              const suspicion = state.suspects ? (state.suspects[suspect.id] || 0) : 0;
              
              if (suspicion >= 25) {
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
                        <img src="${suspect.image}" alt="${suspect.name}" style="width: 100%; height: 100%; object-fit: contain; background: #000;">
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
                      import('../state.js').then(st => {
                        const currentState = st.getState();
                        const treeKey = 'interrogate_' + suspect.id;
                        const interrogations = currentState.interrogations ? currentState.interrogations[suspect.id] : [];
                        
                        let canInterrogate = true;
                        let blockReason = "";

                        if (interrogations && interrogations.length > 0) {
                          if (interrogations.length >= 2) {
                            canInterrogate = false;
                            blockReason = "Keine weiteren Verhöre";
                          } else {
                            const lastCount = interrogations[interrogations.length - 1];
                            const currentSolved = currentState.solvedStations ? currentState.solvedStations.length : 0;
                            if (currentSolved < lastCount + 3) {
                              canInterrogate = false;
                              const left = (lastCount + 3) - currentSolved;
                              blockReason = `Noch ${left} Station(en) lösen`;
                            }
                          }
                        }

                        if (!canInterrogate) {
                          btn.innerText = blockReason;
                          btn.style.opacity = "0.5";
                          btn.style.cursor = "not-allowed";
                          btn.onclick = null;
                        } else {
                          btn.onclick = () => {
                            marker.closePopup();
                            const currentSolved = currentState.solvedStations ? currentState.solvedStations.length : 0;
                            st.recordInterrogation(suspect.id, currentSolved);
                            import('./dialogue.js').then(dMod => {
                              if (story.dialogueTrees && story.dialogueTrees[treeKey]) {
                                dMod.openDialogue(story.dialogueTrees[treeKey], () => {
                                  const suspectGames = {
                                    'herold': 'safe',
                                    'gipser': 'shredder',
                                    'heiden': 'music-cryptogram'
                                  };
                                  if (suspectGames[suspect.id]) {
                                    import(`./gadgets/${suspectGames[suspect.id]}.js`).then(gameMod => {
                                      gameMod.runGadget(suspect.id, () => {
                                        import('../main.js').then(m => m.showView('view-dashboard'));
                                      });
                                    }).catch(err => {
                                      console.error("Fehler beim Laden des Suspect-Minispiels:", err);
                                      import('../main.js').then(m => m.showView('view-dashboard'));
                                    });
                                  } else {
                                    import('../main.js').then(m => m.showView('view-dashboard'));
                                  }
                                });
                              }
                            });
                          };
                        }
                      });
                    }
                  });

                  markers['suspect_'+suspect.id] = marker;
                }
              }
            } else {
              // Hide marker if suspicion < 25
              if (markers['suspect_'+suspect.id]) {
                map.removeLayer(markers['suspect_'+suspect.id]);
                delete markers['suspect_'+suspect.id];
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
