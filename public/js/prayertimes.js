if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=fr`)
                .then(response => response.json())
                .then(dataloc => {
                    console.log()
                    const city = dataloc.address.town
                    document.getElementById("city").textContent = "Ville: " + city

                    fetch(`/api/data?input=${encodeURIComponent(city)}`)
                    .then(response => response.json())
                    .then(data => {
                        const data_ = data[0];
                        const prayers = [
                        { name: 'Fajr', key: 'fajr' },
                        { name: 'Shurooq', key: 'shurooq' },
                        { name: 'Dhuhr', key: 'dhuhr' },
                        { name: 'Asr', key: 'asr' },
                        { name: 'Maghrib', key: 'maghrib' },
                        { name: 'Isha', key: 'isha' }
                        ];
                        document.getElementById("date").textContent = "Date: " + data_.date_for
                        prayers.forEach(prayer => {
                            const prayerText = `${prayer.name}: ${data_[prayer.key]}`;
                            document.getElementById(prayer.key).textContent = prayerText;
                        });
                    })
                    fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const direction = Math.round(data.data.direction)

                        document.getElementById("direction").textContent = "Direction: " + direction + "°";
                    })
                })
            },
            function(error) {
                console.error("Erreur de géolocalisation :", error.message);
            },
            {
                enableHighAccuracy: true, // Précision maximale
                timeout: 5000, // Temps max avant erreur (ms)
                maximumAge: 0 // Pas de mise en cache
            }
        );
    } else {
        console.error("La géolocalisation n'est pas supportée par ce navigateur.");
    }

// Fonction pour démarrer le suivi d'orientation
function startOrientationTracking() {
    if (!window.DeviceOrientationEvent) {
        alert("L'orientation de l'appareil n'est pas supportée sur ce navigateur.");
        return;
    }
    // Demander la permission sur iOS
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(permissionState => {
            if (permissionState === 'granted') {
                // Si la permission est accordée, on peut commencer à écouter les données d'orientation
                        startListening();
                    } else {
                        alert("Vous devez autoriser l'accès à l'orientation.");
                    }
                }).catch(err => {
                    console.error("Erreur de demande de permission : ", err);
                    alert("Erreur lors de la demande de permission.");
                });
            } else {
                // Si la permission n'est pas requise, on commence directement à écouter les données d'orientation
                startListening();
            }
        }

        // Fonction pour écouter les événements d'orientation
        function startListening() {
            window.addEventListener("deviceorientation", function(event) {
                const alpha = event.alpha;  // Rotation autour de l'axe Z (boussole)
                
                if (alpha === null) {
                    document.getElementById("orientation").innerHTML = "Données d'orientation non disponibles.";
                    return;
                }

                // Conversion de l'alpha en orientation vers le nord
                const direction = getDirection(alpha);

                // Affichage de la direction
                document.getElementById("orientation").innerHTML = 
                    `Orientation vers le Nord : ${Math.round(alpha)}° (Direction : ${direction})`;
            });
        }

        // Fonction pour déterminer la direction (Nord, Est, Sud, Ouest) en fonction de l'alpha
        function getDirection(alpha) {
            if (alpha >= 0 && alpha < 45) {
                return "Nord";
            } else if (alpha >= 45 && alpha < 135) {
                return "Est";
            } else if (alpha >= 135 && alpha < 225) {
                return "Sud";
            } else if (alpha >= 225 && alpha < 315) {
                return "Ouest";
            } else {
                return "Nord";
            }
        }

        // Écouter le clic sur le bouton pour démarrer le suivi de l'orientation
        document.getElementById("startTrackingBtn").addEventListener("click", startOrientationTracking);


    