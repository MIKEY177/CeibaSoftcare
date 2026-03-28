import React, { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

import "../styles/global_styles.css"
import "../styles/inicio.css"
import farmaciaIcon from "../images/icons/farmacia-icon.png"
import albergueIcon from "../images/icons/albergue-icon.png"
import usuariosIcon from "../images/icons/usuarios-icon.png"

import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 0;

export const Inicio = () => {
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const BASE = import.meta.env.VITE_API_BASE ?? env(VITE_API_BASE);
  const API_SESSION = `${BASE}/session.php`;
  const API_EVE = `${BASE}/eventos.php`;
  useEffect(() => {
    // consultar eventos
    fetch(API_EVE, {
      credentials: "include"
    })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        setEventos(response.data);
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
      } else {
        navigate("/iniciar_sesion");
      }
    })
    .catch(error => {
      console.error("Error al obtener sesión:", error);
      navigate("/iniciar_sesion");
    });

  }, []);

  // compute menu object based on user role
  const menuObj = (() => {
    switch (user.rol) {
      case "administrador":
        return MenuAdmin;
      case "farmacéutico":
        return MenuFarmaceutico;
      case "veterinario":
        return MenuVeterinario;
      default:
        return {};
    }
  })();

  return (
    <>
      <main>
        {/* determine menu based on role */}
        <Navbar user={user} menu={menuObj} />
        <section className="secciones-dashboard">
          <h2 className="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
          <section className="seccion1-proximas-eventos">
            <h3 className="subtitulo-dashboard">Próximos Eventos</h3>
            <section className="area-eventos">
              {eventos.length === 0 ? (
                <p>No hay eventos programados.</p>
              ) : (
                eventos.map((evento) => (
                  <React.Fragment key={evento.id_evento}>
                    <div className="subarea-evento">
                      <h4 className="fecha">{evento.fecha_hora}</h4>
                      <article className="articulo-evento">
                        <h5 className="detalles-evento">{evento.nombre}</h5>
                        <h6 className="detalles-evento">Lugar:</h6>
                        <p className="detalles-evento">{evento.lugar}</p>
                        <h6 className="detalles-evento">Descripción:</h6>
                        <p className="detalles-evento">{evento.descripcion}</p>
                      </article>
                    </div>
                    <div className="separador-vertical"></div>
                  </React.Fragment>
                ))
              )}
            </section>
          </section>
          <section className="seccion2-modulos-i">
            <h3 className="subtitulo-dashboard">Módulos de Gestión</h3>
            <section className="area-modulos-i">
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/farmacia">
                  <div className="modulo-farmacia">
                    <h4 className="titulo-modulo-farmacia">Farmacia</h4>
                    <figure className="modulo-farmacia-icono">
                      <img className="modulo-farmacia-img" src={farmaciaIcon} alt=""/>
                    </figure>
                  </div>
                </Link>
              ) : ''}
              {user.rol === "administrador" || user.rol === "veterinario" ? (
                <Link to="/albergue">
                  <div className="modulo-albergue">
                    <h4 className="titulo-modulo-albergue">Albergue</h4>
                    <figure className="modulo-albergue-icono">
                      <img className="modulo-albergue-img" src={albergueIcon} alt=""/>
                    </figure>
                  </div>
                </Link>
              ) : ''}
              {user.rol === "administrador" ? (
                <Link to="/usuarios">
                  <div className="modulo-usuarios">
                    <h4 className="titulo-modulo-usuarios">Usuarios</h4>
                    <figure className="modulo-usuarios-icono">
                      <img className="modulo-usuarios-img" src={usuariosIcon} alt=""/>
                    </figure>
                  </div>
                </Link>
              ): ''}
            </section>
          </section>
        </section>
      </main>
      <Footer/>
    </>
  )
}