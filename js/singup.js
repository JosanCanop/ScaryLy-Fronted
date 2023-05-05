import { checkTokenOn } from "./tokenon.js"

checkTokenOn()

const form = document.getElementById("form")

form.addEventListener('submit', (e) => {
    e.preventDefault()
    registerUser(form)
})

const passwordErrorMessage = document.getElementById("password-error-message")
passwordErrorMessage.style.color = "red"


async function registerUser(form) {
    try {
        const passwordInput = document.getElementById("passwordUser")
        const repeatPasswordInput = document.getElementById("passwordUserRepeat")

        if (passwordInput.value !== repeatPasswordInput.value) {
            throw new Error("¡Las contraseñas no coinciden!")
        }

        const formData = new FormData(form)
        const queryString = new URLSearchParams(formData).toString()

        const response = await fetch(urlBase + '/auth/local/register', {
            method: "POST",
            body: queryString,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        if (!response.ok) {
            const message = `Error: ${response.status}`;
            throw new Error(message);
        }
        const tokenJson = await response.json()
        const tokenActualUser = tokenJson.jwt
        localStorage.setItem("token", tokenActualUser)
        swal({
            title: "¡Usuario registrado!",
            text: "Bienvenid@ al rincón del terror :D",
            icon: "success",
            button: "Let's Go!",
        }).then(function () {
            location.replace('home.html')
        });;
    } catch (error) {
        passwordErrorMessage.textContent = error.message || "Datos incorrectos"
        passwordErrorMessage.style.display = "block"
    }
}