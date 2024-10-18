const phoneListElement = document.getElementById('phone-list');
const loadingElement = document.getElementById('loading');

let currentPage = 0;
const itemsPerPage = 8; // Changed to load 8 items by default
let isLoading = false;

// Correct Spreadsheet ID, Sheet Name, and API Key
const SPREADSHEET_ID = '13T6APiYgxWArir_vI-wC47R29S6LFmTE7gexR2gbO5g';
const SHEET_NAME = 'Sheet1'; // Correct sheet name
const API_KEY = 'AIzaSyDAHIYb0E5sdSMctYFjGhH_kqk-6jAr0s0';

// Specify range explicitly (assuming data is in columns A to Z)
const apiURL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:Z?key=${API_KEY}`;

let phonesData = [];  // To store all the phone data fetched

// Fetch data from Google Sheets
async function fetchPhonesFromSheets() {
    try {
        console.log("Fetching data from Google Sheets...");
        const response = await fetch(apiURL);
        console.log("Response received: ", response);

        if (!response.ok) {
            console.error("Error fetching data: ", response.statusText);
            return [];
        }

        const data = await response.json();
        console.log("Data fetched successfully: ", data);
        phonesData = data.values; // Store fetched data in global array
        return phonesData;
    } catch (error) {
        console.error('Error fetching data from Google Sheets:', error);
        return [];
    }
}

// Function to append phones to the DOM
function appendPhones(startIndex, endIndex) {
    const phonesToShow = phonesData.slice(startIndex, endIndex);

    phonesToShow.forEach((phoneData) => {
        const [name, version, price, imageUrl] = phoneData;
        const phoneItem = document.createElement('div');
        phoneItem.classList.add('phone-item');
        phoneItem.innerHTML = `
            <img src="${imageUrl}" alt="${name}" class="phone-image">
            <div class="phone-details">
                <h3>${name} ${version}</h3>
                <p>Price: ${price}</p>
            </div>
        `;
        phoneListElement.appendChild(phoneItem);
    });
}

// Load phones for the current page
async function loadPhones() {
    if (isLoading) return;
    isLoading = true;
    loadingElement.style.display = 'block';

    // Fetch data only if not already loaded
    if (phonesData.length === 0) {
        await fetchPhonesFromSheets();
    }

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;

    appendPhones(start, end);

    currentPage++;
    isLoading = false;
    loadingElement.style.display = 'none';

    // Check if there's more data to load
    if (phonesData.length <= currentPage * itemsPerPage) {
        window.removeEventListener('scroll', handleScroll); // Remove scroll listener if no more data
        loadingElement.style.display = 'none'; // Hide the loading element when all data is loaded
    }
}

// Scroll Event Listener
function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !isLoading) {
        loadPhones();
    }
}

// Infinite Scroll Logic
window.addEventListener('scroll', handleScroll);

// Initial load with 8 items
loadPhones();