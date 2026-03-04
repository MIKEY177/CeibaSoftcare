// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'

export const Menu = (props) => {
  return (
    <>
        <div className="contenedor-nav">

            {Object.entries(props.menu).map(([path, label]) => (
                <Link key={path} to={path}><h2 className="opcion-nav">{label}</h2></Link>
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
