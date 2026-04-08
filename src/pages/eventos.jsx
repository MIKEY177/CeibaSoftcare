// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/eventos.css"

import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'

export const indexSelector = 5;

export const Eventos = () => {
  return (
    <>
        <head>
            <title>Eventos - Softcare</title>
        </head>
        <main>
          <Navbar menu={MenuAdminFarmacia}/>
          <section className="secciones-area-gestion">
            <h2 className="titulo-dashboard">Eventos</h2> 
            <section className="seccion1-busqueda-agregar">
              <form className="busqueda-form" onSubmit="">
                <input className="busqueda-input1" type="text" placeholder="Busca un evento" value={""} onChange={""}/>
                <button className="diff_busqueda-icono" type="button">
                  <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
                </button>
              </form>
              <button className="diff_registrar-btn" type="button" onClick={""}>
                Registrar nuevo Evento
              </button>
            </section>
            <table className="tabla-eventos">
              <thead className="header-tabla-eventos">
                <tr>
                  <td>Nombre</td>
                  <td>Fecha y Hora</td>
                  <td>Lugar</td>
                  <td>Editar | Desactivar</td>
                </tr>
              </thead>
              <tbody className="body-tabla-eventos">
                <tr>
                  <td>[Nombre]</td>
                  <td>[Fecha]</td>
                  <td>[Lugar]</td>
                  <td>
                    <div className="last-td-flex-content-wrapper">
                      <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={""}>
                        <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                      </figure>
                      <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={""}>
                        <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar" />
                      </figure>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </main>
        <Footer/>
        <div className="modales-eventos">
          {/* ── MODAL 1: Registrar Evento ──────────────────────────────────── */}

          <aside className="modal-eventos-registrar">
            <button className="volver-btn-even" onClick={""}>
              <img className="volver-icono" src={flecha} alt=""/>
              <h2>Volver</h2>
            </button>
            <h1 className="modal-er-titulo">
              Registre un nuevo Evento
            </h1>
                    {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
                    {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>} */}
      
            <form className="er-form" onSubmit={""}>
              <section className="er-form-inputs-area">
                <div style={{gridArea: "divInpt1"}}>
                  <label className="er-label" for="">Nombre del Evento<h6 className="obligatorio">*</h6></label>
                  <input className="er-input1" type="text" 
                    value={""} 
                    onChange={""}
                  />
                          {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
                </div>
                <div style={{gridArea: "divInpt2"}}>
                  <label className="er-label" for="">Descripción<h6 className="obligatorio">*</h6></label>
                  <textarea className="er-input2" name="er-descripcion" 
                    value={""} onChange={""}
                  />
                          {/* <span className="error-mensaje">{errores.descripcion ?? ""}</span> */}
                </div>
                <div style={{gridArea: "divInpt3"}}> 
                  <label className="er-label" for="">Salida de Producto<h6 className="obligatorio">*</h6></label>
                  <select className="er-input3" 
                    value={""} 
                    onChange={""}
                    >
                    <option value="">-- Selecciona --</option>
                  </select>
                          {/* <span className="error-mensaje">{errores.tipo_medida ?? ""}</span> */}
                </div>
                <div style={{ gridArea: "divInpt4" }}>
                  <label className="er-label">Fecha y Hora<span className="obligatorio">*</span></label>
                  <input className="er-input4" type="datetime-local"
                    value={""}
                    onChange={""}
                  />
                  {/* <span className="error-mensaje">{errores.fecha_hora ?? ""}</span> */}
                </div>
                <div style={{gridArea: "divInpt5"}}> 
                  <label className="er-label" for="">Lugar<h6 className="obligatorio">*</h6></label>
                  <input className="er-input5" type="text" 
                    value={""} 
                    onChange={""}
                  />
                          {/* <span className="error-mensaje">{errores.cantidad_por_unidad ?? ""}</span> */}
                </div>
              </section>
              <input className="er-btn" type="submit" value="Registrar Evento"/>
            </form>
          </aside>
          {/* ── MODAL 2: Editar Evento ──────────────────────────────────── */}

          <aside className="modal-eventos-editar">
            <button className="volver-btn-even" onClick={""}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-eed-titulo">
              Editar Evento Registrado
            </h1>
              {/*      {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
        
            <form className="eed-form" onSubmit={""}>
              <section className="eed-form-inputs-area">
                <div style={{gridArea: "divInpt1"}}>
                  <label className="eed-label" for="">Nombre del Evento<h6 className="obligatorio">*</h6></label>
                  <input className="eed-input1" type="text"
                    value={""} 
                    onChange={""}
                  />
                  {/* <span className="error-mensaje">{""}</span> */}
                </div>
                <div style={{gridArea: "divInpt2"}}>
                  <label className="eed-label" for="">Descripción<h6 className="obligatorio">*</h6></label>
                  <textarea className="eed-input2" value={""} onChange={""}/>
                  {/* <span className="error-mensaje">{errores.descripcion ?? ""}</span> */}
                </div>
                <div style={{gridArea: "divInpt3"}}>
                  <label className="eed-label" for="">Salida de Producto<h6 className="obligatorio">*</h6></label>
                  <select className="eed-input5" 
                    value={""}
                    onChange={""}
                    >
                    <option value="">-- Selecciona --</option>
                  </select>
                  {/* <span className="error-mensaje">{errores.tipo_medida ?? ""}</span> */}
                </div>
                <div style={{ gridArea: "divInpt4" }}>
                  <label className="er-label">Fecha y Hora<span className="obligatorio">*</span></label>
                  <input className="er-input4" type="datetime-local"
                    value={""}
                    onChange={""}
                  />
                  {/* <span className="error-mensaje">{errores.fecha_hora ?? ""}</span> */}
                </div>
                <div style={{gridArea: "divInpt5"}}> 
                  <label className="er-label" for="">Lugar<h6 className="obligatorio">*</h6></label>
                  <input className="er-input5" type="text" 
                    value={""}
                    onChange={""}
                  />
                  {/* <span className="error-mensaje">{errores.cantidad_por_unidad ?? ""}</span> */}
                </div>      
              </section>
              <input className="eed-btn" type="submit"  
                value={""} 
                disabled={""} 
              />
            </form>
          </aside>
          {/* ── MODAL 3: Desactivar Evento ──────────────────────────────────── */}

          <aside className="modal-eventos-desactivar">
            <h1 className="modal-eel-titulo">Desactivar Evento Registrado</h1>
                    {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}

            <h3 className="modal-eel-mensaje">¿Desea desactivar &nbsp;<h6 className="subrayar">{""}</h6>?</h3>
            <section className="modal-buttons">
              <button className="desactivar-btn" 
                onClick={""} 
                disabled={""}
                >
                {""}
              </button>
              <button className="cancelar-btn" onClick={""}>Cancelar</button>
            </section>
          </aside> 
        </div>
    </>
  )
}