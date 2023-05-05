import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

async function getMoviesLikesUser() {
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

let arrayAllLikes = [];
let movieId;

function showMoviesUser(data) {
    const moviesLikes = document.getElementById("moviesLikes");
    arrayAllLikes = data.likes.map(movie => {
        moviesLikes.innerHTML += `<div class="pelicula">
        <a href="http://127.0.0.1:5501/detailmovie.html?id=${movie.id}">
            <figure class="snip0023 rounded-lg">
                <img src="${movie.image}" alt="">
                <div>
                    <button type="button" class="idButton" id="btn-${movie.id}"><i class="ion-ios-trash-outline text-xs"></i></button>
                    <div class="curl"></div>
                </div>
            </figure>
        </a>
    </div>
    `
        const btnDelete = document.getElementById(`btn-${movie.id}`);
        btnDelete.addEventListener("click", () => {
            remove(movie.id);
        });

        btnDelete.addEventListener('click', (event) => {
            event.preventDefault(); // Cancelar comportamiento predeterminado del evento de clic
            // Agregar cualquier otra acción que desee realizar aquí
        });
        return movie.id;
    });
    document.getElementById("contadorLikes").innerHTML = '(' + arrayAllLikes.length + ')'
}

getMoviesLikesUser()


async function updateProfile(raw) {
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
        //alert("borrar¿?")
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

function remove(movieId) {
    for (var i = 0; i < arrayAllLikes.length; i++) {
        if (arrayAllLikes[i].id == movieId) {
            arrayAllLikes.splice(i, 1);
            break;
        }
    }
    const myLikesIds = arrayAllLikes.map(x => x.id);
    var raw = JSON.stringify({ "likes": myLikesIds });
    updateProfile(raw);
}





