// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminRefugio, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import editarIcon from "../images/icons/editar.png"
import eliminarIcon from "../images/icons/eliminar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 4;

export const SalidasProd = () => {
  return (
    <>
        <head>
            <title>Salidas de Productos - Softcare</title>
        </head>
        <main>
            <Navbar menu={MenuAdminFarmacia}/>
            
        </main>
        <Footer/>
        <div className="modales-salidas-prod">

        </div>
    </>
  )
}