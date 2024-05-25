// Function to fetch data from the API
async function fetchData() {
    const url = "https://api.weather.gov/alerts?active=true&status=actual&message_type=alert&code=TOR,SVR&region_type=land&urgency=Immediate,Expected,Future,Past&severity=Extreme,Severe,Moderate&certainty=Observed,Likely,Possible&limit=500";

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Data:', data); // Log the API response for debugging

        // Ensure data.features exists and is an array
        if (Array.isArray(data.features)) {
            return data.features.map(alert => ({ 
                event: alert.properties.event, 
                description: alert.properties.areaDesc // Use the correct field name
            }));
        } else {
            console.error('Unexpected API response structure:', data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Function to display alerts in a crawling manner
async function displayAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    const alerts = await fetchData();
    console.log('Alerts:', alerts); // Log the fetched alerts for debugging

    if (alerts.length > 0) {
        alertsContainer.innerHTML = `<div class="alert-text">${alerts.map(alert => `${alert.event}: ${alert.description}`).join(' | ')}</div>`;
    } else {
        alertsContainer.textContent = "No alerts available";
    }
}

// Start displaying alerts
displayAlerts();
