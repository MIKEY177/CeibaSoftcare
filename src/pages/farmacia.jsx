// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminRefugio, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos
import "../styles/global_styles.css"
import inventarioIcon from "../images/icons/inventario-icon.png"
import salidaIcon from "../images/icons/salida-icon.png"
import entradaIcon from "../images/icons/entrada-icon.png"
import brigadasIcon from "../images/icons/brigadas-icon.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const Farmacia = () => {
  return (
    <>
      <head>
        <title>Farmacia - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuAdminFarmacia}/>
        <section class="secciones-area-gestion">
          <h2 class="titulo-dashboard">Módulo Farmacia</h2>
          <section class="seccion1-actividad-reciente">
            <h3 class="titulo-area-gestion">Actividad Reciente</h3>
            <table class="tabla-actividad-reciente">
              <thead class="header-tabla-actividad-reciente">
                <tr>
                  <td>Producto</td>
                  <td>Fecha</td>
                  <td>Cantidad</td>
                  <td>Actividad</td>
                  <td>{/* Acciones */}</td>
                </tr>
              </thead>
              <tbody class="body-tabla-actividad-reciente">
                <tr> 
                  <td>[Producto]</td> 
                  <td>[dd/mm/aaaa]</td> 
                  <td>[#]</td>
                  <td>[Actividad]</td>
                  <td><a href=""><button class="tabla-actividad-reciente-btn">Ver</button></a></td>
                </tr>
              </tbody>
            </table>
          </section>
          <section class="seccion2-modulos">
            <h3 class="titulo-area-gestion">Sub-Módulos de Gestión</h3>
            <section class="area-modulos">
              <a href="">
                <div class="modulo-inventario">
                  <h4 class="titulo-modulo-inventario">Inventario</h4>
                  <figure class="modulo-inventario-icono">
                    <img class="modulo-inventario-img" src={inventarioIcon} alt=""/>
                  </figure>
                </div>
              </a>
              <a href="">
                <div class="modulo-salidas-productos">
                  <h4 class="titulo-modulo-salidas-productos">Salidas Productos</h4>
                  <figure class="modulo-salidas-productos-icono">
                    <img class="modulo-salidas-productos-img" src={salidaIcon} alt=""/>
                  </figure>
                </div>
              </a>
              <a href="">
                <div class="modulo-entradas-productos">
                  <h4 class="titulo-modulo-entradas-productos">Entradas Productos</h4>
                  <figure class="modulo-entradas-productos-icono">
                    <img class="modulo-entradas-productos-img" src={entradaIcon} alt=""/>
                  </figure>
                </div>
              </a>
              <a href="">
                <div class="modulo-brigadas">
                  <h4 class="titulo-modulo-brigadas">Brigadas</h4>
                  <figure class="modulo-brigadas-icono">
                    <img class="modulo-brigadas-img" src={brigadasIcon} alt=""/>
                  </figure>
                </div>
              </a>    
            </section>
          </section>
        </section>
      </main>
      <Footer/>
    </>
  )
}


// Arreglar la lista para navegar 