// Imports Base
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { indexSelector as inicioIndex } from "../pages/inicio.jsx"
import { indexSelector as farmaciaIndex} from "../pages/farmacia.jsx"
import { indexSelector as productosIndex} from "../pages/productos.jsx"
import { indexSelector as entradasIndex } from '../pages/entradas_prod.jsx'
import { indexSelector as salidasIndex} from "../pages/salidas_prod.jsx"
import { indexSelector as eventosIndex } from '../pages/eventos.jsx'

export const Menu = (props) => {

  const location = useLocation()
  const pathname = (location.pathname || '/').replace(/\/+$/, '') || '/'

  let indexSelector = -1
  if (pathname === '/' || pathname === '/inicio') indexSelector = inicioIndex
  else if (pathname === '/farmacia') indexSelector = farmaciaIndex
  else if (pathname === '/productos') indexSelector = productosIndex
  else if (pathname === '/entradas_prod') indexSelector = entradasIndex
  else if (pathname === '/salidas_prod') indexSelector = salidasIndex
  else if (pathname === '/eventos') indexSelector = eventosIndex
  

  return (
    <>
        <div className="contenedor-nav">
            {Object.entries(props.menu).map(([path, label], index) => (
                <Link key={path} to={path}>
                  <h2 className={index === indexSelector ? "selector opcion-nav" : "opcion-nav"}>
                    <span className="op-text">{label}</span>
                  </h2>
                </Link>
            ))}

            {/* <Link to="/inicio"><h2 className="opcion-nav">Inicio</h2></Link>
            <Link to="/farmacia"><h2 className="opcion-nav">Farmacia</h2></Link>
            <Link to="/albergue"><h2 className="opcion-nav">Albergue</h2></Link>
            <Link to="/usuarios"><h2 className="opcion-nav">Usuarios</h2></Link> */}
        </div>
    </>
  )
}


// {props.menu.map((element, index)=>(
//     <Link key={index} to="/inicio"><h2 className="opcion-nav">{element}</h2></Link>
// ))}
