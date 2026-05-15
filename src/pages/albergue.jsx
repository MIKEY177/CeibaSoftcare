// Imports Base
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";

import { MenuAdmin, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos
import "../styles/global_styles.css"
import animalesIcon from "../images/icons/animales-icon.png"
import salidaIcon from "../images/icons/salida-animal-icon.png"
import ingresoIcon from "../images/icons/ingreso-animal-icon.png"
import eventosIcon from "../images/icons/eventos-icon.png"
import verificacionIcon from "../images/icons/verificacion-icon.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Notificaciones } from '../components/Notificaciones'

export const indexSelector = 1;

export const Albergue = () => {
  const [actividad, setActividad] = useState([]);
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();
  const API_SESSION = `api/session.php`;
  const API_ACT = `api/actividad_reciente_albergue.php`;

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
          setUser({ nombre: data.usuario, rol: data.rol, foto_perfil: data.foto_perfil });
          if (data.rol !== "administrador" && data.rol !== "veterinario") {
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

    const verActividad = (actividad, id,fecha) => {
    const path = actividad === "Ingreso" 
      ? "/ingreso_animales" 
      : "/salida_animales";

    navigate(
    `${path}/${id}/${encodeURIComponent(fecha)}`
   );
   };  

     const menuObj = (() => {
        switch (user.rol) {
          case "administrador":
            return MenuAdminAlbergue;
          case "veterinario":
            return MenuAdminAlbergue;
          default:
            return {};
        }
      })();

  return (
    <>
    <Helmet>
      <title>Albergue - Softcare</title>
    </Helmet>
      <main>
        <Navbar menu={menuObj} user={user}/>
        <Notificaciones />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Módulo Albergue</h2>
          <section className="seccion1-actividad-reciente">
            <h3 className="titulo-area-gestion">Actividad Reciente</h3>
            <table className="tabla-actividad-reciente">
              <thead className="header-tabla-actividad-reciente">
                <tr>
                  <td>Animal</td>
                  <td>Fecha</td>
                  <td>Motivo</td>
                  <td>Actividad</td>
                  <td>{/* Acciones */}</td>
                </tr>
              </thead>
              <tbody class="body-tabla-actividad-reciente">
                 {actividad.length > 0 ? (
                    actividad.map((item, index) => (
                      <tr key={index}>
                        <td>{item.animal}</td>
                        <td>{item.fecha}</td>
                        <td>{item.motivo}</td>
                        <td>{item.actividad}</td>
                        <td><button class="tabla-actividad-reciente-btn" onClick={()=>verActividad(item.actividad, item.id, item.fecha)}>Ver</button></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No hay actividad reciente</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </section>
          <section className="seccion2-modulos">
            <h3 className="titulo-area-gestion">Sub-Módulos de Gestión</h3>
            <section className="area-modulos">

                  <Link to="/animales">
                    <div className="modulo-productos">
                      <h4 className="titulo-modulo-productos">Registro Animales</h4>
                      <figure className="modulo-productos-icono">
                        <img className="modulo-productos-img" src={animalesIcon} alt=""/>
                      </figure>
                    </div>
                  </Link>

                  <Link to="/verificaciones">
                  <div className="modulo-verificaciones">
                    <h4 className="titulo-modulo-verificaciones">Verificaciones</h4>
                    <figure className="modulo-verificaciones-icono">
                      <img className="modulo-verificaciones-img" src={verificacionIcon} alt=""/>
                    </figure>
                  </div>
                </Link>
   
                  <Link to="/ingreso_animales">
                    <div className="modulo-entradas-productos">
                      <h4 className="titulo-modulo-entradas-productos">Ingresos Animales</h4>
                      <figure className="modulo-ingresos-animales-icono">
                        <img className="modulo-entradas-productos-img" src={ingresoIcon} alt=""/>
                      </figure>
                    </div>
                  </Link>

                <Link to="/salida_animales">
                  <div className="modulo-salidas-productos">
                    <h4 className="titulo-modulo-salidas-productos">Salidas Animales</h4>
                    <figure className="modulo-salidas-animales-icono">
                      <img className="modulo-salidas-productos-img" src={salidaIcon} alt=""/>
                    </figure>
                  </div>
                </Link>

                <Link to="/historias_medicas">
                  <div className="modulo-eventos">
                    <h4 className="titulo-modulo-eventos">Historias Médicas</h4>
                    <figure className="modulo-eventos-icono">
                      <img className="modulo-eventos-img" src={eventosIcon} alt=""/>
                    </figure>
                  </div>
                </Link> 

            </section>
          </section>
        </section>
      </main>
      <Footer/>
    </>
  )
}


// Arreglar la lista para navegar 