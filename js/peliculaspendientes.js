import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

async function getMoviesToWatchUser() {
    try {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem("token"));
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };
        const response = await fetch(urlBase + '/users/me?populate=*', requestOptions)


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
        showMoviesUser(data)

    } catch (error) {
        console.log(error)
    }
}

function showMoviesUser(data) {
    let btnId = null;
    const moviesTowatch = document.getElementById("moviesToWatch");
    for (const movie of data.towatch) {
        arrayToWatch.push(movie.id);
        moviesTowatch.innerHTML += `<div class="pelicula flex flex-col items-center bg-gray-700 hover:bg-gray-600 opacity-90 p-3 rounded-lg shadow-lg">
        <div class="pelicula flex flex-col items-center">
                <a href="./detailmovie.html?id=${movie.id}">
                        <img src="${movie.image}" alt="poster-pelicula" class="rounded-lg shadow-lg">
                </a>
                <div class="pt-5">
                <button type="button" class="idButton" id="btn-${movie.id}"><i class="fas fa-trash text-xl"></i></button>
                </div>
            </div>
            </div>`
    };
    document.getElementById("contadorToWatch").innerHTML = '(' + arrayToWatch.length + ')';
    let btnsDelete = document.querySelectorAll('.idButton');
    for (const btn of btnsDelete) {
        btn.addEventListener('click', () => {
            btnId = btn.id.substring(4)
            removeToWatch(btnId)
        })
    }
}

getMoviesToWatchUser()

let arrayToWatch = [];

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

function removeToWatch(movieId) {
    console.log(movieId)
    for (var i = 0; i < arrayToWatch.length; i++) {
        if (arrayToWatch[i] == movieId) {
            arrayToWatch.splice(i, 1);
        }
    }
    let mytowatchIds = arrayToWatch.map(x => x);
    let raw = JSON.stringify({
        "towatch": mytowatchIds
    })
    updateProfile(raw)
}