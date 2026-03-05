import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin } from "../utils/menu.jsx"

import "../styles/global_styles.css"
import "../styles/inicio.css"
import farmaciaIcon from "../images/icons/farmacia-icon.png"
import refugioIcon from "../images/icons/refugio-icon.png"
import usuariosIcon from "../images/icons/usuarios-icon.png"

import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const Inicio = () => {

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    fetch("http://localhost/Ceibasoftcare/backend/api/eventos.php", {
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
  }, []);
  return (
    <>
      <main>
        <Navbar menu={MenuAdmin}/>
        <section className="secciones-dashboard">
          <h2 className="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
          <section className="seccion1-proximas-brigadas">
            <h3 className="subtitulo-dashboard">Próximos Eventos</h3>
            <section className="area-brigadas">
              {eventos.length === 0 ? (
                <p>No hay eventos programados.</p>
              ) : (
                eventos.map((evento) => (
                  <>
                    <div className="subarea-brigada" key={evento.id_evento}>
                      <h4 className="fecha">{evento.fecha_hora}</h4>
                      <article className="articulo-brigada">
                        <h5 className="detalles-brigada">{evento.nombre}</h5>
                        <h6 className="detalles-brigada">Lugar:</h6>
                        <p className="detalles-brigada">{evento.lugar}</p>
                        <h6 className="detalles-brigada">Descripción:</h6>
                        <p className="detalles-brigada">{evento.descripcion}</p>
                      </article>
                    </div>
                    <div className="separador-vertical"></div>
                  </>
                ))
              )}
            </section>
          </section>
          <section className="seccion2-modulos-i">
            <h3 className="subtitulo-dashboard">Módulos de Gestión</h3>

            <section class="area-modulos-i">
              <Link to="/farmacia">
                <div class="modulo-farmacia">
                  <h4 class="titulo-modulo-farmacia">Farmacia</h4>
                  <figure class="modulo-farmacia-icono">
                    <img class="modulo-farmacia-img" src={farmaciaIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/refugio">
                <div class="modulo-refugio">
                  <h4 class="titulo-modulo-refugio">Refugio</h4>
                  <figure class="modulo-refugio-icono">
                    <img class="modulo-refugio-img" src={refugioIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/usuarios">
                <div class="modulo-usuarios">
                  <h4 class="titulo-modulo-usuarios">Usuarios</h4>
                  <figure class="modulo-usuarios-icono">
                    <img class="modulo-usuarios-img" src={usuariosIcon} alt=""/>
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
