// Imports Base
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
// import Avatar from "boring-avatars";
import { Menu } from "./Menu.jsx";
import settings from "../../images/settings.png"

// Estilos e imágenes
import "../styles/compsStyles/Navbar.css"
import rolStand       from "../images/rol_stand.png"
import pfpPlaceholder from "../../images/pfp_placeholder.png"
import { getColorFromName } from '../utils/initial_colors.jsx';

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

 
  const username = user?.nombre; 
  const { bg, fg } = getColorFromName(username);  


  return (
    <aside className="vertical-navbar">
      <Link className="ajustes" key={''} to={"/ajustes"}>
        <img className="ajustes-img" src={settings} alt="" />
      </Link>
      <div className="perfil">
        <figure className="avatar">
        {user?.foto_perfil ? (
            <img className="avatar-img" src={user.foto_perfil} alt={user.nombre} style={{ width: "100%", height: "100%" }} />
          ) : ( 
          <Avatar className="avatar-img" name={user?.nombre} size="100%"   style={{ width: "100%", height: "100%" }}  color={bg} fgColor={fg}/>
          )}
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
