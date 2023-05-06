import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function getMovie() {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const response = await fetch(urlBase + "/movies/" + movieId + "?populate=comments,comments.user,userslikes,usersdislikes,userstowatch,userwatched,genres", requestOptions)

        if (!response.ok) {
            if (response.status == 401) {
                localStorage.removeItem("token")
                window.location.href = "index.html"
            } else {
                const message = `Error: ${response.status}`;
                throw new Error(message);
            }
        }
        const movies = await response.json()
        showMovieData(movies)

    } catch (error) {
        console.log(error)
    }
}
getMovie()

function showMovieData(movies) {
    let movieData = document.getElementById("movieData")
    let totalLikes = movies.data.attributes.userslikes.data.length;
    let totalDislikes = movies.data.attributes.usersdislikes.data.length;
    const genreNamebyId = movies.data.attributes.genres.data[0].attributes.name;

    movieData.innerHTML = `<!--informacion pelicula-->
    <div class="basis-11/12 sm:basis-2/3 ml-6 flex flex-col">
        <h1 class="font-anton tracking-wider sm:text-3xl text-sm p-2 text-white">${movies.data.attributes.name}</h1>
        <p class="text-xs sm:text-base p-2 text-white text-justify">${movies.data.attributes.description}</p>
        <p class="text-xs sm:text-sm p-2 text-white">${movies.data.attributes.year}</p>
        <!--genero pelicula, se pinta por js-->
        <div class="text-xs sm:text-base p-2 text-white inline-flex space-x-4">
            <p class="underline underline-offset-4">${genreNamebyId}</p>
        </div>
        <!--BotonesLikes+Dislike-->
        <div class="flex flex-row gap-x-5 sm:gap-x-20 mt-5 mb-10">
            <div id="like-dislike" class="flex items-center space-x-2 px-2 mb-5 sm:mb-20">
                <button id="btnLike-${movies.data.id}"
                    class="allLikes inline-flex items-center justify-center text-white hover:text-green-400 focus:text-green-400 space-x-2 pr-4">
                    <i class="far fa-thumbs-up text-sm"></i>
                    <span>${totalLikes}</span>
                </button>
                <button id="btnDislike-${movies.data.id}"
                    class="alldislikes inline-flex items-center justify-center text-white hover:text-red-600 focus:text-red-600 space-x-2">
                    <i class="far fa-thumbs-down text-sm"></i>
                    <span>${totalDislikes}</span>
                </button>
            </div>
            <!--BotonesToWatch+Watch-->
            <div id="actions" class="inline-block space-x-4">
                <button id="btnWatched-${movies.data.id}"
                    class="allWatched inline-flex items-center justify-center w-8 h-8 bg-transparent border border-white rounded-full text-white focus:text-green-400 focus:bg-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-green-500">
                    <i class="far fa-eye text-sm"></i>
                </button>
                <button id="btnToWatch-${movies.data.id}"
                    class="allToWatch inline-flex items-center justify-center w-8 h-8 bg-transparent border border-white rounded-full text-white focus:text-yellow-500 focus:bg-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-yellow-500">
                    <i class="fas fa-clock text-sm"></i>
                </button>
            </div>
        </div>
    </div>
    <!--poster pelicula-->
    <div class="poster basis-1/4 mx-auto md:mx-0">
        <img src="${movies.data.attributes.image}"
            alt="póster película" class="w-sm sm:w-lg">
    </div>
    `;


    const allComments = movies.data.attributes.comments.data
    document.getElementById("contadorComentarios").innerHTML = allComments.length

    let html = ""
    for (const comment of allComments) {
        html += `
            <div class="flex mt-15 mb-4 w-full bg-gray-700 bg-opacity-50 rounded-lg px-4 pt-2 mx-auto max-w-7xl">
                <div class="flex flex-col flex-wrap -mx-3 mb-6 w-full">
                    <h2 class="px-4 pt-3 pb-2 text-gray-300 text-bases font-bold text-xs sm:text-sm">${comment.attributes.user.data.attributes.username}</h2>
                    <div class="w-full px-3 mb-2 mt-2">
                        <textarea id="userComment-${comment.id}"
                            class="bg-transparent border-transparent rounded leading-normal resize-none w-full h-fit py-2 px-3 placeholder-gray-700 text-white"
                            disabled>${comment.attributes.comment}</textarea>
                    </div>`
        let buttons = ` <div id="botones-comment-${comment.id}" class="flex justify-end gap-4">
                        <button type='submit' id="btnUp-${comment.id}"
                            class="updateComment bg-red-600 text-gray-200 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-600 hidden">Publicar cambios</button>
                        <button id="btnEdit-${comment.id}"
                            class="editComment border-2 border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-blue-700 font-bold rounded-lg py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base">
                            <i class="fas fa-pen text-white"></i>
                        </button>
                        <button id="btnDelete-${comment.id}"
                            class="deleteComment border-2 border-red-500 hover:bg-red-500 text-red-500 hover:text-red-700 font-bold rounded-lg py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base">
                            <i class="fas fa-trash text-white"></i>
                        </button>
                    </div>`

        if (comment.attributes.user.data.attributes.email == localStorage.getItem('email')) {
            html += buttons;
        }
        html += ` </div> 
            </div>
        </div>
        `
    }

    document.getElementById("publishedComments").innerHTML = html;
    //boton like
    let btnLikeId = null;
    let btnsUpdateLike = document.querySelector('.allLikes');
    btnsUpdateLike.addEventListener('click', () => {
        btnLikeId = btnsUpdateLike.id.substring(8)
        updateLikes(btnLikeId)
    })

    //boton dislike
    let btnDisikeId = null;
    let btnsUpdateDisike = document.querySelector('.alldislikes');
    btnsUpdateDisike.addEventListener('click', () => {
        btnDisikeId = btnsUpdateDisike.id.substring(11)
        updateDisLikes(btnDisikeId)
    })

    //boton watched
    let btnWatchedId = null;
    let btnsUpdateWatched = document.querySelector('.allWatched');
    btnsUpdateWatched.addEventListener('click', () => {
        btnWatchedId = btnsUpdateWatched.id.substring(11)
        updateWatched(btnWatchedId)
    })

    //boton Towatch
    let btnToWatchId = null;
    let btnsUpdateToWatch = document.querySelector('.allToWatch');
    btnsUpdateToWatch.addEventListener('click', () => {
        btnToWatchId = btnsUpdateToWatch.id.substring(11)
        updateToWatch(btnToWatchId)
    })

    //botones comments
    let idBtn = null;
    let btnUpdateComment = document.querySelector(".updateComment")
    let btnEditComment = document.querySelector(".editComment")
    let btnDeleteComment = document.querySelector(".deleteComment")
    btnUpdateComment.addEventListener('click', () => {
        idBtn = btnUpdateComment.id.substring(6)
        updateComment(idBtn)
    })
    btnEditComment.addEventListener('click', () => {
        idBtn = btnEditComment.id.substring(8)
        editComment(idBtn)
    })
    btnDeleteComment.addEventListener('click', () => {
        idBtn = btnDeleteComment.id.substring(10)
        askDelete(idBtn)
    })
}



