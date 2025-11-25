/* ===================== REFERENCIAS A MODALES ===================== */
const modalRegistrar = document.querySelector(".modal-registrar");
const modalEditar = document.querySelector(".modal-editar");
const modalEliminar = document.querySelector(".modal-eliminar");

/* ===================== BOTONES PRINCIPALES ===================== */
const btnAbrirRegistrar = document.getElementById("abrirRegistrar");

/* Botones cerrar */
document.getElementById("cerrarRegistrar").onclick = () => modalRegistrar.classList.remove("show-modal");
document.getElementById("cerrarEditar").onclick = () => modalEditar.classList.remove("show-modal");
document.getElementById("cerrarEliminar").onclick = () => modalEliminar.classList.remove("show-modal");

/* ===================== ABRIR MODAL REGISTRAR ===================== */
btnAbrirRegistrar.addEventListener("click", (e) => {
    e.preventDefault();
    modalRegistrar.classList.add("show-modal");
});

/* ===================== ABRIR MODAL EDITAR (dinámico) ===================== */
function abrirModalEditar(id_producto, nombre, descripcion, unidad, usuario, id_usuario1) {
    document.getElementById("edit-id").value = id_producto;
    document.getElementById("edit-nombre").value = nombre;
    document.getElementById("edit-descripcion").value = descripcion;
    document.getElementById("edit-unidad").value = unidad;
    document.getElementById("edit-usuario").value = usuario;
    document.getElementById("edit-usuario-id").value = id_usuario1;

    modalEditar.classList.add("show-modal");
}
if (datosDesdePHP.modal === "editar") {
    document.getElementById("edit-id").value = datosDesdePHP.id;
    document.getElementById("edit-nombre").value = datosDesdePHP.nombre;
    document.getElementById("edit-descripcion").value = datosDesdePHP.descripcion;
    document.getElementById("edit-unidad").value = datosDesdePHP.unidad;

    document.getElementById("edit-usuario").value = datosDesdePHP.usuario;  // ← AGREGA ESTO
    document.getElementById("edit-usuario-id").value = datosDesdePHP.id_usuario1;

    document.querySelector(".modal-editar").classList.add("show-modal");
}

/* ===================== ABRIR MODAL ELIMINAR (dinámico) ===================== */
function abrirModalEliminar(nombre_producto, id_producto) {
    document.getElementById("textoEliminar").innerHTML =
        "¿Desea eliminar <strong>" + nombre_producto + "</strong>?";

    // Guarda el ID para enviarlo al backend
    document.getElementById("btnConfirmarEliminar").setAttribute("data-id", id_producto);

    modalEliminar.classList.add("show-modal");
}

/* ===================== CLIC FUERA PARA CERRAR ===================== */
[modalRegistrar, modalEditar, modalEliminar].forEach(modal => {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show-modal");
        }
    });
});

/* ===================== BOTÓN CANCELAR EN MODAL ELIMINAR ===================== */
document.getElementById("btnCancelarEliminar").onclick = () => {
    modalEliminar.classList.remove("show-modal");
};
/* ===================== BOTÓN CONFIRMAR ELIMINAR ===================== */
document.getElementById("btnConfirmarEliminar").addEventListener("click", function () {
    const id = this.getAttribute("data-id");

    if (!id) {
        alert("Error: No se recibió el ID del producto.");
        return;
    }

    // Redirige al archivo PHP que elimina el producto
    window.location.href = "validar_eliminacion_producto.php?id_producto=" + id_producto;
});
