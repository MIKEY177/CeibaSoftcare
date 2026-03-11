// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/inicio.css"
import farmaciaIcon from "../images/icons/farmacia-icon.png"
import albergueIcon from "../images/icons/albergue-icon.png"
import usuariosIcon from "../images/icons/usuarios-icon.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 0;

export const Inicio = () => {

  return (
    <>
      <head>
        <title>Inicio - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuAdmin}/>
        <section className="secciones-dashboard">
          <h2 className="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
          <section className="seccion1-proximas-eventos">
            <h3 className="subtitulo-dashboard">Próximas eventos</h3>
            <section className="area-eventos">
              <div className="subarea-evento">
                <h4 className="fecha">08 de Abril del 2025</h4>
                <article className="articulo-evento">
                  <h5 className="detalles-evento">[Nombre evento]</h5>
                  <h6 className="detalles-evento">Lugar:</h6>
                  <p className="detalles-evento">[contenidooooooooooooooooooo]</p>
                  <h6 className="detalles-evento">Descripción:</h6>                                           
                  <p className="detalles-evento">[contenidoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo]</p>
                </article>
              </div>
              <div className="separador-vertical"></div>
            </section>
          </section>
          <section className="seccion2-modulos-i">
            <h3 className="subtitulo-dashboard">Módulos de Gestión</h3>
            <section className="area-modulos-i">
              <Link to="/farmacia">
                <div className="modulo-farmacia">
                  <h4 className="titulo-modulo-farmacia">Farmacia</h4>
                  <figure className="modulo-farmacia-icono">
                    <img className="modulo-farmacia-img" src={farmaciaIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/albergue">
                <div className="modulo-albergue">
                  <h4 className="titulo-modulo-albergue">Albergue</h4>
                  <figure className="modulo-albergue-icono">
                    <img className="modulo-albergue-img" src={albergueIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/usuarios">
                <div className="modulo-usuarios">
                  <h4 className="titulo-modulo-usuarios">Usuarios</h4>
                  <figure className="modulo-usuarios-icono">
                    <img className="modulo-usuarios-img" src={usuariosIcon} alt=""/>
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
