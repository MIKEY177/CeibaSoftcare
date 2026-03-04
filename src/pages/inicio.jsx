// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminRefugio, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/inicio.css"
import farmaciaIcon from "../images/icons/farmacia-icon.png"
import refugioIcon from "../images/icons/refugio-icon.png"
import usuariosIcon from "../images/icons/usuarios-icon.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

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
          <section className="seccion1-proximas-brigadas">
            <h3 className="subtitulo-dashboard">Próximas Brigadas</h3>
            <section className="area-brigadas">
              <div className="subarea-brigada">
                <h4 className="fecha">08 de Abril del 2025</h4>
                <article className="articulo-brigada">
                  <h5 className="detalles-brigada">[Nombre brigada]</h5>
                  <h6 className="detalles-brigada">Lugar:</h6>
                  <p className="detalles-brigada">[contenidooooooooooooooooooo]</p>
                  <h6 className="detalles-brigada">Descripción:</h6>                                           
                  <p className="detalles-brigada">[contenidoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo]</p>
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
              <Link to="/refugio">
                <div className="modulo-refugio">
                  <h4 className="titulo-modulo-refugio">Refugio</h4>
                  <figure className="modulo-refugio-icono">
                    <img className="modulo-refugio-img" src={refugioIcon} alt=""/>
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
