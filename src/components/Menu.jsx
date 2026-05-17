import React from "react";
import { Link, useLocation } from "react-router-dom";

// IMPORTS DE LOS INDEX SELECTOR
import { indexSelector as inicioIndex } from "../pages/inicio.jsx";
import { indexSelector as farmaciaIndex } from "../pages/farmacia.jsx";
import { indexSelector as productosIndex } from "../pages/productos.jsx";
import { indexSelector as entradasIndex } from "../pages/entradas_prod.jsx";
import { indexSelector as salidasIndex } from "../pages/salidas_prod.jsx";
import { indexSelector as eventosIndex } from "../pages/eventos.jsx";
import { indexSelector as animalesIndex } from "../pages/animales.jsx";
import { indexSelector as verificacionesIndex } from "../pages/verificaciones.jsx";
import { indexSelector as registrarVerificacionIndex } from "../pages/registrar_verificacion.jsx";
import { indexSelector as editarVerificacionIndex } from "../pages/editar_verificacion.jsx";
import { indexSelector as detalleVerificacionIndex } from "../pages/detalle_verificacion.jsx";
import { indexSelector as salidaAnimalesIndex } from "../pages/salidas_animales.jsx";
import { indexSelector as ingresoAnimalesIndex } from "../pages/ingreso_animales.jsx";
import { indexSelector as historiasIndex } from "../pages/historias_medicas.jsx";
import { indexSelector as verHistoriasIndex } from "../pages/ver_historias_medicas.jsx";
import { indexSelector as albergueIndex } from "../pages/albergue.jsx";
import { indexSelector as usuariosIndex } from "../pages/usuarios.jsx";

export const Menu = (props) => {

    const location = useLocation();

    // ELIMINA "/" FINAL
    const pathname =
        (location.pathname || "/").replace(/\/+$/, "") || "/";

    let indexSelector = -1;

    // LANDING E INICIO
    if (pathname === "/" || pathname.startsWith("/inicio")) {
        indexSelector = inicioIndex;
    }

    // FARMACIA
    else if (pathname.startsWith("/farmacia")) {
        indexSelector = farmaciaIndex;
    }


    // PRODUCTOS
    else if (pathname.startsWith("/productos")) {
        indexSelector = productosIndex;
    }

    // ENTRADAS PRODUCTOS
    else if (pathname.startsWith("/entradas_prod")) {
        indexSelector = entradasIndex;
    }

    // SALIDAS PRODUCTOS
    else if (pathname.startsWith("/salidas_prod")) {
        indexSelector = salidasIndex;
    }

    // EVENTOS
    else if (pathname.startsWith("/eventos")) {
        indexSelector = eventosIndex;
    }

    // ANIMALES
    else if (pathname.startsWith("/animales")) {
        indexSelector = animalesIndex;
    }

    // VERIFICACIONES
    else if (pathname.startsWith("/verificaciones")) {
        indexSelector = verificacionesIndex;
    }

    // REGISTRAR VERIFICACION
    else if (pathname.startsWith("/registrar_verificacion")) {
        indexSelector = registrarVerificacionIndex;
    }

    // EDITAR VERIFICACION
    else if (pathname.startsWith("/editar_verificacion")) {
        indexSelector = editarVerificacionIndex;
    }

    // DETALLE VERIFICACION
    else if (pathname.startsWith("/detalle_verificacion")) {
        indexSelector = detalleVerificacionIndex;
    }

    // SALIDA ANIMALES
    else if (pathname.startsWith("/salida_animales")) {
        indexSelector = salidaAnimalesIndex;
    }

    // INGRESO ANIMALES
    else if (pathname.startsWith("/ingreso_animales")) {
        indexSelector = ingresoAnimalesIndex;
    }

    // HISTORIAS MEDICAS
    else if (pathname.startsWith("/historias_medicas")) {
        indexSelector = historiasIndex;
    }

    // VER HISTORIAS MEDICAS
    else if (pathname.startsWith("/ver_historias_medicas")) {
        indexSelector = verHistoriasIndex;
    }

    // ALBERGUE
    else if (pathname.startsWith("/albergue")) {
        indexSelector = albergueIndex;
    }

    // USUARIOS
    else if (pathname.startsWith("/usuarios")) {
        indexSelector = usuariosIndex;
    }

    return (
        <>
            <div className="contenedor-nav">

                {Object.entries(props.menu).map(
                    ([path, label], index) => (

                        <Link key={path} to={path}>

                            <h2
                                className={
                                    index === indexSelector
                                        ? "selector opcion-nav"
                                        : "opcion-nav"
                                }
                            >
                                <span className="op-text">
                                    {label}
                                </span>
                            </h2>

                        </Link>
                    )
                )}

            </div>
        </>
    );
};