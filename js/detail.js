/*import { checkTokenOff } from "./tokenoff.js";

checkTokenOff()*/

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

        const response = await fetch("http://localhost:1337/api/movies/" + movieId + "?populate=comments,comments.user,userslikes,usersdislikes,genres", requestOptions)

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

    //const username = comments.data.find((movie) => movie.data.attributes.comments.data.id == comments.id);
    //let bodyComment = movies.data.attributes.comments.data[0].attributes.comment



    movieData.innerHTML = `<!--informacion pelicula-->
<div class="basis-11/12 sm:basis-2/3 ml-6 flex flex-col">
    <h1 class="font-anton tracking-wider sm:text-3xl text-sm p-2 text-white">${movies.data.attributes.name}</h1>
    <p class="text-xs sm:text-base p-2 text-white text-justify">${movies.data.attributes.description}</p>
    <p class="text-xs sm:text-sm p-2 text-white">${movies.data.attributes.year}</p>

    <!--genero pelicula, se pinta por js-->
    <div class="text-xs sm:text-base p-2 text-white inline-flex space-x-4">
        <p class="underline underline-offset-4">${genreNamebyId}</p>
    </div>

    <!--segunda opcion-->
    <div class="flex flex-row gap-x-5 sm:gap-x-20 mt-5 mb-10">
        <div id="like-dislike" class="flex items-center space-x-2 px-2 mb-5 sm:mb-20">
            <button
                class="inline-flex items-center justify-center text-white hover:text-green-400 focus:text-green-400 space-x-2 pr-4">
                <i class="far fa-thumbs-up text-sm"></i>
                <span>${totalLikes}</span>
            </button>
            <button
                class="inline-flex items-center justify-center text-white hover:text-red-600 focus:text-red-600 space-x-2">
                <i class="far fa-thumbs-down text-sm"></i>
                <span>${totalDislikes}</span>
            </button>
        </div>
        <div id="actions" class="inline-block space-x-4">
            <button
                class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-white rounded-full text-white focus:text-green-400 focus:bg-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-green-500">
                <i class="far fa-eye text-sm"></i>
            </button>

            <button
                class="inline-flex items-center justify-center w-8 h-8 bg-transparent border border-white rounded-full text-white focus:text-yellow-500 focus:bg-white hover:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-yellow-500">
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
        let buttons = ` <div id="botones-comment" class="flex justify-end gap-4">
                        <button type='submit' onclick="updateComment('${comment.id}')" id="postCommentChange"
                            class="bg-red-600 text-gray-200 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-600 hidden">Publicar cambios</button>
                        <button onclick="editComment('${comment.id}')" id="editComment"
                            class="border-2 border-blue-500 hover:bg-blue-500 text-blue-500 hover:text-blue-700 font-bold rounded-lg py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base">
                            <i class="fas fa-pen text-white"></i>
                        </button>
                        <button id="deleteComment" onclick="askDelete('${comment.id}')"
                            class="border-2 border-red-500 hover:bg-red-500 text-red-500 hover:text-red-700 font-bold rounded-lg py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-base">
                            <i class="fas fa-trash text-white"></i>
                        </button>
                    </div> `


        if (comment.attributes.user.data.attributes.email == localStorage.getItem('email')) {
            html += buttons;
        }
        html += ` </div> 
            </div>
        </div>
        `
    }
    document.getElementById("publishedComments").innerHTML = html;
}

function editComment(commentId) {
    const postCommentChange = document.getElementById("postCommentChange")
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
        const response = await fetch(`http://localhost:1337/api/comments/` + commentId, {
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
        const response = await fetch('http://localhost:1337/api/comments', {
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
        const response = await fetch(`http://localhost:1337/api/comments/` + commentId, {
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
