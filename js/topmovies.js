import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

const topMoviesLikes = document.getElementById("topMoviesLikes")

async function getTopMovies() {
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
                image: pelicula.attributes.image
            });
        }
    });

    // Ordenar las películas por cantidad de likes (de mayor a menor)
    peliculas.sort((a, b) => b.likes - a.likes);

    console.log(peliculas);
    for (const pelitop of peliculas) {
        topMoviesLikes.innerHTML += `<div class="pelicula flex flex-col items-center bg-gray-700 hover:bg-gray-600 opacity-90 p-3 rounded-lg shadow-lg">
        <div class="pelicula flex flex-col items-center">
                <a href="./detailmovie.html?id=${pelitop.id}">
                        <img src="${pelitop.image}" alt="poster-pelicula" class="rounded-lg shadow-lg">
                </a>
                <div class="pt-5">
                <h1 class="text-white text-xl">Total Likes<i class="far fa-thumbs-up text-2xl ml-5 mr-2 text-green-400"></i> ${pelitop.likes}</h1>
                </div>
            </div>
            </div>`
    }
}

getTopMovies();