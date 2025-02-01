fetch('/api/loc')
    .then(response => response.json())
    .then(dataloc => {
        document.getElementById("city").textContent = "Ville: " + dataloc.city

        fetch(`/api/data?input=${encodeURIComponent(dataloc.city)}`)
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
        const location = dataloc.loc.split(",")
        fetch(`https://api.aladhan.com/v1/qibla/${location[0]}/${location[1]}`)
        .then(response => response.json())
        .then(data => {
            const direction = Math.round(data.data.direction)

            document.getElementById("direction").textContent = "Direction: " + direction + "°";
        })

    })