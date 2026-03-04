// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminRefugio, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/inicio.css"
import editarIcon from "../images/icons/editar.png"
import eliminarIcon from "../images/icons/eliminar.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const Inventario = () => {
  return (
    <>
    <head>
      <title>Inventario - Softcare</title>
    </head>
    <main>
      <Navbar menu={MenuAdminFarmacia}/>
      <section class="secciones-area-gestion">
        <section class="seccion1-busqueda-agregar">
          <form class="busqueda-form" action="" method="">
            <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id=""/>
              <button class="busqueda-icono" type="submit">
                <img class="busqueda-icono-img" src="" alt=""/>
              </button>
              <a href="">
                <figure class="busqueda-barras-icono">
                  <img class="busqueda-barras-icono-img" src="" alt=""/>
                </figure>
              </a>
          </form>
          <a href="">
            <button class="registrar-btn">Registrar Producto</button>
          </a>
        </section>
        <table class="tabla-inventario">
          <thead class="header-tabla-inventario">
            <tr>
              <td>Producto</td>
              <td>Descripción</td>
              <td>Unidad de Medida</td>
              <td>Registró</td>
              <td>Editar | Eliminar</td>
            </tr>
          </thead>
          <tbody class="body-tabla-inventario">
            <tr>
              <td>[Producto]</td> 
              <td>[Descripción]</td> 
              <td>[#]</td> 
              <td>[Nombre_mediante_id]</td> 
              <td>
                <a href="">
                  <figure class="editar-icono">
                    <img class="editar-icono-img" src="" alt=""/>
                  </figure>
                </a>
                <a href="">
                  <figure class="eliminar-icono">
                    <img class="eliminar-icono-img" src="" alt=""/>
                  </figure>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
    <Footer/>
    </>
  )
}
