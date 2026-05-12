// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/ingreso_animales.css"
import "../styles/ver_ingreso_animal.css"
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

const API = `api/ingreso_animales.php`;
const API_SESSION = `api/session.php`;
const API_VERIFICACIONES = `api/seleccionar_verificacion.php`;
export const indexSelector = 4;

export const IngresoAnimales = () => {
   const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
  
    const [ingresos, setIngresos] = useState([]);
    const [verificaciones, setVerificaciones] = useState([]);
    const [modalActiva, setModalActiva] = useState(null);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [ingresoSeleccionado, setIngresoSeleccionado] = useState(null);
    const ingresoVacio = () => {
      const d = new Date();
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return { 
        persona_reporta: "",
        cedula_reporta: "",
        direccion_reporta: "",
        telefono_reporta: "",
        funcionario_autoriza: "",
        persona_realiza: "",
        cedula_realiza: "",
        motivo_ingreso: "",
        fecha_hora_ingreso: d.toISOString().slice(0, 16),
        id_verificacion: "",
        id_usuario: "",
      };
       };
  
    const [formRegistrar, setFormRegistrar] = useState(ingresoVacio());
    const [formEditar, setFormEditar] = useState({
      persona_reporta: "",
      cedula_reporta: "",
      direccion_reporta: "",
      telefono_reporta: "",
      funcionario_autoriza: "",
      persona_realiza: "",
      cedula_realiza: "",
      motivo_ingreso: "",
      fecha_hora_ingreso: "",
      id_verificacion: "",
      id_usuario: "",
    });
  
    const [busqueda, setBusqueda] = useState("");
  
    // ─── Helpers ────────────────────────────────────────────────────────────────
  
    const abrirModal = (num, ingreso = null) => {
      setErrores({});
      setMensajeExito("");
      setIngresoSeleccionado(ingreso);
      if (num === 1) {
        setFormRegistrar(ingresoVacio());
      }
      if (num === 2 && ingreso) {
        setFormEditar({
          persona_reporta: ingreso.persona_reporta ?? "",
          cedula_reporta: ingreso.cedula_reporta ?? "",
          direccion_reporta: ingreso.direccion_reporta ?? "",
          telefono_reporta: ingreso.telefono_reporta ?? "",
          funcionario_autoriza: ingreso.funcionario_autoriza ?? "",
          persona_realiza: ingreso.persona_realiza ?? "",
          cedula_realiza: ingreso.cedula_realiza ?? "",
          motivo_ingreso: ingreso.motivo_ingreso ?? "",
          fecha_hora_ingreso: ingreso.fecha_hora_ingreso ? ingreso.fecha_hora_ingreso.replace(" ", "T").slice(0, 16) : "",
          id_verificacion: String(ingreso.id_verificacion1) ?? "",
          id_usuario: ingreso.id_usuario ?? "",
        });
      }
      setModalActiva(num);
    };
  
    const cerrarModal = () => {
      setErrores({});
      setMensajeExito("");
      setModalActiva(null);
      setIngresoSeleccionado(null);
  
      setFormRegistrar({ 

        persona_reporta: "",
        cedula_reporta: "",
        direccion_reporta: "",
        telefono_reporta: "",
        funcionario_autoriza: "",
        persona_realiza: "",
        cedula_realiza: "",
        motivo_ingreso: "",
        fecha_hora_ingreso:  "", 
        id_verificacion: "",
        id_usuario: "",
      });
  
      setFormEditar({   
        persona_reporta: "",
        cedula_reporta: "",
        direccion_reporta: "",
        telefono_reporta: "",
        funcionario_autoriza: "",
        persona_realiza: "",
        cedula_realiza: "",
        motivo_ingreso: "",
        fecha_hora_ingreso: "",
        id_verificacion: "",
        id_usuario: "",
      });
    };
  
    const cargarIngresos = () => {
      fetch(API, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) setIngresos(response.data);
          else console.error(response.error);
        })
        .catch(console.error);
    };

    const cargarVerificaciones = () => {
      fetch(API_VERIFICACIONES, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setVerificaciones(response.data);  
          } else {
            console.error(response.error);
          }
        })
        .catch(console.error);
    } 
  
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
            if (data.rol === "farmacéutico") navigate("/albergue");
          } else {
            navigate("/iniciar_sesion");
          }
        })
        .catch(() => navigate("/iniciar_sesion"));
    }, []);
  
    useEffect(() => { cargarIngresos(); cargarVerificaciones();}, []);
  
 
  
    // ─── Menú ────────────────────────────────────────────────────────────────────
  
    const menuObj = (() => {
      switch (user.rol) {
        case "administrador": return MenuVeterinario;
        case "veterinario":  return MenuVeterinario;
        default:              return {};
      }
    })();
  
    // ─── Búsqueda ─────────────────────────────────────────────────────────────────
  
    const ingresosFiltrados = ingresos.filter(ingreso =>
      ingreso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ingreso.motivo_ingreso.toLowerCase().includes(busqueda.toLowerCase()) ||
      ingreso.fecha.includes(busqueda) 
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
            cargarIngresos();
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
      enviar("PUT", { id_ingreso: ingresoSeleccionado.id_ingreso, ...formEditar }, "¡Producto actualizado correctamente!");
    };
  
    const handleVer = (e) => {
      navigate("/ver_ingreso_animales/" + e.id_ingreso);
      
    };
    // ─── Render ──────────────────────────────────────────────────────────────────
  
  return (
    <>
      <head>
        <title>Ingreso Animales - Softcare</title>
      </head>
      <main>
        <Navbar menu={menuObj} user={user}/>
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Ingreso Animales</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un ingreso" value={busqueda} onChange={(e) => {setBusqueda(e.target.value)}}/>
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
            </form>
              <button className="registrar-btn" onClick={() => abrirModal(1)}>Registrar Ingreso</button>
          </section>
          <table className="tabla-ingreso-animales">
            <thead className="header-tabla-ingreso-animales">
              <tr>
                <td>Nombre del Animal</td>
                <td>Motivo</td>
                <td>Fecha Verificación</td>
                <td>{/*Boton ver */}</td>
                <td>Editar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ingreso-animales">
              { ingresosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron ingresos de animales que coincidan." : "No hay ingresos de animales registrados."}</td>
                </tr>
              ) : (
                  ingresosFiltrados.map((ingreso) => (
                <tr key={ingreso.id_ingreso}>
                    <td>{ingreso.nombre}</td>
                    <td>{ingreso.motivo_ingreso}</td>
                    <td>{ingreso.fecha}</td>
                    <td><button class="ver-detalles-btn" onClick={()=>handleVer(ingreso)}>Ver</button></td>
                    <td>
                      <div className='last-td-flex-content-wrapper'>
                        <figure className="editar-icono" onClick={() => abrirModal(2, ingreso)} style={{ cursor: "pointer" }}>
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
            
    <div className="modales-ingreso-animales" style={{display: modalActiva ? "flex" : "none"}}>
      
        {/* ── MODAL 1: Registrar Animal ──────────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-ingreso-animales-registrar">
            <button className="volver-btn-ingreso-anim" onClick={cerrarModal}>
               <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">
              Registrar Ingreso de Animal
            </h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form" onSubmit={(e) => handleRegistrar(e)}>
              <section className="ar-form-inputs-area-ingresos">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="ar-label" for="">Persona que reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input1-ingreso" type="text" value={formRegistrar.persona_reporta} onChange={e => setFormRegistrar({...formRegistrar, persona_reporta: e.target.value})}/>
                   <span className="error-mensaje">{errores.persona_reporta ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="ar-label" for="">Dirección de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input2-ingreso" type="text" value={formRegistrar.direccion_reporta} onChange={e => setFormRegistrar({...formRegistrar, direccion_reporta: e.target.value})}/>
                  <span className="error-mensaje">{errores.direccion_reporta ?? ""}</span> 
                </div>


                <div style={{gridArea: "divInpt4"}}>
                  <label className="ar-label" for="">Funcionario que Autoriza<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input4-ingreso" type="text" value={formRegistrar.funcionario_autoriza} onChange={e => setFormRegistrar({...formRegistrar, funcionario_autoriza: e.target.value})}/>
                   <span className="error-mensaje">{errores.funcionario_autoriza ?? ""}</span> 
                </div>

                <div style={{gridArea: "divInpt3"}}>
                  <label className="ar-label" for="">Motivo de ingreso<h6 className="obligatorio">*</h6></label>
                  <textarea className="ar-input3" name="ar-observaciones" value={formRegistrar.motivo_ingreso} onChange={e => setFormRegistrar({...formRegistrar, motivo_ingreso: e.target.value})}/>
                  <span className="error-mensaje">{errores.motivo_ingreso ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt5"}}>
                  <label className="ar-label" for="">Cédula de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input5-ingreso" type="text" value={formRegistrar.cedula_reporta} onChange={e => setFormRegistrar({...formRegistrar, cedula_reporta: e.target.value})}/>
                  <span className="error-mensaje">{errores.cedula_reporta ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt6"}}>
                  <label className="ar-label" for="">Telefono de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input6-ingreso" type="text" value={formRegistrar.telefono_reporta} onChange={e => setFormRegistrar({...formRegistrar, telefono_reporta: e.target.value})}/>
                  <span className="error-mensaje">{errores.telefono_reporta ?? ""}</span>
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt7"}}>
                  <label className="ar-label" for="">Persona que realiza</label>
                    <input className="ar-input6-ingreso" type="text" value={formRegistrar.persona_realiza} onChange={e => setFormRegistrar({...formRegistrar, persona_realiza: e.target.value})}/>
                    <span className="error-mensaje">{errores.persona_realiza ?? ""}</span>
                  
                </div>

                <div style={{gridArea: "divInpt8"}}>
                  <label className="ar-label" for="">cédula de persona que realiza</label>
                    <input className="ar-input6-ingreso" type="text" value={formRegistrar.cedula_realiza} onChange={e => setFormRegistrar({...formRegistrar, cedula_realiza: e.target.value})}/>
                    <span className="error-mensaje">{errores.cedula_realiza ?? ""}</span>
                  <label className="ar-label" for="">Fecha y hora de ingreso<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input6-ingreso" type="datetime-local" value={formRegistrar.fecha_hora_ingreso} onChange={(e) => setFormRegistrar({...formRegistrar, fecha_hora_ingreso: e.target.value })} /> 
                  <span className="error-mensaje">{errores.fecha_hora_ingreso ?? ""}</span>
                  <label className="ar-label" for="">Verificación<h6 className="obligatorio">*</h6></label>
                  <select className="ar-input6-ingreso" value={formRegistrar.id_verificacion} onChange={(e) => setFormRegistrar({ ...formRegistrar, id_verificacion: e.target.value })}>
                    <option value="" selected>Seleccione una verificación</option>
                    {verificaciones.map((verificacion) => (
                      <option key={verificacion.id_verificacion} value={verificacion.id_verificacion}>
                        {verificacion.fecha} - {verificacion.nombre}
                      </option>
                    ))}
                  </select>
                  <span className="error-mensaje">{errores.id_verificacion ?? ""}</span>
                </div>

               

              </section>
              <input className="ar-btn" type="submit" value="Registrar Ingreso de un Animal"/>
            </form>
          </aside>
        )}

        {/* ── MODAL 2: Editar Animal ──────────────────────────────────── */}
        {modalActiva === 2 && ingresoSeleccionado && (
          <aside className="modal-ingreso-animales-editar">
            <button className="volver-btn-ingreso-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">
              Editar Ingreso de Animal
            </h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="ar-form" onSubmit={(e) => handleEditar(e)}>
              <section className="ar-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="ar-label" for="">Persona que reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input1-ingreso" type="text" value={formEditar.persona_reporta} onChange={e => setFormEditar({ ...formEditar, persona_reporta: e.target.value })}/>
                   <span className="error-mensaje">{errores.persona_reporta ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="ar-label" for="">Dirección de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input2-ingreso" type="text" value={formEditar.direccion_reporta} onChange={e => setFormEditar({ ...formEditar, direccion_reporta: e.target.value })}/>
                   <span className="error-mensaje">{errores.direccion_reporta ?? ""}</span>
                </div>


                <div style={{gridArea: "divInpt4"}}>
                  <label className="ar-label" for="">Funcionario que Autoriza<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input4-ingreso" type="text" value={formEditar.funcionario_autoriza} onChange={e => setFormEditar({ ...formEditar, funcionario_autoriza: e.target.value })}/>
                   <span className="error-mensaje">{errores.funcionario_autoriza ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt3"}}>
                  <label className="ar-label" for="">Motivo de ingreso<h6 className="obligatorio">*</h6></label>
                  <textarea className="ar-input3" name="ar-observaciones" value={formEditar.motivo_ingreso} onChange={e => setFormEditar({ ...formEditar, motivo_ingreso: e.target.value })}/>
                   <span className="error-mensaje">{errores.motivo_ingreso ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt5"}}>
                  <label className="ar-label" for="">Cédula de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input5-ingreso" type="text" value={formEditar.cedula_reporta} onChange={e => setFormEditar({ ...formEditar, cedula_reporta: e.target.value })}/>
                   <span className="error-mensaje">{errores.cedula_reporta ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt6"}}>
                  <label className="ar-label" for="">Telefono de quien reporta<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input6-ingreso" type="text" value={formEditar.telefono_reporta} onChange={e => setFormEditar({ ...formEditar, telefono_reporta: e.target.value })}/>
                   <span className="error-mensaje">{errores.telefono_reporta ?? ""}</span>
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt7"}}>
                  <label className="ar-label" for="">persona que realiza</label>
                    <input className="ar-input6-ingreso" type="text" value={formEditar.persona_realiza} onChange={(e)=>setFormEditar({...formEditar, persona_realiza: e.target.value})} />
                    <span className="error-mensaje">{errores.persona_realiza ?? ""}</span>
                  <label className="ar-label" for="">Cedula de quien realiza</label>
                    <input className="ar-input6-ingreso" type="text" value={formEditar.cedula_realiza}  onChange={(e)=>setFormEditar({...formEditar, cedula_realiza: e.target.value})}/>
                    <span className="error-mensaje">{errores.cedula_realiza ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt8"}}>
                  <label className="ar-label" for="">Fecha de ingreso<h6 className="obligatorio">*</h6></label>
                  <input className="ar-input6-ingreso" type="datetime-local" value={formEditar.fecha_hora_ingreso} onChange={(e)=>setFormEditar({...formEditar, fecha_hora_ingreso: e.target.value})}/>
                    <span className="error-mensaje">{errores.fecha_hora_ingreso ?? ""}</span>
                  <label className="ar-label" for="">Verificación<h6 className="obligatorio">*</h6></label>
                  <select className="ar-input6-ingreso" value={String(formEditar.id_verificacion)} onChange={(e) => setFormEditar({ ...formEditar, id_verificacion: e.target.value })}>   
                    <option value="">Seleccione una verificación</option>
                    {verificaciones.map((verificacion) => (
                      <option key={verificacion.id_verificacion} value={String(verificacion.id_verificacion)}>
                        {verificacion.fecha} - {verificacion.nombre}
                      </option>
                    ))}
                  </select>
                </div>

               

              </section>
              <input className="ar-btn" type="submit" value="Guardar Cambios"/>
            </form>
          </aside>

        )}
          {/* ── MODAL 3: Detalle de ingreso Animal ──────────────────────────────────── */}
          
          <aside className='modal-detalle-ingreso'>
            <button className="volver-btn-ingreso-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">
              Ingreso del animal [nombre_animal]
            </h1>
            <table className="tabla-ver-ingreso-animal">
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Persona que reporta</td>
                <td>Cédula de quien reporta</td>
                <td>Dirección de quien reporta</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
              <tr>
                <th>{/*{ingreso.persona_reporta}*/}</th>
                <th>{/*{ingreso.cedula_reporta}*/}</th>
                <th>{/*{ingreso.direccion_reporta}*/}</th>
              </tr>
            </tbody>
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Telefono de quien reporta</td>
                <td>Funcionario que autoriza</td>
                <td>Cédula del funcionario</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
              <tr>
                <th>{/*{ingreso.telefono_reporta}*/}</th>
                <th>{/*{ingreso.funcionario_autoriza}*/}</th>
                <th>{/*{ingreso.cedula_realiza}*/}</th>
              </tr>
            </tbody>
            <thead className="header-tabla-ingreso-animal">
              <tr>
                <td>Fecha de ingreso</td>
                <td>Motivo de ingreso</td>
                <td>Verificación</td>
              </tr>
            </thead>
            <tbody className="body-tabla-ver-ingreso-animal">
              <tr>
                <th>{/*{ingreso.fecha_hora_ingreso}*/}</th>
                <th>{/*{ingreso.motivo_ingreso}*/}</th>
                <th>{/*[{ingreso.fecha}] {ingreso.nombre}*/}</th>
              </tr>
            </tbody>
          </table>
          </aside>
      </div>
    </>
  )
} 