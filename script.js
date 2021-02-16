const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
    const currentArray = (page === 'results') ? resultsArray : Object.values(favorites);
    currentArray.forEach((result) => {
        // Card Element
        const card = document.createElement('div');
        card.classList.add('card');
        // Link for image
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Size Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        link.appendChild(image);
        // Body
        const body = document.createElement('div');
        body.classList.add('card-body');
        // Card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // Add to favorite
        const addToFav = document.createElement('p');
        addToFav.classList.add('clickable');
        if (page === 'results') {
            addToFav.textContent = 'Add to Favorites';
            addToFav.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addToFav.textContent = 'Remove Favorite';
            addToFav.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card text
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Muted text at the bottom
        const smallEl = document.createElement('small');
        smallEl.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyright = document.createElement('span');
        copyright.textContent = (result.copyright) ? ` ${result.copyright}` : '';
        smallEl.append(date, copyright);
        body.append(cardTitle, addToFav, cardText, smallEl);
        // Append
        card.append(link, body);
        imagesContainer.appendChild(card);
    })
}

function updateDOM(page) {
    if (page === 'favorites') {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    // Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    window.scrollTo({top: 0, behavior: 'auto'})
    loader.classList.add('hidden')
}

// Get 10 Images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden')
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');
    } catch (error) {
        // Catch errror here
        console.log(error);
    }
}

// Add result to Favorite
function saveFavorite(itemUrl) {
    // Loop through Results Array to select Favorite to save
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            // Show Save Confirmation for 2 seconds
            saveConfirmed.classList.remove('hidden');
            setTimeout(() => {
                saveConfirmed.classList.add('hidden');
            }, 2000);
        }
    });
}

// Remove favorites from Local Storage
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Set Favorites in localStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// On Load
getNasaPictures();