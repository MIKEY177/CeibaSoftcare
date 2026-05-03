// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/ajustes.css"
import editarIcon from "../images/icons/editar.png"
import subirIcon from "../images/subir.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"
import pfpPlaceholder from "../../images/pfp_placeholder.png"

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Menu } from '../components/Menu.jsx'

// const API = `api/inventario.php`;
// const API_SESSION = `api/session.php`;
export const indexSelector = 6;

export const Ajustes = () => {
  return (
    <>
      <head>
        <title>Ajustes - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Ajustes e Información del Usuario</h2>
          <section className='seccion1-ajustes'>
            <label className='user-info-avatar' style={{ gridArea: "avatar" }}>
              <figure className="avatar-ajustes" style={{ width: "220px", height: "220px" }}>
                <img className="avatar-img" src={pfpPlaceholder} alt="" />
              </figure>
              <h4>Imágen de Perfil</h4>
              <figure className="editar-ajustes" onClick={''}>
                <img className="editar-ajustes-img" src={editarIcon} alt="" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "nombre" }}>
              <h3>Nombre:&nbsp;</h3>
              <h4>[Nombre_del_Usuario].</h4>
              <figure className="editar-icono-ajus" onClick={''}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "correo" }}>
              <h3>Correo:&nbsp;</h3>
              <h4>[Correo_del_Usuario].</h4>
              <figure className="editar-icono-ajus" onClick={''}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "contrasena" }}>
              <h3>Contraseña:&nbsp;</h3>
              <h4>[Contraseña_del_Usuario].</h4>
              <figure className="editar-icono-ajus" onClick={''}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "rol" }}>
              <h3>Rol Actual:&nbsp;</h3>
              <h4>[Rol_del_Usuario].</h4>
              {/* <figure className="editar-icono-ajus" onClick={''}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure> */}
              <figure className="candado-icono-ajus">
                <img className="candado-icono-img" src={campoRestringido} alt="" />
              </figure>
            </label>
          </section>
        </section>
      </main>
      <Footer />

      <div className="modales-ajustes" style={{}}>

        {/* modal #1 editar Nombres */}

        <aside className="modal-ajustes-editar1">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Nombres
          </h1>

          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}

          <form className="ajustes-form" onSubmit={''}>
            <section className="ajustes-form-inputs-area1">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Nombres y Apellidos<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input1" type="text" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={''} disabled={''} />
          </form>
        </aside>

        {/* modal #2 editar Correo */}
        <aside className="modal-ajustes-editar2">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Correo
          </h1>

          <form className="ajustes-form" onSubmit={''}>
            <section className="ajustes-form-inputs-area2">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Correo Actual<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input2" type="text" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ajustes-label" for="">Nuevo Correo<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input2" type="text" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={''} disabled={''} />
          </form>
        </aside>

        {/* modal #3 editar Contraseña */}
        <aside className="modal-ajustes-editar3">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Contraseña
          </h1>

          <form className="ajustes-form" onSubmit={''}>
            <section className="ajustes-form-inputs-area3">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Contraseña Actual<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ajustes-label" for="">Nueva Contraseña<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="ajustes-label" for="">Confirmar Contraseña Nueva<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={''} disabled={''} />
          </form>
        </aside>

        {/* modal #4 editar Rol */}
        {/* <aside className="modal-ajustes-editar4">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Rol del Usuario
          </h1>


        </aside> */}

        {/* modal #5 editar Correo */}
        <aside className="modal-ajustes-editar5">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Imágen de Perfil
          </h1>

          <form className="ajustes-form-img-file" onSubmit={''}>
            <section className="ajustes-form-inputs-area5">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Subir Foto de Perfil<h6 className="obligatorio">*</h6></label>
                <label className="ajustes-input5">
                  <label className="ajustes-input5-form" for="file">
                    <figure className="subir-icono">
                      <img className="subir-icono-img" src={subirIcon} alt="Editar" />
                    </figure>
                    <h5>Seleccionar Archivo...</h5>
                    <input className="ajustes-input5-file-input" type="file" accept="image/*" id="file" value={''} onChange={''} />
                  </label>
                </label>
                
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={''} disabled={''} />
          </form>
        </aside>



      </div>
    </>
  )
} 