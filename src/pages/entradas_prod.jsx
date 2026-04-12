import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuAdminFarmacia, MenuFarmaceutico } from "../utils/menu.jsx"

import "../styles/global_styles.css"
import "../styles/entradas_prod.css"
import editarIcon       from "../images/icons/editar.png"
import desactivarIcon   from "../images/icons/desactivar.png"
import lupaBusqueda     from "../images/lupa_busqueda.png"
import campoRestringido from "../images/candado.png"
import flecha           from "../images/flecha_salir.png"

import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const API         = `api/entradas_completas.php`;
const API_DET     = `api/detalles_entradas.php`;
const API_PROD    = `api/productos_busqueda.php`;
const API_SESSION = `api/session.php`;

export const indexSelector = 3;

const entradaVacia = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return { fecha_hora: d.toISOString().slice(0, 16), observaciones: "" };
};
    
const detalleVacio = {
  id_producto1:          "",
  nombre_producto:       "",
  tipo_medida:           "",
  cantidad_por_unidad:   "",
  cantidad_presentacion: "",
  cantidad_total:        "",
  fecha_vencimiento:     "",
  motivo:                "",
};

// BuscadorProducto
const BuscadorProducto = ({ onSeleccionar, initialValue }) => {
  const [query, setQuery] = useState(initialValue ?? '');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const primeraVez = useRef(true);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // si es la primera vez y hay initialValue, no busca
    if (primeraVez.current) {
      primeraVez.current = false;
      if (initialValue) return;
    }

    if (!query || query.trim().length < 1) {
      setResultados([]);
      setAbierto(false);
      return;
    }

    const timer = setTimeout(() => {
      setCargando(true);
      fetch(`${API_PROD}?q=${encodeURIComponent(query)}`, { credentials: "include" })
        .then(r => r.json())
        .then(res => { if (res.success) { setResultados(res.data); setAbierto(true); } })
        .catch(console.error)
        .finally(() => setCargando(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const elegir = (prod) => {
    onSeleccionar(prod);
    setQuery(prod.nombre);
    setAbierto(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", zIndex: 999 }}>
      <div style={{ position: "relative" }}>
        <input className="edpr-input1" type="text" placeholder="Buscar por nombre o código de barras..." value={query} autoComplete="off" 
          onChange={e => { setQuery(e.target.value); onSeleccionar(null); }}
        />
        {cargando && (
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 12, color: "#888", pointerEvents: "none"}}>
            Buscando...
          </span>
        )}
      </div>

      {abierto && (
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
                  {prod.cantidad_por_unidad} {prod.tipo_medida}
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

// Componente principal
export const EntradasProd = () => {
  const navigate = useNavigate();

  const [user,     setUser]     = useState({ nombre: "", rol: "" });
  const [entradas, setEntradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // ── UI ──────────────────────────────────────────────────────────────────────
  const [modalActiva,         setModalActiva]         = useState(null);
  const [errores,             setErrores]             = useState({});
  const [cargando,            setCargando]            = useState(false);
  const [mensajeExito,        setMensajeExito]        = useState("");
  const [entradaSeleccionada, setEntradaSeleccionada] = useState(null);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);

  // ── Formularios ─────────────────────────────────────────────────────────────
  const [formEntrada,      setFormEntrada]      = useState(entradaVacia());
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
      setModalActiva(anterior);
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

  useEffect(() => { cargarEntradas(); }, []);

  const menuObj = user.rol === "administrador" ? MenuAdminFarmacia : user.rol === "farmacéutico"  ? MenuFarmaceutico : {};

  // ── Cargar entradas ──────────────────────────────────────────────────────────
  const cargarEntradas = () => {
    fetch(API, { credentials: "include" })
      .then(r => r.json())
      .then(res => { if (res.success) setEntradas(res.data); })
      .catch(console.error);
  };

  // ── Recargar detalles de la entrada seleccionada sin cerrar el modal ─────────
  const recargarDetalles = (id_entrada) => {
    fetch(`${API_DET}?id_entrada=${id_entrada}`, { credentials: "include" })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setEntradaSeleccionada(prev => ({ ...prev, detalles: res.data }));
        }
      })
      .catch(console.error);
  };
  const [origenModal4, setOrigenModal4] = useState(null); // 'registrar' | 'editar'

  // ── Abrir modal ──────────────────────────────────────────────────────────────
  const abrirModal = (num, item = null) => {
    setErrores({});
    setMensajeExito("");
    setHistorial(prev => [...prev, modalActiva]);

    if (num === 1) {
      setFormEntrada(entradaVacia());
      setListaDetalles([]);
    }
    if (num === 2 && item) {
      setEntradaSeleccionada(item);
      setFormEditar({ fecha_hora: item.fecha_hora ?? "", observaciones: item.observaciones ?? "" });
    }
    if (num === 3 && item) setEntradaSeleccionada(item);
    if (num === 4) {
      setFormDetalle(detalleVacio);
      setProductoElegido(null);
      setDetalleEditIndex(null);
      setOrigenModal4(modalActiva === 1 ? 'registrar' : 'editar');
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
        cantidad_presentacion: item.cantidad_presentacion ?? "",
        cantidad_total: item.cantidad_total        ?? "",
        fecha_vencimiento: item.fecha_vencimiento     ?? "",
        motivo: item.motivo                ?? "",
      });
    }
    if (num === 6 && item) setDetalleSeleccionado(item);
    if (num === 7 && item) {
      setEntradaSeleccionada(item);
    }
    setModalActiva(num);
  };
  // ── Cerrar modal ─────────────────────────────────────────────────────────────
  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActiva(null);
    setEntradaSeleccionada(null);
    setDetalleSeleccionado(null);
    setFormEntrada(entradaVacia());
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
    if (!form.fecha_vencimiento) {
      e.fecha_vencimiento = "❗La fecha de vencimiento es obligatoria.";
    } else {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // ignora la hora, solo compara fecha
      const fechaIngresada = new Date(form.fecha_vencimiento);
      if (fechaIngresada <= hoy) {
        e.fecha_vencimiento = "❗La fecha de vencimiento debe ser una fecha futura.";
      }
    }
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
      setModalActiva(1);
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
        id_entrada1: entradaSeleccionada.id_entrada,
        id_producto1: formDetalle.id_producto1,
        cantidad_presentacion: formDetalle.cantidad_presentacion,
        cantidad_total: formDetalle.cantidad_total,
        fecha_vencimiento: formDetalle.fecha_vencimiento,
        motivo: formDetalle.motivo,
      }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(entradaSeleccionada.id_entrada);
        mostrarExito("¡Producto agregado!", () => setModalActiva(2));
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
      cantidad_presentacion: det.cantidad_presentacion,
      cantidad_total: det.cantidad_total,
      fecha_vencimiento: det.fecha_vencimiento,
      motivo: det.motivo,
    });
    setErrores({});
    setHistorial(prev => [...prev, modalActiva]);
    setModalActiva(5);
  };

  // ── POST: registrar entrada + detalles ───────────────────────────────────────
  const handleRegistrar = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formEntrada.fecha_hora)    errs.fecha_hora = "❗La fecha es obligatoria.";
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
        fecha_hora:    formEntrada.fecha_hora,
        observaciones: formEntrada.observaciones,
        detalles: listaDetalles.map(d => ({
          id_producto1:          d.id_producto1,
          cantidad_presentacion: d.cantidad_presentacion,
          cantidad_total:        d.cantidad_total,
          fecha_vencimiento:     d.fecha_vencimiento,
          motivo:                d.motivo,
        })),
      }),
    })
    .then(r => r.json())
    .then(res => {
        if (res.success) {
          cargarEntradas();
          mostrarExito(`¡Entrada registrada con ${res.detalles_registrados} producto(s)!`, cerrarModal);
        } else {
          setErrores(res.errores ?? { general: "Error desconocido." });
        }
      })
      .catch(() => setErrores({ general: "❗Error de conexión con el servidor." }))
      .finally(() => setCargando(false));
  };

  // ── PUT: editar cabecera de entrada ──────────────────────────────────────────
  const handleEditar = (e) => {
    e.preventDefault();
    setCargando(true);
    setErrores({});
    fetch(API, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_entrada: entradaSeleccionada.id_entrada, ...formEditar }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) { cargarEntradas(); mostrarExito("¡Entrada actualizada!", cerrarModal); }
        else setErrores(res.errores ?? { general: "Error desconocido." });
      })
      .catch(() => setErrores({ general: "Error de conexión." }))
      .finally(() => setCargando(false));
  };

  // ── DELETE: desactivar entrada ───────────────────────────────────────────────
  const handleEliminar = () => {
    setCargando(true);
    setErrores({});
    fetch(API, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_entrada: entradaSeleccionada.id_entrada }),
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) { cargarEntradas(); mostrarExito("¡Entrada desactivada!", cerrarModal); }
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
        id_detalle_entrada: detalleSeleccionado.id_detalle_entrada,
        id_producto1: formEditarDetalle.id_producto1,
        cantidad_presentacion: formEditarDetalle.cantidad_presentacion,
        cantidad_total: formEditarDetalle.cantidad_total,
        fecha_vencimiento: formEditarDetalle.fecha_vencimiento,
        motivo: formEditarDetalle.motivo,
      }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(entradaSeleccionada.id_entrada);
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
    const detallesActivos = (entradaSeleccionada?.detalles ?? []).filter(
      d => d.id_detalle_entrada !== detalleSeleccionado.id_detalle_entrada
    );

    if (detallesActivos.length === 0) {
      setErrores({ general: "No puedes desactivar este producto porque la entrada quedaría vacía. Agrega otro producto primero o desactiva la entrada completa." });
      return;
    }

    setCargando(true);
    setErrores({});
    fetch(API_DET, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_detalle_entrada: detalleSeleccionado.id_detalle_entrada }),
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        recargarDetalles(entradaSeleccionada.id_entrada);
        mostrarExito("¡Producto desactivado!", () => setModalActiva(2));
      } else {
        setErrores(res.errores ?? { general: "Error desconocido." });
      }
    })
    .catch(() => setErrores({ general: "Error de conexión." }))
    .finally(() => setCargando(false));
  };

  // ── Filtro tabla principal ───────────────────────────────────────────────────
  const entradasFiltradas = entradas.filter(e =>
    (e.fecha_hora    ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.observaciones ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );
  // RENDER
  return (
    <>
      <head><title>Entradas de Productos - Softcare</title></head>
      <main>
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Entradas de Productos</h2>

          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={e => e.preventDefault()}>
              <input className="busqueda-input1" type="text" placeholder="Busca una entrada"
                value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              <button className="diff_busqueda-icono" type="button">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="diff_registrar-btn" type="button" onClick={() => abrirModal(1)}>
              Registrar Entrada del Producto
            </button>
          </section>

          <table className="tabla-entradas">
            <thead className="header-tabla-entradas">
              <tr>
                <td>Fecha y Hora</td>
                <td>Observaciones</td>
                <td>Detalles</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-entradas">
              {entradasFiltradas.length === 0 ? (
                <tr><td colSpan="4">{busqueda ? "No se encontraron entradas." : "No hay entradas registradas."}</td></tr>
              ) : (
                entradasFiltradas.map(entrada => (
                  <tr key={entrada.id_entrada}>
                    <td>{entrada.fecha_hora}</td>
                    <td>{entrada.observaciones}</td>
                    <td>
                      <button className="ver-detalles-btn" type="button" onClick={() => abrirModal(7, entrada)}> Ver Detalles</button>
                    </td>
                    <td>
                      <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(2, entrada)}>
                        <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                      </figure>
                      <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(3, entrada)}>
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

      <div className="modales-entradas-prod" style={{ display: modalActiva ? "flex" : "none" }}>

        {/* ── MODAL 1: Registrar Entrada ──────────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-entrada-registrar">
            <button className="volver-btn-entr-prod" type="button" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-epr-titulo">Registre una nueva Entrada de Productos</h1>

            <p className="exito-mensaje">{mensajeExito ?? ""}</p>
            <span className="error-mensaje">{errores.general ?? ""}</span>
            <span className="error-mensaje">{errores.sesion ?? ""}</span>

            <form className="epr-form" onSubmit={handleRegistrar}>
              <section className="epr-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="epr-label">Fecha y Hora de Entrada <span className="obligatorio">*</span></label>
                  <input className="epr-input1" type="datetime-local"
                    value={formEntrada.fecha_hora}
                    onChange={e => setFormEntrada({ ...formEntrada, fecha_hora: e.target.value })} />
                  <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt2" }}>
                  <label className="epr-label">Observaciones de la Entrada</label>
                  <textarea className="epr-input2"
                    value={formEntrada.observaciones}
                    onChange={e => setFormEntrada({ ...formEntrada, observaciones: e.target.value })} />
                  <span className="error-mensaje">{errores.observaciones ?? ""}</span>
                </div>
                <section style={{ gridArea: "divInpt3" }} className="epr-form-detalles-area">
                  <div className="epr-form-detalles-header">
                    <h2>Productos de la Entrada</h2>
                    <button type="button" className="epr-agregar-detalles-btn" onClick={() => abrirModal(4)}>
                      Agregar Producto
                    </button>
                  </div>
                  <span className="error-mensaje">{errores.detalles ?? ""}</span>
                  <table className="tabla-epr-detalles">
                    <thead className="header-tabla-epr-detalles">
                      <tr>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Cantidad Total</td>
                        <td>Vencimiento</td>
                        <td>Motivo</td>
                        <td>Editar | Quitar</td>
                      </tr>
                    </thead>
                    <tbody className="body-tabla-epr-detalles">
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
                            <td>{det.cantidad_total} {det.tipo_medida}</td>
                            <td>{det.fecha_vencimiento}</td>
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
                  : `Registrar Entrada${listaDetalles.length > 0 ? ` (${listaDetalles.length} producto${listaDetalles.length > 1 ? "s" : ""})` : ""}`}
                disabled={cargando}
              />
            </form>
          </aside>
        )}

        {/* ── MODAL 2: Ver / Editar Entrada ──────────────────────────────── */}
        {modalActiva === 2 && (
          <aside className="modal-entrada-editar">
            <button className="volver-btn-entr-prod" type="button" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-eped-titulo">Editar Entrada N°{entradaSeleccionada?.id_entrada}</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="eped-form" onSubmit={handleEditar}>
              <section className="eped-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="eped-label">Fecha y Hora <span className="obligatorio">*</span></label>
                  <input className="eped-input1" type="datetime-local" value={formEditar.fecha_hora} onChange={e => setFormEditar({ ...formEditar, fecha_hora: e.target.value })} />
                  <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt2" }}>
                  <label className="eped-label">Observaciones</label>
                  <textarea className="eped-input2" value={formEditar.observaciones} onChange={e => setFormEditar({ ...formEditar, observaciones: e.target.value })} />
                </div>
                {/* Tabla de detalles con botones editar/desactivar */}
                <section style={{ gridArea: "divInpt3" }} className="eped-form-detalles-area">
                  <div className="eped-form-detalles-header">
                    <h2>Productos registrados</h2>
                    <button type="button" className="epr-agregar-detalles-btn" onClick={() => abrirModal(4)}>
                      Agregar Producto
                    </button>
                  </div>
                  
                  <table className="tabla-eped-detalles">
                    <thead className="header-tabla-eped-detalles">
                      <tr>
                        <td>Producto</td>
                        <td>Cantidad</td>
                        <td>Cantidad Total</td>
                        <td>Vencimiento</td>
                        <td>Motivo</td>
                        <td>Editar | Desactivar</td>
                      </tr>
                    </thead>
                    <tbody className="body-tabla-eped-detalles">
                      {(entradaSeleccionada?.detalles ?? []).length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", color: "#888" }}>
                            Sin productos registrados.
                          </td>
                        </tr>
                      ) : (
                        (entradaSeleccionada?.detalles ?? []).map(det => (
                          <tr key={det.id_detalle_entrada}>
                            <td>{det.nombre_producto}</td>
                            <td>{det.cantidad_presentacion}</td>
                            <td>{det.cantidad_total} {det.tipo_medida}</td>
                            <td>{det.fecha_vencimiento}</td>
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
              <input className="eped-btn" type="submit" value={cargando ? "Guardando..." : "Realizar cambios"} disabled={cargando} />
            </form>
          </aside>
        )}

        {/* ── MODAL 3: Desactivar Entrada ─────────────────────────────────── */}
        {modalActiva === 3 && (
          <aside className="modal-entrada-desactivar">
            <h1 className="modal-epel-titulo">Desactivar Entrada Registrada</h1>
            <h3 className="modal-epel-mensaje"> ¿Desea desactivar la Entrada N°{" "}
              <span className="subrayar">{entradaSeleccionada?.id_entrada}</span>?
            </h3>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            <section className="modal-buttons">
              <button className="desactivar-btn" type="button" onClick={handleEliminar} disabled={cargando}>
                {cargando ? "Desactivando..." : "Desactivar"}
              </button>
              <button className="cancelar-btn" type="button" onClick={cerrarModal}>Cancelar</button>
            </section>
          </aside>
        )}

        {/* ── MODAL 4: Agregar / Editar producto en memoria ───────────────── */}
        {modalActiva === 4 && (
          <aside className="modal-entrada-detalle-registrar">
            <button className="volver-btn-entr-det-prod" type="button" onClick={volver}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-edpr-titulo"> {detalleEditIndex !== null ? "Editar Producto" : "Agregar Producto a la Entrada"}</h1>
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="edpr-form" onSubmit={handleGuardarDetalle}>
              <section className="edpr-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="edpr-label">Producto <span className="obligatorio">*</span></label>
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
                          cantidad_presentacion: "",
                          cantidad_total:        "",
                        }));
                      } else {
                        setFormDetalle(prev => ({
                          ...prev,
                          id_producto1: "", nombre_producto: "",
                          tipo_medida: "", cantidad_por_unidad: "",
                          cantidad_presentacion: "", cantidad_total: "",
                        }));
                      }
                    }}
                  />
                  
                 <span className="error-mensaje">{errores.id_producto1 ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="edpr-label">Motivo <span className="obligatorio">*</span></label>
                  <textarea className="edpr-input2" value={formDetalle.motivo} onChange={e => setFormDetalle({ ...formDetalle, motivo: e.target.value })} />
                  <span className="error-mensaje">{errores.motivo ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="edpr-label">
                    Cantidad <span className="obligatorio">*</span>
                    {productoElegido && (
                      <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                        (frascos / cajas / unidades)
                      </span>
                    )}
                  </label>
                  <input className="edpr-input3" type="number" min="1" value={formDetalle.cantidad_presentacion} onChange={e => handleCantidadPres(e.target.value, productoElegido?.cantidad_por_unidad ?? 0, setFormDetalle)} />
                  <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="edpr-label">Fecha de Vencimiento <span className="obligatorio">*</span></label>
                  <input className="edpr-input4" type="date"
                    value={formDetalle.fecha_vencimiento}
                    onChange={e => setFormDetalle({ ...formDetalle, fecha_vencimiento: e.target.value })} />
                 <span className="error-mensaje">{errores.fecha_vencimiento ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="edpr-label">
                    Cantidad total
                    {productoElegido && (
                      <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                        ({productoElegido.cantidad_por_unidad} {productoElegido.tipo_medida} × cantidad)
                      </span>
                    )}
                  </label>
                  <div className="union-input-icono">
                    <input className="edpr-input6" type="text" readOnly
                      style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                      placeholder={!productoElegido ? "Selecciona un producto primero" : "Ingresa la cantidad"}
                      value={formDetalle.cantidad_total !== ""
                        ? `${formDetalle.cantidad_total} ${productoElegido?.tipo_medida ?? ""}` : ""}
                    />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>
              </section>
              <input className="edpr-btn" type="submit" value={detalleEditIndex !== null ? "Guardar cambios" : "Agregar a la entrada"} disabled={cargando} />
            </form>
          </aside>
        )}

        {/* ── MODAL 5: Editar detalle guardado en BD ──────────────────────── */}
        {modalActiva === 5 && (
          <aside className="modal-entrada-detalle-registrar">
            <button className="volver-btn-entr-det-prod" type="button" onClick={volver}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-edpr-titulo">Editar Producto de la Entrada</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="edpr-form" onSubmit={handleEditarDetalle}>
              <section className="edpr-form-inputs-area">
                {/* Producto — solo lectura, no se puede cambiar desde aquí */}
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="edpr-label">Producto</label>
                    <BuscadorProducto
                        key={detalleSeleccionado?.id_detalle_entrada} // fuerza reinicio con el producto correcto
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
                              cantidad_presentacion: "",
                              cantidad_total: "",
                            }));
                          }
                        }}
                      />
                      <span className="error-mensaje">{errores.id_producto1 ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="edpr-label">Motivo <span className="obligatorio">*</span></label>
                  <textarea className="edpr-input2"
                    value={formEditarDetalle.motivo}
                    onChange={e => setFormEditarDetalle({ ...formEditarDetalle, motivo: e.target.value })} />
                 <span className="error-mensaje">{errores.motivo ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="edpr-label">
                    Cantidad <span className="obligatorio">*</span>
                    <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                      (frascos / cajas / unidades)
                    </span>
                  </label>
                  <input className="edpr-input3" type="number" min="1" value={formEditarDetalle.cantidad_presentacion}
                    onChange={e => handleCantidadPres(e.target.value, productoElegidoEditar?.cantidad_por_unidad ?? formEditarDetalle.cantidad_por_unidad, setFormEditarDetalle)} />
                  <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="edpr-label">Fecha de Vencimiento <span className="obligatorio">*</span></label>
                  <input className="edpr-input4" type="date" value={formEditarDetalle.fecha_vencimiento} onChange={e => setFormEditarDetalle({ ...formEditarDetalle, fecha_vencimiento: e.target.value })} />
                  <span className="error-mensaje">{errores.fecha_vencimiento ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="edpr-label">
                    Cantidad total
                    <span style={{ fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6 }}>
                      ({formEditarDetalle.cantidad_por_unidad} {formEditarDetalle.tipo_medida} × cantidad)
                    </span>
                  </label>
                  <div className="union-input-icono">
                    <input className="edpr-input6" type="text" readOnly
                      style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                      value={formEditarDetalle.cantidad_total !== ""
                        ? `${formEditarDetalle.cantidad_total} ${formEditarDetalle.tipo_medida}` : ""}
                    />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>

              </section>
              <input className="edpr-btn" type="submit"
                value={cargando ? "Guardando..." : "Guardar cambios"} disabled={cargando} />
            </form>
          </aside>
        )}

        {/* ── MODAL 6: Confirmar desactivar detalle ───────────────────────── */}
        {modalActiva === 6 && (
          <aside className="modal-entrada-desactivar">
            <h1 className="modal-epel-titulo">Desactivar Producto</h1>
            <h3 className="modal-epel-mensaje">
              ¿Desea desactivar&nbsp;{" "}
              <span className="subrayar">{detalleSeleccionado?.nombre_producto}</span>?
            </h3>
            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            <section className="modal-buttons">
              <button className="desactivar-btn" type="button"
                onClick={handleDesactivarDetalle} disabled={cargando}>
                {cargando ? "Desactivando..." : "Desactivar"}
              </button>
              <button className="cancelar-btn" type="button" onClick={() => setModalActiva(2)}>
                Cancelar
              </button>
            </section>
          </aside>
        )}

        {modalActiva === 7 && (
          <aside className="modal-entrada-editar">
            <button className="volver-btn-entr-prod" type="button" onClick={volver}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-eped-titulo">Entrada N°{entradaSeleccionada?.id_entrada}</h1>

            <section className="eped-form-inputs-area">
             <div style={{ gridArea: "divInpt1" }}>
                <label className="eped-label">Fecha y Hora</label>
                <input className="eped-input1" type="datetime-local" value={entradaSeleccionada?.fecha_hora ?? ""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }} />
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="eped-label">Observaciones</label>
                <textarea className="eped-input2" value={entradaSeleccionada?.observaciones ?? ""} readOnly style={{ background: "#f5f5f5", cursor: "not-allowed", resize: "none" }} />
              </div>

              <section style={{ gridArea: "divInpt3" }} className="eped-form-detalles-area">
                <div className="eped-form-detalles-header">
                 <h2>Productos registrados</h2>
                </div>

                <table className="tabla-eped-detalles">
                  <thead className="header-tabla-eped-detalles">
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Cantidad Total</td>
                      <td>Vencimiento</td>
                      <td>Motivo</td>
                    </tr>
                  </thead>
                  <tbody className="body-tabla-eped-detalles">
                    {(entradaSeleccionada?.detalles ?? []).length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center", color: "#888" }}> Sin productos registrados.</td>
                    </tr>
                    ) : (
                      (entradaSeleccionada?.detalles ?? []).map(det => (
                        <tr key={det.id_detalle_entrada}>
                          <td>{det.nombre_producto}</td>
                          <td>{det.cantidad_presentacion}</td>
                          <td>{det.cantidad_total} {det.tipo_medida}</td>
                          <td>{det.fecha_vencimiento}</td>
                          <td>{det.motivo}</td>
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
  );
};
