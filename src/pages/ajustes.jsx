// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/ajustes.css"
import editarIcon from "../images/icons/editar.png"
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
            <button className="editar-ajustes" onClick={''}>
              <img className="editar-ajustes-img" src={editarIcon} alt="" />
            </button>
            <label className='user-info-avatar' style={{ gridArea: "avatar" }}>
              <figure className="avatar-ajustes" style={{ width: "220px", height: "220px" }}>
                <img className="avatar-img" src={pfpPlaceholder} alt="" />
              </figure>
              <h4>Imágen de Perfil</h4>
            </label>
            <label className='user-info' style={{ gridArea: "nombre" }}>
              <h3>Nombre:&nbsp;</h3>
              <h4>[Nombre_del_Usuario].</h4>
            </label>
            <label className='user-info' style={{ gridArea: "correo" }}>
              <h3>Correo:&nbsp;</h3>
              <h4>[Correo_del_Usuario].</h4>
            </label>
            <label className='user-info' style={{ gridArea: "contrasena" }}>
              <h3>Contraseña:&nbsp;</h3>
              <h4>[Contraseña_del_Usuario].</h4>
            </label>
            <label className='user-info' style={{ gridArea: "rol" }}>
              <h3>Rol Actual:&nbsp;</h3>
              <h4>[Rol_del_Usuario].</h4>
            </label>
          </section>
        </section>
      </main>
      <Footer />
      
      <div className="modales-ajustes" style={{}}>
        <aside className="modal-ajustes-editar">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Información del Usuario
          </h1>

          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}

          <form className="ajustes-form" onSubmit={''}>
            <section className="ajustes-form-inputs-area">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Imágen de perfil</label>
                <input className="ajustes-input1" type="file" accept="image/*" value={''} onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ajustes-label" for="">Nombre<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input2" type="text" value={'[Tipo]'} onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="ajustes-label" for="">Correo<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="text" value={'[Nombre_del_Ajuste]'} onChange={''} />
                {/* <span className="error-mensaje">{errores.descripcion ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt4" }}>
                <label className="ajustes-label" for="">Especie<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input4" type="text" value={'[Especie]'} onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt5" }}>
                <label className="ajustes-label" for="">Sexo<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input5" type="text" value={'[Sexo]'} onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt6" }}>
                <label className="ajustes-label" for="">Edad Estimada<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input6" type="text" value={'[Edad_Estimada]'} onChange={''} />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div className="label-and-input-container" style={{ gridArea: "divInpt7" }}>
                <label className="ajustes-label" for="">Usuario que Registra</label>
                <div className="union-input-icono">
                  <input className="ajustes-input7" type="text" value={'[Usuario_que_Registra]'} readOnly />
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt="" />
                  </figure>
                </div>
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={''} disabled={''} />
          </form>
        </aside>
      </div>
    </>
  )
} 