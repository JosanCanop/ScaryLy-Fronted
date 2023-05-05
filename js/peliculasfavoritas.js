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

let allLikes

function showMoviesUser(data) {
    allLikes = data.likes
    document.getElementById("contadorLikes").innerHTML = '(' + allLikes.length + ')'
    const moviesLikes = document.getElementById("moviesLikes")
    for (const movie of data.likes) {
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

getMoviesLikesUser()


/*
async function updateProfile(data) {
    try {
        const response = await fetch(urlBase + '/users/' + localStorage.getItem("idUser"), {
            method: "PUT",
            body: data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        alert("borrar¿?")
        location.reload()
    } catch (error) {
        console.log(error)
    }
}

function remove() {
    //borrar bicis de la lista
    if (myBikes.selectedIndex != -1) {
        var value = myBikes.value;
        var selectedOption = myBikes.options[myBikes.selectedIndex];
        const text = selectedOption.text;
        selectedOption.classList.add("d-none")

        for (var i = 0; i < arrayMyBikes.length; i++) {
            if (arrayMyBikes[i].id == value) {
                arrayMyBikes.splice(i, 1);
            }
        }

        console.log(arrayMyBikes)

    }
}

function save() {
    const name = nameInput.value
    const surname = surnameInput.value

    //getElement name, surname, array de bicicletas
    //const array1 = [1, 4, 9, 16];

    // Pass a function to map
    //const map1 = array1.map(x => x.id);

    //console.log(map1);
    // Expected output: Array [2, 8, 18, 32]

    const myBikesIds = arrayMyBikes.map(x => x.id);
    //myBikedIds es un array, lo crea el map

    var raw = JSON.stringify({
        "name": name,
        "surname": surname,
        "bicicletas": myBikesIds
    })
//console.log(raw)
    /*o de la manera tradicional

    */
   // updateProfile(raw)
//}