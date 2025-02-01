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

    async function requestPermission() {
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    console.log("Permission accordée !");
                    startOrientationTracking();
                } else {
                    console.log("Permission refusée.");
                }
            } catch (error) {
                console.error("Erreur lors de la demande de permission :", error);
            }
        } else {
            console.log("L'API DeviceOrientation est directement accessible.");
            startOrientationTracking();
        }
    }

let initialAlpha = null; // Stocker l'orientation initiale

function startOrientationTracking() {
    if (!window.DeviceOrientationEvent) {
        console.warn("L'orientation de l'appareil n'est pas supportée sur ce navigateur.");
        document.getElementById("orientation").innerHTML = "❌ Orientation non supportée.";
        return;
    }

    window.addEventListener("deviceorientation", function(event) {
        if (event.alpha === null || event.beta === null || event.gamma === null) {
            console.warn("Données d'orientation non disponibles.");
            document.getElementById("orientation").innerHTML = "⚠️ Données non disponibles.";
            return;
        }

        // Définir l'alpha initial lors de la première détection
        if (initialAlpha === null) {
            initialAlpha = event.alpha;
        }

        // Calculer la rotation par rapport à l'orientation initiale
        const alpha = Math.round(event.alpha - initialAlpha);
        const beta = Math.round(event.beta);
        const gamma = Math.round(event.gamma);

        console.log(`Alpha (Z) : ${alpha}, Beta (X) : ${beta}, Gamma (Y) : ${gamma}`);

        document.getElementById("orientation").innerHTML = 
            `📍 Alpha (Z) : ${alpha}° (par rapport au départ)<br>
             🔄 Beta (X) : ${beta}°<br>
             ↔️ Gamma (Y) : ${gamma}°`;
    });
}

    