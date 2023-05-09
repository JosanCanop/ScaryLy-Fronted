import { carousel } from "./carrousel.js";
//import { checkTokenOff } from "./tokenoff.js";

//checkTokenOff()

//menu movile responsive
const hamburguesita = document.getElementById("hamburguesita")
hamburguesita.addEventListener('click', () => {
    verMenu()
})


function verMenu() {
    document.getElementById("menu").classList.toggle("hidden");
}

const btnCloseSesion = document.getElementById("closeSesion")
btnCloseSesion.addEventListener('click', () => {
    exitLoginTwo()
})
const closeSesionHamburguer = document.getElementById("closeSesionHamburguer")
closeSesionHamburguer.addEventListener('click', () => {
    exitLoginTwo()
})


function exitLoginTwo() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("idUser")
    window.location.href = "index.html"
}

const token = localStorage.getItem("token");

async function obtenerUser() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch(urlBase + '/users/me', requestOptions)


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
        showDataUser(data)

    } catch (error) {
        console.log(error)
    }
}
//nombre user barra nav
function showDataUser(data) {

    const userName = document.getElementById("userName")
    userName.innerHTML = `${data.username}`
}

obtenerUser()

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
            url = urlBase + `/genres/?populate=*&filters[id][$eq]=${idGenero}`
        } else {
            url = urlBase + `/genres?populate=*`
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
        let url = urlBase + `/genres?populate=*`
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
//pintamos botones genero
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
//pintamos las movies segun su genero
function showMoviesGenre(data) {
    const carouselDinamic = document.getElementById("carouselDinamic")
    carouselDinamic.innerHTML = ""
    for (let genre of data.data) {
        let peliculas = ""
        for (const pelicula of genre.attributes.movies.data) {
            peliculas += `<div class="pelicula">
        <a href="./detailmovie.html?id=${pelicula.id}"><img src="${pelicula.attributes.image}"></a>
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

const searchInput = document.getElementById("inputBuscar")

async function filterMovies() {
    const search = searchInput.value
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        let url = urlBase + `/movies?populate=*&filters[$or][0][name][$containsi]=${search}&filters[$or][1][year][$containsi]=${search}`
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

const resutaldosBusqueda = document.getElementById("resultados")

function showSearchResult(data) {
    for (const resultado of data.data) {
        resutaldosBusqueda.innerHTML += `<div class="w-4/5">
        <a href="./detailmovie.html?id=${resultado.id}" id="resultado"
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

const btnSearch = document.getElementById("btnSearch")
btnSearch.addEventListener('click', async () => {
    resutaldosBusqueda.innerHTML = ""
    filterMovies()

})


const sectionCarousel = document.getElementById("mainSection")
const resultadosSearch = document.getElementById("resultados-busqueda")

//barra de busqueda accciones de buscar y vaciar input
searchInput.addEventListener('input', async () => {
    if (searchInput.value === '') {
        console.log("ocultar")
        sectionCarousel.classList.remove("hidden")
        resultadosSearch.classList.add("hidden")
        resultadosSearch.classList.remove("flex")
        resutaldosBusqueda.innerHTML = ""
    } else {
        console.log("mostrar")
        sectionCarousel.classList.add("hidden")
        resultadosSearch.classList.remove("hidden")
        resultadosSearch.classList.add("flex")
        resutaldosBusqueda.innerHTML = ""
    }
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // previene el comportamiento predeterminado del Enter
        resutaldosBusqueda.innerHTML = ""
        filterMovies()
    }
});

getGenres()
getMovies()

//Pelicula portada principal
const mainMovie = document.getElementById("mainMovie")

async function getMainMovie() {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch(urlBase + '/movies?populate=*&pagination[start]=0&pagination[limit]=1000', requestOptions);

        if (!response.ok) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "login.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json();
        showTopMovies(data.data);

    } catch (error) {
        console.log(error);
    }
}

let peliculas = []

function showTopMovies(data) {
    data.forEach(pelicula => {
        // Obtenemos un array con los likes de la película actual
        const likes = pelicula.attributes.userslikes.data.map(usuario => usuario.id);

        // Agregamos un objeto con la información de la película y sus likes al array "peliculas"
        if (likes.length != 0) {
            peliculas.push({
                id: pelicula.id,
                nombre: pelicula.attributes.name,
                likes: likes.length,
                image: pelicula.attributes.image,
                description: pelicula.attributes.description
            });
        }
    });

    // Ordenar las películas por cantidad de likes (de mayor a menor)
    peliculas.sort((a, b) => b.likes - a.likes);
    let peliTop = peliculas[0]
    mainMovie.innerHTML = `<div class="contenedor  sm:flex sm:justify-between">
    <div>
        <h3 class="titulo">${peliTop.nombre}</h3>
        <p class="descripcion">${peliTop.description}</p>
        <button role="button" id="btn-${peliTop.id}" class="toWatchMain boton text-md sm:text-lg mb-5"><i class="far fa-eye"></i>Ver
            más
            tarde</button>
        <button role="button" class="boton text-md sm:text-lg mb-5"><a href="./detailmovie.html?id=${peliTop.id}"><i class="fas fa-info-circle"></i>Más información</a></button>
        </div>
        <div class="flex justify-center">
        <img class="w-1/2 sm:w-full" src="${peliTop.image}" alt="portada">
        </div>
        </div>`
    //boton añadir ver mas tarde portada
    const btnVerMasTarde = document.querySelector(".toWatchMain")
    let btnWatchedId = null;
    btnVerMasTarde.addEventListener('click', () => {
        btnWatchedId = btnVerMasTarde.id.substring(4)
        updateToWatch(btnWatchedId)
    });
    if (arrayAllToWatch.includes(parseInt(peliTop.id))) {
        btnVerMasTarde.classList.replace("text-white", "text-gr-400")
        btnVerMasTarde.classList.replace("bg-transparent", "bg-white")
    } else {
        btnVerMasTarde.classList.replace("text-green-400", "text-white")
    }
}



async function getInfoUser() {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch(urlBase + '/users/me?populate=*', requestOptions);

        if (!response.ok) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "login.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }

        const data = await response.json();
        showMoviesUser(data);

    } catch (error) {
        console.log(error);
    }
}

let arrayAllToWatch = [];

function showMoviesUser(data) {
    for (const towatch of data.towatch) {
        arrayAllToWatch.push(towatch.id);
    };
    //getMovie()
    getMainMovie();
}

async function updateProfile(raw) {
    console.log(raw)
    try {
        const response = await fetch(urlBase + '/users/' + localStorage.getItem("idUser"), {
            method: "PUT",
            body: raw,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        location.reload();
    } catch (error) {
        console.log(error);
    }
}

function updateToWatch(movieId) {
    if (arrayAllToWatch.includes(parseInt(movieId))) {
        let index = arrayAllToWatch.indexOf(parseInt(movieId));
        arrayAllToWatch.splice(index, 1);
    } else {
        arrayAllToWatch.push(parseInt(movieId));
    }
    let mytowatchIds = arrayAllToWatch.map(x => x);
    let raw = JSON.stringify({
        "towatch": mytowatchIds
    })
    updateProfile(raw);
}

getInfoUser();