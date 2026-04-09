// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'

export const indexSelector = 5;

export const Eventos = () => {
  return (
    <>
        <head>
            <title>Eventos - Softcare</title>
        </head>
        <main>
            <Navbar menu={MenuAdminFarmacia}/>
            
        </main>
        <Footer/>
        <div className="modales-eventos">

        </div>
    </>
  )
}