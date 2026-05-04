import React, { useEffect, useState, useRef } from 'react'
import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

import "../styles/global_styles.css";
import "../styles/ver_ingreso_animal.css";
import { useParams, useNavigate } from "react-router-dom";

import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";

export const indexSelector = 6;

export const VerIngresoAnimal = () => {
  const [ingreso, setIngreso] = useState(null);
  const [user, setUser] = useState({});
  const [menu, setMenu] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const API = `api/ingreso_animales.php?id=${id}`;
  const API_SESSION = `api/session.php`;
  

  useEffect(() => {
    fetch(API, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setIngreso(data.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del ingreso:", error);
      });
  }, [navigate]);

  useEffect(() => {
        fetch(API_SESSION, { credentials: "include" })
          .then(res => res.json())
          .then(data => {
            if (data.status === "ok") {
              setUser({ nombre: data.usuario, rol: data.rol });
              if (data.rol === "farmacéutico") navigate("/albergue");
              setMenu(MenuAdminAlbergue);
            } else {
              navigate("/iniciar_sesion");
            }
          })
          .catch(() => navigate("/iniciar_sesion"));
      }, []);

  
 
  return (
    <>  
      <head>
        <title>Detalle de Ingreso del Animal - SoftCare</title>
      </head>
      <main>
        <Navbar menu={menu} user= {user} />
        { ingreso && ( 
        <section className="secciones-area-gestion">   
         <h2 className="titulo-dashboard">Ingreso de animal #{id}</h2>
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
                <th>{ingreso.persona_reporta}</th>
                <th>{ingreso.cedula_reporta}</th>
                <th>{ingreso.direccion_reporta}</th>
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
                <th>{ingreso.telefono_reporta}</th>
                <th>{ingreso.funcionario_autoriza}</th>
                <th>{ingreso.cedula_realiza}</th>
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
                <th>{ingreso.fecha_hora_ingreso}</th>
                <th>{ingreso.motivo_ingreso}</th>
                <th>[{ingreso.fecha}] {ingreso.nombre}</th>
              </tr>
            </tbody>
          </table>
        </section>
        ) }
      </main>
      <Footer />
    </>
  );
};
