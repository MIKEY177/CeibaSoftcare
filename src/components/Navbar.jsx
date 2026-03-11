// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from "./Menu.jsx";

// Estilos e imágenes
import "../styles/compsStyles/Navbar.css"
import rolStand from "../images/rol_stand.png"

export const Navbar = (props) => {
  return (
    <>
    <aside className="vertical-navbar">
        <div className="perfil">
            <figure className="avatar">
                <img className="avatar-img" src="" alt=""/>
            </figure>
            <h1 className="perfil-nombre">[Username...]</h1>
            <figure className="perfil-rol">
                <img className="perfil-rol-img" src={rolStand} alt=""/>
                <h1 className="perfil-rol-texto">[Rol]</h1>
            </figure>
        </div>
        {/* <div className="contenedor-nav">
            <Link to="/inicio"><h2 className="opcion-nav">Inicio</h2></Link>
            <Link to="/farmacia"><h2 className="opcion-nav">Farmacia</h2></Link>
            <Link to="/albergue"><h2 className="opcion-nav">Albergue</h2></Link>
            <Link to="/usuarios"><h2 className="opcion-nav">Usuarios</h2></Link>
        </div> */}
        <Menu menu={props.menu}/>
        <a href="" className="btn-link"><button className="cerrar-sesion-btn">Cerrar Sesión</button></a>
    </aside>
    </>
  )
}
