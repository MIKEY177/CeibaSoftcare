const modal1 = document.querySelector(".modal-recuperar-contrasena1");
const modal2 = document.querySelector(".modal-recuperar-contrasena2");
const modal3 = document.querySelector(".modal-recuperar-contrasena3");
const btnAbrirRecuperar  = document.getElementById("btnAbrirRecuperar");
const btnCerrarRecuperar = document.getElementById("btnCerrarRecuperar");

// Función helper para abrir una modal
function abrirModal(modal) {
    if (modal) modal.classList.add("show-modal");
}

function cerrarModal(modal) {
    if (modal) modal.classList.remove("show-modal");
}

// Al cargar la página, abrir la modal que corresponda según el estado del PHP
window.addEventListener("DOMContentLoaded", () => {
    if (typeof modalActiva !== "undefined") {
        if (modalActiva === 2 && modal2) abrirModal(modal2);
        if (modalActiva === 3 && modal3) abrirModal(modal3);
    }
});

// Abrir modal 1 (botón ¿Olvidó su contraseña?)
if (btnAbrirRecuperar) {
    btnAbrirRecuperar.addEventListener("click", (e) => {
        e.preventDefault();
        abrirModal(modal1);
    });
}

// Cerrar modal 1
if (btnCerrarRecuperar) {
    btnCerrarRecuperar.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarModal(modal1);
    });
}

// Cerrar cualquier modal haciendo click afuera
window.addEventListener("click", (e) => {
    if (e.target === modal1) cerrarModal(modal1);
    if (e.target === modal2) cerrarModal(modal2);
    if (e.target === modal3) cerrarModal(modal3);
});