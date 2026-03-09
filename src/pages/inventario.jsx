// Imports Base
import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'
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
    const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
  
    useEffect(() => {
        // consultar sesión
        fetch("http://localhost/Ceibasoftcare/backend/api/session.php", {
          credentials: "include"
        })
        .then(res => res.json())
        .then(data => {
          console.log("Datos de sesión:", data);
          if (data.status === "ok") {
            setUser({ nombre: data.usuario, rol: data.rol });
            if (data.rol === "Veterinario") {
              navigate("/farmacia");
            }
          } else {
            navigate("/iniciar_sesion");
          }
        })
        .catch(error => {
          console.error("Error al obtener sesión:", error);
          navigate("/iniciar_sesion");
        });
      }, []);
  
       const menuObj = (() => {
          switch (user.rol) {
            case "administrador":
              return MenuAdminFarmacia;
            case "farmacéutico":
              return MenuAdminFarmacia;
            case "Veterinario":
              return MenuVeterinarioFarmacia;
            default:
              return {};
          }
        })();
  

  return (
    <>
      <head>
        <title>Inventario - Softcare</title>
      </head>
      <main>
        <Navbar user={user} menu={menuObj} />
        <section class="secciones-area-gestion">
          <h2 className="titulo-dashboard">Productos</h2>
          <section class="seccion1-busqueda-agregar">
            <form class="busqueda-form" action="" method="">
              <input class="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" id=""/>
              <button class="busqueda-icono" type="submit">
                <img class="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
              <a href="">
                <figure class="busqueda-barras-icono">
                  <img class="busqueda-barras-icono-img" src={barrasBusqueda} alt=""/>
                </figure>
              </a>
            </form>
            <a href="">
              <button class="registrar-btn">Registrar Producto</button>
            </a>
          </section>
          <table class="tabla-inventario">
            <thead class="header-tabla-inventario">
              <tr>
                <td>Producto</td>
                <td>Descripción</td>
                <td>Unidad de Medida</td>
                <td>Registró</td>
                <td>Editar | Eliminar</td>
              </tr>
            </thead>
            <tbody class="body-tabla-inventario">
              <tr>
                <td>[Producto]</td> 
                <td>[Descripción]</td> 
                <td>[#]</td> 
                <td>[Nombre_mediante_id]</td> 
                <td>
                  <a href="">
                    <figure class="editar-icono">
                      <img class="editar-icono-img" src={editarIcon} alt=""/>
                    </figure>
                  </a>
                  <a href="">
                    <figure class="eliminar-icono">
                      <img class="eliminar-icono-img" src={eliminarIcon} alt=""/>
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
            <img class="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 class="modal-ir-titulo">
            Registre un nuevo Producto
          </h1>
          {/* <a href="" class="link-codigo-barras">
            <h2>Escanear con Lector de Barras</h2>
            <figure class="codigo-barras-icono">
              <img class="codigo-barras-icono-img" src={barrasBusqueda} alt=""/>
            </figure>
          </a> */}
          <form class="ir-form" action="" method="">
            <section class="ir-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label class="ir-label" for="">Nombre del Producto<h6 class="obligatorio">*</h6></label>
                <input class="ir-input1" type="text" name="ir-nombre"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label class="ir-label" for="">Descripción del Producto</label>
                <textarea class="ir-input2" name="ir-descripcion" id=""></textarea>
              </div>
              <div class="label-and-input-container" style={{gridArea: "divInpt3"}}> 
                <label class="ir-label" for="">Unidad de Medida</label>
                <input class="ir-input3" type="text" name="ir-unidad_medida"/>
              </div>
              <div class="label-and-input-container" style={{gridArea: "divInpt4"}}>
                <label class="ir-label" for="">Usuario que Registra</label>
                <div class="union-input-icono">
                  <input class="ir-input4" type="text" name="ir-id_usuario" defaultValue="[Usuario_registrado]"/> 
                  <figure class="candado-icono">
                    <img class="candado-icono-img" src={campoRestringido} alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input class="ir-btn" type="submit" value="Registrar Producto"/>
          </form>
        </aside>
        <aside class="modal-inventario-editar">
          <a href="">
            <img class="volver-icono" src={flecha} alt=""/>
            <h2>Volver</h2>
          </a>
          <h1 class="modal-ied-titulo">
            Editar Producto Registrado
          </h1>
          <form class="ied-form" action="" method="">
            <section class="ied-form-inputs-area">
              <div style={{gridArea: "divInpt1"}}>
                <label class="ied-label" for="">Nombre del Producto<h6 class="obligatorio">*</h6></label>
                <input class="ied-input1" type="text" name="ied-nombre" defaultValue="[Nombre_ya_registrado]"/>
              </div>
              <div style={{gridArea: "divInpt2"}}>
                <label class="ied-label" for="">Descripción del Producto</label>
                <textarea class="ied-input2" name="ied-descripcion" id="">[Descripcion_ya_registrada]</textarea> 
              </div>
              <div class="label-and-input-container" style={{gridArea: "divInpt3"}}>
                <label class="ied-label" for="">Unidad de Medida</label>
                <input class="ied-input3" type="text" name="ied-unidad_medida" defaultValue="[Unidad_ya_registrada]"/> 
              </div>
              <div class="label-and-input-container" style={{gridArea: "divInpt4"}}>
                <label class="ied-label" for="">Usuario que Registra</label>
                <div class="union-input-icono">
                  <input class="ied-input4" type="text" name="ied-id_usuario" defaultValue="[Usuario_registrado]"/> 
                  <figure class="candado-icono">
                    <img class="candado-icono-img" src={campoRestringido}alt=""/>
                  </figure>
                </div>
              </div>
            </section>
            <input class="ied-btn" type="submit" value="Realizar Cambios"/>
          </form>
        </aside>
        <aside class="modal-inventario-eliminar">
          <h1 class="modal-iel-titulo">Eliminar Producto Registrado</h1>
          <h3 class="modal-iel-mensaje">¿Desea eliminar &nbsp;<h6 class="subrayar">[Nombre Producto]</h6>?</h3>
          <section class="modal-buttons">
            <a href=""><button class="eliminar-btn">Eliminar</button></a>
            <a href=""><button class="cancelar-btn">Cancelar</button></a>
          </section>
        </aside> 
      </div>
    </>
  )
}
