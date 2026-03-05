// Imports Base
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { indexSelector as inicioIndex } from "../pages/inicio.jsx"
import { indexSelector as farmaciaIndex} from "../pages/farmacia.jsx"
import { indexSelector as inventarioIndex} from "../pages/inventario.jsx"

export const Menu = (props) => {

  const location = useLocation()
  const pathname = (location.pathname || '/').replace(/\/+$/, '') || '/'

  let indexSelector = -1
  if (pathname === '/' || pathname === '/inicio') indexSelector = inicioIndex
  else if (pathname === '/farmacia') indexSelector = farmaciaIndex
  else if (pathname === '/inventario') indexSelector = inventarioIndex
  

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
            <Link to="/refugio"><h2 className="opcion-nav">Refugio</h2></Link>
            <Link to="/usuarios"><h2 className="opcion-nav">Usuarios</h2></Link> */}
        </div>
    </>
  )
}


// {props.menu.map((element, index)=>(
//     <Link key={index} to="/inicio"><h2 className="opcion-nav">{element}</h2></Link>
// ))}
