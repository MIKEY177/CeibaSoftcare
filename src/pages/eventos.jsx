import React, { useEffect, useState, useRef } from "react";
import { MenuAdmin } from "../utils/menu.jsx";
import "../styles/global_styles.css";
import "../styles/eventos.css";
import editarIcon from "../images/icons/editar.png";
import desactivarIcon from "../images/icons/desactivar.png";
import lupaBusqueda from "../images/lupa_busqueda.png";
import flecha from "../images/flecha_salir.png";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

const API_BUSQUEDA = `api/productos_busqueda.php`;
const BuscadorProducto = ({ onSeleccionar, valorInicial = "" }) => {
  const [query, setQuery] = useState(valorInicial);
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(valorInicial ? true : null); // ← cambio aquí
  const [cargando, setCargando] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    if (skipSearch.current) {
      skipSearch.current = false;
      return;
    }
    if (query.trim().length < 1) {
      setResultados([]);
      return;
    }
    const timeout = setTimeout(() => {
      setCargando(true);
      fetch(`${API_BUSQUEDA}?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setResultados(res.data);
        })
        .catch(console.error)
        .finally(() => setCargando(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const elegir = (prod) => {
    skipSearch.current = true;
    setSeleccionado(prod);
    setQuery(prod.nombre);
    setResultados([]);
    onSeleccionar(prod);
  };

  const limpiar = () => {
    skipSearch.current = false;
    setSeleccionado(null);
    setQuery("");
    setResultados([]);
    onSeleccionar(null);
  };

  return (
    <div className="buscador-wrapper">
      <div className="buscador-input-row">
        <input type="text" className="er-input1"placeholder="Buscar por nombre o código..." value={query} 
          onChange={(e) => {
            setSeleccionado(null);
            setQuery(e.target.value);
          }}
          autoComplete="off"
        />
      </div>

      {cargando && <p className="buscador-cargando">Buscando...</p>}

      {!seleccionado && resultados.length > 0 && (
        <ul className="buscador-dropdown">
          {resultados.map((prod) => (
            <li key={prod.id_producto} onMouseDown={(e) => e.preventDefault()} onClick={() => elegir(prod)}>
              <span className="buscador-nombre">{prod.nombre}</span>
              <span className="buscador-detalle"> {prod.cantidad_por_unidad} {prod.tipo_medida} </span>
            </li>
          ))}
        </ul>
      )}

      {query.length >= 1 && !cargando && resultados.length === 0 && !seleccionado && (<p className="buscador-sin-resultados">Sin resultados</p>)}
    </div>
  );
};

export const indexSelector = 5;
export const Eventos = () => {
  const API = `api/eventos.php`;
  const navigate = useNavigate();
  const API_SESSION = `api/session.php`;

  const [user, setUser] = useState({ nombre: "", rol: "" });
  const normalizarFecha = (f) => f.replace("T", " ").slice(0, 16);

  const eventoVacio = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return {
      nombre: "",
      descripcion: "",
      requiere_producto: 0,
      fecha_hora: d.toISOString().slice(0, 16),
      lugar: "",
    };
  };

  const productoVacio = {
    id_producto: "",
    nombre: "",
    tipo_medida: "",
    cantidad_por_unidad: "",
    cantidad: "",
    cantidad_total: "",
  };

  const [stockDisponible, setStockDisponible] = useState(null);
  const [cargandoStock, setCargandoStock] = useState(false);

  const [formProducto, setFormProducto] = useState(productoVacio);
  const [productoElegido, setProductoElegido] = useState(null);

  const [listaProductos, setListaProductos] = useState([]);

  const [errores, setErrores] = useState({});
  const [mensajeExito, setMensajeExito] = useState("");

  const [modalActivo, setModalActivo] = useState(null);

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [formEvento, setFormEvento] = useState(eventoVacio());
  const [formEditar, setFormEditar] = useState(eventoVacio());

  const [cargando, setCargando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [modalOrigen, setModalOrigen] = useState(1);

  const [indexEditandoProducto, setIndexEditandoProducto] = useState(null);
  const menuObj = user.rol === "administrador";

  const [productosOriginales, setProductosOriginales] = useState([]);

  const hayCambios = () => {
    const camposEvento =
      eventoSeleccionado.nombre !== formEditar.nombre ||
      eventoSeleccionado.descripcion !== formEditar.descripcion ||
      normalizarFecha(eventoSeleccionado.fecha_hora) !==
        normalizarFecha(formEditar.fecha_hora) ||
      eventoSeleccionado.lugar !== formEditar.lugar ||
      Number(eventoSeleccionado.requiere_producto) !==
        Number(formEditar.requiere_producto);

    const orig = JSON.stringify(
      productosOriginales.map((p) => ({
        id_producto: p.id_producto,
        cantidad_presentacion: String(p.cantidad_presentacion),
        cantidad_total: String(p.cantidad_total),
      })),
    );

    const actual = JSON.stringify(
      listaProductos.map((p) => ({
        id_producto: p.id_producto,
        cantidad_presentacion: String(p.cantidad_presentacion),
        cantidad_total: String(p.cantidad_total),
      })),
    );

    return camposEvento || orig !== actual;
  };
  const abrirModal = (num, evento = null) => {
    if (num === 1) {
      setFormEvento(eventoVacio());
      setModalOrigen(1);
    }
    if (num === 2 && evento) {
      const eventoNormalizado = {
        ...evento,
        requiere_producto: Number(evento.requiere_producto ?? 0),
        fecha_hora: evento.fecha_hora
          ? evento.fecha_hora.replace(" ", "T").slice(0, 16)
          : "",
      };
      setEventoSeleccionado(eventoNormalizado);
      setFormEditar(eventoNormalizado);

      if (Number(evento.requiere_producto) === 1) {
        fetch(`api/productos_evento.php?id=${evento.id_evento}`, {
          credentials: "include",
        })
          .then((r) => r.json())
          .then((res) => {
            if (res.success) {
              setListaProductos(res.data);
              setProductosOriginales(res.data);
            }
          })
          .catch(console.error);
      } else {
        setListaProductos([]);
        setProductosOriginales([]); 
      }
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
    setListaProductos([]);
    setFormProducto(productoVacio);
    setProductoElegido(null);
    setStockDisponible(null);
  };

  useEffect(() => {
    fetch(API_SESSION, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol });
          if (data.rol !== "administrador") navigate("/inicio");
        } else navigate("/iniciar_sesion");
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => {
    fetch(API, { credentials: "include" })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          const eventosNormalizados = res.data.map((ev) => ({
            ...ev,
            requiere_producto: Number(ev.requiere_producto),
          }));
          setEventos(eventosNormalizados);
        }
      })
      .catch(console.error);
  }, []);

  const btnRegistrarRef = useRef(null);
const enviandoEvento = useRef(false);

const handleRegistrar = () => {
  if (enviandoEvento.current) return; // ← bloqueo inmediato
  enviandoEvento.current = true;      // ← marca inmediatamente

  const nuevosErrores = {};
  if (formEvento.requiere_producto === 1 && listaProductos.length === 0) {
    nuevosErrores.productos = "❗Debes agregar al menos un producto.";
    setErrores(nuevosErrores);
    enviandoEvento.current = false;
    return;
  }

  setCargando(true);
  setErrores({});

  const data = {
    ...formEvento,
    fecha_hora: formEvento.fecha_hora.replace("T", " ") + ":00",
    requiere_producto: Number(formEvento.requiere_producto),
    productos:
      formEvento.requiere_producto === 1
        ? listaProductos.map((p) => ({
            id_producto: p.id_producto,
            cantidad_presentacion: p.cantidad_presentacion,
            cantidad_total: p.cantidad_total,
          }))
        : [],
  };

  fetch(API, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(async (r) => {
      const res = await r.json();
      if (!r.ok) {
        setErrores(res.errores || {});
        enviandoEvento.current = false;
        return;
      }
      setEventos((prev) => [...prev, res.data]);
      setMensajeExito("Evento registrado correctamente");
      setTimeout(() => cerrarModal(), 1500);
    })
    .catch(() => {
      setErrores({ general: "❗Error de conexión con el servidor." });
      enviandoEvento.current = false;
    })
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
        requiere_producto: Number(formEditar.requiere_producto),
        productos:
          formEditar.requiere_producto === 1
            ? listaProductos.map((p) => ({
                id_producto: p.id_producto,
                cantidad_presentacion: p.cantidad_presentacion,
                cantidad_total: p.cantidad_total,
              }))
            : [],
      }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          if (res.mensaje === "No se realizaron cambios.") {
            setErrores({ general: res.mensaje });
            return;
          }
          setMensajeExito(res.mensaje || "Evento actualizado correctamente.");
          setEventos((prev) =>
            prev.map((ev) =>
              ev.id_evento === eventoSeleccionado.id_evento
                ? { ...ev, ...formEditar }
                : ev,
            ),
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
      body: JSON.stringify({ id_evento: eventoSeleccionado.id_evento }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setEventos((prev) =>
            prev.filter((ev) => ev.id_evento !== eventoSeleccionado.id_evento),
          );
          cerrarModal();
        }
      })
      .finally(() => setCargando(false));
  };
  const handleGuardarProducto = (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!formProducto.id_producto) {
      nuevosErrores.id_producto = "❗Selecciona un producto.";
    }

    if (
      !formProducto.cantidad_presentacion ||
      Number(formProducto.cantidad_presentacion) <= 0
    ) {
      nuevosErrores.cantidad_presentacion = "❗La cantidad debe ser mayor a 0.";
    }

    if (
      stockDisponible !== null &&
      Number(formProducto.cantidad_total) > stockDisponible
    ) {
      nuevosErrores.cantidad_presentacion = "❗Stock insuficiente.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    setErrores({});
    setListaProductos((prev) => [...prev, formProducto]);
    setFormProducto(productoVacio);
    setProductoElegido(null);
    setStockDisponible(null);
    setModalActivo(5);
  };
  const eventosFiltrados = eventos.filter(
    (e) =>
      e &&
      e.nombre &&
      e.lugar &&
      (e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.lugar.toLowerCase().includes(busqueda.toLowerCase())),
  );

  const mostrarExito = (msg, cb) => {
    setMensajeExito(msg);
    setTimeout(() => {
      setMensajeExito("");
      if (cb) cb();
    }, 1500);
  };
  return (
    <>
      <main>
        <Navbar menu={MenuAdmin} user={user} />

        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Eventos</h2>

          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={(e) => e.preventDefault()}>
              <input className="busqueda-input1" type="text" placeholder="Busca un evento" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
              <button className="diff_busqueda-icono" type="button">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>

            <button className="diff_registrar-btn" type="button" onClick={() => abrirModal(1)}> Registrar nuevo Evento</button>
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
                  <td colSpan="4">
                    {busqueda ? "No se encontraron eventos." : "No hay eventos registrados."}
                  </td>
                </tr>
              ) : (
                eventosFiltrados.map((evento) => (
                  <tr key={evento.id_evento}>
                    <td>{evento.nombre}</td>
                    <td>{new Date(evento.fecha_hora).toLocaleString()}</td>
                    <td>{evento.lugar}</td>
                    <td>
                      <div className="last-td-flex-content-wrapper">
                        <figure className="editar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(2, evento)}>
                          <img className="editar-icono-img" src={editarIcon} alt="Editar"/>
                        </figure>
                        <figure className="desactivar-icono" style={{ cursor: "pointer" }} onClick={() => abrirModal(3, evento)}>
                          <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar"/>
                        </figure>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
        <Footer />
        <div className="modales-eventos" style={{ display: modalActivo ? "flex" : "none" }}>
          {/* MODAL REGISTRAR */}
          {modalActivo === 1 && (
            <aside className="modal-eventos-registrar">
              <button className="volver-btn-even" onClick={cerrarModal}>
                <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
              </button>

              <h1 className="modal-er-titulo">Registre un nuevo Evento</h1>
              <p className="exito-mensaje">{mensajeExito ?? ""}</p>
              <span className="error-mensaje">{errores.general ?? ""}</span>
              <span className="error-mensaje">{errores.sesion ?? ""}</span>
              <form className="er-form" onSubmit={e => e.preventDefault()}>
                <section className="er-form-inputs-area">
                  <div style={{ gridArea: "divInpt1" }}>
                    <label className="er-label">  {" "} Nombre del Evento<h6 className="obligatorio">*</h6></label>
                    <input className="er-input1" type="text" value={formEvento.nombre} onChange={(e) => setFormEvento({ ...formEvento, nombre: e.target.value })}/>
                    <span className="error-mensaje">{errores.nombre ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt2" }}>
                    <label className="er-label">Descripción</label>
                    <textarea className="er-input2" value={formEvento.descripcion} onChange={(e) => setFormEvento({...formEvento,descripcion: e.target.value,})}/>
                    <span className="error-mensaje">{errores.descripcion ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt3" }}>
                    <label className="er-label">¿Requiere producto?</label>
                    <select className="er-input3" value={formEvento.requiere_producto} onChange={(e) => setFormEvento({...formEvento,requiere_producto: Number(e.target.value),}) } >
                      <option value={0}>No</option>
                      <option value={1}>Sí</option>
                    </select>
                  </div>
                  {formEvento.requiere_producto === 1 && (
                    <div className="agregar-producto" style={{ gridArea: "divInpt6" }} >
                      <button type="button" className="registrar-producto-btn"
                        onClick={() => {
                          setModalOrigen(1);
                          abrirModal(5);
                        }}
                       >
                        Ver productos ({listaProductos.length})
                      </button>
                    </div>
                  )}

                  <div style={{ gridArea: "divInpt4" }}>
                    <label className="er-label">{" "} Fecha y Hora<span className="obligatorio">*</span></label>
                    <input className="er-input4" type="datetime-local" value={formEvento.fecha_hora}
                      onChange={(e) =>
                        setFormEvento({
                          ...formEvento,
                          fecha_hora: e.target.value,
                        })
                      }
                    />
                    <span className="error-mensaje">{errores.fecha_hora ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt5" }}>
                    <label className="er-label">{" "} Lugar<h6 className="obligatorio">*</h6></label>
                    <input className="er-input5" type="text" value={formEvento.lugar}
                      onChange={(e) =>
                        setFormEvento({ ...formEvento, lugar: e.target.value })
                      }
                    />
                    <span className="error-mensaje">{errores.lugar ?? ""}</span>
                  </div>
                </section>
                <button ref={btnRegistrarRef} className="er-btn" type="button"  onClick={handleRegistrar} disabled={cargando}> {cargando ? "Registrando..." : "Registrar Evento"} </button>
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

              <h1 className="modal-eed-titulo">Editar Evento Registrado</h1>
              <p className="exito-mensaje">{mensajeExito ?? ""}</p>
              <span className="error-mensaje">{errores.general ?? ""}</span>
              <span className="error-mensaje">{errores.sesion ?? ""}</span>

              <form className="eed-form" onSubmit={handleEditar}>
                <section className="eed-form-inputs-area">
                  <div style={{ gridArea: "divInpt1" }}>
                    <label className="eed-label">{" "} Nombre del Evento<h6 className="obligatorio">*</h6></label>
                    <input className="eed-input1" value={formEditar.nombre}
                      onChange={(e) =>
                        setFormEditar({ ...formEditar, nombre: e.target.value })
                      }
                    />
                    <span className="error-mensaje">{errores.nombre ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt2" }}>
                    <label className="eed-label">Descripción</label>
                    <textarea className="eed-input2" value={formEditar.descripcion}
                      onChange={(e) =>
                        setFormEditar({
                          ...formEditar,
                          descripcion: e.target.value,
                        })
                      }
                    />
                    <span className="error-mensaje"> {" "}{errores.descripcion ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt3" }}>
                    <label className="er-label">¿Requiere producto?</label>
                    <select className="eed-input3" value={formEditar.requiere_producto ?? 0}
                      onChange={(e) =>
                        setFormEditar({
                          ...formEditar,
                          requiere_producto: Number(e.target.value),
                        })
                      }
                    >
                      <option value={0}>No</option>
                      <option value={1}>Sí</option>
                    </select>
                  </div>
                  {formEditar.requiere_producto === 1 && (
                    <div className="agregar-producto" style={{ gridArea: "divInpt6" }}>
                      <button type="button" className="registrar-producto-btn"
                        onClick={() => {
                          setModalOrigen(2);
                          abrirModal(5);
                        }}
                      >
                        Ver productos ({listaProductos.length})
                      </button>
                    </div>
                  )}

                  <div style={{ gridArea: "divInpt4" }}>
                    <label className="eed-label">{" "} Fecha y Hora<span className="obligatorio">*</span></label>
                    <input className="eed-input5" type="datetime-local" value={formEditar.fecha_hora}
                      onChange={(e) =>
                        setFormEditar({
                          ...formEditar,
                          fecha_hora: e.target.value,
                        })
                      }
                    />
                    <span className="error-mensaje"> {errores.fecha_hora ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt5" }}>
                    <label className="eed-label"> {" "}Lugar<h6 className="obligatorio">*</h6></label>
                    <input className="eed-input4" value={formEditar.lugar}
                      onChange={(e) =>
                        setFormEditar({ ...formEditar, lugar: e.target.value })
                      }
                    />
                    <span className="error-mensaje">{errores.lugar ?? ""}</span>
                  </div>
                </section>
                <input
                  className="eed-btn"
                  type="submit"
                  value="Guardar cambios"
                  disabled={cargando}
                />
              </form>
            </aside>
          )}

          {/* MODAL ELIMINAR */}
          {modalActivo === 3 && (
            <aside className="modal-eventos-desactivar">
              <h1 className="modal-eel-titulo">Desactivar Evento Registrado</h1>

              <h3 className="modal-eel-mensaje">
                ¿Desea desactivar&nbsp; <span className="subrayar"> evento</span>?
              </h3>

              <section className="modal-buttons">
                <button className="desactivar-btn" type="button" onClick={handleDesactivar} disabled={cargando}>{" "}{cargando ? "Desactivando..." : "Desactivar"}</button>
                <button className="cancelar-btn" onClick={cerrarModal}>Cancelar</button>
              </section>
            </aside>
          )}

          {modalActivo === 4 && (
            <aside className="modal-eventos-rp">
              <button className="volver-btn-even" type="button" onClick={() => setModalActivo(modalOrigen)}>
                <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
              </button>

              <h1 className="modal-rp-titulo">Agregar producto al evento</h1>

              <form className="rp-form" onSubmit={handleGuardarProducto}>
                <section className="rp-form-inputs-area">
                  <div style={{ gridArea: "divInpt1" }}>
                    <label className="rp-label">{" "} Producto <span className="obligatorio">*</span> </label>
                    <BuscadorProducto
                      valorInicial={formProducto.nombre}
                      onSeleccionar={(prod) => {
                        setProductoElegido(prod); 
                        if (prod) {
                          setFormProducto({
                            id_producto: prod.id_producto,
                            nombre: prod.nombre,
                            tipo_medida: prod.tipo_medida,
                            cantidad_por_unidad: prod.cantidad_por_unidad,
                            cantidad_presentacion: "",
                            cantidad_total: "",
                          });
                          setCargandoStock(true);
                          fetch(
                            `api/stock_producto.php?id=${prod.id_producto}`,
                            { credentials: "include" },
                          )
                            .then((r) => r.json())
                            .then((res) => {
                              if (res.success) setStockDisponible(res.stock);
                            })
                            .catch(console.error)
                            .finally(() => setCargandoStock(false));
                        } else {
                          setFormProducto(productoVacio);
                        }
                      }}
                    />
                    <span className="error-mensaje">{" "} {errores.id_producto ?? ""}</span>
                  </div>

                  <div style={{ gridArea: "divInpt2" }}>
                    <label className="rp-label"> {" "} Cantidad <span className="obligatorio">*</span>
                      {productoElegido && (
                        <span style={{fontWeight: "normal", fontSize: 12, color: "#666", marginLeft: 6,}}>
                          (frascos / cajas / unidades)
                        </span>
                      )}
                    </label>
                    <input className="rp-input1" type="number" min="1" value={formProducto.cantidad_presentacion}
                      onChange={(e) => {
                        const cantidad = e.target.value;
                        const total = productoElegido
                          ? (
                              cantidad * productoElegido.cantidad_por_unidad
                            ).toFixed(2)
                          : "";
                        setFormProducto((prev) => ({
                          ...prev,
                          cantidad_presentacion: cantidad,
                          cantidad_total: total,
                        }));
                      }}
                    />
                    <span className="error-mensaje"> {" "} {errores.cantidad_presentacion ?? ""} </span>

                    {/* Stock disponible */}
                    {cargandoStock && (
                      <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        {" "}
                        Consultando stock...
                      </p>
                    )}
                    {!cargandoStock &&
                      stockDisponible !== null &&
                      productoElegido && (
                        <p>
                          {" "}
                          Stock disponible:{" "}
                          <strong>
                            {" "}
                            {stockDisponible} {productoElegido.tipo_medida}
                          </strong>
                        </p>
                      )}
                  </div>

                  <div style={{ gridArea: "divInpt3" }}>
                    <label className="rp-label">
                      {" "}
                      Cantidad total
                      {productoElegido && (
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: 12,
                            color: "#666",
                            marginLeft: 6,
                          }}
                        >
                          ({productoElegido.cantidad_por_unidad}{" "}
                          {productoElegido.tipo_medida} × cantidad)
                        </span>
                      )}
                    </label>

                    <input className="rp-input3" type="text" readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                      placeholder={
                        !productoElegido
                          ? "Selecciona un producto primero"
                          : "Ingresa la cantidad"
                      }
                      value={
                        formProducto.cantidad_total
                          ? `${formProducto.cantidad_total} ${productoElegido?.tipo_medida ?? ""}`
                          : ""
                      }
                    />
                  </div>
                </section>

                <div style={{display: "flex", gap: "16px", justifyContent: "center", marginTop: "10px",}} >
                  <button type="submit" className="er-btn" style={{ marginTop: 0 }}>
                    Agregar producto
                  </button>
                </div>
              </form>
            </aside>
          )}
          {modalActivo === 5 && (
            <aside className="modal-eventos-productos-lista">
              <button className="volver-btn-even" type="button" onClick={() => setModalActivo(modalOrigen)}>
                <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
              </button>

              <h1 className="modal-ep-titulo">Productos del evento</h1>
              <div style={{ width: "100%", display: "flex", justifyContent: "flex-end",}}>
                <button type="button" className="registrar-producto-btn"
                  onClick={() => {
                    setErrores({});
                    setModalActivo(4);
                  }}
                >
                  Agregar producto
                </button>
              </div>
              {listaProductos.length === 0 ? (
                <p style={{ color: "#888" }}>No hay productos agregados</p>
              ) : (
                <table className="tabla-productos-evento">
                  <thead>
                    <tr>
                      <td>Producto</td>
                      <td>Cantidad</td>
                      <td>Total</td>
                      <td>Editar | Quitar</td>
                    </tr>
                  </thead>
                  <tbody>
                    {listaProductos.map((p, i) => (
                      <tr key={i}>
                        <td>{p.nombre}</td>
                        <td>{p.cantidad_presentacion}</td>
                        <td>
                          {p.cantidad_total} {p.tipo_medida}
                        </td>
                        <td>
                          <div className="last-td-flex-content-wrapper">
                            <figure className="editar-icono" style={{ cursor: "pointer" }}
                              onClick={() => {
                                setIndexEditandoProducto(i);
                                setFormProducto(p);
                                setProductoElegido({
                                  id_producto: p.id_producto,
                                  nombre: p.nombre,
                                  tipo_medida: p.tipo_medida,
                                  cantidad_por_unidad: p.cantidad_por_unidad,
                                });
                                setCargandoStock(true);
                                fetch(
                                  `api/stock_producto.php?id=${p.id_producto}`,
                                  { credentials: "include" },
                                )
                                  .then((r) => r.json())
                                  .then((res) => {
                                    if (res.success)
                                      setStockDisponible(res.stock);
                                  })
                                  .catch(console.error)
                                  .finally(() => setCargandoStock(false));
                                setErrores({});
                                setModalActivo(6);
                              }}
                            >
                              <img className="editar-icono-img" src={editarIcon} alt="Editar"/>
                            </figure>
                            <figure className="desactivar-icono" style={{ cursor: "pointer" }}
                              onClick={() =>
                                setListaProductos((prev) =>
                                  prev.filter((_, index) => index !== i),
                                )
                              }
                            >
                              <img className="desactivar-icono-img" src={desactivarIcon} alt="Desactivar"/>
                            </figure>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </aside>
          )}
          {modalActivo === 6 && (
            <aside className="modal-eventos-rp">
              <button className="volver-btn-even"type="button"onClick={() => { setErrores({}); setModalActivo(5);}}>
                <img className="volver-icono" src={flecha} alt="" />
                <h2>Volver</h2>
              </button>

              <h1 className="modal-rp-titulo">Editar producto del evento</h1>

              <form className="rp-form" onSubmit={(e) => {
                  e.preventDefault();
                  const nuevosErrores = {};

                  if (!formProducto.id_producto) {
                    nuevosErrores.id_producto = "❗Selecciona un producto.";
                  }
                  if (
                    !formProducto.cantidad_presentacion ||
                    Number(formProducto.cantidad_presentacion) <= 0
                  ) {
                    nuevosErrores.cantidad_presentacion =
                      "❗La cantidad debe ser mayor a 0.";
                  }
                  if (
                    stockDisponible !== null &&
                    Number(formProducto.cantidad_total) > stockDisponible
                  ) {
                    nuevosErrores.cantidad_presentacion = `❗Stock insuficiente. Disponible: ${stockDisponible} ${productoElegido?.tipo_medida ?? ""}`;
                  }

                  if (Object.keys(nuevosErrores).length > 0) {
                    setErrores(nuevosErrores);
                    return;
                  }
                  setListaProductos((prev) =>
                    prev.map((p, i) =>
                      i === indexEditandoProducto ? formProducto : p,
                    ),
                  );
                  setFormProducto(productoVacio);
                  setProductoElegido(null);
                  setStockDisponible(null);
                  setIndexEditandoProducto(null);
                  setErrores({});
                  setModalActivo(5);
                }}
              >
                <section className="rp-form-inputs-area">
                  <div style={{ gridArea: "divInpt1" }}>
                    <label className="rp-label"> Producto <span className="obligatorio">*</span></label>
                    <BuscadorProducto
                      valorInicial={formProducto.nombre}
                      onSeleccionar={(prod) => {
                        setProductoElegido(prod);
                        setStockDisponible(null);
                        if (prod) {
                          setFormProducto({
                            id_producto: prod.id_producto,
                            nombre: prod.nombre,
                            tipo_medida: prod.tipo_medida,
                            cantidad_por_unidad: prod.cantidad_por_unidad,
                            cantidad_presentacion: "",
                            cantidad_total: "",
                          });
                          setCargandoStock(true);
                          fetch(
                            `api/stock_producto.php?id=${prod.id_producto}`,
                            { credentials: "include" },
                          )
                            .then((r) => r.json())
                            .then((res) => {
                              if (res.success) setStockDisponible(res.stock);
                            })
                            .catch(console.error)
                            .finally(() => setCargandoStock(false));
                        } else {
                          setFormProducto(productoVacio);
                        }
                      }}
                    />
                    <span className="error-mensaje"> {errores.id_producto ?? ""} </span>
                  </div>

                  <div style={{ gridArea: "divInpt2" }}>
                    <label className="rp-label">
                      Cantidad <span className="obligatorio">*</span>
                      {(productoElegido ||
                        formProducto.cantidad_por_unidad) && (
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: 12,
                            color: "#666",
                            marginLeft: 6,
                          }}
                        >
                          (frascos / cajas / unidades)
                        </span>
                      )}
                    </label>
                    <input className="rp-input1" type="number" min="1" value={formProducto.cantidad_presentacion}
                      onChange={(e) => {
                        const cantidad = e.target.value;
                        const porUnidad =
                          productoElegido?.cantidad_por_unidad ||
                          formProducto.cantidad_por_unidad;
                        const total = porUnidad
                          ? (cantidad * porUnidad).toFixed(2)
                          : "";
                        setFormProducto((prev) => ({
                          ...prev,
                          cantidad_presentacion: cantidad,
                          cantidad_total: total,
                        }));
                      }}
                    />
                    <span className="error-mensaje">{errores.cantidad_presentacion ?? ""}</span>

                    {cargandoStock && (
                      <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                        Consultando stock...
                      </p>
                    )}
                    {!cargandoStock &&
                      stockDisponible !== null &&
                      (productoElegido || formProducto.nombre) && (
                        <p
                          style={{ fontSize: 12, marginTop: 4, color: "#555" }}
                        >
                          Stock disponible:{" "}
                          <strong>
                            {stockDisponible}{" "}
                            {productoElegido?.tipo_medida ||
                              formProducto.tipo_medida}
                          </strong>
                        </p>
                      )}
                  </div>

                  <div style={{ gridArea: "divInpt3" }}>
                    <label className="rp-label">
                      Cantidad total
                      {(productoElegido ||
                        formProducto.cantidad_por_unidad) && (
                        <span
                          style={{
                            fontWeight: "normal",
                            fontSize: 12,
                            color: "#666",
                            marginLeft: 6,
                          }}
                        >
                          (
                          {productoElegido?.cantidad_por_unidad ||
                            formProducto.cantidad_por_unidad}{" "}
                          {productoElegido?.tipo_medida ||
                            formProducto.tipo_medida}{" "}
                          × cantidad)
                        </span>
                      )}
                    </label>
                    <input className="rp-input3" type="text" readOnly style={{ background: "#f5f5f5", cursor: "not-allowed" }}
                      placeholder={
                        !productoElegido && !formProducto.nombre
                          ? "Selecciona un producto primero"
                          : "Ingresa la cantidad"
                      }
                      value={
                        formProducto.cantidad_total
                          ? `${formProducto.cantidad_total} ${productoElegido?.tipo_medida || formProducto.tipo_medida}`
                          : ""
                      }
                    />
                  </div>
                </section>

                <div style={{ display: "flex", gap: "16px", justifyContent: "center", marginTop: "10px",}}>
                  <button type="submit" className="er-btn" style={{ marginTop: 0 }} >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </aside>
          )}
        </div>
      </main>
    </>
  );
};
