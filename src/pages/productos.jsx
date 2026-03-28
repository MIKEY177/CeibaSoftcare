// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/productos.css"
import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import barrasBusqueda from "../images/codigo_barras.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Menu } from '../components/Menu.jsx'

const BASE = import.meta.env.VITE_API_BASE ?? env('VITE_API_BASE');
const API = `${BASE}/inventario.php`;
const API_SESSION = `${BASE}/session.php`;
export const indexSelector = 2;

export const Productos = () => {
   const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
  
    const [productos, setProductos] = useState([]);
    const [modalActiva, setModalActiva] = useState(null);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
    const [formRegistrar, setFormRegistrar] = useState({
      nombre: "", 
      descripcion: "", 
      tipo_medida: "",
    });
    const [formEditar, setFormEditar] = useState({
      nombre: "", 
      descripcion: "", 
      tipo_medida: "",
    });
  
    const [busqueda, setBusqueda] = useState("");
  
    const scanTimeoutRef = useRef(null);
    const scannedCodeRef = useRef("");
    const lastKeyTimeRef = useRef(0); // timestamp of previous keystroke
    const isScanningRef = useRef(false); // whether current sequence is treated as scanned input
  
    // ─── Helpers ────────────────────────────────────────────────────────────────
  
    const abrirModal = (num, producto = null) => {
      setErrores({});
      setMensajeExito("");
      setProductoSeleccionado(producto);
      if (num === 2 && producto) {
        setFormEditar({
          nombre:      producto.nombre      ?? "",
          descripcion: producto.descripcion ?? "",
          tipo_medida: producto.tipo_medida ?? "",
          codigo_barras: producto.codigo_barras ?? "",
          cantidad_por_unidad: producto.cantidad_por_unidad ?? "",
        });
      }
      setModalActiva(num);
    };
  
    const cerrarModal = () => {
      setErrores({});
      setMensajeExito("");
      setModalActiva(null);
      setProductoSeleccionado(null);
  
      setFormRegistrar({ 
        nombre: "", 
        descripcion: "", 
        tipo_medida: "", 
        codigo_barras: "", 
        cantidad_por_unidad: "" 
      });
  
      setFormEditar({   
        nombre: "", 
        descripcion: "", 
        tipo_medida: "", 
        codigo_barras: "", 
        cantidad_por_unidad: "" 
      });
    };
  
    const cargarProductos = () => {
      fetch(API, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) setProductos(response.data);
          else console.error(response.error);
        })
        .catch(console.error);
    };
  
    const mostrarExito = (msg) => {
      setMensajeExito(msg);
      setTimeout(() => cerrarModal(), 1500);
    };
  
    // ─── Sesión ──────────────────────────────────────────────────────────────────
  
    useEffect(() => {
      fetch(API_SESSION, { credentials: "include" })
        .then(res => res.json())
        .then(data => {
          if (data.status === "ok") {
            setUser({ nombre: data.usuario, rol: data.rol });
            if (data.rol === "veterinario") navigate("/farmacia");
          } else {
            navigate("/iniciar_sesion");
          }
        })
        .catch(() => navigate("/iniciar_sesion"));
    }, []);
  
    useEffect(() => { cargarProductos(); }, []);
  
    useEffect(() => {
  
    const applyScannedCode = () => {
  
      // Ignorar si no es escaneo real
      if (!isScanningRef.current || scannedCodeRef.current.length < 6) {
        scannedCodeRef.current = "";
        return;
      }
  
      const code = scannedCodeRef.current;
  
      console.log("Código escaneado automáticamente:", code);
  
      if (modalActiva === 1) {
        setFormRegistrar(prev => ({ ...prev, codigo_barras: code }));
      } 
      else if (modalActiva === 2) {
        setFormEditar(prev => ({ ...prev, codigo_barras: code }));
      } 
      else {
        setBusqueda(code);
      }
  
      scannedCodeRef.current = "";
      isScanningRef.current = false;
    };
  
  
    const handleKeyDown = (e) => {
      
      const now = Date.now();
      const interval = now - lastKeyTimeRef.current;
      lastKeyTimeRef.current = now;
  
      // Si la velocidad es lenta se considera humano
      if (interval > 80) {
        scannedCodeRef.current = "";
        isScanningRef.current = false;
  
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
      }
  
      if (e.key === "Enter") {
  
        if (isScanningRef.current) {
          e.preventDefault(); // 🚫 evita enviar formularios
        }
  
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
  
        applyScannedCode();
        return;
      }
  
      if (/^[0-9]$/.test(e.key)) {
  
        if (scannedCodeRef.current === "") {
          isScanningRef.current = interval < 80;
        }
  
        if (isScanningRef.current) {
  
          // 🚫 Evita que el escáner escriba en otros inputs
          e.preventDefault();
  
          scannedCodeRef.current += e.key;
  
          if (scanTimeoutRef.current) {
            clearTimeout(scanTimeoutRef.current);
          }
  
          scanTimeoutRef.current = setTimeout(() => {
            applyScannedCode();
          }, 120);
        }
  
      } 
      else if (e.key === "Backspace") {
  
        if (isScanningRef.current) {
          e.preventDefault();
          scannedCodeRef.current = scannedCodeRef.current.slice(0, -1);
        }
  
      } 
      else {
  
        scannedCodeRef.current = "";
        isScanningRef.current = false;
  
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
          scanTimeoutRef.current = null;
        }
      }
    };
  
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
  
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  
  }, [modalActiva]);
  
    // ─── Menú ────────────────────────────────────────────────────────────────────
  
    const menuObj = (() => {
      switch (user.rol) {
        case "administrador": return MenuAdminFarmacia;
        case "farmacéutico":  return MenuFarmaceutico;
        default:              return {};
      }
    })();
  
    // ─── Búsqueda ─────────────────────────────────────────────────────────────────
  
    const productosFiltrados = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.tipo_medida.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.codigo_barras.toLowerCase().includes(busqueda.toLowerCase())
    );
  
    const handleBusqueda = (e) => {
      e.preventDefault();
      // La búsqueda es en tiempo real con onChange, pero mantenemos esto si quieren buscar con botón
    };
  
    // ─── Envío genérico al backend ───────────────────────────────────────────────
  
    const enviar = (method, body, onExito) => {
      setCargando(true);
      setErrores({});
      fetch(API, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            cargarProductos();
            mostrarExito(onExito);
          } else {
            setErrores(response.errores ?? { general: "Error desconocido." });
          }
        })
        .catch(() => setErrores({ general: "Error de conexión con el servidor." }))
        .finally(() => setCargando(false));
    };
  
    const handleRegistrar = (e) => {
      e.preventDefault();
      enviar("POST", formRegistrar, "¡Producto registrado correctamente!");
    };
  
    const handleEditar = (e) => {
      e.preventDefault();
      enviar("PUT", { id_producto: productoSeleccionado.id_producto, ...formEditar }, "¡Producto actualizado correctamente!");
    };
  
    const handleEliminar = () => {
      enviar("DELETE", { id_producto: productoSeleccionado.id_producto }, "¡Producto desactivado correctamente!");
    };
  
    // ─── Render ──────────────────────────────────────────────────────────────────
  
  return (
    <>
      <head>
        <title>Productos - Softcare</title>
      </head>
      <main>
        <Navbar user={user} menu={menuObj} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Productos</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
              <button className="busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
                <figure className="busqueda-barras-icono" style={{ cursor: "pointer" }}>
                  <img className="busqueda-barras-icono-img" src={barrasBusqueda} alt=""/>
                </figure>
            </form>
              <button className="registrar-btn" onClick={() => abrirModal(1)}>Registrar Producto</button>
          </section>

          <table className="tabla-productos">
            <thead className="header-tabla-productos">
              <tr>
                <td>Producto</td>
                <td>Descripción</td>
                <td>Cantidad por unidad</td>
                <td>Registró</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-productos">
              {productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron productos que coincidan." : "No hay productos registrados."}</td>
                </tr>
              ) : (
                  productosFiltrados.map((producto) => (
                <tr key={producto.id_producto}>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.cantidad_por_unidad} {producto.tipo_medida}</td>
                    <td>{producto.nombre_usuario}</td>
                    <td>
                      <figure className="editar-icono" onClick={() => abrirModal(2, producto)} style={{ cursor: "pointer" }}>
                        <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                      </figure>
                      <figure className="desactivar-icono" onClick={() => abrirModal(3, producto)} style={{ cursor: "pointer" }}>
                        <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar" />
                      </figure>
                    </td>
                 </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    <Footer />
             
      <div className="modales-productos"style={{ display: modalActiva ? 'block' : 'none' }}>

        {modalActiva === 1 &&(
          <aside className="modal-productos-registrar">
            <button className="volver-btn" onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
               <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
            </button>
            <h1 className="modal-ir-titulo">
              Registre un nuevo Producto
            </h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ir-form" onSubmit={handleRegistrar}>
              <section className="ir-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="ir-label" for="">Nombre del Producto<h6 className="obligatorio">*</h6></label>
                  <input className="ir-input1" type="text" value={formRegistrar.nombre} onChange={e => setFormRegistrar({ ...formRegistrar, nombre: e.target.value})}/>
                  {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
                </div>
                <div style={{gridArea: "divInpt2"}}>
                  <label className="ir-label" for="">Descripción del Producto</label>
                  <textarea className="ir-input2" name="ir-descripcion" value={formRegistrar.descripcion} onChange={e => setFormRegistrar({ ...formRegistrar, descripcion: e.target.value })}/>
                  {errores.descripcion && <span className="error-mensaje">{errores.descripcion}</span>}
                </div>
                <div className="label-and-input-container" style={{gridArea: "divInpt3"}}> 
                  <label className="ir-label" for="">Unidad de Medida</label>
                  <select className="ir-input3" value={formRegistrar.tipo_medida} onChange={e => setFormRegistrar({ ...formRegistrar, tipo_medida: e.target.value })}>
                    <option value="">-- Selecciona --</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unidades">Unidades</option>
                  </select>
                  {errores.tipo_medida && <span className="error-mensaje">{errores.tipo_medida}</span>}
                </div>
                <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                  <label className="ir-label" for="">Usuario que Registra</label>
                  <div className="union-input-icono">
                    <input className="ir-input4" type="text" value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt=""/>
                    </figure>
                  </div>
                </div>
                <div className="label-and-input-container" style={{gridArea: "divInpt5"}}> 
                  <label className="ir-label" for="">Cantidad por Unidad</label>
                  <input className="ir-input5" type="text" nvalue={formRegistrar.cantidad_por_unidad} onChange={e => setFormRegistrar({ ...formRegistrar, cantidad_por_unidad: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                </div>
                <div className="label-and-input-container" style={{gridArea: "divInpt6"}}> 
                  <label className="ir-label" for=""> Código de Barras</label>
                  <input className="ir-input6 scan-capture" type="text"
                    value={formRegistrar.codigo_barras} onChange={e => setFormRegistrar({ ...formRegistrar, codigo_barras: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) { e.preventDefault(); } }}/>
                  {errores.codigo_barras && <span className="error-mensaje">{errores.codigo_barras}</span>}
                  <figure className="codigo-barras-icono">
                    <img className="codigo-barras-icono-img" src={barrasBusqueda} alt=""/>
                  </figure>
                </div>
              </section>
              <input className="ir-btn" type="submit" value="Registrar Producto"/>
            </form>
          </aside>
        )}    
        {modalActiva === 2 &&(
          <aside className="modal-productos-editar">
            <button className="volver-btn" onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ied-titulo">
              Editar Producto Registrado
            </h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="ied-form" onSubmit={handleEditar}>
              <section className="ied-form-inputs-area">
                <div style={{gridArea: "divInpt1"}}>
                  <label className="ied-label" for="">Nombre del Producto<h6 className="obligatorio">*</h6></label>
                  <input className="ied-input1" type="text"value={formEditar.nombre} onChange={e => setFormEditar({ ...formEditar, nombre: e.target.value })}/>
                  {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="ied-label" for="">Descripción del Producto</label>
                  <textarea className="ied-input2" value={formEditar.descripcion} onChange={e => setFormEditar({ ...formEditar, descripcion: e.target.value })}/>
                  {errores.descripcion && <span className="error-mensaje">{errores.descripcion}</span>}
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt3"}}>
                  <label className="ied-label" for="">Unidad de Medida</label>
                  <select className="ied-input5" value={formEditar.tipo_medida} onChange={e => setFormEditar({ ...formEditar, tipo_medida: e.target.value })}>
                    <option value="">-- Selecciona --</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unidades">Unidades</option>
                  </select>
                  {errores.tipo_medida && <span className="error-mensaje">{errores.tipo_medida}</span>}
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                  <label className="ied-label" for="">Usuario que Registra</label>
                  <div className="union-input-icono">
                    <input className="ied-input4" type="text"  value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido}alt=""/>
                    </figure>
                  </div>
                </div>
              
                <div className="label-and-input-container" style={{gridArea: "divInpt5"}}> 
                  <label className="ir-label" for="">Cantidad por Unidad</label>
                  <input className="ir-input5" type="text" value={formEditar.cantidad_por_unidad}
                    onChange={e => setFormEditar({ ...formEditar, cantidad_por_unidad: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                    {errores.cantidad_por_unidad && <span className="error-mensaje">{errores.cantidad_por_unidad}</span>}
                </div>
              
                <div className="label-and-input-container" style={{gridArea: "divInpt6"}}> 
                  <label className="ir-label" for=""> Código de Barras</label>
                  <input className="ied-input6 scan-capture" type="text"
                    value={formEditar.codigo_barras} onChange={e => setFormEditar({ ...formEditar, codigo_barras: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) { e.preventDefault(); } }}/>
                  {errores.codigo_barras && <span className="error-mensaje">{errores.codigo_barras}</span>}
                  <figure className="codigo-barras-icono">
                    <img className="codigo-barras-icono-img" src={barrasBusqueda} alt=""/>
                  </figure>
                </div>
              </section>
              <input className="ied-btn" type="submit"  value={cargando ? "Guardando..." : "Realizar Cambios"} disabled={cargando} />
            </form>
          </aside>
        )}

        {modalActiva === 3 &&(
          <aside className="modal-productos-desactivar">
            <h1 className="modal-iel-titulo">Desactivar Producto Registrado</h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            <h3 className="modal-iel-mensaje">¿Desea desactivar &nbsp;<h6 className="subrayar">{productoSeleccionado?.nombre}</h6>?</h3>
            <section className="modal-buttons">
              <button className="desactivar-btn" onClick={handleEliminar} disabled={cargando}>
                {cargando ? "Desactivando..." : "Desactivar"}
              </button>
              <button className="cancelar-btn" onClick={cerrarModal}>Cancelar</button>
            </section>
          </aside> 
        )}
      </div>
    </>
  )
}   
