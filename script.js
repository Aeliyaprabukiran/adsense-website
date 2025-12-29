// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }
}

// Price Dashboard Functions
const priceCache = {};
const cacheDuration = 5 * 60 * 1000; // 5 minutes

function refreshPrices() {
    const goldPrice = document.getElementById('gold-price');
    const silverPrice = document.getElementById('silver-price');
    const usdPrice = document.getElementById('usd-price');
    
    // Show loading state
    goldPrice.textContent = 'Loading...';
    silverPrice.textContent = 'Loading...';
    usdPrice.textContent = 'Loading...';
    
    // Fetch prices from APIs
    Promise.all([
        fetchGoldPrice(),
        fetchSilverPrice(),
        fetchUSDtoINR()
    ]).then(([gold, silver, usd]) => {
        goldPrice.textContent = '₹' + gold.toFixed(2) + '/g';
        silverPrice.textContent = '₹' + silver.toFixed(2) + '/g';
        usdPrice.textContent = '₹' + usd.toFixed(2);
    }).catch(error => {
        console.log('Using mock prices due to:', error);
        goldPrice.textContent = '₹6,500/g';
        silverPrice.textContent = '₹75/g';
        usdPrice.textContent = '₹83.50';
    });
}

function fetchGoldPrice() {
    // Using mock API data or real API
    // Replace with actual API call
    return Promise.resolve(6500 + Math.random() * 100);
}

function fetchSilverPrice() {
    // Using mock API data or real API
    return Promise.resolve(75 + Math.random() * 5);
}

function fetchUSDtoINR() {
    // Using mock API data or real API
    return Promise.resolve(83.50 + Math.random() * 0.5);
}

// Instagram Reel Caption Generator
const captions = {
    fitness: [
        "Transform your body, transform your life. No excuses, just results! 💪",
        "Consistency is the key to success. Keep pushing! 🏋️",
        "Your body can do it. Your mind needs to believe it. 🔥",
        "Pain is weakness leaving the body. Let's go! 💥",
        "Stronger than yesterday, weaker than tomorrow. Keep grinding! 🚀",
        "Your future self will thank you for this workout. 🙌",
        "It's a lifestyle, not just a workout. Own it! 💪",
        "Progress over perfection. Every rep counts! 💯"
    ],
    couple: [
        "Us against the world. Forever & always. 💕",
        "Love is not about finding someone perfect, it's about finding someone perfect for you. 💑",
        "You're my favorite notification. 📱💕",
        "Life was meant for good friends and great adventures. With you, both. 🌟",
        "We go together like coffee and mornings. 😍☕",
        "Soulmate? Nah, I call him my favorite person. 💕",
        "All you need is love. And maybe pizza. 🍕💕",
        "Love of my life right here. 👰💍"
    ],
    motivation: [
        "Your limitation, it's only your imagination. Push beyond! 🚀",
        "Don't wait for the perfect moment, take the moment and make it perfect. 💪",
        "Success is not final, failure is not fatal. Keep moving! 🎯",
        "Dream big, work hard, stay focused. 🌟",
        "You don't have to see the whole staircase, just take the first step. 👣",
        "The only way to do great work is to love what you do. 💯",
        "Your only limit is you. Break free! 🔥",
        "Rise and grind. Success is coming! 💼🌟"
    ],
    travel: [
        "Adventure awaits. Let's go explore! ✈️🌍",
        "Collect moments, not things. 📸✨",
        "Travel is the only thing you buy that makes you richer. 💎",
        "Leave only footprints, take only memories. 👣📷",
        "Wander often, wonder always. 🗺️",
        "The world is a book, and those who do not travel read only one page. 📖✈️",
        "Passport: Stamps in it. Memories: Priceless. 🧳💕",
        "Not all those who wander are lost. 🌏🎒"
    ],
    funny: [
        "I'm not lazy, I'm just on energy-saving mode. 😴",
        "Me trying to be productive on a Monday. 😂",
        "Coffee: because adulting is hard. ☕😂",
        "I'm not arguing, I'm just explaining why I'm right. 🤷",
        "Relationships are like a walk in the park. Jurassic Park. 😂",
        "I can't remember if I'm coming or going. Where am I? 🤪",
        "My bed is a magical place. I suddenly remember everything I forgot to do. 🛏️",
        "Is it too late to return this personality? Asking for a friend. 😂"
    ],
    business: [
        "Work hard in silence, let success make the noise. 💼💯",
        "Your net worth grows when your self-worth grows. 📈",
        "Make it happen. Shock everyone. 🚀",
        "Success is a journey, not a destination. Keep going! 🎯",
        "Small progress is still progress. Keep building! 🏗️",
        "Dream it, believe it, build it. 💪🌟",
        "Hustle like you're broke. Dream like you're rich. 💸",
        "Your network is your net worth. Build connections! 🤝"
    ],
    general: [
        "Living my best life, one day at a time. ✨",
        "Life is too short for negative vibes. Stay positive! 🌞",
        "Be yourself; everyone else is already taken. 🎭",
        "Doing the best I can with what I have. 💪",
        "Grateful for another day on this beautiful earth. 🙏",
        "Keep smiling, it looks good on you. 😊",
        "Making memories and living life to the fullest. 📸",
        "Here's to new adventures and endless possibilities. 🌈"
    ]
};

