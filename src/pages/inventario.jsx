// Imports Base
import React from 'react'
import { Link } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminRefugio, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/inventario.css"
import editarIcon from "../images/icons/editar.png"
import eliminarIcon from "../images/icons/eliminar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import barrasBusqueda from "../images/codigo_barras.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 2;

export const Inventario = () => {
  return (
    <>
      <head>
        <title>Inventario - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuAdminFarmacia}/>
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Productos</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" action="" method="">
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id=""/>
              <button className="busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
              <a href="">
                <figure className="busqueda-barras-icono">
                  <img className="busqueda-barras-icono-img" src={barrasBusqueda} alt=""/>
                </figure>
              </a>
            </form>
            <a href="">
              <button className="registrar-btn">Registrar Producto</button>
            </a>
          </section>
          <table className="tabla-inventario">
            <thead className="header-tabla-inventario">
              <tr>
                <td>Producto</td>
                <td>Descripción</td>
                <td>Unidad de Medida</td>
                <td>Registró</td>
                <td>Editar | Eliminar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-inventario">
              <tr>
                <td>[Producto]</td> 
                <td>[Descripción]</td> 
                <td>[#]</td> 
                <td>[Nombre_mediante_id]</td> 
                <td>
                  <a href="">
                    <figure className="editar-icono">
                      <img className="editar-icono-img" src={editarIcon} alt=""/>
                    </figure>
                  </a>
                  <a href="">
                    <figure className="eliminar-icono">
                      <img className="eliminar-icono-img" src={eliminarIcon} alt=""/>
                    </figure>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <Footer/>
      <div className="modales-inventario">
        <aside className="modal-inventario-registrar">
          <a href="">
            <img className="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 className="modal-ir-titulo">
            Registre un nuevo Producto
          </h1>
          {/* <a href="" className="link-codigo-barras">
            <h2>Escanear con Lector de Barras</h2>
            <figure className="codigo-barras-icono">
              <img className="codigo-barras-icono-img" src={barrasBusqueda} alt=""/>
            </figure>
          </a> */}
          <form className="ir-form" action="" method="">
            <section className="ir-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label className="ir-label" for="">Nombre del Producto<h6 className="obligatorio">*</h6></label>
                <input className="ir-input1" type="text" name="ir-nombre"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label className="ir-label" for="">Descripción del Producto</label>
                <textarea className="ir-input2" name="ir-descripcion" id=""></textarea>
              </div>
              <div className="label-and-input-container" style={{gridArea: "divInpt3"}}> 
                <label className="ir-label" for="">Unidad de Medida</label>
                <input className="ir-input3" type="text" name="ir-unidad_medida"/>
              </div>
              <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                <label className="ir-label" for="">Usuario que Registra</label>
                <div className="union-input-icono">
                  <input className="ir-input4" type="text" name="ir-id_usuario" defaultValue="[Usuario_registrado]"/> 
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input className="ir-btn" type="submit" value="Registrar Producto"/>
          </form>
        </aside>
        <aside className="modal-inventario-editar">
          <a href="">
            <img className="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 className="modal-ied-titulo">
            Editar Producto Registrado
          </h1>
          <form className="ied-form" action="" method="">
            <section className="ied-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label className="ied-label" for="">Nombre del Producto<h6 className="obligatorio">*</h6></label>
                <input className="ied-input1" type="text" name="ied-nombre" defaultValue="[Nombre_ya_registrado]"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label className="ied-label" for="">Descripción del Producto</label>
                <textarea className="ied-input2" name="ied-descripcion" id="">[Descripcion_ya_registrada]</textarea> 
              </div>
              <div className="label-and-input-container" style={{gridArea: "divInpt3"}}>
                <label className="ied-label" for="">Unidad de Medida</label>
                <input className="ied-input3" type="text" name="ied-unidad_medida" defaultValue="[Unidad_ya_registrada]"/> 
              </div>
              <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                <label className="ied-label" for="">Usuario que Registra</label>
                <div className="union-input-icono">
                  <input className="ied-input4" type="text" name="ied-id_usuario" defaultValue="[Usuario_registrado]"/> 
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido}alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input className="ied-btn" type="submit" value="Realizar Cambios"/>
          </form>
        </aside>
        <aside className="modal-inventario-eliminar">
          <h1 className="modal-iel-titulo">Eliminar Producto Registrado</h1>
          <h3 className="modal-iel-mensaje">¿Desea eliminar &nbsp;<h6 className="subrayar">[Nombre Producto]</h6>?</h3>
          <section className="modal-buttons">
            <a href=""><button className="eliminar-btn">Eliminar</button></a>
            <a href=""><button className="cancelar-btn">Cancelar</button></a>
          </section>
        </aside> 
      </div>
    </>
  )
}
