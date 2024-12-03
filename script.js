const apiKey = '373e220201fd62a688b8d6071d24b6b4'; // Replace with your OpenWeatherMap API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

async function getWeather() {
    const city = document.getElementById('city-input').value;
    const url = `${apiUrl}?q=${city}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {
        // Show weather details container once the data is received
        document.getElementById('weather-details').style.visibility = 'visible';
        showCurrentWeather(data);
        showForecast(data);
        createCharts(data);
    } else {
        alert("City not found!");
    }
}

function showCurrentWeather(data) {
    const cityName = data.city.name;
    const currentWeather = data.list[0];

    document.getElementById('city-name').textContent = cityName;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
    document.getElementById('description').textContent = currentWeather.weather[0].description;
    document.getElementById('temp').textContent = currentWeather.main.temp;
    document.getElementById('temp-max').textContent = currentWeather.main.temp_max;
    document.getElementById('temp-min').textContent = currentWeather.main.temp_min;
    document.getElementById('wind-speed').textContent = currentWeather.wind.speed;
    document.getElementById('humidity').textContent = currentWeather.main.humidity;
    document.getElementById('precipitation').textContent = currentWeather.rain ? currentWeather.rain['3h'] : '0';
}

function showForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Clear the container
    
    // Filter data for every 24 hours (forecast every 3 hours)
    const dailyData = data.list.filter((item, index) => index % 8 === 0);
    
    dailyData.forEach(day => {
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');

        const date = new Date(day.dt_txt).toLocaleDateString();
        const icon = day.weather[0].icon;
        const tempMax = day.main.temp_max;
        const tempMin = day.main.temp_min;
        
        forecastDay.innerHTML = `
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
            <p>Max: ${tempMax}°C</p>
            <p>Min: ${tempMin}°C</p>
        `;
        forecastContainer.appendChild(forecastDay);
    });
}

function createCharts(data) {
    const labels = [];
    const tempData = [];
    const humidityData = [];
    const precipitationData = [];
    const windSpeedData = [];

    // Process the data to extract required values
    data.list.forEach((entry, index) => {
        if (index % 8 === 0) {
            labels.push(new Date(entry.dt_txt).toLocaleDateString());
            tempData.push(entry.main.temp);
            humidityData.push(entry.main.humidity);
            precipitationData.push(entry.rain ? entry.rain['3h'] : 0);
            windSpeedData.push(entry.wind.speed);
        }
    });

    // Temperature chart
    const tempChart = new Chart(document.getElementById('tempChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: tempData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            }]
        }
    });

    // Humidity chart
    const humidityChart = new Chart(document.getElementById('humidityChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Humidity (%)',
                data: humidityData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
            }]
        }
    });

    // Precipitation chart
    const precipitationChart = new Chart(document.getElementById('precipitationChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precipitation (mm)',
                data: precipitationData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        }
    });

    // Wind speed chart
    const windSpeedChart = new Chart(document.getElementById('windSpeedChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Wind Speed (m/s)',
                data: windSpeedData,
                borderColor: 'rgba(153, 102, 255, 1)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
            }]
        }
    });

    // Activate the temperature chart by default
    openTab(event, 'tempChartTab');
}

// Tab functionality to switch between charts
function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";  
    }

    // Remove the "active" class from all tab links
    const tabLinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";  
    evt.currentTarget.className += " active";
}