const hashtags = {
    fitness: ['#fitnessgoals', '#gymlife', '#fitnessmotivation', '#bodygoals', '#workoutoftheday', '#fitfam', '#gains', '#healthylifestyle', '#fitnessjunkie', '#nofats', '#fitnessblogger', '#personaltrainer', '#cardio', '#weights', '#fitnesscommunity', '#fitlifestyle', '#bodytransformation', '#fitandstrong', '#fitnesschallenge', '#dedication', '#motivation', '#fitnessinspiration', '#trainhard', '#stayfocused', '#nutrition'],
    couple: ['#couplegoals', '#relationshipgoals', '#couples', '#coupleoftheday', '#lovemypartner', '#soulmatesfound', '#loveislove', '#partnership', '#togetherforever', '#ourlove', '#couplequote', '#relationshipnotes', '#wifey', '#husbandmaterial', '#bestpartner', '#truelove', '#coupleselfie', '#matchmade', '#foreverlove', '#togetherness', '#couplemode', '#ourjourney', '#loveofmylife', '#itsus'],
    motivation: ['#motivation', '#motivational', '#motivationmonday', '#motivated', '#motivationquotes', '#motivationalquotes', '#motivator', '#successmotivation', '#fitnessmotivation', '#youcandidit', '#nevergiveup', '#fightforyourdreams', '#believeinyourself', '#keepgoing', '#pushforward', '#thinkbig', '#goaloriented', '#successiscoming', '#workhard', '#staymotivated', '#inspirationalquotes', '#dailyinspiration', '#mindsetmatters', '#chasingdreams'],
    travel: ['#travel', '#travelgram', '#wanderlust', '#adventure', '#explore', '#traveldiaries', '#passportready', '#travelinspiration', '#travelphoto', '#aroundtheworld', '#globetrotter', '#backpacker', '#tourist', '#seetheworld', '#travelbugbite', '#exploremore', '#adventuretime', '#travelgoals', '#bucketlist', '#getaway', '#vacation', '#nomad', '#travelstories', '#journeys', '#bestplaces'],
    funny: ['#funny', '#hilarious', '#comedy', '#lol', '#haha', '#funnymemes', '#laughing', '#laughoutloud', '#meme', '#memequeen', '#humorous', '#comedypost', '#laughinghard', '#sarcasm', '#witty', '#funnyposts', '#darkhumor', '#standup', '#jokes', '#laughlikecrazy', '#comedyshow', '#ridiculousmemes', '#hilariousmemes', '#funnyvideos'],
    business: ['#business', '#entrepreneur', '#businessmotivation', '#entrepreneurship', '#startup', '#hustle', '#success', '#businessgoals', '#smallbusiness', '#businessowner', '#marketingdigital', '#businesstips', '#networking', '#leadgeneration', '#sales', '#corporate', '#leadership', '#businessplan', '#revenue', '#profit', '#growth', '#expansion', '#strategies', '#businesssuccess', '#workhard'],
    general: ['#insta', '#instagood', '#instagram', '#photooftheday', '#picoftheday', '#instalike', '#instadaily', '#beautiful', '#happy', '#life', '#lifestyle', '#living', '#amazing', '#goodvibes', '#vibes', '#happy', '#smile', '#motivation', '#inspiration', '#goals', '#quotes', '#instamood', '#love', '#life']
};

