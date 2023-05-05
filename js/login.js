/*import { checkTokenOn } from "./tokenon.js";
checkTokenOn()
*/

const form = document.getElementById("form")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    loginUser(form)
})

async function loginUser(form) {
    try {
        const formData = new FormData(form)
        const queryString = new URLSearchParams(formData).toString()
        const response = await fetch(urlBase + '/auth/local', {
            method: "POST",
            body: queryString, headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        const tokenJson = await response.json()
        const tokenActualUser = tokenJson.jwt
        const emailActualUser = tokenJson.user.email
        const idActualUser = tokenJson.user.id

        localStorage.setItem("email", emailActualUser);
        localStorage.setItem("token", tokenActualUser);
        localStorage.setItem("idUser", idActualUser);
        swal({
            title: "Usuario Correcto!",
            text: "Bienvenid@ al rincón del terror :D",
            icon: "success",
            button: "Let's Go!",
        }).then(function () {
            location.replace('home.html')
        });;

    } catch (error) {
        console.log(error)
        swal('Usuario incorrecto', 'Intenta introducir un usuario valido', 'error')
    }
}
