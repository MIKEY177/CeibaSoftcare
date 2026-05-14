// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

// Estilos e imágenes
import "../styles/global_styles.css";
import "../styles/historias_medicas.css";
import editarIcon from "../images/icons/editar.png";
import desactivarIcon from "../images/icons/desactivar.png";
import lupaBusqueda from "../images/lupa_busqueda.png";
import barrasBusqueda from "../images/codigo_barras.png";
import campoRestringido from "../images/candado.png";
import flecha from "../images/flecha_salir.png";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";

// const API = `api/inventario.php`;
// const API_SESSION = `api/session.php`;
export const indexSelector = 6;

export const HistoriasMedicas = () => {
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
      <Helmet>
        <title>Historias Médicas - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Historias Médicas</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={""}>
              <input
                className="busqueda-input1"
                type="text"
                name="busqueda"
                placeholder="Busca una Historia Médica"
                value={""}
              />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="registrar-btn" onClick={""}>
              Registrar Historia
            </button>
          </section>
          <table className="tabla-historias-medicas">
            <thead className="header-tabla-historias-medicas">
              <tr>
                <td>Nombre del Animal</td>
                <td>Fecha de Creación</td>
                <td>{/*Boton ver */}</td>
                <td>Editar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-historias-medicas">
              {/* {animalesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron animales que coincidan." : "No hay animales registrados."}</td>
                </tr>
              ) : (
                  animalesFiltrados.map((producto) => (
                <tr key={producto.id_producto}>
                    <td>{producto.nombre_animal}</td>
                    <td>{producto.motivo}</td>
                    <td>{producto.verificacion}</td>*/}
              <td>
                <a href="">
                  <button class="tabla-historias-medicas-btn">Ver</button>
                </a>
              </td>
              {/*<td>
                      <div className='last-td-flex-content-wrapper'>
                        <figure className="editar-icono" onClick={() => abrirModal(2, producto)} style={{ cursor: "pointer" }}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                      </div>
                    </td>
                 </tr>
                ))
              )} */}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />

      <div className="modales-historias-medicas" style={{}}>
        {/* ── MODAL 1: Registrar Historia Médica ──────────────────────────────────── */}
        <aside className="modal-historias-medicas-registrar">
          <button className="volver-btn-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">Registrar Historia Médica</h1>
          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>} */}

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area-historias">
              <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label" for="">
                    Nombre del Animal
                  </label>
                  <input className="ar-input1" type="text" value={""} onChange={""} />
                  {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Fecha de Creación
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>
            </section>
            <input
              className="ar-btn"
              type="submit"
              value="Registrar Historia Médica"
            />
          </form>
        </aside>

        {/* ── MODAL 2: Editar Historia Médica ──────────────────────────────────── */}
        <aside className="modal-historias-medicas-editar">
          <button className="volver-btn-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-aed-titulo">Editar Historias Médicas</h1>

          {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="ar-label" for="">
                  Nombre del Animal
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Fecha de Creación
                </label>
                <input
                  className="ar-input2"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>
            </section>
            <input className="ar-btn" type="submit" value="Guardar Cambios" />
          </form>
        </aside>
      </div>
    </>
  );
};
