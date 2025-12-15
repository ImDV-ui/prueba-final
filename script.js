const contenedor = document.getElementById('app');
const controles = document.getElementById('controls');
const buscador = document.getElementById('searchInput');
const ordenSelect = document.getElementById('sortSelect');

let articulos = [];

async function cargarDatos() {
    try {
        const response = await fetch('data.json');
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error cargando datos:', error);
        contenedor.innerHTML = '<p>Error cargando los artículos.</p>';
        return [];
    }
}

function obtenerParametro(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function pintarGrid(listaArticulos) {
    if (listaArticulos.length === 0) {
        contenedor.innerHTML = '<p class="no-results">No se encontraron artículos.</p>';
        return;
    }

    const rejilla = document.createElement('div');
    rejilla.className = 'articles-grid';

    listaArticulos.forEach(articulo => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';
        tarjeta.onclick = () => window.location.href = `?id=${articulo.id}`;

        const rutaImagen = `${articulo.image}.png`;

        tarjeta.innerHTML = `
            <img src="${rutaImagen}" alt="${articulo.title}" class="card-image" onerror="this.src='https://via.placeholder.com/300'">
            <div class="card-content">
                <span class="card-date">${articulo.date}</span>
                <h3 class="card-title">${articulo.title}</h3>
            </div>
        `;
        rejilla.appendChild(tarjeta);
    });

    contenedor.innerHTML = '';
    contenedor.appendChild(rejilla);
}

function pintarArticulo(articulo) {
    const rutaImagen = `${articulo.image}.png`;

    contenedor.innerHTML = `
        <a href="index.html" class="back-btn">&larr; Volver al inicio</a>
        <article class="article-detail">
            <header class="detail-header">
                <h1 class="detail-title">${articulo.title}</h1>
                <div class="detail-meta">
                    Por ${articulo.author} | ${articulo.date}
                </div>
            </header>
            <img src="${rutaImagen}" alt="${articulo.title}" class="detail-image" onerror="this.src='https://via.placeholder.com/800'">
            <div class="detail-body">
                ${articulo.content}
            </div>
        </article>
    `;
}

function filtrarYOrdenar() {
    let filtrados = [...articulos];

    const busqueda = buscador.value.toLowerCase();
    if (busqueda) {
        filtrados = filtrados.filter(a =>
            a.title.toLowerCase().includes(busqueda) ||
            a.author.toLowerCase().includes(busqueda)
        );
    }

    const criterioOrden = ordenSelect.value;
    filtrados.sort((a, b) => {
        if (criterioOrden === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (criterioOrden === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (criterioOrden === 'title-asc') return a.title.localeCompare(b.title);
        if (criterioOrden === 'title-desc') return b.title.localeCompare(a.title);
        return 0;
    });

    pintarGrid(filtrados);
}

async function iniciar() {
    articulos = await cargarDatos();
    const id = obtenerParametro('id');

    if (id !== null) {
        if (controles) controles.style.display = 'none';
        const articulo = articulos.find(a => a.id == id);
        if (articulo) {
            pintarArticulo(articulo);
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
