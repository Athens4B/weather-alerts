// Function to fetch data from the API
async function fetchData() {
    const url = "https://api.weather.gov/alerts?active=true&status=actual&message_type=alert&code=TOR,SVR&region_type=land&urgency=Immediate,Expected,Future,Past&severity=Extreme,Severe,Moderate&certainty=Observed,Likely,Possible&limit=500";

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.features.map(alert => ({ event: alert.properties.event, description: alert.properties.areasDesc }));
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

// Function to display alerts in a crawling manner
async function displayAlerts() {
    const alertsContainer = document.getElementById('alerts-container');
    const alerts = await fetchData();

    let index = 0;
    setInterval(() => {
        if (alerts.length > 0) {
            alertsContainer.textContent = `${alerts[index].event}: ${alerts[index].description}`;
            index = (index + 1) % alerts.length;
        } else {
            alertsContainer.textContent = "No alerts available";
        }
    }, 5000); // Change this value to adjust the speed of crawling
}

// Start displaying alerts
displayAlerts();
