// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/usuarios.css"
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
import { form } from 'framer-motion/client'

const API = `api/users.php`;
const API_SESSION = `api/session.php`;
const API_ROLES = `api/roles_usuarios.php`;
export const indexSelector = 3;

export const Usuarios = () => {
   const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
  
    const [usuarios, setUsuarios] = useState([]);
    const [modalActiva, setModalActiva] = useState(null);
    const [errores, setErrores] = useState({});
    const [cargando, setCargando] = useState(false);
    const [mensajeExito, setMensajeExito] = useState("");
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [roles, setRoles] = useState([]);
    const [formRegistrar, setFormRegistrar] = useState({
      nombre: "",
      correo: "",
      contraseña: "",
      rol: "",
    });
    const [formEditar, setFormEditar] = useState({
      nombre: "",
      correo: "",
      rol: "",
    });
  
  
    // ─── Helpers ────────────────────────────────────────────────────────────────
    const setContrasenaGenerada = (longitud = 4) => {
      const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678901234567890123456789012345678901234567890123456789";

      let resultado = "User?";

      for (let i = 0; i < longitud; i++) {
        resultado += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      return resultado;
    }

  
    const abrirModal = (num, usuario = null) => {
      setErrores({});
      setMensajeExito("");
      setUsuarioSeleccionado(usuario);
      if (num == 1){
        setFormRegistrar({...formRegistrar, contraseña: setContrasenaGenerada()});
      }
      if (num === 2 && usuario) {
        setFormEditar({
          nombre:      usuario.nombre      ?? "",
          correo:      usuario.correo      ?? "",
          rol:      usuario.id_rol      ?? "",
        });
      }
      setModalActiva(num);
    };
  
    const cerrarModal = () => {
      setErrores({});
      setMensajeExito("");
      setModalActiva(null);
      setUsuarioSeleccionado(null);
  
      setFormRegistrar({ 
        nombre: "", 
        correo: "", 
        contraseña: "",
        rol: ""
      });
  
      setFormEditar({   
        nombre: "", 
        correo: "", 
        rol: ""
      });
    };
  
    const cargarUsuarios = () => {
      fetch(API, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) setUsuarios(response.data);
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
            if (data.rol !== "administrador") navigate("/inicio");
          } else {
            navigate("/iniciar_sesion");
          }
        })
        .catch(() => navigate("/iniciar_sesion"));
    }, []);
  
    useEffect(() => { cargarUsuarios(); }, []);

    useEffect(() => {
      fetch(API_ROLES, { credentials: "include" })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setRoles(response.data);
          } 
        })
        .catch(error => console.error("Error de conexión al cargar roles:", error));
    }, []);
  
    // ─── Menú ────────────────────────────────────────────────────────────────────
  
    const menuObj = (() => {
      switch (user.rol) {
        case "administrador": return MenuAdmin;
        default:              return {};
      }
    })();
  
    // ─── Búsqueda ─────────────────────────────────────────────────────────────────
  
    const usuariosFiltrados = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
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
            cargarUsuarios();
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
      enviar("POST", formRegistrar, "¡Usuario registrado correctamente!");
    };
  
    const handleEditar = (e) => {
      e.preventDefault();
      enviar("PUT", { id_usuario: usuarioSeleccionado.id_usuario, ...formEditar }, "¡Usuario actualizado correctamente!");
    };
  
    const handleEliminar = () => {
      enviar("DELETE", { id_usuario: usuarioSeleccionado.id_usuario }, "¡Usuario desactivado correctamente!");
    };
  
    // ─── Render ──────────────────────────────────────────────────────────────────
  
  return (
    <>
      <head>
        <title>Usuarios - Softcare</title>
      </head>
      <main>
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Registro Usuarios</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={''}>
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un usuario" value={busqueda} onChange={(e)=>setBusqueda(e.target.value)}/>
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt=""/>
              </button>
            </form>
              <button className="registrar-btn" onClick={()=>abrirModal(1)}>Registrar Usuario</button>
          </section>
          <table className="tabla-usuarios">
            <thead className="header-tabla-usuarios">
              <tr>
                <td>Nombre del Usuario</td>
                <td>Correo</td>
                <td>Rol</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-usuarios">
             { usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">{busqueda ? "No se encontraron usuarios que coincidan." : "No hay usuarios registrados."}</td>
                </tr>
              ) : (
                  usuariosFiltrados.map((usuario) =>(
                <tr key={usuario.id_usuario}>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <div className='last-td-flex-content-wrapper'>
                        <figure className="editar-icono" onClick={() => abrirModal(2, usuario)} style={{ cursor: "pointer" }}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                        <figure className="desactivar-icono" onClick={() => abrirModal(3, usuario)} style={{ cursor: "pointer" }}>
                          <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar" />
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
             
      <div className="modales-usuarios" style={{display: modalActiva ? 'flex' : 'none'}}>

        {/* ── MODAL 1: Registrar Usuario ──────────────────────────────────── */}
        {modalActiva === 1 &&(
          <aside className="modal-usuarios-registrar">
            <button className="volver-btn-usua" onClick={cerrarModal}>
               <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
            </button>
            <h1 className="modal-usr-titulo">
              Registre un Usuario
            </h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="usr-form" onSubmit={handleRegistrar}>
              <section className="usr-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="usr-label" for="">Nombre del Usuario<h6 className="obligatorio">*</h6></label>
                  <input className="usr-input1" type="text" value={formRegistrar.nombre} onChange={(e)=>setFormRegistrar({...formRegistrar, nombre: e.target.value})}/>
                  <span className="error-mensaje">{errores.nombre ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="usr-label" for="">Correo<h6 className="obligatorio">*</h6></label>
                  <input className="usr-input2" type="text" value={formRegistrar.correo} onChange={(e)=>setFormRegistrar({...formRegistrar, correo: e.target.value})}/>
                  <span className="error-mensaje">{errores.correo ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt3"}}>
                  <label className="usr-label" for="">Contraseña<h6 className="obligatorio">*</h6></label>
                  <div className="union-input-icono">
                    <input className="usr-input3" type="text" value={formRegistrar.contraseña} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt=""/>
                    </figure>
                  </div>
                  { <span className="error-mensaje">{errores.contrasena ?? ""}</span> }
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                  <label className="usr-label" for="">Rol<h6 className="obligatorio">*</h6></label>
                  <select className="usr-input4" value={formRegistrar.rol} onChange={(e) => setFormRegistrar({...formRegistrar, rol: e.target.value})}>
                    <option value="">-- Selecciona --</option>
                    {roles.map((rol) => (
                      <option key={rol.id_rol} value={rol.id_rol}>
                        {rol.nombre}
                      </option>
                    ))}
                  </select>
                  <span className="error-mensaje">{errores.rol ?? ""}</span>
                </div>

              </section>
              <input className="usr-btn" type="submit" value={cargando?'Enviando...':'Registrar usuario'} disabled={cargando}/>
            </form>
          </aside>
        )}
        {/* ── MODAL 2: Editar Usuario ──────────────────────────────────── */}
        {modalActiva === 2 &&(
          <aside className="modal-usuarios-editar">
            <button className="volver-btn-usua" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-used-titulo">
              Editar Usuario Registrado
            </h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="used-form" onSubmit={handleEditar}>
              <section className="used-form-inputs-area">

                <div style={{gridArea: "divInpt1"}}>
                  <label className="used-label" for="">Nombre del Usuario<h6 className="obligatorio">*</h6></label>
                  <input className="used-input1" type="text" value={formEditar.nombre} onChange={(e) => setFormEditar({...formEditar, nombre: e.target.value})}/>
                  <span className="error-mensaje">{errores.nombre ?? ""}</span>
                </div>

                <div style={{gridArea: "divInpt2"}}>
                  <label className="used-label" for="">Correo<h6 className="obligatorio">*</h6></label>
                  <input className="used-input2" type="text" value={formEditar.correo} onChange={(e) => setFormEditar({...formEditar, correo: e.target.value})}/>
                  <span className="error-mensaje">{errores.correo ?? ""}</span>
                </div>

                <div className="label-and-input-container" style={{gridArea: "divInpt4"}}>
                  <label className="used-label" for="">Rol<h6 className="obligatorio">*</h6></label>
                  <select
                      id="rol"
                      className="used-input4"
                      value={String(formEditar.rol)}
                      onChange={(e) =>
                        setFormEditar({
                          ...formEditar,
                          rol: e.target.value
                        })
                      }
                    >
                      <option value="">-- Selecciona --</option>

                      {roles.map((rol) => (
                        <option
                          key={String(rol.id_rol)}
                          value={String(rol.id_rol)}
                        >
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  <span className="error-mensaje">{errores.rol ?? ""}</span>
                </div>
                
              </section>
              <input className="used-btn" type="submit"  value={cargando ? 'Enviando...' : 'enviar'} disabled={cargando} />
            </form>
          </aside>
          )}
        {/* ── MODAL 3: Desactivar Usuario ──────────────────────────────────── */}
         {modalActiva === 3 &&(          
          <aside className="modal-usuarios-desactivar">
            <h1 className="modal-usel-titulo">Desactivar Usuario Registrado</h1>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            <h3 className="modal-usel-mensaje">¿Desea desactivar a &nbsp;<h6 className="subrayar">{usuarioSeleccionado.nombre}</h6>?</h3>
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