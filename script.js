const apiKey = '3fd2be6f0c70a2a598f084ddfb75487c';

const apiUrl = `https://api.themoviedb.org/3`;

let currentPage = 1;

const recentMoviesContainer = document.getElementById('recent-movies-container');

const popularMoviesContainer = document.getElementById('popular-movies-container');

const allMoviesContainer = document.getElementById('all-movies-container');

const nextButton = document.getElementById('next-btn');

const prevButton = document.getElementById('prev-btn');

const moviePreviewContainer = document.getElementById('movie-preview-container');

const searchBar = document.getElementById('search-bar');

const searchButton = document.getElementById('search-btn');

// Modal Elements

const modal = document.getElementById("movieModal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");

const modalDescription = document.getElementById("modalDescription");

const modalDate = document.getElementById("modalDate");

const modalGenre = document.getElementById("modalGenre");

const modalRating = document.getElementById("modalRating");

const closeBtn = document.querySelector(".close-btn"); // Close button

// Store genres globally

let genres = {};

// Fetch and store genres list

async function fetchGenres() {

    const response = await fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}`);

    const data = await response.json();

    data.genres.forEach(genre => {

        genres[genre.id] = genre.name;

    });

}

// Function to open the modal and populate with details

function openModal(movie) {

    modalImage.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

    modalTitle.innerText = movie.title;

    modalDescription.innerText = movie.overview;

    modalDate.innerText = movie.release_date;

    modalGenre.innerText = movie.genre_ids.map(id => genres[id]).join(", ");

    modalRating.innerText = movie.vote_average;

    modal.style.display = "flex"; // Show the modal

}

// Close modal when clicking outside

window.onclick = function(event) {

    if (event.target == modal) {

        modal.style.display = "none"; // Hide the modal when clicking outside

    }

}

// Close modal when clicking the close button (x)

closeBtn.onclick = function() {

    modal.style.display = "none"; // Hide the modal when the close button is clicked

}

// Fetch movies from API

async function fetchMovies(section, page = 1) {

    const url = `${apiUrl}/movie/${section}?api_key=${apiKey}&page=${page}`;

    const response = await fetch(url);

    const data = await response.json();

    return data.results;

}

// Display Recent Movies

async function displayRecentMovies() {

    const movies = await fetchMovies('now_playing', 1);

    movies.slice(0, 6).forEach(movie => {

        const card = createMovieCard(movie);

        recentMoviesContainer.appendChild(card);

    });

}

// Display Popular Movies

async function displayPopularMovies() {

    const movies = await fetchMovies('popular', 1);

    movies.slice(0, 10).forEach(movie => {

        const card = createMovieCard(movie);

        popularMoviesContainer.appendChild(card);

    });

}

// Display All Movies with pagination

async function displayAllMovies(page = 1) {

    const movies = await fetchMovies('popular', page);

    allMoviesContainer.innerHTML = ''; // Clear the container before adding new cards

    movies.slice(0, 20).forEach(movie => {

        const card = createMovieCard(movie, true);

        allMoviesContainer.appendChild(card);

    });

}

// Create Movie Card with Click Event to Open Modal

function createMovieCard(movie, isAllMovies = false) {

    const card = document.createElement('div');

    card.classList.add('movie-card');

    const img = document.createElement('img');

    img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

    card.appendChild(img);

    const details = document.createElement('div');

    details.classList.add('details');

    const title = document.createElement('span');

    title.innerText = movie.title;

    details.appendChild(title);

    if (isAllMovies) {

        const releaseDate = document.createElement('span');

        releaseDate.innerText = `Released: ${movie.release_date}`;

        details.appendChild(releaseDate);

    }

    card.appendChild(details);

    // Add event listener to open modal with movie details

    card.addEventListener("click", function() {

        openModal(movie); // Only show the modal when the card is clicked

    });

    return card;

}

// Pagination event listeners

nextButton.addEventListener('click', () => {

    currentPage++;

    displayAllMovies(currentPage);

});

prevButton.addEventListener('click', () => {

    currentPage--;

    displayAllMovies(currentPage);

});

// Function to fetch movies based on search term

async function searchMovies(query) {

    if (query.trim() === '') return;

    const url = `${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`;

    const response = await fetch(url);

    const data = await response.json();

    const movies = data.results;

    displayMoviePreviews(movies);

}

// Display the movie previews (title above image, smaller cards)

function displayMoviePreviews(movies) {

    moviePreviewContainer.innerHTML = ''; // Clear previous results

    if (movies.length === 0) {

        moviePreviewContainer.innerHTML = '<p>No movies found.</p>';

        return;

    }

    movies.forEach(movie => {

        const card = document.createElement('div');

        card.classList.add('movie-preview-card');

        // Movie Title

        const title = document.createElement('span');

        title.classList.add('movie-title');

        title.innerText = movie.title;

        // Movie Image

        const img = document.createElement('img');

        img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;

        img.alt = movie.title;

        // Append title and image

        card.appendChild(title);

        card.appendChild(img);

        moviePreviewContainer.appendChild(card);

    });

}

// Add event listener to the search button

searchButton.addEventListener('click', () => {

    const query = searchBar.value;

    // Show or hide the movie preview container based on whether the search query is empty or not

    const previewContainer = document.getElementById('movie-preview-container');

    if (query.trim() !== "") {

        previewContainer.style.display = "grid"; // Show the preview container if there's a search query

    } else {

        previewContainer.style.display = "none"; // Hide if no search query

    }

    // Perform the movie search

    searchMovies(query);

});

// Optional: Search on typing (live search)

searchBar.addEventListener('input', () => {

    const query = searchBar.value;

    // Show or hide the movie preview container based on whether the search query is empty or not

    const previewContainer = document.getElementById('movie-preview-container');

    if (query.trim() !== "") {

        previewContainer.style.display = "grid"; // Show the preview container if there's a search query

    } else {

        previewContainer.style.display = "none"; // Hide if no search query

    }

    // Perform the movie search

    searchMovies(query);

});

// Initialize sections and fetch genres

fetchGenres().then(() => {

    displayRecentMovies();

    displayPopularMovies();

    displayAllMovies();

});

// Ensure modal is hidden on page load

document.addEventListener('DOMContentLoaded', () => {

    modal.style.display = 'none'; // Ensure the modal is hidden on page load

});

