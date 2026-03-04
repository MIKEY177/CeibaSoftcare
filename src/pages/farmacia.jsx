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

export const indexSelector = 1;

export const Farmacia = () => {
  return (
    <>
      <head>
        <title>Farmacia - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuAdminFarmacia}/>
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
              <tbody className="body-tabla-actividad-reciente">
                <tr> 
                  <td>[Producto]</td> 
                  <td>[dd/mm/aaaa]</td> 
                  <td>[#]</td>
                  <td>[Actividad]</td>
                  <td><a href=""><button className="tabla-actividad-reciente-btn">Ver</button></a></td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="seccion2-modulos">
            <h3 className="titulo-area-gestion">Sub-Módulos de Gestión</h3>
            <section className="area-modulos">
              <Link to="/inventario">
                <div className="modulo-inventario">
                  <h4 className="titulo-modulo-inventario">Inventario</h4>
                  <figure className="modulo-inventario-icono">
                    <img className="modulo-inventario-img" src={inventarioIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/salidas_prod">
                <div className="modulo-salidas-productos">
                  <h4 className="titulo-modulo-salidas-productos">Salidas Productos</h4>
                  <figure className="modulo-salidas-productos-icono">
                    <img className="modulo-salidas-productos-img" src={salidaIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/entradas_prod">
                <div className="modulo-entradas-productos">
                  <h4 className="titulo-modulo-entradas-productos">Entradas Productos</h4>
                  <figure className="modulo-entradas-productos-icono">
                    <img className="modulo-entradas-productos-img" src={entradaIcon} alt=""/>
                  </figure>
                </div>
              </Link>
              <Link to="/eventos">
                <div className="modulo-brigadas">
                  <h4 className="titulo-modulo-brigadas">Brigadas</h4>
                  <figure className="modulo-brigadas-icono">
                    <img className="modulo-brigadas-img" src={brigadasIcon} alt=""/>
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