async function fetchAlerts() {
    try {
        const response = await fetch('https://api.weather.gov/alerts/active.atom');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
        const entries = Array.from(xmlDoc.getElementsByTagName('entry'));
        return entries.map(entry => {
            return {
                event: entry.querySelector('cap\\:event, event').textContent.trim(),
                areaDesc: entry.querySelector('cap\\:areaDesc, areaDesc').textContent.trim()
            };
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
    }
}

async function updateCrawlAndCount() {
    const crawlTextElement = document.getElementById('crawl-text');
    const severeCountElement = document.getElementById('severe-count');
    const tornadoCountElement = document.getElementById('tornado-count');
    
    const alerts = await fetchAlerts();

    // Filter alerts for Severe Thunderstorm Warning and Tornado Warning
    const filteredAlerts = alerts.filter(alert => {
        const event = alert.event.toLowerCase();
        return event.includes('severe thunderstorm warning') || event.includes('tornado warning');
    });

    // Update the crawl text
    const crawlText = filteredAlerts.map(alert => `${alert.event}: ${alert.areaDesc}`).join(' | ');
    crawlTextElement.textContent = crawlText;

    // Update counts
    let severeCount = 0;
    let tornadoCount = 0;

    filteredAlerts.forEach(alert => {
        const event = alert.event.toLowerCase();
        if (event.includes('severe thunderstorm warning')) {
            severeCount++;
        }
        if (event.includes('tornado warning')) {
            tornadoCount++;
        }
    });

    // Update count elements
    severeCountElement.textContent = severeCount;
    tornadoCountElement.textContent = tornadoCount;

    // Flash animation for count update
    flashWarningCount(severeCountElement.parentElement, 'severe');
    flashWarningCount(tornadoCountElement.parentElement, 'tornado');

    // Calculate animation duration based on content length
    const textLength = crawlTextElement.offsetWidth;
    const containerWidth = document.querySelector('.crawl-container').offsetWidth;
    const duration = (textLength + containerWidth) / 100; // Adjust the divisor to control speed
    crawlTextElement.style.animation = `crawl ${duration}s linear infinite`;

    // Keyframes with dynamic duration
    const styleSheet = document.styleSheets[0];
    // Remove any existing keyframes
    for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        if (styleSheet.cssRules[i].name === 'crawl') {
            styleSheet.deleteRule(i);
        }
    }
    // Add new keyframes
    styleSheet.insertRule(`
        @keyframes crawl {
            0% {
                transform: translateX(${containerWidth}px);
            }
            100% {
                transform: translateX(-${textLength}px);
            }
        }
    `, styleSheet.cssRules.length);
}

let prevSevereCount = 0;
let prevTornadoCount = 0;

function flashWarningCount(element, type, currentCount) {
    if (type === 'severe') {
        if (currentCount !== prevSevereCount) {
            prevSevereCount = currentCount;
            element.classList.add('flash-severe'); // Add class to trigger animation
            setTimeout(() => element.classList.remove('flash-severe'), 50); // Remove class after slight delay
            setTimeout(() => element.classList.add('flash-severe'), 100); // Re-add class for animation restart
            setTimeout(() => element.classList.remove('flash-severe'), 7050); // Remove class after 7 seconds
        }
    } else if (type === 'tornado') {
        if (currentCount !== prevTornadoCount) {
            prevTornadoCount = currentCount;
            element.classList.add('flash-tornado'); // Add class to trigger animation
            setTimeout(() => element.classList.remove('flash-tornado'), 50); // Remove class after slight delay
            setTimeout(() => element.classList.add('flash-tornado'), 100); // Re-add class for animation restart
            setTimeout(() => element.classList.remove('flash-tornado'), 7050); // Remove class after 7 seconds
        }
    }
}





// Initial load
updateCrawlAndCount();

// Update every 60 seconds
setInterval(updateCrawlAndCount, 60000);
