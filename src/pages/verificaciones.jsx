// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/verificaciones.css"
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

// const API = `api/inventario.php`;
// const API_SESSION = `api/session.php`;
export const indexSelector = 6;

export const Verificaciones = () => {
  //    const [user, setUser] = useState({ nombre: "", rol: "" });
  //     const navigate = useNavigate();

  //     const [productos, setProductos] = useState([]);
  //     const [modalActiva, setModalActiva] = useState(null);
  //     const [errores, setErrores] = useState({});
  //     const [cargando, setCargando] = useState(false);
  //     const [mensajeExito, setMensajeExito] = useState("");
  //     const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  //     const [formRegistrar, setFormRegistrar] = useState({
  //       nombre: "", 
  //       descripcion: "", 
  //       tipo_medida: "",
  //     });
  //     const [formEditar, setFormEditar] = useState({
  //       nombre: "", 
  //       descripcion: "", 
  //       tipo_medida: "",
  //     });

  //     const [busqueda, setBusqueda] = useState("");

  //     const scanTimeoutRef = useRef(null);
  //     const scannedCodeRef = useRef("");
  //     const lastKeyTimeRef = useRef(0); // timestamp of previous keystroke
  //     const isScanningRef = useRef(false); // whether current sequence is treated as scanned input

  //     // ─── Helpers ────────────────────────────────────────────────────────────────

  //     const abrirModal = (num, producto = null) => {
  //       setErrores({});
  //       setMensajeExito("");
  //       setProductoSeleccionado(producto);
  //       if (num === 2 && producto) {
  //         setFormEditar({
  //           nombre:      producto.nombre      ?? "",
  //           descripcion: producto.descripcion ?? "",
  //           tipo_medida: producto.tipo_medida ?? "",
  //           codigo_barras: producto.codigo_barras ?? "",
  //           cantidad_por_unidad: producto.cantidad_por_unidad ?? "",
  //         });
  //       }
  //       setModalActiva(num);
  //     };

  //     const cerrarModal = () => {
  //       setErrores({});
  //       setMensajeExito("");
  //       setModalActiva(null);
  //       setProductoSeleccionado(null);

  //       setFormRegistrar({ 
  //         nombre: "", 
  //         descripcion: "", 
  //         tipo_medida: "", 
  //         codigo_barras: "", 
  //         cantidad_por_unidad: "" 
  //       });

  //       setFormEditar({   
  //         nombre: "", 
  //         descripcion: "", 
  //         tipo_medida: "", 
  //         codigo_barras: "", 
  //         cantidad_por_unidad: "" 
  //       });
  //     };

  //     const cargarProductos = () => {
  //       fetch(API, { credentials: "include" })
  //         .then(res => res.json())
  //         .then(response => {
  //           if (response.success) setProductos(response.data);
  //           else console.error(response.error);
  //         })
  //         .catch(console.error);
  //     };

  //     const mostrarExito = (msg) => {
  //       setMensajeExito(msg);
  //       setTimeout(() => cerrarModal(), 1500);
  //     };

  //     // ─── Sesión ──────────────────────────────────────────────────────────────────

  //     useEffect(() => {
  //       fetch(API_SESSION, { credentials: "include" })
  //         .then(res => res.json())
  //         .then(data => {
  //           if (data.status === "ok") {
  //             setUser({ nombre: data.usuario, rol: data.rol });
  //             if (data.rol === "veterinario") navigate("/farmacia");
  //           } else {
  //             navigate("/iniciar_sesion");
  //           }
  //         })
  //         .catch(() => navigate("/iniciar_sesion"));
  //     }, []);

  //     useEffect(() => { cargarProductos(); }, []);

  //     useEffect(() => {

  //     const applyScannedCode = () => {

  //       // Ignorar si no es escaneo real
  //       if (!isScanningRef.current || scannedCodeRef.current.length < 6) {
  //         scannedCodeRef.current = "";
  //         return;
  //       }

  //       const code = scannedCodeRef.current;

  //       console.log("Código escaneado automáticamente:", code);

  //       if (modalActiva === 1) {
  //         setFormRegistrar(prev => ({ ...prev, codigo_barras: code }));
  //       } 
  //       else if (modalActiva === 2) {
  //         setFormEditar(prev => ({ ...prev, codigo_barras: code }));
  //       } 
  //       else {
  //         setBusqueda(code);
  //       }

  //       scannedCodeRef.current = "";
  //       isScanningRef.current = false;
  //     };


  //     const handleKeyDown = (e) => {

  //       const now = Date.now();
  //       const interval = now - lastKeyTimeRef.current;
  //       lastKeyTimeRef.current = now;

  //       // Si la velocidad es lenta se considera humano
  //       if (interval > 80) {
  //         scannedCodeRef.current = "";
  //         isScanningRef.current = false;

  //         if (scanTimeoutRef.current) {
  //           clearTimeout(scanTimeoutRef.current);
  //           scanTimeoutRef.current = null;
  //         }
  //       }

  //       if (e.key === "Enter") {

  //         if (isScanningRef.current) {
  //           e.preventDefault();
  //         }

  //         if (scanTimeoutRef.current) {
  //           clearTimeout(scanTimeoutRef.current);
  //           scanTimeoutRef.current = null;
  //         }

  //         applyScannedCode();
  //         return;
  //       }

  //       if (/^[0-9]$/.test(e.key)) {

  //         if (scannedCodeRef.current === "") {
  //           isScanningRef.current = interval < 80;
  //         }

  //         if (isScanningRef.current) {

  //           e.preventDefault();

  //           scannedCodeRef.current += e.key;

  //           if (scanTimeoutRef.current) {
  //             clearTimeout(scanTimeoutRef.current);
  //           }

  //           scanTimeoutRef.current = setTimeout(() => {
  //             applyScannedCode();
  //           }, 120);
  //         }

  //       } 
  //       else if (e.key === "Backspace") {

  //         if (isScanningRef.current) {
  //           e.preventDefault();
  //           scannedCodeRef.current = scannedCodeRef.current.slice(0, -1);
  //         }

  //       } 
  //       else {

  //         scannedCodeRef.current = "";
  //         isScanningRef.current = false;

  //         if (scanTimeoutRef.current) {
  //           clearTimeout(scanTimeoutRef.current);
  //           scanTimeoutRef.current = null;
  //         }
  //       }
  //     };


  //     document.addEventListener("keydown", handleKeyDown);

  //     return () => {
  //       document.removeEventListener("keydown", handleKeyDown);

  //       if (scanTimeoutRef.current) {
  //         clearTimeout(scanTimeoutRef.current);
  //       }
  //     };

  //   }, [modalActiva]);

  //     // ─── Menú ────────────────────────────────────────────────────────────────────

  //     const menuObj = (() => {
  //       switch (user.rol) {
  //         case "administrador": return MenuAdminFarmacia;
  //         case "farmacéutico":  return MenuFarmaceutico;
  //         default:              return {};
  //       }
  //     })();

  //     // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  //     const productosFiltrados = productos.filter(producto =>
  //       producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
  //       producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
  //       producto.tipo_medida.toLowerCase().includes(busqueda.toLowerCase()) ||
  //       producto.codigo_barras.toLowerCase().includes(busqueda.toLowerCase())
  //     );

  //     const handleBusqueda = (e) => {
  //       e.preventDefault();
  //       // La búsqueda es en tiempo real con onChange, pero mantenemos esto si quieren buscar con botón
  //     };

  //     // ─── Envío genérico al backend ───────────────────────────────────────────────

  //     const enviar = (method, body, onExito) => {
  //       setCargando(true);
  //       setErrores({});
  //       fetch(API, {
  //         method,
  //         credentials: "include",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(body),
  //       })
  //         .then(res => res.json())
  //         .then(response => {
  //           if (response.success) {
  //             cargarProductos();
  //             mostrarExito(onExito);
  //           } else {
  //             setErrores(response.errores ?? { general: "Error desconocido." });
  //           }
  //         })
  //         .catch(() => setErrores({ general: "Error de conexión con el servidor." }))
  //         .finally(() => setCargando(false));
  //     };

  //     const handleRegistrar = (e) => {
  //       e.preventDefault();
  //       enviar("POST", formRegistrar, "¡Producto registrado correctamente!");
  //     };

  //     const handleEditar = (e) => {
  //       e.preventDefault();
  //       enviar("PUT", { id_producto: productoSeleccionado.id_producto, ...formEditar }, "¡Producto actualizado correctamente!");
  //     };

  //     const handleEliminar = () => {
  //       enviar("DELETE", { id_producto: productoSeleccionado.id_producto }, "¡Producto desactivado correctamente!");
  //     };

  //     // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <head>
        <title>Verificaciones - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Verificaciones</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={''}>
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca una verificación" value={''} />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="registrar-btn" onClick={''}>Registrar Verificación</button>
          </section>
          <table className="tabla-verificaciones">
            <thead className="header-tabla-verificaciones">
              <tr>
                <td>Tipo de verificación</td>
                <td>Código</td>
                <td>Fecha</td>
                <td>Animal</td>
                <td>{/*Acciones*/}</td>
              </tr>
            </thead>
            <tbody className="body-tabla-verificaciones">
              {/* {verificacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron verificaciones que coincidan." : "No hay verificaciones registradas."}</td>
                </tr>
              ) : (
                  verificacionesFiltradas.map((verificacion) => ( */}
              <tr key={'/*verificacion.id_verificacion*/'}>
                {/* <td>{verificacion.tipo_verificacion}</td>
                    <td>{verificacion.codigo}</td>
                    <td>{verificacion.fecha} {verificacion.tipo_medida}</td>
                    <td>{verificacion.animal}</td> */}
                <td><a href=""><button class="tabla-verificaciones-btn">Ver</button></a></td>
              </tr>
              {/* ))
              )} */}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />

      {<div className="modal-verificaciones" style={{}}>

        {/* ── MODAL 1: Detalle Verificación ──────────────────────────────────── */}
        <aside className="modal-verificaciones-ver">
          <button className="volver-btn-verificaciones" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">
            Verificación N°[id_verificacion]
          </h1>
          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>} */}

          <section className="detalles-verificacion">

            <div className="datos-verificacion">
              <h5>Datos de Verificación</h5>
              <p><strong>Tipo de Verificación</strong></p>
              <p><strong>Tipo de Código</strong></p>
              <p><strong>Código</strong></p>
              <p><strong>Fecha de Verificación</strong></p>
              <p className='p-final'><strong>Responsable verificación</strong></p>
            </div>

            <div className="datos-verificacion-propietario">
              <h5>Datos del Propietario</h5>
              <p><strong>Nombre</strong></p>
              <p><strong>Identificación</strong></p>
              <p><strong>Telefono</strong></p>
              <p><strong>Correo</strong></p>
              <p className='p-final'><strong>Dirección</strong></p>
            </div>

            <div className="datos-verificacion-especificaciones">
              <h5>Especificaciones</h5>
              <p><strong>Nombre del Animal</strong></p>
              <p><strong>Descripción</strong></p>
              <p className='p-final'><strong>Registro Fotográfico</strong></p>
            </div>

          </section>

        </aside>


      </div>}
    </>
  )
} 