function generateCaption() {
    const topic = document.getElementById('topic').value.trim();
    const reelType = document.getElementById('reel-type').value;
    
    if (!topic) {
        alert('Please enter a topic or description.');
        return;
    }
    
    // Get captions for the selected type
    const selectedCaptions = captions[reelType] || captions.general;
    const selectedHashtags = hashtags[reelType] || hashtags.general;
    
    // Shuffle and select random captions and hashtags
    const randomCaptions = getRandomItems(selectedCaptions, 5);
    const randomHashtags = getRandomItems(selectedHashtags, 25);
    
    // Display results
    displayResults(randomCaptions, randomHashtags);
}

function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayResults(captionsArray, hashtagsArray) {
    const resultContainer = document.getElementById('caption-result');
    const captionsList = document.getElementById('captions-list');
    const hashtagsList = document.getElementById('hashtags-list');
    
    // Clear previous results
    captionsList.innerHTML = '';
    hashtagsList.innerHTML = '';
    
    // Display captions
    captionsArray.forEach((caption, index) => {
        const captionDiv = document.createElement('div');
        captionDiv.className = 'caption-item';
        captionDiv.textContent = (index + 1) + '. ' + caption;
        captionDiv.onclick = () => copyToClipboard(caption);
        captionsList.appendChild(captionDiv);
    });
    
    // Display hashtags
    hashtagsArray.forEach((hashtag, index) => {
        const hashtagDiv = document.createElement('div');
        hashtagDiv.className = 'hashtag-item';
        hashtagDiv.textContent = (index + 1) + '. ' + hashtag;
        hashtagDiv.onclick = () => copyToClipboard(hashtag);
        hashtagsList.appendChild(hashtagDiv);
    });
    
    // Show results container
    resultContainer.classList.remove('hidden');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load initial prices
    refreshPrices();
    
    // Show home section by default
    showSection('home');
});

// Auto-refresh prices every 5 minutes
setInterval(refreshPrices, 5 * 60 * 1000);

// BMI CALCULATOR FUNCTIONS
function calculateBMI() {
    const heightInput = document.getElementById('height-input').value;
    const weightInput = document.getElementById('weight-input').value;
    
    if (!heightInput || !weightInput) {
        alert('Please enter both height and weight');
        return;
    }
    
    const height = parseFloat(heightInput) / 100; // Convert cm to meters
    const weight = parseFloat(weightInput);
    
    // BMI Formula: weight (kg) / (height (m))^2
    const bmi = weight / (height * height);
    
    // Determine category
    let category = '';
    let recommendations = '';
    
    if (bmi < 18.5) {
        category = 'Underweight';
        recommendations = '<h4>Recommendations for Underweight:</h4><ul><li>Increase daily calorie intake</li><li>Eat nutrient-rich foods</li><li>Include healthy proteins and fats</li><li>Consult a healthcare provider</li></ul>';
    } else if (bmi >= 18.5 && bmi < 25) {
        category = 'Normal Weight';
        recommendations = '<h4>You are in a healthy weight range!</h4><ul><li>Maintain regular exercise</li><li>Eat balanced meals</li><li>Stay hydrated</li><li>Get adequate sleep</li></ul>';
    } else if (bmi >= 25 && bmi < 30) {
        category = 'Overweight';
        recommendations = '<h4>Recommendations for Overweight:</h4><ul><li>Start regular exercise routine</li><li>Monitor calorie intake</li><li>Increase fruit and vegetable consumption</li><li>Reduce sugary drinks</li></ul>';
    } else {
        category = 'Obese';
        recommendations = '<h4>Recommendations for Obesity:</h4><ul><li>Consult a healthcare provider</li><li>Start a structured exercise program</li><li>Adopt a balanced diet</li><li>Monitor weight regularly</li></ul>';
    }
    
    // Display results
    const resultContainer = document.getElementById('bmi-result');
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    const healthRecs = document.getElementById('health-recommendations');
    
    bmiValue.textContent = bmi.toFixed(1);
    bmiCategory.textContent = category;
    healthRecs.innerHTML = recommendations;
    
    resultContainer.classList.remove('hidden');
}
