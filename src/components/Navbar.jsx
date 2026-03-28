// Imports Base
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from "./Menu.jsx";

// Estilos e imágenes
import "../styles/compsStyles/Navbar.css"
import rolStand from "../images/rol_stand.png"

export const Navbar = ({ user, menu }) => {
  const navigate = useNavigate();
  const API         = `api/logout.php`;
  const cerrarSesion = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.status === "success") {
        navigate("/iniciar_sesion");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <aside className="vertical-navbar">
      <div className="perfil">
        <figure className="avatar">
          <img className="avatar-img" src="" alt=""/>
        </figure>
        {/* Nombre del usuario */}
        <h1 className="perfil-nombre">{user?.nombre}</h1>
        <figure className="perfil-rol">
          <img className="perfil-rol-img" src={rolStand} alt=""/>
          {/* Rol del usuario */}
          <h1 className="perfil-rol-texto">{user?.rol}</h1>
        </figure>
      </div>

      <Menu menu={menu}/>

    
        <button className="cerrar-sesion-btn" onClick={cerrarSesion}>
          Cerrar Sesión
        </button>
    </aside>
  )
}
