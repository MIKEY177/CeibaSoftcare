import React from "react";

import ceiba from '../images/ceiba_logo.png'

import "../styles/global_styles.css";
import "../styles/verificaciones.css";

import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu";

import { Navbar } from "../components/Navbar";
import { Menu } from "../components/Menu";
import { Footer } from "../components/Footer";

export const DetalleVerificacion = () => {
  return (
    <>
      <head>
        <title>Detalle Verificación - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className=" detalle-verificaciones">
          <h2 className="titulo-dashboard titulo-detalle-verificacion">Verificación [código]</h2>
          <section className="detalles-verificacion">
            <div className="datos-verificacion">
              <h5>Datos de Verificación</h5>
              <div className="campo-verificaciones">
                <strong>Tipo de Verificación</strong>
                <p></p>
              </div>
              <div className="campo-verificaciones">
                <strong>Tipo de Código</strong>
                <p></p>
              </div>
              <div className="campo-verificaciones">
                <strong>Código</strong>
                <p></p>
              </div>
              <div className="campo-verificaciones">
                <strong>Fecha Verificación</strong>
                <p></p>
              </div>
              <div className="campo-verificaciones p-final">
                  <strong>Responsable  de la verificación</strong>
                <p></p>
              </div>
            </div>

            <div className="datos-verificacion-propietario">
              <h5>Datos del Propietario</h5>
              <div className="campo-verificaciones propietario">
                <strong>Nombre</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones propietario">
                <strong>Identificación</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones propietario">
                <strong>Teléfono</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones propietario">
                <strong>Correo</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones propietario p-final">
                <strong>Dirección</strong>
              <p></p>
              </div>
            </div>

            <div className="datos-verificacion-especificaciones">
              <h5>Especificaciones</h5>
              <div className="campo-verificaciones">
                <strong>Nombre del animal</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones especificacion-descripcion">
                <strong>Descripción</strong>
              <p></p>
              </div>
              <div className="campo-verificaciones p-final">
                <strong>Registro Fotográfico</strong>
              <figure className="img-registro-fotografico">
                <img src={''} alt="" />
              </figure>
              </div>
            </div>
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};
