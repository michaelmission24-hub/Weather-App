const apiKey = "6bd81109c04b4c25845150642252712";

const weatherIcons = {
    'Clear': 'fa-sun',
    'Sunny': 'fa-sun',
    'Partly cloudy': 'fa-cloud-sun',
    'Cloudy': 'fa-cloud',
    'Overcast': 'fa-cloud',
    'Mist': 'fa-smog',
    'Patchy rain nearby': 'fa-cloud-showers-heavy',
    'Light rain': 'fa-cloud-rain',
    'Rain': 'fa-cloud-showers-heavy',
    'Thunderstorm': 'fa-bolt',
    'Snow': 'fa-snowflake'
};

function fetchWeather(city) {
    $.ajax({
        url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`,
        success: (data) => { 
            $('#error-msg').hide();
            updateDisplay(data);
            
            const condition = data.current.condition.text;
            updateBackground(condition);
            createWeatherEffects(condition);
        },
        error: () => $('#error-msg').fadeIn() 
    });
}

function updateDisplay(data) {
    const { name, localtime_epoch } = data.location;
    const { text } = data.current.condition;
    const { temp_c, humidity, wind_kph, wind_dir,wind_degree } = data.current;

    $('#city').text(name);
    $('#description').text(text);
    $('#temp_c').text(temp_c + "°C");
    $('#humidity_val').text(humidity + "%");
    $('#wind_val').text(wind_kph + " kmh");
    $('#wind_dir').text(wind_dir);

    if (wind_degree !== undefined) {
        const rotation = wind_degree - 45; 
        $('#wind-arrow').css('transform', `rotate(${rotation}deg)`);
    };

    
    const iconClass = weatherIcons[text] || 'fa-cloud';
    $('.weather-icon').attr('class', `weather-icon fas ${iconClass}`);

    
    const date = new Date(localtime_epoch * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    $('#date-time').text(date.toLocaleString('en-IN', options));
}

function updateBackground(condition) {
    
    const colors = {
        'Clear': ['#FFD700', '#FF8C00'],
        'Sunny': ['#FFD700', '#FF8C00'],
        'Cloudy': ['#7F7FD5', '#86A8E7'],
        'Overcast': ['#7F7FD5', '#86A8E7'],
        'Rain': ['#005C97', '#363795'],
        'Light rain': ['#005C97', '#363795'],
        'default': ['#606C88', '#3F4C6B']
    };

    const grad = colors[condition] || colors['default'];
    $('body').css('background', `linear-gradient(45deg, ${grad[0]}, ${grad[1]})`);
}


function createWeatherEffects(condition) {
    const effects = $('#weather-effects');
    effects.empty();
    
    
    const particles = {
        'Clear': { icon: 'sun', count: 3 },
        'Rain': { icon: 'tint', count: 20 },
        'Light rain': { icon: 'tint', count: 15 },
        'Snow': { icon: 'snowflake', count: 15 }
    };

    const config = particles[condition] || { icon: 'circle', count: 5 };

    for (let i = 0; i < config.count; i++) {
        const p = $('<i>').addClass(`fas fa-${config.icon} weather-particle`);
        p.css({
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            fontSize: Math.random() * 20 + 10 + 'px',
            animationDelay: Math.random() * 5 + 's',
            position: 'absolute'
        });
        effects.append(p);
    }
}

$(document).ready(() => {
    fetchWeather('Abeokuta');

    $('#search-btn').click(() => {
        const city = $('#city-input').val();
        if (city) fetchWeather(city);
    });
    $('#city-input').on('keypress', function (e) {
        if (e.which === 13) { 
            $('#search-btn').click(); 
        }
    });
});