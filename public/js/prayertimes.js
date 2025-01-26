function getInputValue() {
    const inputValue = document.getElementById('cityInput').value;
    
    fetch(`/api/data?input=${encodeURIComponent(inputValue)}`)
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
            document.getElementById("date").textContent = data_.date_for
            document.getElementById("city").textContent = inputValue
            prayers.forEach(prayer => {
                const prayerText = `${prayer.name}: ${data_[prayer.key]}`;
                document.getElementById(prayer.key).textContent = prayerText;
            });
        })
}