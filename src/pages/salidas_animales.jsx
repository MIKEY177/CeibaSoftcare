// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/salida_animales.css"
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
import { form } from 'framer-motion/m'

const API = `api/salidas_animales.php`;
const API_SESSION = `api/session.php`;
const API_ANIMALES = `api/animales.php`;
export const indexSelector = 3;

export const SalidaAnimales = () => {
   const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [modalActiva, setModalActiva] = useState(null);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
    const [animales, setAnimales] = useState([]);
  
    const [formRegistrar, setFormRegistrar] = useState({
      fecha_salida: "", 
      responsable_salida: "", 
      motivo_salida: "", 
      animales_id_animales: "",
    });
    const [formEditar, setFormEditar] = useState({
      fecha_salida: "", 
      responsable_salida: "", 
      motivo_salida: "", 
      animales_id_animales: "",  
    });
  
    const [busqueda, setBusqueda] = useState("");
  
    
  
    // ─── Helpers ────────────────────────────────────────────────────────────────
  
    const abrirModal = (num, salida = null) => {
      setErrores({});
      setMensajeExito("");
      setSalidaSeleccionada(salida);
      if (num === 2 && salida) {
        setFormEditar({
          fecha_salida: salida.fecha_salida,  // Asumiendo formato "YYYY-MM-DD"
          responsable_salida: salida.responsable_salida,
          motivo_salida: salida.motivo_salida,
          animales_id_animales: salida.animales_id_animales,
        });
      }
      setModalActiva(num);
    };
  
    const cerrarModal = () => {
      setErrores({});
      setMensajeExito("");
      setModalActiva(null);
      setSalidaSeleccionada(null);
  
      setFormRegistrar({ 
        fecha_salida: "", 
        responsable_salida: "", 
        motivo_salida: "", 
        animales_id_animales: "",
      });
  
      setFormEditar({   
        fecha_salida: "", 
        responsable_salida: "", 
        motivo_salida: "", 
        animales_id_animales: "",
      });
    };

    const cargarSalidas = () => {
      fetch(API, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) setSalidas(response.data);
          else console.error(response.error);
        })
        .catch(console.error);
    };

    const cargarAnimales = () => {
      fetch(API_ANIMALES, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) setAnimales(response.data);
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
            setUser({ nombre: data.usuario, rol: data.rol, foto_perfil: data.foto_perfil });
            if (data.rol !== "veterinario" && data.rol !== "administrador") navigate("/albergue");
            setMenu(MenuVeterinario);
          } else {
            navigate("/iniciar_sesion");
          }
        })
        .catch(() => navigate("/iniciar_sesion"));
    }, []);
  
    useEffect(() => { cargarSalidas(); cargarAnimales(); }, []);
  
  
    // ─── Búsqueda ─────────────────────────────────────────────────────────────────
  
    const salidasFiltradas = salidas.filter(salida => 
      salida.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      salida.motivo_salida.toLowerCase().includes(busqueda.toLowerCase()) ||
      salida.responsable_salida.toLowerCase().includes(busqueda.toLowerCase())    
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
            cargarSalidas();
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
        enviar("POST", formRegistrar, "¡Salida registrada correctamente!");
    };
  
    const handleEditar = (e) => {
      e.preventDefault();
      enviar("PUT", { id_salida: salidaSeleccionada.id_salida, ...formEditar }, "¡Salida actualizada correctamente!");
    };
  
    const handleEliminar = () => {
      enviar("DELETE", { id_salida: salidaSeleccionada.id_salida }, "¡Salida eliminada correctamente!");
    };
  
