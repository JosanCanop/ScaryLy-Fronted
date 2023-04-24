// Seleccionar los elementos del DOM para los botones
const changeUserDataButton = document.querySelector('#changeUserData');
const saveUserDataButton = document.querySelector('#saveUserData');

// Agregar un eventListener al botón "Modificar datos de usuario"
changeUserDataButton.addEventListener('click', () => {
    // Cambiar la clase CSS "hidden" del botón "Guardar cambios" a "show"
    saveUserDataButton.classList.remove('hidden');
});