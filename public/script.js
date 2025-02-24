document.getElementById('search-btn').addEventListener('click', async () => {
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Введите название города!');
        return;
    }

    try {
        const weatherResponse = await fetch(`/api/weather?city=${city}`);
        if (!weatherResponse.ok) throw new Error('Город не найден');

        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        const alertsResponse = await fetch(`/api/weather/alerts?city=${city}`);
        const alertsData = await alertsResponse.json();
        displayAlerts(alertsData);

        displayMap(weatherData.coordinates.latitude, weatherData.coordinates.longitude);
    } catch (error) {
        alert(error.message);
    }
});

function displayWeather(data) {
    const weatherInfo = `
        <h2>${data.city}, ${data.country} <img src="https://flagsapi.com/${data.country}/flat/64.png" alt="Flag"></h2>
        <p>Температура: ${data.temperature}°C</p>
        <p>Ощущается как: ${data.feels_like}°C</p>
        <p>Описание: ${data.description}</p>
        <p>Влажность: ${data.humidity}%</p>
        <p>Давление: ${data.pressure} hPa</p>
        <p>Скорость ветра: ${data.wind_speed} м/с</p>
        <p><strong>Качество воздуха (AQI):</strong> ${data.aqi} (${data.aqi_category})</p>
        <img src="${data.icon}" alt="Погодная иконка">
    `;

    document.getElementById('weather-info').innerHTML = weatherInfo;
}

function displayAlerts(alerts) {
    const alertsContainer = document.getElementById('alerts-info');
    alertsContainer.innerHTML = '';

    if (alerts.length > 0) {
        alerts.forEach(alert => {
            const alertDiv = document.createElement('div');
            alertDiv.classList.add('alert');
            alertDiv.innerHTML = `
                <h3>${alert.event}</h3>
                <p>${alert.description}</p>
            `;
            alertsContainer.appendChild(alertDiv);
        });
    } else {
        alertsContainer.innerHTML = '<p>Нет предупреждений для этого города.</p>';
    }
}

function displayMap(lat, lon) {
    const map = document.getElementById('map');
    map.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.google.com/maps?q=${lat},${lon}&z=10&output=embed`;
    iframe.width = '100%';
    iframe.height = '400px';
    iframe.style.border = 'none';
    map.appendChild(iframe);
}