//     // ─── Render ──────────────────────────────────────────────────────────────────
  
  return (
    <>
      <Helmet>
        <title>Salidas Animales - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={menu} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Salidas Animales</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input className="busqueda-input1" type="text" name="busqueda" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Busca una salida"/>
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
            </form>
              <button className="registrar-btn" onClick={()=>abrirModal(1)}>Registrar Salida</button>
          </section>
          <table className="tabla-salidas-animales">
            <thead className="header-tabla-salidas-animales">
              <tr>
                <td>Nombre del Animal</td>
                <td>Fecha de Salida</td>
                <td>Motivo</td>
                <td>Responsable</td>
                <td>Editar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-salidas-animales">
              {salidasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron salidas que coincidan." : "No hay salidas registradas."}</td>
                </tr>
              ) : (
                  salidasFiltradas.map((salida) => (
                <tr key={salida.id_salida}>
                    <td>{salida.nombre}</td>
                    <td>{salida.fecha_salida}</td>
                    <td>{salida.motivo_salida}</td>
                    <td>{salida.responsable_salida}</td>
                    <td>
                      <div className='last-td-flex-content-wrapper'>
                        <figure className="editar-icono" onClick={() => abrirModal(2, salida)} style={{ cursor: "pointer" }}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                      </div>
                    </td>
                 </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
      <Footer/>
             
      <div className="modales-salidas-animales" style={{display: modalActiva ? "flex" : "none"}}>

        {/* ── MODAL 1: Registrar Salida de  Animal ──────────────────────────────────── */}
        {modalActiva === 1 &&(
           <aside className="modal-salidas-animales-registrar">
            <button className="volver-btn-salida-animal" onClick={cerrarModal}>
               <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">
              Registrar Salida Animal
            </h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form" onSubmit={e => handleRegistrar(e)}>
              <section className="ar-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="ar-label" for="">Fecha Salida<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input1" type="date" value={formRegistrar.fecha_salida} onChange={e => setFormRegistrar({...formRegistrar, fecha_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.fecha_salida ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="ar-label" for="">Responsable<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input2" type="text" value={formRegistrar.responsable_salida} onChange={e => setFormRegistrar({...formRegistrar, responsable_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.responsable_salida ?? ""}</span>
                </div>


                <div style={{gridArea: "divInpt4"}}>
                  <label className="ar-label" for="">Animal<h6 className="obligatorio">*</h6></label>
                  <select className="ar-input4" type="text" value={formRegistrar.animales_id_animales} onChange={e => setFormRegistrar({...formRegistrar, animales_id_animales: e.target.value})}>
                    <option value="">Seleccione un animal</option>
                    {animales.map(animal => (
                      <option key={animal.id_animal} value={animal.id_animal}>{animal.nombre}</option>
                    ))}
                  </select>
                  <span className="error-mensaje">{errores.animales_id_animales ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt3"}}>
                  <label className="ar-label" for="">Motivo<h6 className="obligatorio">*</h6></label>
                  <textarea className="ar-input3" name="ar-observaciones" value={formRegistrar.motivo_salida} onChange={e => setFormRegistrar({...formRegistrar, motivo_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.motivo_salida ?? ""}</span>
                </div>

              </section>
              <input className="ar-btn" type="submit" value="Registrar Animal"/>
            </form>
          </aside>
 )}
        {/* ── MODAL 2: Editar Salida Animal ──────────────────────────────────── */}
        {modalActiva === 2 && salidaSeleccionada && (
          <aside className="modal-salidas-animales-editar">
            <button className="volver-btn-salida-animal" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">
              Editar Salida Animal 
            </h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="aed-form" onSubmit={handleEditar}>
              <section className="aed-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="aed-label" for="">Fecha Salida<h6 className="obligatorio">*</h6></label>
                  <input className="aed-input1" type="date" value={formEditar.fecha_salida} onChange={e => setFormEditar({...formEditar, fecha_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.fecha_salida ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="aed-label" for="">Responsable<h6 className="obligatorio">*</h6></label>
                  <input className="aed-input2" type="text" value={formEditar.responsable_salida} onChange={e => setFormEditar({...formEditar, responsable_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.responsable_salida ?? ""}</span>
                </div>


                <div style={{gridArea: "divInpt4"}}>
                  <label className="aed-label" for="">Animal<h6 className="obligatorio">*</h6></label>
                  <select className="aed-input4" type="text" value={formEditar.animales_id_animales} onChange={e => setFormEditar({...formEditar, animales_id_animales: e.target.value})}>
                    <option value="">Seleccione un animal</option>
                    {animales.map(animal => (
                      <option key={animal.id_animal} value={animal.id_animal}>{animal.nombre}</option>
                    ))}
                  </select>
                  <span className="error-mensaje">{errores.animales_id_animales ?? ""}</span>
                </div>
                
                <div style={{gridArea: "divInpt3"}}>
                  <label className="aed-label" for="">Motivo<h6 className="obligatorio">*</h6></label>
                  <textarea className="aed-input3" name="aed-observaciones" value={formEditar.motivo_salida} onChange={e => setFormEditar({...formEditar, motivo_salida: e.target.value})}/>
                  <span className="error-mensaje">{errores.motivo_salida ?? ""}</span>
                </div>

              </section>
              <input className="ar-btn" type="submit" value="Guardar Cambios"/>
            </form>
          </aside>
        )}
      </div>
    </>
  )
} 