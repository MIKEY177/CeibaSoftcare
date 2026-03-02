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
    <aside class="vertical-navbar">
        <div class="perfil">
            <figure class="avatar">
                <img class="avatar-img" src="" alt=""/>
            </figure>
            <h1 class="perfil-nombre">[Username...]</h1>
            <figure class="perfil-rol">
                <img class="perfil-rol-img" src={rolStand} alt=""/>
                <h1 class="perfil-rol-texto">[Rol]</h1>
            </figure>
        </div>
        {/* <div class="contenedor-nav">
            <Link to="/inicio"><h2 class="opcion-nav">Inicio</h2></Link>
            <Link to="/farmacia"><h2 class="opcion-nav">Farmacia</h2></Link>
            <Link to="/refugio"><h2 class="opcion-nav">Refugio</h2></Link>
            <Link to="/usuarios"><h2 class="opcion-nav">Usuarios</h2></Link>
        </div> */}
        <Menu menu={props.menu}/>
        <a href="" class="btn-link"><button class="cerrar-sesion-btn">Cerrar Sesión</button></a>
    </aside>
    </>
  )
}
