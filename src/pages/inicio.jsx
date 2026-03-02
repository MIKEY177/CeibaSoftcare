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
        <section class="secciones-dashboard">
          <h2 class="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
          <section class="seccion1-proximas-brigadas">
            <h3 class="subtitulo-dashboard">Próximas Brigadas</h3>
            <section class="area-brigadas">
              <div class="subarea-brigada">
                <h4 class="fecha">08 de Abril del 2025</h4>
                <article class="articulo-brigada">
                  <h5 class="detalles-brigada">[Nombre brigada]</h5>
                  <h6 class="detalles-brigada">Lugar:</h6>
                  <p class="detalles-brigada">[contenidooooooooooooooooooo]</p>
                  <h6 class="detalles-brigada">Descripción:</h6>                                           
                  <p class="detalles-brigada">[contenidoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo]</p>
                </article>
              </div>
              <div class="separador-vertical"></div>
            </section>
          </section>
          <section class="seccion2-modulos-i">
            <h3 class="subtitulo-dashboard">Módulos de Gestión</h3>
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
