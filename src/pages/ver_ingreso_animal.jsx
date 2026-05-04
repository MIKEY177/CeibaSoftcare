import React from "react";
import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

import "../styles/global_styles.css";
import "../styles/ver_ingreso_animal.css";

import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";

export const indexSelector = 6;

export const VerIngresoAnimal = () => {
  return (
    <>
      <head>
        <title>Detalle de Ingreso del Animal - SoftCare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Ingreso del animal [id_animal]</h2>
          <table className="tabla-ver-ingreso-animal">
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Persona que reporta</td>
                <td>Cédula de quien reporta</td>
                <td>Dirección de quien reporta</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Telefono de quien reporta</td>
                <td>Funcionario que autoriza</td>
                <td>Cédula del funcionario</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
              <tr>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Fecha de ingreso</td>
                <td>Motivo de ingreso</td>
                <td>Verificación</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
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
