// Function to fetch data from the API and update the crawl
async function updateCrawl() {
    const alertsContainer = document.getElementById('alerts-container');
    const alerts = await fetchData();
    console.log('Alerts:', alerts); // Log the fetched alerts for debugging

    if (alerts.length > 0) {
        alertsContainer.innerHTML = `<div class="alert-text">${alerts.map(alert => `${alert.event}: ${alert.description}`).join(' | ')}</div>`;
    } else {
        alertsContainer.textContent = "No alerts available";
    }
}

// Function to fetch data from the API
async function fetchAlerts() {
    try {
        const response = await fetch('https://api.weather.gov/alerts?active=true&status=actual&message_type=alert&code=TOR,SVR&region_type=land&urgency=Immediate,Expected,Future,Past&severity=Extreme,Severe,Moderate&certainty=Observed,Likely,Possible&limit=500');
        const data = await response.json();
        return data.features.map(alert => `${alert.properties.event}: ${alert.properties.areaDesc}`).join(' | ');
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return 'Unable to fetch alerts at this time.';
    }
}

async function updateCrawl() {
    const crawlTextElement = document.getElementById('crawl-text');
    const alerts = await fetchAlerts();
    crawlTextElement.innerHTML = alerts;
    
    // Calculate animation duration based on content length
    const textLength = crawlTextElement.offsetWidth;
    const containerWidth = document.querySelector('.crawl-container').offsetWidth;
    const duration = (textLength + containerWidth) / 100; // Adjust the divisor to control speed
    crawlTextElement.style.animationDuration = `${duration}s`;
}

// Initial load
updateCrawl();

// Update every 60 seconds
setInterval(updateCrawl, 60000);

