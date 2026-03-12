// Imports Base
import React, { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export const indexSelector = 3;

export const EntradasProd = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // consultar sesión
    fetch("http://localhost/Ceibasoftcare/backend/api/session.php", {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "ok") {
        setUser({ nombre: data.usuario, rol: data.rol });
        if (data.rol !== "administrador" && data.rol !== "farmacéutico") {
          navigate("/inicio");
        }
      } else {
        navigate("/iniciar_sesion");
      } 
    })
    .catch(() => navigate("/iniciar_sesion"));
  }, []);
  
  const menuObj = (() => {
  switch (user.rol) {
    case "administrador":
      return MenuAdminFarmacia;
    case "farmacéutico":
      return MenuFarmaceutico;
    default:
      return {};
  }
  })();
  return (
    <>
      <head>
          <title>Entradas de Productos - Softcare</title>
      </head>
      <main>
        <Navbar menu={menuObj} user={user}/>
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Entradas de Productos</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" action="" method="">
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id=""/>
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
            </form>
            <a href="">
              <button className="diff_registrar-btn">Registrar Entrada del Producto</button>
            </a>
          </section>
          <table className="tabla-entradas">
            <thead className="header-tabla-entradas">
              <tr>
                <td>Fecha y Hora</td>
                <td>Observaciones</td>
                <td>Detalles del Registro</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-entradas">
              <tr>
                <td>[dd/mm/aaaa hh:mm:ss]</td>
                <td>[Observaciones]</td>
                <td>
                  <a href="">
                    <button className="ver-detalles-btn">Ver Detalles</button>
                  </a>
                </td>
                <td>
                  <a href="">
                    <figure className="editar-icono">
                      <img className="editar-icono-img" src={editarIcon} alt=""/>
                    </figure>
                  </a>
                  <a href="">
                    <figure className="desactivar-icono">
                      <img className="desactivar-icono-img" src={desactivarIcon} alt=""/>
                    </figure>
                 </a>
                </td>
              </tr>
            </tbody>    
          </table>
        </section>
      </main>
      <Footer/>
      <div className="modales-entradas-prod">
        <aside className="modal-entrada-registrar">
          <a href="">
            <img className="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 className="modal-epr-titulo">
            Registre una nueva Entrada de Productos
          </h1>
          <form className="epr-form" action="" method="">
            <section className="epr-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label className="epr-label" for="">Fecha y Hora de Entrada<h6 className="obligatorio">*</h6></label>
                <input className="epr-input1" type="datetime-local" name="epr-fecha_hora_entrada"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label className="epr-label" for="">Observaciones de la Entrada</label>
                <textarea className="epr-input2" name="epr-observaciones" id=""></textarea>
              </div>
              <section style={{gridArea: "divInpt3"}} className="epr-form-detalles-area">
                <div className="epr-form-detalles-header">
                  <h2>Detalles de la Entrada</h2>
                  <a href="">
                    <button className="epr-agregar-detalles-btn">Agregar Producto</button>
                  </a>
                </div>
                <table className="tabla-epr-detalles">
                  <thead className="header-tabla-epr-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Fecha de Vencimiento</td>
                      <td>Motivo</td>
                      <td>Desactivar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-epr-detalles">
                    <tr>
                      <td>[Producto]</td> 
                      <td>[#]</td> 
                      <td>[mm/dd/aaaa]</td>
                      <td>[Motivo]</td> 
                      <td>
                        <a href="">
                          <figure className="desactivar-icono"> 
                            <img className="desactivar-icono-img" src={desactivarIcon} alt=""/>
                          </figure>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </section>
            <input className="epr-btn" type="submit" value="Registrar Entrada"/>
          </form>
        </aside>
        <aside className="modal-entrada-editar">
          <a href="">
            <img className="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 className="modal-eped-titulo">
            Editar Entrada de Productos
          </h1>
          <form className="eped-form" action="" method=""> 
            <section className="eped-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label className="eped-label" for="">Fecha y Hora de Entrada<h6 className="obligatorio">*</h6></label>
                <input className="eped-input1" type="datetime-local" name="eped-fecha_hora_entrada" value="[Fecha_ya_registrada]"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label className="eped-label" for="">Observaciones de la Entrada</label>
                <textarea className="eped-input2" name="eped-observaciones" id="">[Observación_ya_registrada]</textarea>
              </div>
              <section style={{gridArea: "divInpt3"}} className="eped-form-detalles-area">
                <div className="eped-form-detalles-header">
                  <h2>Detalles de la Entrada</h2>
                  <a href="">
                    <button className="eped-agregar-detalles-btn">Agregar Producto</button>
                  </a>
                </div>
                <table className="tabla-eped-detalles">
                  <thead className="header-tabla-eped-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Fecha de Vencimiento</td>
                      <td>Motivo</td>
                      <td>Desactivar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-eped-detalles">
                    <tr>
                      <td>[Producto]</td> 
                      <td>[#]</td> 
                      <td>[mm/dd/aaaa]</td>
                      <td>[Motivo]</td> 
                      <td>
                        <a href=""> 
                          <figure className="desactivar-icono"> 
                            <img className="desactivar-icono-img" src={desactivarIcon} alt=""/>
                          </figure>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </section>
            <input className="eped-btn" type="submit" value="Realizar cambios"/>
          </form>
        </aside>
        <aside className="modal-entrada-desactivar">
          <h1 className="modal-epel-titulo">Desactivar Entrada Registrada</h1>
          <h3 className="modal-epel-mensaje">¿Desea desactivar la Entrada N°<h6 className="subrayar">[id_entrada]</h6>?</h3>
          <section className="modal-buttons">
            <a href=""><button className="desactivar-btn">Desactivar</button></a>
            <a href=""><button className="cancelar-btn">Cancelar</button></a>
          </section>
        </aside>
        <aside className="modal-entrada-detalle-registrar">
          <a href="">
            <img className="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 className="modal-edpr-titulo">
            Registre un Producto en la Entrada N°[Id_entrada]
          </h1>
          {/* <a href="">
            <h2>Escanear con Lector de Barras</h2>
            <figure className="codigo-barras-icono">
              <img className="codigo-barras-icono-img" src="" alt=""/>
            </figure>
          </a> */}
          <form className="edpr-form" action="" method="">
            <section className="edpr-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label className="edpr-label" for="">Producto que ingresó<h6 className="obligatorio">*</h6></label>
                <select className="edpr-input1" name="edpr-producto">
                  <option value="seleccionar" default> - Seleccionar - </option> 
                </select>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label className="edpr-label" for="">Motivo de Entrada</label>
                <textarea className="edpr-input2" name="edpr-motivo" id=""></textarea>
              </div>
              <div style={{gridArea: "divInpt3"}}>
                <label className="edpr-label" for="">Cantidad<h6 className="obligatorio">*</h6></label>
                <input className="edpr-input3" type="text" name="edpr-cantidad"/>
              </div>
              <div style={{gridArea: "divInpt4"}}>
                <label className="edpr-label" for="">Fecha de Vencimiento</label>
                <input className="edpr-input4" type="date" name="edpr-fecha_vencimiento"/>
              </div>
              <div className="edpr-div5" style={{gridArea: "divInpt5"}}>
                <label className="edpr-label" for="">N° de Entrada</label>
                <div className="union-input-icono">
                  <input className="edpr-input5" type="text" name="edpr-id_entrada" value="[id_entrada]"/>
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input className="edpr-btn" type="submit" value="Registrar Producto en la Entrada"/>
          </form>
        </aside>
        <aside className="modal-entrada-detalle-desactivar">
          <h1 className="modal-edpel-titulo">Desactivar Producto de la Entrada</h1>
          <h3 className="modal-edpel-mensaje">¿Desea desactivar &nbsp;<h6 className="subrayar">[Nombre Producto]</h6>&nbsp; de la Entrada N° &nbsp;<h6 className="subrayar">[id_entrada]</h6>?</h3>
          <section className="modal-buttons">
            <a href=""><button className="desactivar-btn">Desactivar</button></a>
            <a href=""><button className="cancelar-btn">Cancelar</button></a>
          </section>
        </aside>
      </div>
    </>
  )
}
