import React, { useEffect, useState } from 'react' 
import { MenuAdmin } from "../utils/menu.jsx" 
import "../styles/global_styles.css" 
import "../styles/eventos.css" 
import editarIcon from "../images/icons/editar.png" 
import desactivarIcon from "../images/icons/desactivar.png" 
import lupaBusqueda from "../images/lupa_busqueda.png" 
import flecha from "../images/flecha_salir.png" 
import { Navbar } from '../components/Navbar.jsx' 
import { Footer } from '../components/Footer.jsx' 
import { useNavigate } from "react-router-dom";
export const indexSelector = 5; 
export const Eventos = () => { 
  const API = `api/eventos.php`;
  const navigate = useNavigate();
  const API_SESSION = `api/session.php`;
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const normalizarFecha = (f) => f.replace("T", " ").slice(0,16);

    const eventoVacio = () => { 
      const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); 
      return { 
        nombre: "", 
        descripcion: "", 
        requiere_producto: 0,
        fecha_hora: d.toISOString().slice(0, 16), 
        lugar: "" 
      }; 
    }; 

  const [errores,setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  const [modalActivo, setModalActivo] = useState(null); 

  const [eventos, setEventos] = useState([]); 
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null); 

  const [formEvento, setFormEvento] = useState(eventoVacio()); 
  const [formEditar, setFormEditar] = useState(eventoVacio()); 

  const [cargando, setCargando] = useState(false); 
  const [busqueda, setBusqueda] = useState(""); 

  const menuObj = user.rol === "administrador";

  const hayCambios = () => {
    return (
      eventoSeleccionado.nombre !== formEditar.nombre ||
      eventoSeleccionado.descripcion !== formEditar.descripcion ||
      normalizarFecha(eventoSeleccionado.fecha_hora) !== normalizarFecha(formEditar.fecha_hora) ||
      eventoSeleccionado.lugar !== formEditar.lugar ||
      Number(eventoSeleccionado.requiere_producto) !== Number(formEditar.requiere_producto)
    );
  };


  const abrirModal = (num, evento = null) => { 
    if (num === 1) setFormEvento(eventoVacio()); 
    if (num === 2 && evento) {
      const eventoNormalizado = {
        ...evento,
        requiere_producto: Number(evento.requiere_producto ?? 0),
        fecha_hora: evento.fecha_hora
        ? evento.fecha_hora.replace(" ", "T").slice(0, 16): ""
      };

      setEventoSeleccionado(eventoNormalizado);
      setFormEditar(eventoNormalizado);
    }
    if (num === 3 && evento) { 
      setEventoSeleccionado(evento); 
    }   
      setModalActivo(num); 
  }; 

  const cerrarModal = () => { 
    setModalActivo(null); 
    setEventoSeleccionado(null); 
    setErrores({});
    setMensajeExito("");
  }; 

  useEffect(() => {
    fetch(API_SESSION, { credentials: "include" })
    .then(r => r.json())
    .then(data => {
      if (data.status === "ok") {
        setUser({ nombre: data.usuario, rol: data.rol });
        if (data.rol !== "administrador") navigate("/inicio");
      } else navigate("/iniciar_sesion");
    })
    .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => { 
    fetch(API, { credentials: "include" }) 
    .then(r => r.json()) 
    .then(res => { 
      if (res.success) {
        const eventosNormalizados = res.data.map(ev => ({
          ...ev, requiere_producto: Number(ev.requiere_producto)
        }));
        setEventos(eventosNormalizados);
      }
    }) 
    .catch(console.error);
  }, []);
  
  const handleRegistrar = (e) => {
    e.preventDefault();
    setCargando(true);
    setErrores({});

    const data = {
      ...formEvento,
      fecha_hora: formEvento.fecha_hora.replace("T", " ") + ":00",
      requiere_producto: Number(formEvento.requiere_producto)
    };

    fetch(API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
    .then(async (r) => {
      const res = await r.json();
      if (!r.ok) {
        setErrores(res.errores || {});
        return;
      }
      setEventos(prev => [...prev, res.data]);
      setMensajeExito("Evento registrado correctamente");
      cerrarModal();
    })
    .catch(console.error)
    .finally(() => setCargando(false));
  };

const handleEditar = (e) => { 
  e.preventDefault(); 
  if (!hayCambios()) {
    setErrores({ general: "No se realizaron cambios." });
    return;
  }
  setCargando(true); 
  setErrores({});
  setMensajeExito("");
  let fecha = formEditar.fecha_hora;
  if (fecha.includes("T")) {
    fecha = fecha.replace("T", " ");
  }

  fecha = fecha.length === 16 ? fecha + ":00" : fecha;

  fetch(API, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id_evento: eventoSeleccionado.id_evento,
      ...formEditar,
      fecha_hora: fecha,
      requiere_producto: Number(formEditar.requiere_producto)
    })
  })
  .then(r => r.json()) 
    .then(res => { 
      if (res.success) {
        if (res.mensaje === "No se realizaron cambios.") {
          setErrores({ general: res.mensaje });
          return;
        }
        setMensajeExito(res.mensaje || "Evento actualizado correctamente.");
        setEventos(prev => 
          prev.map(ev => 
              ev.id_evento === eventoSeleccionado.id_evento 
            ? { ...ev, ...formEditar }: ev
          )
        );
        setTimeout(() => {
          cerrarModal();
        }, 1500);

      } else {
        setErrores(res.errores || {});
      }
    }) 
    .catch(() => {
      setErrores({ general: "Error de conexión con el servidor." });
    })
    .finally(() => setCargando(false)); 
  };

  const handleDesactivar = () => { 
    setCargando(true); 
    fetch(API, { 
      method: "DELETE", 
      credentials: "include", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ id_evento: eventoSeleccionado.id_evento }) }) 
      .then(r => r.json()) 
      .then(res => { 
        if (res.success) { 
          setEventos(prev => prev.filter(ev => ev.id_evento !== eventoSeleccionado.id_evento) ); 
          cerrarModal(); 
        } }) 
        .finally(() => setCargando(false)); 
  }; 

  const eventosFiltrados = eventos.filter(
    e => e && e.nombre && e.lugar &&
    (e.nombre.toLowerCase().includes(busqueda.toLowerCase()) || e.lugar.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const mostrarExito = (msg, cb) => {
    setMensajeExito(msg);
    setTimeout(() => { setMensajeExito(""); if (cb) cb(); }, 1500);
  };
  return (
    <>
      <main>
        <Navbar menu={MenuAdmin} user={user}/>

        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Eventos</h2>

          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={e => e.preventDefault()}>
              <input
                className="busqueda-input1"
                type="text"
                placeholder="Busca un evento"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
              <button className="diff_busqueda-icono" type="button">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>

            <button className="diff_registrar-btn"type="button" onClick={() => abrirModal(1)}>
              Registrar nuevo Evento
            </button>
          </section>

          <table className="tabla-eventos">
            <thead className="header-tabla-eventos">
              <tr>
                <td>Nombre</td>
                <td>Fecha y Hora</td>
                <td>Lugar</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-eventos">
                {eventosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="4">{busqueda ? "No se encontraron eventos." : "No hay eventos registrados."}</td>
                    </tr>
                  ) : (
                    eventosFiltrados.map(evento => (
                      <tr key={evento.id_evento}>
                          <td>{evento.nombre}</td>
                          <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                          <td>{evento.lugar}</td>
                          <td>
                            <div className="last-td-flex-content-wrapper">
                              <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() =>abrirModal(2, evento)}>
                                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                              </figure>
                              <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(3, evento)}>
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
      <Footer/>
      <div className="modales-eventos" style= {{ display: modalActivo ? "flex" : "none" }}>
            {/* MODAL REGISTRAR */}
            {modalActivo === 1 && (
              <aside className="modal-eventos-registrar">
                <button className="volver-btn-even" onClick={cerrarModal}>
                  <img className="volver-icono" src={flecha} alt=""/>
                  <h2>Volver</h2>
                </button>

                <h1 className="modal-er-titulo">
                  Registre un nuevo Evento
                </h1>
                <p className="exito-mensaje">{mensajeExito ?? ""}</p>
                <span className="error-mensaje">{errores.general ?? ""}</span>
                <span className="error-mensaje">{errores.sesion ?? ""}</span>
                <form className="er-form" onSubmit={handleRegistrar}>
                  <section className="er-form-inputs-area">
                    <div style={{gridArea: "divInpt1"}}>
                      <label className="er-label">Nombre del Evento<h6 className="obligatorio">*</h6></label>
                      <input className="er-input1" type="text" value={formEvento.nombre} onChange={e => setFormEvento({...formEvento, nombre: e.target.value})} />
                      <span className="error-mensaje">{errores.nombre ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt2"}}>
                      <label className="er-label">Descripción</label>
                      <textarea className="er-input2" value={formEvento.descripcion} onChange={e => setFormEvento({...formEvento, descripcion: e.target.value})}/>
                      <span className="error-mensaje">{errores.descripcion ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt3"}}>
                      <label className="er-label">¿Requiere producto?</label>
                      <select className="er-input3" value={formEvento.requiere_producto} onChange={e => setFormEvento({...formEvento,requiere_producto: Number(e.target.value) })}>
                          <option value={0}>No</option>
                          <option value={1}>Sí</option>
                      </select>
                    </div>

                    <div style={{gridArea: "divInpt4"}}>
                      <label className="er-label">Fecha y Hora<span className="obligatorio">*</span></label>
                      <input className="er-input4" type="datetime-local" value={formEvento.fecha_hora} onChange={e => setFormEvento({...formEvento, fecha_hora: e.target.value})}/>
                      <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt5"}}>
                      <label className="er-label">Lugar<h6 className="obligatorio">*</h6></label>
                      <input className="er-input5" type="text" value={formEvento.lugar} onChange={e => setFormEvento({...formEvento, lugar: e.target.value})}/>
                      <span className="error-mensaje">{errores.lugar ?? ""}</span>
                    </div>

                  </section>
                  <input className="er-btn" type="submit" value="Registrar Evento"/>
                </form>
              </aside>
            )}

            {/* MODAL EDITAR */}
            {modalActivo === 2 && (
              <aside className="modal-eventos-editar">
                <button className="volver-btn-even" onClick={cerrarModal}>
                  <img className="volver-icono" src={flecha} alt="" />
                  <h2>Volver</h2>
                </button>

                <h1 className="modal-eed-titulo">
                  Editar Evento Registrado
                </h1>
                <p className="exito-mensaje">{mensajeExito ?? ""}</p>
                <span className="error-mensaje">{errores.general ?? ""}</span>
                <span className="error-mensaje">{errores.sesion ?? ""}</span>

                <form className="eed-form" onSubmit={handleEditar}> 
                  <section className="eed-form-inputs-area">
                    <div style={{gridArea: "divInpt1"}}>
                      <label className="eed-label">Nombre del Evento<h6 className="obligatorio">*</h6></label>
                      <input className="eed-input1" value={formEditar.nombre} onChange={e => setFormEditar({...formEditar, nombre: e.target.value})} /> 
                      <span className="error-mensaje">{errores.nombre ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt2"}}>
                      <label className="eed-label">Descripción</label>
                      <textarea className="eed-input2" value={formEditar.descripcion} onChange={e => setFormEditar({...formEditar, descripcion: e.target.value})} /> 
                      <span className="error-mensaje">{errores.descripcion ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt3"}}>
                      <label className="er-label">¿Requiere producto?</label>
                      <select className="eed-input3" value={formEditar.requiere_producto ?? 0} onChange={e => setFormEditar({...formEditar,requiere_producto: Number(e.target.value)})}>
                          <option value={0}>No</option>
                          <option value={1}>Sí</option>
                      </select>
                    </div>

                    <div style={{gridArea: "divInpt4"}}>
                      <label className="eed-label">Fecha y Hora<span className="obligatorio">*</span></label>
                      <input className="eed-input5" type="datetime-local" value={formEditar.fecha_hora} onChange={e => setFormEditar({...formEditar, fecha_hora: e.target.value})} /> 
                      <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
                    </div>

                    <div style={{gridArea: "divInpt5"}}>
                      <label className="eed-label">Lugar<h6 className="obligatorio">*</h6></label>
                      <input className="eed-input4" value={formEditar.lugar} onChange={e => setFormEditar({...formEditar, lugar: e.target.value})} /> 
                      <span className="error-mensaje">{errores.lugar ?? ""}</span>
                    </div>
                  </section>
                  <input className="eed-btn" type="submit" value="Guardar cambios" disabled={cargando} /> 
                </form>
              </aside>
            )}

            {/* MODAL ELIMINAR */}
            {modalActivo === 3 && (
              <aside className="modal-eventos-desactivar">
                <h1 className="modal-eel-titulo">Desactivar Evento Registrado</h1>

                <h3 className="modal-eel-mensaje">
                  ¿Desea desactivar <span className="subrayar">evento</span>?
                </h3>

                <section className="modal-buttons">
                   <button className="desactivar-btn" type="button" onClick={handleDesactivar} disabled={cargando}> {cargando ? "Desactivando..." : "Desactivar"}</button>
                    <button className="cancelar-btn" onClick={cerrarModal}>Cancelar</button>
                </section>
              </aside>
            )}
          </div>
      </main>
    </>
  )
}