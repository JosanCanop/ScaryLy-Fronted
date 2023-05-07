import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

async function getMoviesLikesUser() {
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

function showMoviesUser(data) {
    let btnId = null;
    const moviesLikes = document.getElementById("moviesLikes");
    for (const movie of data.likes) {
        arrayAllLikes.push(movie.id);
        moviesLikes.innerHTML += `<div class="pelicula">
                <a href="./detailmovie.html?id=${movie.id}">
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
    document.getElementById("contadorLikes").innerHTML = '(' + arrayAllLikes.length + ')';
    let btnsDelete = document.querySelectorAll('.idButton');
    for (const btn of btnsDelete) {
        btn.addEventListener('click', () => {
            btnId = btn.id.substring(4)
            removeLike(btnId)
        })
    }

}

getMoviesLikesUser();

let arrayAllLikes = [];

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

function removeLike(movieId) {
    console.log(movieId)
    for (var i = 0; i < arrayAllLikes.length; i++) {
        if (arrayAllLikes[i] == movieId) {
            arrayAllLikes.splice(i, 1);
        }
    }
    let myLikesIds = arrayAllLikes.map(x => x);
    let raw = JSON.stringify({
        "likes": myLikesIds
    })
    updateProfile(raw)
}