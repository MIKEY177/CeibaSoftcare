// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/salidas_prod.css"

import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 4;

export const SalidasProd = () => {
  return (
    <>
      <head>
        <title>Salidas de Productos - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuAdminFarmacia}/>
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Salidas de Productos</h2>
        
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit="">
              <input className="busqueda-input1" type="text" placeholder="Busca una salida"
                value={""} onChange={""} />
              <button className="diff_busqueda-icono" type="button">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="diff_registrar-btn" type="button" onClick={""}>
              Registrar Salida del Producto
            </button>
          </section>
        
          <table className="tabla-salidas">
            <thead className="header-tabla-salidas">
              <tr>
                <td>Fecha y Hora</td>
                <td>Observaciones</td>
                <td>Detalles</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-salidas">
              <tr>
                <td>[Fecha]</td>
                <td>[Observaciones]</td>
                <td>
                  <button className="ver-detalles-btn" type="button" onClick={""}> Ver Detalles</button>
                </td>
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
      <div className="modales-salidas-prod">
        {/* ── MODAL 1: Registrar Entrada ──────────────────────────────────── */}

        <aside className="modal-salida-registrar">
          <button className="volver-btn-sal-prod" type="button" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-spr-titulo">Registre una nueva Salida de Productos</h1>
        
          {/* <p className="exito-mensaje">{mensajeExito ?? ""}</p>
          <span className="error-mensaje">{errores.general ?? ""}</span>
          <span className="error-mensaje">{errores.sesion ?? ""}</span> */}
        
          <form className="spr-form" onSubmit={""}>
            <section className="spr-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="spr-label">Fecha y Hora de Salida <span className="obligatorio">*</span></label>
                <input className="spr-input1" type="datetime-local"
                  value={""}
                  onChange={""} />
                {/* <span className="error-mensaje">{errores.fecha_hora ?? ""}</span> */}
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="spr-label">Observaciones de la Salida</label>
                <textarea className="spr-input2"
                  value={""}
                  onChange={""} />
                {/* <span className="error-mensaje">{errores.observaciones ?? ""}</span> */}
              </div>
              <section style={{ gridArea: "divInpt3" }} className="spr-form-detalles-area">
                <div className="spr-form-detalles-header">
                  <h2>Productos de la Salida</h2>
                  <button type="button" className="spr-agregar-detalles-btn" onClick={""}>
                    Agregar Producto
                  </button>
                </div>
                {/* <span className="error-mensaje">{errores.detalles ?? ""}</span> */}
                <table className="tabla-spr-detalles">
                  <thead className="header-tabla-spr-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Cantidad Total</td>
                      <td>Vencimiento</td>
                      <td>Motivo</td>
                      <td>Editar | Quitar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-spr-detalles">
                    <tr>
                      <td>[Nombre]</td>
                      <td>[Cantidad]</td>
                      <td>[Cantidad total]</td>
                      <td>[vencimiento]</td>
                      <td>[Motivo]</td>
                      <td>
                        <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={""}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                        <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={""}>
                          <img className="desactivar-icono-img" src={desactivarIcon} alt="Quitar" />
                        </figure>
                      </td>
                    </tr>    
                  </tbody>
                </table>
              </section>
            </section>
            <input className="spr-btn" type="submit"
              value={""}
              disabled={""}
            />
          </form>
        </aside>
        {/* ── MODAL 2: Ver / Editar Entrada ──────────────────────────────── */}

        <aside className="modal-salida-editar">
          <button className="volver-btn-sal-prod" type="button" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sped-titulo">Editar Salida N°{""}</h1>
        
          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
        
          <form className="sped-form" onSubmit={""}>
            <section className="sped-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sped-label">Fecha y Hora <span className="obligatorio">*</span></label>
                <input className="sped-input1" type="datetime-local" value={""} onChange={""} />
                {/* <span className="error-mensaje">{errores.fecha_hora ?? ""}</span> */}
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="sped-label">Observaciones</label>
                <textarea className="sped-input2" value={""} onChange={""} />
              </div>
              {/* Tabla de detalles con botones editar/desactivar */}
              <section style={{ gridArea: "divInpt3" }} className="sped-form-detalles-area">
                <div className="sped-form-detalles-header">
                  <h2>Productos registrados</h2>
                  <button type="button" className="epr-agregar-detalles-btn" onClick={""}>
                    Agregar Producto
                  </button>
                </div>
                        
                <table className="tabla-sped-detalles">
                  <thead className="header-tabla-sped-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Cantidad Total</td>
                      <td>Vencimiento</td>
                      <td>Motivo</td>
                      <td>Editar | Desactivar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-sped-detalles">
                    <tr>
                      <td>[Nombre]</td>
                      <td>[Cantidad]</td>
                      <td>[Cantidad total]</td>
                      <td>[Vencimiento]</td>
                      <td>[Motivo]</td>
                      <td>
                        <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={""}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                        <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={""}>
                          <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar" />
                        </figure>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </section>
            <input className="sped-btn" type="submit" 
              value={""} 
              disabled={""}
            />
          </form>
        </aside>
        {/* ── MODAL 3: Desactivar Entrada ─────────────────────────────────── */}

        <aside className="modal-salida-desactivar">
          <h1 className="modal-epel-titulo">Desactivar Salida Registrada</h1>
          <h3 className="modal-epel-mensaje"> ¿Desea desactivar la Salida N°{" "}
            <span className="subrayar">{""}</span>?
          </h3>

          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}       
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
                    
          <section className="modal-buttons">
            <button className="desactivar-btn" type="button" 
              onClick={""} 
              disabled={""}
              >
              {/* {cargando ? "Desactivando..." : "Desactivar"} */}

            </button>
            <button className="cancelar-btn" type="button" onClick={""}>Cancelar</button>
          </section>
        </aside>
        {/* ── MODAL 4: Agregar / Editar producto en memoria ───────────────── */}

        <aside className="modal-salida-detalle-registrar">
          <button className="volver-btn-sal-det-prod" type="button" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sdpr-titulo"> {""}</h1>

          {/* {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
          <form className="sdpr-form" onSubmit={""}>
            <section className="sdpr-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sdpr-label">Producto <span className="obligatorio">*</span></label>
                          {/* <BuscadorProducto
                            onSeleccionar={(prod) => {
                              setProductoElegido(prod);
                              if (prod) {
                                setFormDetalle(prev => ({
                                  ...prev,
                                  id_producto1:          prod.id_producto,
                                  nombre_producto:       prod.nombre,
                                  tipo_medida:           prod.tipo_medida,
                                  cantidad_por_unidad:   prod.cantidad_por_unidad,
                                  cantidad_presentacion: "",
                                  cantidad_total:        "",
                                }));
                              } else {
                                setFormDetalle(prev => ({
                                  ...prev,
                                  id_producto1: "", nombre_producto: "",
                                  tipo_medida: "", cantidad_por_unidad: "",
                                  cantidad_presentacion: "", cantidad_total: "",
                                }));
                              }
                            }}
                          /> */}
                          
                {/* <span className="error-mensaje">{errores.id_producto1 ?? ""}</span> */}
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                 <label className="sdpr-label">Motivo <span className="obligatorio">*</span></label>
                  <textarea className="sdpr-input2" 
                    value={""} 
                    onChange={""} 
                  />
                  {/* <span className="error-mensaje">{errores.motivo ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="sdpr-label">
                  Cantidad <span className="obligatorio">*</span>
                            {/* {productoElegido && (
                              <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                                (frascos / cajas / unidades)
                              </span>
                            )} */}
                </label>
                <input className="sdpr-input3" type="number" min="1" value={""} />
                {/* <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span> */}
              </div>
        
              <div style={{ gridArea: "divInpt4" }}>
                <label className="sdpr-label">Fecha de Vencimiento <span className="obligatorio">*</span></label>
                <input className="sdpr-input4" type="date"
                  value={""}
                  onChange={""} 
                />
                {/* <span className="error-mensaje">{errores.fecha_vencimiento ?? ""}</span> */}
              </div>
      
              <div style={{ gridArea: "divInpt5" }}>
                <label className="sdpr-label">
                  Cantidad total
                            {/* {productoElegido && (
                              <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                                ({productoElegido.cantidad_por_unidad} {productoElegido.tipo_medida} × cantidad)
                              </span>
                            )} */}
                </label>
                <div className="union-input-icono">
                  <input className="sdpr-input6" type="text" readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                    placeholder={""}
                    value={""}
                  />
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input className="sdpr-btn" type="submit" 
              value={""} 
              disabled={""} 
            />
          </form>
        </aside>
        {/* ── MODAL 5: Editar detalle guardado en BD ──────────────────────── */}

        <aside className="modal-salida-detalle-registrar">
          <button className="volver-btn-sal-det-prod" type="button" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sdpr-titulo">Editar Producto de la Salida</h1>
        
                    {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
        
          <form className="sdpr-form" onSubmit={""}>
            <section className="sdpr-form-inputs-area">
              {/* Producto — solo lectura, no se puede cambiar desde aquí */}
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sdpr-label">Producto</label>
                            {/* <BuscadorProducto
                                key={detalleSeleccionado?.id_detalle_entrada} // fuerza reinicio con el producto correcto
                                initialValue={formEditarDetalle.nombre_producto}
                                onSeleccionar={(prod) => {
                                  setProductoElegidoEditar(prod);
                                  if (prod) {
                                    setFormEditarDetalle(prev => ({
                                      ...prev,
                                      id_producto1: prod.id_producto,
                                      nombre_producto: prod.nombre,
                                      tipo_medida: prod.tipo_medida,
                                      cantidad_por_unidad: prod.cantidad_por_unidad,
                                      cantidad_presentacion: "",
                                      cantidad_total: "",
                                    }));
                                  }
                                }}
                              /> */}

                {/* <span className="error-mensaje">{errores.id_producto1 ?? ""}</span> */}
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="sdpr-label">Motivo <span className="obligatorio">*</span></label>
                <textarea className="sdpr-input2"
                  value={""}
                  onChange={""} 
                />
                {/* <span className="error-mensaje">{errores.motivo ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="sdpr-label">
                  Cantidad <span className="obligatorio">*</span>
                  <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                    (frascos / cajas / unidades)
                  </span>
                </label>
                <input className="sdpr-input3" type="number" min="1" 
                  value={""}
                  onChange={""} 
                />
                {/* <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span> */}
              </div>
        
              <div style={{ gridArea: "divInpt4" }}>
                <label className="sdpr-label">Fecha de Vencimiento <span className="obligatorio">*</span></label>
                <input className="sdpr-input4" type="date" value={""} onChange={""} />
                {/* <span className="error-mensaje">{errores.fecha_vencimiento ?? ""}</span> */}
              </div>
        
              <div style={{ gridArea: "divInpt5" }}>
                <label className="sdpr-label">
                  Cantidad total
                  {/* <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                    ({formEditarDetalle.cantidad_por_unidad} {formEditarDetalle.tipo_medida} × cantidad)
                  </span> */}
                </label>
                <div className="union-input-icono">
                  <input className="sdpr-input6" type="text" readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                    value={""}
                  />
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt="" />
                  </figure>
                </div>
              </div>
            </section>
            <input className="sdpr-btn" type="submit"
              value={""} 
              disabled={""} 
            />
          </form>
        </aside>
        {/* ── MODAL 6: Confirmar desactivar detalle ───────────────────────── */}

        <aside className="modal-salida-desactivar">
          <h1 className="modal-spel-titulo">Desactivar Producto</h1>
          <h3 className="modal-spel-mensaje">
            ¿Desea desactivar&nbsp;{""}
            <span className="subrayar">{""}</span>?
          </h3>
                    {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}

          <section className="modal-buttons">
            <button className="desactivar-btn" type="button"
              onClick={""} 
              disabled={""}
              >
              {/* {cargando ? "Desactivando..." : "Desactivar"} */}
            </button>
            <button className="cancelar-btn" type="button" onClick={""}>
              Cancelar
            </button>
          </section>
        </aside>
        {/* modal 7 */}

        <aside className="modal-salida-editar">
          <button className="volver-btn-sal-prod" type="button" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sped-titulo">Salida N°{""}</h1>
        
          <section className="sped-form-inputs-area">
            <div style={{ gridArea: "divInpt1" }}>
              <label className="sped-label">Fecha y Hora</label>
              <input className="sped-input1" type="datetime-local" value={""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }} />
            </div>
        
            <div style={{ gridArea: "divInpt2" }}>
              <label className="sped-label">Observaciones</label>
              <textarea className="sped-input2" value={""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed", resize: "none" }} />
            </div>
        
            <section style={{ gridArea: "divInpt3" }} className="sped-form-detalles-area">
              <div className="sped-form-detalles-header">
                <h2>Productos registrados</h2>
              </div>
        
              <table className="tabla-sped-detalles">
                <thead className="header-tabla-sped-detalles">
                  <tr>
                    <td>Producto</td>
                    <td>Cantidad</td>
                    <td>Cantidad Total</td>
                    <td>Vencimiento</td>
                    <td>Motivo</td>
                  </tr>
                </thead>
                <tbody className="body-tabla-sped-detalles">
                  <tr>
                    <td>[Producto]</td>
                    <td>[Cantidad]</td>
                    <td>[Cantidad Total]</td>
                    <td>[Vencimiento]</td>
                    <td>[Motivo]</td>
                  </tr>
                </tbody>
              </table>
            </section>
          </section>
        </aside>
      </div>
    </>
  )
}