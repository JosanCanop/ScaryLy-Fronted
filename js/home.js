import { carousel } from "./carrousel.js";
import { checkTokenOn } from "./tokenon.js";

checkTokenOn()
async function getGenresButtons() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch('http://localhost:1337/api/genres?populate=*', requestOptions)


        if (!response.ok) {

            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "login.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json()
        showGenreButtons(data)
        showMoviesGenre(data)

    } catch (error) {
        console.log(error)
    }
}

function showGenreButtons(data) {
    const buttonsGenres = document.getElementById("btnGenres")
    for (let genre of data.data) {
        buttonsGenres.innerHTML += `<button
            class=" m-1 hover:font-semibold border border-double  bg-opacity-70 border-white rounded-full px-3 py-2 hover:bg-red-900 text-white">${genre.attributes.name}</button>`
    }
}

function showMoviesGenre(data) {
    const carouselDinamic = document.getElementById("carouselDinamic")

    for (let genre of data.data) {
        let peliculas = ""
        for (const pelicula of genre.attributes.movies.data) {
            peliculas += `<div class="pelicula">
        <a href="http://127.0.0.1:5501/detailmovie.html?id=${pelicula.id}"><img src="${pelicula.attributes.image}" alt=""></a>
    </div>`
        }
        carouselDinamic.innerHTML += `<div id="padre-${genre.id}" class="contenedor-titulo-controles">
        <h3>${genre.attributes.name}</h3>
        <div class="indicadores"></div>
    </div>

    <div class="contenedor-principal">
        <button role="button" id="flecha-izquierda-${genre.id}" class="flecha-izquierda"><i
                class="fas fa-angle-left"></i></button>

        <div id="carouselImg-${genre.id}" class="contenedor-carousel">
            <div id="pelis-${genre.id}" class="carousel">
                ${peliculas}
            </div>
        </div>

        <button role="button" id="flecha-derecha-${genre.id}" class="flecha-derecha"><i
                class="fas fa-angle-right"></i></button>

    </div>`

    }
    for (let genre of data.data) {
        carousel(genre.id)
    }
}


getGenresButtons()