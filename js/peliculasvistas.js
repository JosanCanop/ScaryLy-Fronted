import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

async function getMoviesWatched() {
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
        showMoviesWatched(data)

    } catch (error) {
        console.log(error)
    }
}

function showMoviesWatched(data) {
    const allWatched = data.watched
    document.getElementById("contadorWatched").innerHTML = '(' + allWatched.length + ')'
    const moviesLikes = document.getElementById("moviesWatched")
    for (const movie of data.watched) {
        moviesLikes.innerHTML += `<div class="pelicula">
    <a href="http://127.0.0.1:5501/detailmovie.html?id=${movie.id}">
        <figure class="snip0023 rounded-lg">
            <img src="${movie.image}" alt="">
            <div>
                <button onclick=""><i class="ion-ios-trash-outline text-xs"></i></button>
                <div class="curl"></div>
            </div>
        </figure>
    </a>
</div>`
    }
}

getMoviesWatched()