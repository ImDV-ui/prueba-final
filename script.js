const contenedor = document.getElementById('app');
const controles = document.getElementById('controls');
const buscador = document.getElementById('searchInput');
const ordenSelect = document.getElementById('sortSelect');

let articulos = [];

async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        contenedor.innerHTML = '<p>Error cargando los artículos.</p>';
        return [];
    }
}

function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function pintarGrid(articles) {
    if (articles.length === 0) {
        contenedor.innerHTML = '<p class="no-results">No se encontraron artículos.</p>';
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'articles-grid';

    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => window.location.href = `?id=${article.id}`;

        const imgPath = `${article.image}.png`;

        card.innerHTML = `
            <img src="${imgPath}" alt="${article.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-content">
                <span class="card-date">${article.date}</span>
                <h3 class="card-title">${article.title}</h3>
            </div>
        `;
        grid.appendChild(card);
    });

    contenedor.innerHTML = '';
    contenedor.appendChild(grid);
}

function pintarArticulo(article) {
    const imgPath = `${article.image}.png`;

    contenedor.innerHTML = `
        <a href="index.html" class="back-btn">&larr; Volver al inicio</a>
        <article class="article-detail">
            <header class="detail-header">
                <h1 class="detail-title">${article.title}</h1>
                <div class="detail-meta">
                    Por ${article.author} | ${article.date}
                </div>
            </header>
            <img src="${imgPath}" alt="${article.title}" class="detail-image" onerror="this.src='https://via.placeholder.com/800'">
            <div class="detail-body">
                ${article.content}
            </div>
        </article>
    `;
}

function filtrarYOrdenar() {
    let filtered = [...articulos];

    const query = buscador.value.toLowerCase();
    if (query) {
        filtered = filtered.filter(a =>
            a.title.toLowerCase().includes(query) ||
            a.author.toLowerCase().includes(query)
        );
    }

    const sortVal = ordenSelect.value;
    filtered.sort((a, b) => {
        if (sortVal === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortVal === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortVal === 'title-asc') return a.title.localeCompare(b.title);
        if (sortVal === 'title-desc') return b.title.localeCompare(a.title);
        return 0;
    });

    pintarGrid(filtered);
}

async function iniciar() {
    articulos = await cargarDatos();
    const id = obtenerParametro('id');

    if (id !== null) {
        if (controles) controles.style.display = 'none';
        const article = articulos.find(a => a.id == id);
        if (article) {
            pintarArticulo(article);
        } else {
            contenedor.innerHTML = '<p>Artículo no encontrado. <a href="index.html">Volver</a></p>';
        }
    } else {
        if (controles) controles.style.display = 'flex';

        if (buscador) buscador.addEventListener('input', filtrarYOrdenar);
        if (ordenSelect) ordenSelect.addEventListener('change', filtrarYOrdenar);

        filtrarYOrdenar();
    }
}

iniciar();
