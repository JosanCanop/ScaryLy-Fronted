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
        moviesTowatch.innerHTML += `<div class="pelicula">
                <a href="http://127.0.0.1:5501/detailmovie.html?id=${movie.id}">
                    <figure class="snip0023 rounded-lg">
                        <img src="${movie.image}" alt="">
                    </figure>
                </a>
                <div>
                <button type="button" class="idButton" id="btn-${movie.id}"><i class="ion-ios-trash-outline text-xs"></i></button>
                <div class="curl"></div>
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