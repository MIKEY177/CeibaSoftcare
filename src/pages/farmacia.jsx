// Imports Base
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos
import "../styles/global_styles.css"
import productosIcon from "../images/icons/productos-icon.png"
import salidaIcon from "../images/icons/salida-icon.png"
import entradaIcon from "../images/icons/entrada-icon.png"
import eventosIcon from "../images/icons/eventos-icon.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 1;

export const Farmacia = () => {
  const [actividad, setActividad] = useState([]);
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();
  const BASE        = import.meta.env.VITE_API_BASE;
  const API_SESSION = `${BASE}/session.php`;
  const API_ACT = `${BASE}/actividad_reciente.php`;

  useEffect(() => {
      fetch(API_ACT,{
      credentials: "include"
      })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setActividad(response.data);
        } else {
          console.error(response.error);
        }
      })
      .catch(error => console.error(error));

      // consultar sesión
      fetch(API_SESSION, {
        credentials: "include"
      })
      .then(res => res.json())
      .then(data => {
        console.log("Datos de sesión:", data);
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol });
          if (data.rol !== "administrador" && data.rol !== "farmacéutico") {
            navigate("/inicio");
          }
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(error => {
        console.error("Error al obtener sesión:", error);
        navigate("/iniciar_sesion");
      });
    }, []);

     const menuObj = (() => {
        switch (user.rol) {
          case "administrador":
            return MenuAdminFarmacia;
          case "farmacéutico":
            return MenuFarmaceutico;
          default:
            return {};
        }
      })();

  return (
    <>
      <head>
        <title>Farmacia - Softcare</title>
      </head>
      <main>
        <Navbar user={user} menu={menuObj} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Módulo Farmacia</h2>
          <section className="seccion1-actividad-reciente">
            <h3 className="titulo-area-gestion">Actividad Reciente</h3>
            <table className="tabla-actividad-reciente">
              <thead className="header-tabla-actividad-reciente">
                <tr>
                  <td>Producto</td>
                  <td>Fecha</td>
                  <td>Cantidad</td>
                  <td>Actividad</td>
                  <td>{/* Acciones */}</td>
                </tr>
              </thead>
              <tbody class="body-tabla-actividad-reciente">
                 {actividad.length === 0 ? (
                <p>No hay actividad reciente.</p>
              ) : (
                actividad.map((activity) => (
                <tr> 
                  <td>{activity.producto}</td> 
                  <td>{activity.fecha}</td> 
                  <td>{activity.cantidad}</td>
                  <td>{activity.actividad}</td>
                  <td><a href=""><button class="tabla-actividad-reciente-btn">Ver</button></a></td>
                </tr>
                ))
              )}
              </tbody>
            </table>
          </section>
          <section className="seccion2-modulos">
            <h3 className="titulo-area-gestion">Sub-Módulos de Gestión</h3>
            <section className="area-modulos">
              
                {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                  <Link to="/productos">
                    <div className="modulo-productos">
                      <h4 className="titulo-modulo-productos">Productos</h4>
                      <figure className="modulo-productos-icono">
                        <img className="modulo-productos-img" src={productosIcon} alt=""/>
                      </figure>
                    </div>
                  </Link>) 
                : ''}
                {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                  <Link to="/entradas_prod">
                    <div className="modulo-entradas-productos">
                      <h4 className="titulo-modulo-entradas-productos">Entradas Productos</h4>
                      <figure className="modulo-entradas-productos-icono">
                        <img className="modulo-entradas-productos-img" src={entradaIcon} alt=""/>
                      </figure>
                    </div>
                  </Link>)
                : ''}
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/salidas_prod">
                  <div className="modulo-salidas-productos">
                    <h4 className="titulo-modulo-salidas-productos">Salidas Productos</h4>
                    <figure className="modulo-salidas-productos-icono">
                      <img className="modulo-salidas-productos-img" src={salidaIcon} alt=""/>
                    </figure>
                  </div>
                </Link>)
              : ''}
              {user.rol === "administrador" ?(
                <Link to="/eventos">
                  <div className="modulo-eventos">
                    <h4 className="titulo-modulo-eventos">Eventos</h4>
                    <figure className="modulo-eventos-icono">
                      <img className="modulo-eventos-img" src={eventosIcon} alt=""/>
                    </figure>
                  </div>
                </Link> )
              : ''}   
            </section>
          </section>
        </section>
      </main>
      <Footer/>
    </>
  )
}


// Arreglar la lista para navegar 