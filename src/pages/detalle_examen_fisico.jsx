import React from "react";
import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

import "../styles/global_styles.css";
import "../styles/detalle_examen_fisico.css";

import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";

export const indexSelector = 6;

export const DetalleExamenFisico = () => {
  return (
    <>
      <head>
        <title>Detalle del Exámen Físico - SoftCare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion-examenes-fisicos">
          <h2 className="titulo-dashboard">Exámen Fisico [fecha_creacion]</h2>
          <section className="seccion1-busqueda-agregar">
            <button className="registrar-btn" onClick={""}>
              Registrar Salida
            </button>
          </section>
          <table className="tabla-detalles-examenes-fisicos">
            <thead className="header-tabla-detalles-examenes-fisicos">
              <tr>
                <td>Frecuencia Cardiaca</td>
                <td>Frecuencia Respiratoria</td>
                <td>Mucosa</td>
              </tr>
            </thead>
            <tbody className="body-tabla-detalles-examenes-fisicos">
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
            <thead className="header-tabla-detalles-examenes-fisicos">
              <tr>
                <td>Temperatura Rectal</td>
                <td>Tiempo de Llenado Capilar</td>
                <td>Condición Corporal</td>
              </tr>
            </thead>
            <tbody className="body-tabla-detalles-examenes-fisicos">
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <Footer />
    </>
  );
};
