import { carousel } from "./carrousel.js";
//import { checkTokenOff } from "./tokenoff.js";

//checkTokenOff()

async function getMovies(idGenero) {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        let url
        if (idGenero) {
            url = `http://localhost:1337/api/genres/?populate=*&filters[id][$eq]=${idGenero}`
        } else {
            url = `http://localhost:1337/api/genres?populate=*`
        }
        const response = await fetch(url, requestOptions)

        if (!response.ok) {

            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "index.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json()
        showMoviesGenre(data)

    } catch (error) {
        console.log(error)
    }
}
async function getGenres() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        let url = `http://localhost:1337/api/genres?populate=*`
        const response = await fetch(url, requestOptions)

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

    } catch (error) {
        console.log(error)
    }
}

function showGenreButtons(data) {
    const buttonsGenres = document.getElementById("btnGenres")
    let genreId = null;
    let genreIdAntes = null;

    for (let genre of data.data) {
        buttonsGenres.innerHTML += `<button id="button-${genre.id}"
        class="generosPelis m-1 hover:font-semibold border border-double bg-opacity-70 border-white rounded-full px-3 py-2 hover:bg-red-900 text-white">${genre.attributes.name}</button>`
    }

    let buttonsGenre = document.querySelectorAll(".generosPelis")

    for (let button of buttonsGenre) {
        let buttonActive = false;

        button.addEventListener("click", async () => {
            genreId = button.id.substring(7)

            if (buttonActive) {
                getMovies()
                buttonActive = false;
                button.classList.remove("bg-red-800")
            } else {
                getMovies(genreId);

                // si hay un género anteriormente seleccionado, cambia su estilo
                if (genreIdAntes) {
                    let buttonAntes = document.getElementById(`button-${genreIdAntes}`);
                    buttonAntes.classList.remove("bg-red-800");
                }

                // establece el nuevo género seleccionado y cambia su estilo
                genreIdAntes = genreId;
                buttonActive = true;
                button.classList.add("bg-red-800")
            }
        }, false)
    }
}


function showMoviesGenre(data) {
    const carouselDinamic = document.getElementById("carouselDinamic")
    carouselDinamic.innerHTML = ""
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

    <div id="contenedor-${genre.id}" class="contenedor-principal mb-8">
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

const searchInput = document.getElementById("buscar")
const search = searchInput.value

async function filterMovies() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        let url = `http://localhost:1337/api/movies?populate=*&filters[$or][0][name][$containsi]=${search}&filters[$or][1][year][$containsi]=${search}`
        const response = await fetch(url, requestOptions)

        if (!response.ok) {

            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "index.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json()
        showSearchResult(data)

    } catch (error) {
        console.log(error)
    }
}

function showSearchResult(data) {
    for (const resultado of data.data) {
        document.getElementById("resutaldos").innerHTML += `<div class="w-4/5">
        <a href="http://127.0.0.1:5501/detailmovie.html?id=${resultado.id}" id="resultado"
            class="flex flex-row justify-start gap-x-8 h-fit hover:bg-gray-600 p-2 rounded-md">
            <div class="basis-1/3">
                <img src="${resultado.attributes.image}" alt="">
            </div>
            <div class="flex flex-col justify-start">
                <p class="text-white">${resultado.attributes.name}</p>
                <p class="text-white">${resultado.attributes.year}</p>
            </div>
        </a>
    </div>`

    }
}


searchInput.addEventListener('input', async () => {
    if (searchInput.value != '') {
        filterMovies()
    }
});

getGenres()
getMovies()