function editComment(commentId) {
    const postCommentChange = document.getElementById(`btnUp-` + commentId)
    postCommentChange.classList.toggle("hidden")
    const userComment = document.getElementById(`userComment-` + commentId)
    userComment.disabled = false
    userComment.classList.add("bg-white", "text-black")

}

async function updateComment(commentId) {
    try {
        var raw = JSON.stringify({
            "data": {
                "comment": document.getElementById(`userComment-` + commentId).value,
                "movie": movieId,
                "user": localStorage.getItem("idUser")
            }
        });
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(urlBase + `/comments/` + commentId, {
            method: "PUT",
            body: raw,
            headers: myHeaders,
            redirect: 'follow'

        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        swal({
            title: "Comentario actualizado correctamente",
            icon: "success",
            button: "Let's Go!",
        }).then(function () {
            location.reload()
        });;
    } catch (error) {
        console.log(error)
    }
}

const formCreate = document.getElementById("formCreate")
formCreate.addEventListener('submit', (e) => {
    e.preventDefault()
    createComment()

})

const newComment = document.getElementById("newComment")

async function createComment() {
    try {
        var raw = JSON.stringify({
            "data": {
                "comment": newComment.value,
                "movie": movieId,
                "user": localStorage.getItem("idUser")
            }
        });
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        myHeaders.append("Content-Type", "application/json");
        const response = await fetch(urlBase + '/comments', {
            method: "POST",
            body: raw,
            headers: myHeaders,
            redirect: 'follow'

        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        swal({
            title: "Comentario publicado",
            icon: "success",
            button: "Let's Go!",
        }).then(function () {
            location.reload()
        });;
    } catch (error) {
        console.log(error)
    }
}

async function deleteComment(commentId) {
    try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
        const response = await fetch(urlBase + `/comments/` + commentId, {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'

        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
    } catch (error) {
        console.log(error)
    }
}

function askDelete(commentId) {
    swal({
        title: "¿Estas seguro que quieres eliminar tu comentario?",
        text: "¡Una vez borrado, no podras recuperarlo!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deleteComment(commentId)
                swal("¡Tu comentario ha sido borrado!", {
                    icon: "success",
                }).then(function () {
                    location.reload()
                });
            }
        });
}

//Parte de modificar botones de likes etc


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

function showMoviesUser(data) {

    for (const like of data.likes) {
        arrayAllLikes.push(like.id);
    };

    for (const dislike of data.dislikes) {
        arrayAllDislikes.push(dislike.id);
    };

    for (const watched of data.watched) {
        arrayAllWatched.push(watched.id);
    };

    for (const towatch of data.towatch) {
        arrayAllToWatch.push(towatch.id);
    };

}

getInfoUser()

//Funciones para cada boton
let arrayAllLikes = [];
let arrayAllDislikes = [];
let arrayAllWatched = [];
let arrayAllToWatch = [];

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

function updateLikes(movieId) {
    if (arrayAllLikes.includes(parseInt(movieId))) {
        let index = arrayAllLikes.indexOf(parseInt(movieId));
        arrayAllLikes.splice(index, 1);
    } else {
        arrayAllLikes.push(parseInt(movieId));
    }
    let mytowatchIds = arrayAllLikes.map(x => x);
    let raw = JSON.stringify({
        "likes": mytowatchIds
    })
    updateProfile(raw);
}

function updateDisLikes(movieId) {
    if (arrayAllDislikes.includes(parseInt(movieId))) {
        let index = arrayAllDislikes.indexOf(parseInt(movieId));
        arrayAllDislikes.splice(index, 1);
    } else {
        arrayAllDislikes.push(parseInt(movieId));
    }
    let mytowatchIds = arrayAllDislikes.map(x => x);
    let raw = JSON.stringify({
        "dislikes": mytowatchIds
    })
    updateProfile(raw);
}

function updateWatched(movieId) {
    if (arrayAllWatched.includes(parseInt(movieId))) {
        let index = arrayAllWatched.indexOf(parseInt(movieId));
        arrayAllWatched.splice(index, 1);
    } else {
        arrayAllWatched.push(parseInt(movieId));
    }
    let mytowatchIds = arrayAllWatched.map(x => x);
    let raw = JSON.stringify({
        "watched": mytowatchIds
    })
    updateProfile(raw);
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