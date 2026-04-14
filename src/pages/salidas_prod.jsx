// Imports Base
import React, { useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/salidas_prod.css"

import editarIcon from "../images/icons/editar.png"
import desactivarIcon from "../images/icons/desactivar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const API = '/api/salidas_completas.php';
const API_DET = '/api/detalles_salidas.php';
const API_PRODUCTOS = '/api/productos_stock_busqueda.php';
const API_SESSION = '/api/session.php';

export const indexSelector = 4;

const salidaVacia = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); 
  return {
    fecha_hora: d.toISOString().slice(0,16), 
    observaciones: ""
  } 
}

const detalleVacio = {
  id_producto1: "",
  nombre_producto: "",
  tipo_medida: "",
  cantidad_por_unidad: "",
  cantidad_actual: "",
  cantidad_presentacion: "",
  cantidad_total: "",
  motivo: "",
}

const BuscadorProducto = ({ onSeleccionar, initialValue }) => { 
  const [query, setQuery] = useState(initialValue || "");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const primeraVez = useRef(true);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      if (initialValue) return;
    } 
    if (!query || query.trim().length < 1) {
      setResultados([]);
      setAbierto(false);
      setMostrarResultados(false);
      return; 
    }
    
    const timer = setTimeout(() => {  
      setCargando(true);
      fetch(`${API_PRODUCTOS}?q=${encodeURIComponent(query)}`, { credentials: "include" })
        .then(r => r.json())
        .then(res => {
          if (res.success) {
            setResultados(res.data ?? []);
            setAbierto(true);
          } else {
            setResultados([]);
            setAbierto(true);
          }
        })
        .catch(error => {
          console.error(error);
          setResultados([]);
          setAbierto(true);
        })
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const elegir = (prod) => {
    onSeleccionar(prod);
    setQuery(prod.nombre);
    setAbierto(false);
    setMostrarResultados(false);
  }

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", zIndex: 999 }}>
      <div style={{ position: "relative" }}>
        <input className="sdpr-input1" type="text" placeholder="Buscar por nombre o código de barras..." value={query} autoComplete="off" 
          onChange={e => { setQuery(e.target.value); onSeleccionar(null); setMostrarResultados(true); }}
        />
        {cargando && (
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#888", pointerEvents: "none"}}>
            Buscando...
          </span>
        )}
      </div>

      {abierto && mostrarResultados && (
        <ul style={{ position: "absolute", top: "100%", left: 0, width: "100%",
          zIndex: 99999, background: "#fff", border: "1px solid #ccc",
          borderRadius: 6, boxShadow: "0 6px 20px rgba(0,0,0,.18)",
          maxHeight: 220, overflowY: "auto", margin: 0, padding: 0, listStyle: "none",
        }}>
          {resultados.length === 0 && !cargando ? (
            <li style={{ padding: "10px 14px", color: "#888", fontSize: 13 }}>
              No se encontraron productos.
            </li>
          ) : (
            resultados.map(prod => (
              <li key={prod.id_producto} onMouseDown={e => { e.preventDefault(); elegir(prod); }}
                style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f9ff"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                <div style={{ fontWeight: 600 }}>{prod.nombre}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {'Total: '.concat(prod.cantidad_actual)} {prod.tipo_medida}
                  {' · '}
                  {'Presentación: '.concat(prod.cantidad_por_unidad)} {prod.tipo_medida}
                  {prod.codigo_barras ? ` · ${prod.codigo_barras}` : ""}
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );

};

export const SalidasProd = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({nombre: "", rol: ""}); 
  const [salidas, setSalidas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [modalActivo, setModalActivo] = useState(null); 
  const [errores,             setErrores]             = useState({});
  const [cargando,            setCargando]            = useState(false);
  const [mensajeExito,        setMensajeExito]        = useState("");
  const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  
  // ── Formularios ─────────────────────────────────────────────────────────────
  const [formSalida,      setFormSalida]      = useState(salidaVacia());
  const [listaDetalles,    setListaDetalles]    = useState([]);
  const [formDetalle,      setFormDetalle]      = useState(detalleVacio);
  const [productoElegido,  setProductoElegido]  = useState(null);
  const [detalleEditIndex, setDetalleEditIndex] = useState(null);
  const [formEditar,       setFormEditar]       = useState({ fecha_hora: "", observaciones: "" });
  const [formEditarDetalle, setFormEditarDetalle] = useState(detalleVacio);
  const [historial, setHistorial] = useState([]);
  const [productoElegidoEditar, setProductoElegidoEditar] = useState(null);
  
  const [origenDetalle, setOrigenDetalle] = useState(null); // 'memoria' | 'bd'

  const volver = () => {
    if (historial.length === 0) return;
      const anterior = historial[historial.length - 1];
      setHistorial(prev => prev.slice(0, -1));
      setModalActivo(anterior);
    };
  // ── Sesión ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(API_SESSION, { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol });
          if (data.rol !== "administrador" && data.rol !== "farmacéutico") navigate("/inicio");
        } else navigate("/iniciar_sesion");
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => { cargarSalidas(); }, []);

  const menuObj = user.rol === "administrador" ? MenuAdminFarmacia : user.rol === "farmacéutico"  ? MenuFarmaceutico : {};

  // ── Cargar salidas ──────────────────────────────────────────────────────────
  const cargarSalidas = () => {
    fetch(API, { credentials: "include" })
      .then(r => r.json())
      .then(res => { if (res.success) setSalidas(res.data ?? []); })
      .catch(console.error);
  };

  // ── Recargar detalles de la salida seleccionada sin cerrar el modal ─────────
  const recargarDetalles = (id_salida) => {
    fetch(`${API_DET}?id_salida=${id_salida}`, { credentials: "include" })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setSalidaSeleccionada(prev => ({ ...prev, detalles: res.data }));
        }
      })
      .catch(console.error);
  };
  const [origenModal4, setOrigenModal4] = useState(null); // 'registrar' | 'editar'

  // ── Abrir modal ──────────────────────────────────────────────────────────────
  const abrirModal = (num, item = null) => {
    setErrores({});
    setMensajeExito("");
    setHistorial(prev => [...prev, modalActivo]);

    if (num === 1) {
      setFormSalida(salidaVacia());
      setListaDetalles([]);
    }
    if (num === 2 && item) {
      setSalidaSeleccionada(item);
      setFormEditar({ fecha_hora: item.fecha_hora ?? "", observaciones: item.observaciones ?? "" });
    }
    if (num === 3 && item) setSalidaSeleccionada(item);
    if (num === 4) {
      setFormDetalle(detalleVacio);
      setProductoElegido(null);
      setDetalleEditIndex(null);
      setOrigenModal4(modalActivo === 1 ? 'registrar' : 'editar');
    }
    if (num === 5 && item) {
      setOrigenDetalle('bd');
      setDetalleSeleccionado(item);
      setProductoElegidoEditar({
        id_producto: item.id_producto1,
        nombre: item.nombre_producto,
        tipo_medida: item.tipo_medida,
        cantidad_por_unidad: item.cantidad_por_unidad,
      });
      setFormEditarDetalle({
        id_producto1: item.id_producto1          ?? "",
        nombre_producto: item.nombre_producto       ?? "",
        tipo_medida: item.tipo_medida           ?? "",
        cantidad_por_unidad: item.cantidad_por_unidad   ?? "",
        cantidad_actual: item.cantidad_actual !== undefined && item.cantidad_actual !== ""
          ? parseFloat(item.cantidad_actual) + parseFloat(item.cantidad_total ?? 0)
          : item.cantidad_actual ?? "",
        cantidad_presentacion: item.cantidad_presentacion ?? "",
        cantidad_total: item.cantidad_total        ?? "",
        motivo: item.motivo                ?? "",
      });
    }
    if (num === 6 && item) setDetalleSeleccionado(item);
    if (num === 7 && item) {
      setSalidaSeleccionada(item);
    }
    setModalActivo(num);
  };
  // ── Cerrar modal ─────────────────────────────────────────────────────────────
  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActivo(null);
    setSalidaSeleccionada(null);
    setDetalleSeleccionado(null);
    setFormSalida(salidaVacia());
    setListaDetalles([]);
    setFormDetalle(detalleVacio);
    setFormEditarDetalle(detalleVacio);
    setProductoElegido(null);
    setDetalleEditIndex(null);
  };

  const mostrarExito = (msg, cb) => {
    setMensajeExito(msg);
    setTimeout(() => { setMensajeExito(""); if (cb) cb(); }, 1500);
  };

  // ── Calcular cantidad_total automáticamente ──────────────────────────────────
  const handleCantidadPres = (valor, porUnidad, setter) => {
    const total = valor !== "" && parseFloat(porUnidad) > 0 ? (parseFloat(valor) * parseFloat(porUnidad)).toFixed(2) : "";
    setter(prev => ({ ...prev, cantidad_presentacion: valor, cantidad_total: total }));
  };

  // ── Validar detalle en memoria ───────────────────────────────────────────────
  const validarDetalle = (form) => {
    const e = {};
    if (!form.id_producto1)
      e.id_producto1 = "❗Selecciona un producto.";
    if (!form.cantidad_presentacion || form.cantidad_presentacion <= 0)
      e.cantidad_presentacion = "❗Ingresa una cantidad válida.";
    if (form.cantidad_total === "" || parseFloat(form.cantidad_total) <= 0)
      e.cantidad_total = "❗La cantidad total debe ser mayor a 0.";
    else if (form.cantidad_actual !== "" && parseFloat(form.cantidad_total) > parseFloat(form.cantidad_actual))
      e.cantidad_total = `❗La cantidad total no puede exceder el stock disponible máximo (${form.cantidad_actual}).`;
    if (!form.motivo.trim())
      e.motivo = "❗El motivo es obligatorio.";
    return e;
  };
  // ── Guardar detalle en memoria (modal 4 desde registrar) ────────────────────
  const handleGuardarDetalle = (e) => {
    e.preventDefault();
    const errs = validarDetalle(formDetalle);
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    // Viene de modal 1 → guardar en memoria como antes
    if (origenModal4 === 'registrar') {
      if (detalleEditIndex !== null) {
        setListaDetalles(prev => prev.map((d, i) => i === detalleEditIndex ? { ...formDetalle } : d));
      } else {
        setListaDetalles(prev => [...prev, { ...formDetalle }]);
      }
      setErrores({});
      setFormDetalle(detalleVacio);
      setProductoElegido(null);
      setDetalleEditIndex(null);
      setModalActivo(1);
      return;
    }

    // Viene de modal 2 → guardar en BD
    setCargando(true);
    setErrores({});
    fetch(API_DET, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_salida1: salidaSeleccionada.id_salida,
        id_producto1: formDetalle.id_producto1,
        cantidad_presentacion: formDetalle.cantidad_presentacion,
        cantidad_total: formDetalle.cantidad_total,
        motivo: formDetalle.motivo,
      }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(salidaSeleccionada.id_salida);
        mostrarExito("¡Producto agregado!", () => setModalActivo(2));
      } else {
        setErrores(res.errores ?? { general: "Error desconocido." });
      }
    })
    .catch(() => setErrores({ general: "Error de conexión." }))
    .finally(() => setCargando(false));
  };

  const eliminarDetalleLocal = (index) => {
    setListaDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const editarDetalleLocal = (index) => {
    const det = listaDetalles[index];
    setOrigenDetalle('memoria');
    setDetalleEditIndex(index);
    setDetalleSeleccionado(det); // para que la modal 5 lo muestre
    setProductoElegidoEditar({
      id_producto: det.id_producto1,
      nombre: det.nombre_producto,
      tipo_medida: det.tipo_medida,
      cantidad_por_unidad: det.cantidad_por_unidad,
    });
    setFormEditarDetalle({
      id_producto1: det.id_producto1,
      nombre_producto: det.nombre_producto,
      tipo_medida: det.tipo_medida,
      cantidad_por_unidad: det.cantidad_por_unidad,
      cantidad_actual: det.cantidad_actual ?? "",
      cantidad_presentacion: det.cantidad_presentacion,
      cantidad_total: det.cantidad_total,
      motivo: det.motivo,
    });
    setErrores({});
    setHistorial(prev => [...prev, modalActivo]);
    setModalActivo(5);
  };

  // ── POST: registrar salida + detalles ───────────────────────────────────────
  const handleRegistrar = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formSalida.fecha_hora)    errs.fecha_hora = "❗La fecha es obligatoria.";
    if (listaDetalles.length === 0) errs.detalles   = "❗Agrega al menos un producto.";
    if (Object.keys(errs).length > 0) { 
      setErrores(errs); return; 
    }
    setCargando(true);
    setErrores({});
    fetch(API, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha_hora:    formSalida.fecha_hora,
        observaciones: formSalida.observaciones,
        detalles: listaDetalles.map(d => ({
          id_producto1:          d.id_producto1,
          cantidad_presentacion: d.cantidad_presentacion,
          cantidad_total:        d.cantidad_total,
          motivo:                d.motivo,
        })),
      }),
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) {
          cargarSalidas();
          mostrarExito(`¡Salida registrada con ${res.detalles_registrados} producto(s)!`, cerrarModal);
        } else {
          setErrores(res.errores ?? { general: "Error desconocido." });
        }
      })
      .catch(() => setErrores({ general: "❗Error de conexión con el servidor." }))
      .finally(() => setCargando(false));
  };

  // ── PUT: editar cabecera de salida ──────────────────────────────────────────
  const handleEditar = (e) => {
    e.preventDefault();
    setCargando(true);
    setErrores({});
    fetch(API, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_salida: salidaSeleccionada.id_salida, ...formEditar }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) { cargarSalidas(); mostrarExito("¡Salida actualizada!", cerrarModal); }
        else setErrores(res.errores ?? { general: "Error desconocido." });
      })
      .catch(() => setErrores({ general: "Error de conexión." }))
      .finally(() => setCargando(false));
  };

  // ── DELETE: desactivar salida ───────────────────────────────────────────────
  const handleEliminar = () => {
    setCargando(true);
    setErrores({});
    fetch(API, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_salida: salidaSeleccionada.id_salida }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) { cargarSalidas(); mostrarExito("¡Salida desactivada!", cerrarModal); }
        else setErrores(res.errores ?? { general: "Error desconocido." });
      })
      .catch(() => setErrores({ general: "Error de conexión." }))
      .finally(() => setCargando(false));
  };

  // ── PUT: editar detalle guardado en BD ───────────────────────────────────────
  const handleEditarDetalle = (e) => {
    e.preventDefault();
    const errs = validarDetalle(formEditarDetalle);
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    // Viene de memoria - actualizar listaDetalles
    if (origenDetalle === 'memoria') {
      setListaDetalles(prev => prev.map((d, i) => i === detalleEditIndex ? { ...formEditarDetalle } : d
      ));
      setErrores({});
      volver();
      return;
    }
    // Viene de BD - fetch PUT 
    setCargando(true);
    setErrores({});
    fetch(API_DET, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_detalle_salida: detalleSeleccionado.id_detalle_salida,
        id_producto1: formEditarDetalle.id_producto1,
        cantidad_presentacion: formEditarDetalle.cantidad_presentacion,
        cantidad_total: formEditarDetalle.cantidad_total,
        motivo: formEditarDetalle.motivo,
      }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(salidaSeleccionada.id_salida);
        mostrarExito("¡Detalle actualizado!", () => volver());
      } else {
        setErrores(res.errores ?? { general: "Error desconocido." });
      }
    })
    .catch(() => setErrores({ general: "Error de conexión." }))
    .finally(() => setCargando(false));
  };

  // ── DELETE: desactivar detalle guardado en BD ────────────────────────────────
  const handleDesactivarDetalle = () => {
    const detallesActivos = (salidaSeleccionada?.detalles ?? []).filter(
      d => d.id_detalle_salida!== detalleSeleccionado.id_detalle_salida
    );

    if (detallesActivos.length === 0) {
      setErrores({ general: "No puedes desactivar este producto porque la salida quedaría vacía. Agrega otro producto primero o desactiva la salida completa." });
      return;
    }

    setCargando(true);
    setErrores({});
    fetch(API_DET, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_detalle_salida: detalleSeleccionado.id_detalle_salida }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(salidaSeleccionada.id_salida);
        mostrarExito("¡Producto desactivado!", () => setModalActivo(2));
      } else {
        setErrores(res.errores ?? { general: "Error desconocido." });
      }
    })
    .catch(() => setErrores({ general: "Error de conexión." }))
    .finally(() => setCargando(false));
  };

  // ── Filtro tabla principal ───────────────────────────────────────────────────
  const salidasFiltradas = salidas.filter(e =>
    (e.fecha_hora    ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.observaciones ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <>
      <head>
        <title>Salidas de Productos - Softcare</title>
      </head>
      <main>
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Salidas de Productos</h2>
        
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={e => e.preventDefault()}>
              <input className="busqueda-input1" type="text" placeholder="Busca una salida"
                value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              <button className="diff_busqueda-icono" type="button">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="diff_registrar-btn" type="button" onClick={() => abrirModal(1)}>
              Registrar Salida del Producto
            </button>
          </section>
        
          <table className="tabla-salidas">
            <thead className="header-tabla-salidas">
              <tr>
                <td>Fecha y Hora</td>
                <td>Observaciones</td>
                <td>Detalles</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-salidas">
              {salidasFiltradas.length === 0 ? (
                <tr><td colSpan="4">{busqueda ? "No se encontraron salidas que coincidan con tu búsqueda." : "No hay salidas registradas."}</td></tr>
              ) : (
              salidasFiltradas.map(salida => (
                <tr key={salida.id_salida}>
                  <td>{salida.fecha_hora}</td>
                  <td>{salida.observaciones}</td>
                  <td>
                    <button className="ver-detalles-btn" type="button" onClick={() => abrirModal(7, salida)}> Ver Detalles</button>
                  </td>
                  <td>
                    <div className="last-td-flex-content-wrapper">
                      <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(2, salida)}>
                        <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                      </figure>
                      <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(3, salida)}>
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
      <div className="modales-salidas-prod" style={{ display: modalActivo ? "flex" : "none" }}>
        {/* ── MODAL 1: Registrar Salida ──────────────────────────────────── */}
        {modalActivo === 1 && (
        <aside className="modal-salida-registrar">
          <button className="volver-btn-sal-prod" type="button" onClick={cerrarModal}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-spr-titulo">Registre una nueva Salida de Productos</h1>
        
          <p className="exito-mensaje">{mensajeExito ?? ""}</p>
          <span className="error-mensaje">{errores.general ?? ""}</span>
          <span className="error-mensaje">{errores.sesion ?? ""}</span>
        
          <form className="spr-form" onSubmit={handleRegistrar}>
            <section className="spr-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="spr-label">Fecha y Hora de Salida <span className="obligatorio">*</span></label>
                <input className="spr-input1" type="datetime-local"
                  value={formSalida.fecha_hora}
                  onChange={e => setFormSalida({ ...formSalida, fecha_hora: e.target.value})} />
                <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="spr-label">Observaciones de la Salida</label>
                <textarea className="spr-input2"
                  value={formSalida.observaciones}
                  onChange={e => setFormSalida({ ...formSalida, observaciones: e.target.value})} />
                <span className="error-mensaje">{errores.observaciones ?? ""}</span>
              </div>
              <section style={{ gridArea: "divInpt3" }} className="spr-form-detalles-area">
                <div className="spr-form-detalles-header">
                  <h2>Productos de la Salida</h2>
                  <button type="button" className="spr-agregar-detalles-btn" onClick={() => abrirModal(4)}>
                    Agregar Producto
                  </button>
                </div>
                <span className="error-mensaje">{errores.detalles ?? ""}</span>
                <table className="tabla-spr-detalles">
                  <thead className="header-tabla-spr-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Cantidad Total</td>
                      <td>Motivo</td>
                      <td>Editar | Quitar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-spr-detalles">
                    {listaDetalles.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                          Aún no hay productos — usa "Agregar Producto"
                        </td>
                      </tr>
                    ) : (
                      listaDetalles.map((det, i) => (
                        <tr key={i}>
                          <td>{det.nombre_producto}</td>
                          <td>{det.cantidad_presentacion}</td>
                          <td>{det.cantidad_total}</td>
                          <td>{det.motivo}</td>
                          <td>
                            <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() => editarDetalleLocal(i)}>
                              <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                            </figure>
                            <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => eliminarDetalleLocal(i)}>
                              <img className="desactivar-icono-img" src={desactivarIcon} alt="Quitar" />
                            </figure>
                          </td>
                        </tr>
                      ))
                    )}    
                  </tbody>
                </table>
              </section>
            </section>
            <input className="epr-btn" type="submit"
                value={cargando ? "Registrando..."
                  : `Registrar Salida${listaDetalles.length > 0 ? ` (${listaDetalles.length} producto${listaDetalles.length > 1 ? "s" : ""})` : ""}`}
                disabled={cargando}
            />
          </form>
        </aside>
        )}
        {/* ── MODAL 2: Ver / Editar Salida ──────────────────────────────── */}
        {modalActivo === 2 && (
        <aside className="modal-salida-editar">
          <button className="volver-btn-sal-prod" type="button" onClick={cerrarModal}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sped-titulo">Editar Salida N°{salidaSeleccionada?.id_salida}</h1>
        
          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
        
          <form className="sped-form" onSubmit={handleEditar}>
            <section className="sped-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sped-label">Fecha y Hora <span className="obligatorio">*</span></label>
                <input className="sped-input1" type="datetime-local" value={formEditar.fecha_hora} onChange={e => setFormEditar({ ...formEditar, fecha_hora: e.target.value })} />
                <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="sped-label">Observaciones</label>
                <textarea className="sped-input2" value={formEditar.observaciones} onChange={e => setFormEditar({ ...formEditar, observaciones: e.target.value })} />
              </div>
              {/* Tabla de detalles con botones editar/desactivar */}
              <section style={{ gridArea: "divInpt3" }} className="sped-form-detalles-area">
                <div className="sped-form-detalles-header">
                  <h2>Productos registrados</h2>
                  <button type="button" className="epr-agregar-detalles-btn" onClick={() => abrirModal(4)}>
                    Agregar Producto
                  </button>
                </div>
                        
                <table className="tabla-sped-detalles">
                  <thead className="header-tabla-sped-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Cantidad Total</td>
                      <td>Motivo</td>
                      <td>Editar | Desactivar</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-sped-detalles">
                    {(salidaSeleccionada?.detalles ?? []).length === 0 ? (  
                      <tr>
                          <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                            Sin productos registrados.
                          </td>
                      </tr>
                    ) : (
                       (salidaSeleccionada?.detalles ?? []).map(det => (
                        <tr key={det.id_detalle_salida}>
                          <td>{det.nombre_producto}</td>
                          <td>{det.cantidad_presentacion}</td>
                          <td>{det.cantidad_total}</td>
                          <td>{det.motivo}</td>
                          <td>
                            <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(5, det)}>
                              <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                            </figure>
                            <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(6, det)}>
                              <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar" />
                            </figure>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </section>
            </section>
            <input className="sped-btn" type="submit" 
              value={cargando ? "Guardando..." : "Guardar Cambios"} 
              disabled={cargando}
            />
          </form>
        </aside>
        )}
        {/* ── MODAL 3: Desactivar Salida ─────────────────────────────────── */}
        {modalActivo === 3 && (
        <aside className="modal-salida-desactivar">
          <h1 className="modal-epel-titulo">Desactivar Salida Registrada</h1>
          <h3 className="modal-epel-mensaje"> ¿Desea desactivar la Salida N°{salidaSeleccionada?.id_salida}
            <span className="subrayar">{""}</span>?
          </h3>

          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}       
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
                    
          <section className="modal-buttons">
            <button className="desactivar-btn" type="button" 
              onClick={handleEliminar} 
              disabled={cargando}
              >
              {cargando ? "Desactivando..." : "Desactivar"}

            </button>
            <button className="cancelar-btn" type="button" onClick={cerrarModal}>Cancelar</button>
          </section>
        </aside>
        )}
        {/* ── MODAL 4: Agregar / Editar producto en memoria ───────────────── */}
        {modalActivo === 4 && (
        <aside className="modal-salida-detalle-registrar">
          <button className="volver-btn-sal-det-prod" type="button" onClick={volver}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sdpr-titulo"> {detalleEditIndex !== null ? 'Editar Producto': 'Agregar Producto'}</h1>

          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
          <form className="sdpr-form" onSubmit={handleGuardarDetalle}>
            <section className="sdpr-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sdpr-label">Producto <span className="obligatorio">*</span></label>
                          <BuscadorProducto
                            onSeleccionar={(prod) => {
                              setProductoElegido(prod);
                              if (prod) {
                                setFormDetalle(prev => ({
                                  ...prev,
                                  id_producto1:          prod.id_producto,
                                  nombre_producto:       prod.nombre,
                                  tipo_medida:           prod.tipo_medida,
                                  cantidad_por_unidad:   prod.cantidad_por_unidad,
                                  cantidad_actual:       prod.cantidad_actual,
                                  cantidad_presentacion: "",
                                  cantidad_total:        "",
                                }));
                              } else {
                                setFormDetalle(prev => ({
                                  ...prev,
                                  id_producto1: "", nombre_producto: "",
                                  tipo_medida: "", cantidad_por_unidad: "",
                                  cantidad_actual: "",
                                  cantidad_presentacion: "", cantidad_total: "",
                                }));
                              }
                            }}
                          />
                          
                <span className="error-mensaje">{errores.id_producto1 ?? ""}</span>
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                 <label className="sdpr-label">Motivo <span className="obligatorio">*</span></label>
                  <textarea className="sdpr-input2" 
                    value={formDetalle.motivo} 
                    onChange={e => setFormDetalle(prev => ({ ...prev, motivo: e.target.value }))} 
                  />
                  <span className="error-mensaje">{errores.motivo ?? ""}</span> 
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="sdpr-label">
                  Cantidad <span className="obligatorio">*</span>
                            {productoElegido && (
                              <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                                (frascos / cajas / unidades)
                              </span>
                            )}
                </label>
                <input className="sdpr-input3" type="number" min="1" value={formDetalle.cantidad_presentacion} 
                onChange={e => handleCantidadPres(e.target.value, productoElegido?.cantidad_por_unidad ?? formDetalle.cantidad_por_unidad, setFormDetalle)} />
                <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span>
              </div>
        
      
              <div style={{ gridArea: "divInpt4" }}>
                <label className="sdpr-label">
                  Cantidad total
                            {productoElegido && (
                              <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                                ({productoElegido.cantidad_por_unidad} {productoElegido.tipo_medida} × cantidad)
                              </span>
                            )}
                </label>
                <div className="union-input-icono">
                  <input className="sdpr-input6" type="text" readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                    placeholder={productoElegido ? "Ingresa la cantidad" : "Selecciona un producto primero"}
                    value={formDetalle.cantidad_total !== ""
                      ? `${formDetalle.cantidad_total} ${productoElegido?.tipo_medida ?? ""}` : "" }
                  />
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt=""/>
                  </figure>
                </div>
                {formDetalle.cantidad_actual !== "" && (
                  <div style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
                    Stock disponible máximo: {formDetalle.cantidad_actual} {formDetalle.tipo_medida}
                  </div>
                )}
              </div>
              <div style={{ gridArea: "divInpt5" }}>
                <span className = "error-mensaje">{errores.cantidad_total ?? ""}</span>
              </div>

            </section>
            <input className="sdpr-btn" type="submit" 
              value={detalleEditIndex !== null ? "Guardar Cambios" : "Agregar Producto" } 
              disabled={cargando} 
            />
          </form>
        </aside>
        )}
        {/* ── MODAL 5: Editar detalle guardado en BD ──────────────────────── */}
        {modalActivo === 5 && (
        <aside className="modal-salida-detalle-registrar">
          <button className="volver-btn-sal-det-prod" type="button" onClick={volver}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sdpr-titulo">Editar Producto de la Salida</h1>
        
                    {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} 
      
          <form className="sdpr-form" onSubmit={handleEditarDetalle}>
            <section className="sdpr-form-inputs-area">
              {/* Producto — solo lectura, no se puede cambiar desde aquí */}
              <div style={{ gridArea: "divInpt1" }}>
                <label className="sdpr-label">Producto</label>
                            <BuscadorProducto
                                key={detalleSeleccionado?.id_detalle_salida} // fuerza reinicio con el producto correcto
                                initialValue={formEditarDetalle.nombre_producto}
                                onSeleccionar={(prod) => {
                                  setProductoElegidoEditar(prod);
                                  if (prod) {
                                    setFormEditarDetalle(prev => ({
                                      ...prev,
                                      id_producto1: prod.id_producto,
                                      nombre_producto: prod.nombre,
                                      tipo_medida: prod.tipo_medida,
                                      cantidad_por_unidad: prod.cantidad_por_unidad,
                                      cantidad_actual: prod.cantidad_actual,
                                      cantidad_presentacion: "",
                                      cantidad_total_original: productoElegidoEditar.cantidad_total ?? formEditarDetalle.cantidad_total, // para recalcular si cambia el producto
                                    }));
                                  }
                                }}
                              /> 

                <span className="error-mensaje">{errores.id_producto1 ?? ""}</span>
              </div>
              <div style={{ gridArea: "divInpt2" }}>
                <label className="sdpr-label">Motivo <span className="obligatorio">*</span></label>
                <textarea className="sdpr-input2"
                  value={formEditarDetalle.motivo}
                  onChange={e => setFormEditarDetalle(prev => ({ ...prev, motivo: e.target.value }))} 
                />
                <span className="error-mensaje">{errores.motivo ?? ""}</span>
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="sdpr-label">
                  Cantidad <span className="obligatorio">*</span>
                  <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                    (frascos / cajas / unidades)
                  </span>
                </label>
                <input className="sdpr-input3" type="number" min="1" 
                  value={formEditarDetalle.cantidad_presentacion}
                  onChange={e => handleCantidadPres(e.target.value, productoElegidoEditar?.cantidad_por_unidad ?? formEditarDetalle.cantidad_por_unidad, setFormEditarDetalle) } 
                />
                <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span>
              </div>
        
              <div style={{ gridArea: "divInpt4" }}>
                <label className="sdpr-label">
                  Cantidad total
                  <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                    ({formEditarDetalle.cantidad_por_unidad} {formEditarDetalle.tipo_medida} × cantidad)
                  </span>
                </label>
                <div className="union-input-icono">
                  <input className="sdpr-input6" type="text" readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                    value={formEditarDetalle.cantidad_total !== "" 
                      ? `${formEditarDetalle.cantidad_total} ${formEditarDetalle.tipo_medida ?? ''}` : ''}
                  />
                  <figure className="candado-icono">
                    <img className="candado-icono-img" src={campoRestringido} alt="" />
                  </figure>
                </div>
                {formEditarDetalle.cantidad_actual !== "" && (
                  <div style={{ fontSize: 16, color: "#555", marginTop: 4 }}>
                    Stock máximo:  {formEditarDetalle.cantidad_actual} {formEditarDetalle.tipo_medida}
                  </div>
                )}
               
              </div>
              < div style={{ gridArea: "divInpt5" }}>
                <span className = "error-mensaje">{errores.cantidad_total ?? ""}</span>
              </div>
            </section>
            <input className="sdpr-btn" type="submit"
              value={cargando ? "Guardando..." : "Guardar Cambios"} 
              disabled={cargando} 
            />
          </form>
        </aside>
        )}
        {/* ── MODAL 6: Confirmar desactivar detalle ───────────────────────── */}
        {modalActivo === 6 && (
        <aside className="modal-salida-desactivar">
          <h1 className="modal-spel-titulo">Desactivar Producto</h1>
          <h3 className="modal-spel-mensaje">
            ¿Desea desactivar&nbsp;{""}
            <span className="subrayar">{detalleSeleccionado?.nombre_producto}</span>?
          </h3>
                    {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
                    {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

          <section className="modal-buttons">
            <button className="desactivar-btn" type="button"
              onClick={handleDesactivarDetalle} 
              disabled={cargando}
              >
              {cargando ? "Desactivando..." : "Desactivar"}
            </button>
            <button className="cancelar-btn" type="button" onClick={() => setModalActivo(2)}>
              Cancelar
            </button>
          </section>
        </aside>
        )}
        {/* modal 7 */}
        {modalActivo === 7 && (
        <aside className="modal-salida-editar">
          <button className="volver-btn-sal-prod" type="button" onClick={volver}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-sped-titulo">Salida N°{salidaSeleccionada?.id_salida}</h1>
        
          <section className="sped-form-inputs-area">
            <div style={{ gridArea: "divInpt1" }}>
              <label className="sped-label">Fecha y Hora</label>
              <input className="sped-input1" type="datetime-local" value={salidaSeleccionada?.fecha_hora ?? ""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }} />
            </div>
        
            <div style={{ gridArea: "divInpt2" }}>
              <label className="sped-label">Observaciones</label>
              <textarea className="sped-input2" value={salidaSeleccionada?.observaciones ?? ""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed", resize: "none" }} />
            </div>
        
            <section style={{ gridArea: "divInpt3" }} className="sped-form-detalles-area">
              <div className="sped-form-detalles-header">
                <h2>Productos registrados</h2>
              </div>
        
              <table className="tabla-sped-detalles">
                <thead className="header-tabla-sped-detalles">
                  <tr>
                    <td>Producto</td>
                    <td>Cantidad</td>
                    <td>Cantidad Total</td>
                    <td>Motivo</td>
                  </tr>
                </thead>
                <tbody className="body-tabla-sped-detalles">
                  {(salidaSeleccionada?.detalles ?? []).length === 0 ? (
                    <tr>
                      <td colSpan="5">No hay detalles disponibles</td>
                    </tr>
                  ) : (
                    salidaSeleccionada?.detalles?.map((detalle, index) => (
                      <tr key={index}>
                        <td>{detalle.nombre_producto}</td>
                        <td>{detalle.cantidad_presentacion}</td>
                        <td>{detalle.cantidad_total}</td>
                        <td>{detalle.motivo}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </section>
          </section>
        </aside>
        )}  
      </div>
    </>
  )
}