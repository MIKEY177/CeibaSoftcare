// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MenuAdmin,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

// Estilos e imágenes
import "../styles/global_styles.css";
import "../styles/ver_historias_medicas.css";
import "../styles/detalle_examen_fisico.css";
import lupaBusqueda from "../images/lupa_busqueda.png";
import editarIcon from "../images/icons/editar.png";
import desactivarIcon from "../images/icons/desactivar.png";
import flecha from "../images/flecha_salir.png";
import campoRestringido from "../images/candado.png";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Notificaciones } from "../components/Notificaciones";
import CustomSelect from "../components/CustomSelect.jsx";

const API_SESSION = `api/session.php`;
const API_HISTORIA = `api/historias_medicas.php`;
const API_EXAMENES = `api/examenes_fisicos.php`;
const API_EVENTOS = `api/eventos_clinicos.php`;
const API_BUSQUEDA = `api/productos_busqueda.php`;
const API_PROD_COD = `/api/inventario.php`;

export const indexSelector = 6;

const BuscadorProducto = ({ onSeleccionar, valorInicial = "" }) => {
  const [query, setQuery] = useState(valorInicial);
  const [resultados, setResultados] = useState([]);
  const [seleccionado, setSeleccionado] = useState(valorInicial ? true : null);
  const [cargando, setCargando] = useState(false);
  const skipSearch = useRef(false);

  useEffect(() => {
    setQuery(valorInicial || "");
  }, [valorInicial]);

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
        <input
          type="text"
          className="er-input1"
          placeholder="Buscar por nombre o código..."
          value={query}
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
            <li
              key={prod.id_producto}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => elegir(prod)}
            >
              <span className="buscador-nombre">{prod.nombre}</span>
              <span className="buscador-detalle">
                {" "}
                {prod.cantidad_por_unidad} {prod.tipo_medida}{" "}
              </span>
            </li>
          ))}
        </ul>
      )}
      {query.length >= 1 &&
        !cargando &&
        resultados.length === 0 &&
        !seleccionado && (
          <p className="buscador-sin-resultados">Sin resultados</p>
        )}
    </div>
  );
};

export const VerHistoriaMedicas = () => {
  const { id_historia_medica } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({ nombre: "", rol: "" });

  const [historia, setHistoria] = useState(null);
  const [examenes, setExamenes] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [modalActiva, setModalActiva] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [examenSeleccionado, setExamenSeleccionado] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [busquedaExamen, setBusquedaExamen] = useState("");
  const [busquedaEvento, setBusquedaEvento] = useState("");
  const enviandoRef = useRef(false);
  const btnRegistrarExamenRef = useRef(null);
  const btnRegistrarEventoRef = useRef(null);
  const scannedCodeRef = useRef("");
  const isScanningRef = useRef(false);
  const lastKeyTimeRef = useRef(0);
  const scanTimeoutRef = useRef(null);
  const [codigoEscaneado, setCodigoEscaneado] = useState("");

  const opcionesRequiere = [
    { value: 1, label: "Sí" },
    { value: 0, label: "No" },
  ];

  const productoVacio = {
    id_producto: "",
    nombre: "",
    tipo_medida: "",
    cantidad_por_unidad: "",
    cantidad_presentacion: "",
    cantidad_total: "",
  };

  const [listaProductos, setListaProductos] = useState([]);
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [formProducto, setFormProducto] = useState(productoVacio);
  const [productoElegido, setProductoElegido] = useState(null);
  const [stockDisponible, setStockDisponible] = useState(null);
  const [cargandoStock, setCargandoStock] = useState(false);
  const [modalOrigen, setModalOrigen] = useState(null);
  const [indexEditandoProducto, setIndexEditandoProducto] = useState(null);

  const bloquearBtn = (ref) => {
    if (ref.current) {
      ref.current.disabled = true;
      ref.current.style.opacity = "0.6";
      ref.current.style.cursor = "not-allowed";
    }
  };
  const desbloquearBtn = (ref) => {
    if (ref.current) {
      ref.current.disabled = false;
      ref.current.style.opacity = "";
      ref.current.style.cursor = "";
    }
  };

  const formExamenVacio = {
    id_historia_medica,
    frecuencia_cardiaca: "",
    frecuencia_respiratoria: "",
    mucosa: "",
    tiempo_llenado_capilar: "",
    temperatura_rectal: "",
    condicion_corporal: "",
    fecha: "",
  };

  const formEventoVacio = {
    id_historia_medica,
    fecha: "",
    responsable: "",
    descripcion: "",
    requiere_producto: 0,
  };

  const [formRegistrarExamen, setFormRegistrarExamen] =
    useState(formExamenVacio);
  const [formEditarExamen, setFormEditarExamen] = useState(formExamenVacio);
  const [formRegistrarEvento, setFormRegistrarEvento] =
    useState(formEventoVacio);
  const [formEditarEvento, setFormEditarEvento] = useState(formEventoVacio);

  useEffect(() => {
    fetch(API_SESSION, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setUser({
            nombre: data.usuario,
            rol: data.rol,
            foto_perfil: data.foto_perfil,
          });
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => {
    if (!id_historia_medica) return;
    cargarHistoria();
    cargarExamenes();
    cargarEventos();
  }, [id_historia_medica]);

  const cargarHistoria = () => {
    fetch(`${API_HISTORIA}?id_historia_medica=${id_historia_medica}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setHistoria(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  };

  const cargarExamenes = () => {
    fetch(`${API_EXAMENES}?id_historia_medica=${id_historia_medica}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setExamenes(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  };

  const cargarEventos = () => {
    fetch(`${API_EVENTOS}?id_historia_medica=${id_historia_medica}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setEventos(
            response.data.map((ev) => ({
              ...ev,
              requiere_producto: Number(ev.requiere_producto ?? 0),
            })),
          );
        } else {
          console.error(response.error);
        }
      })
      .catch(console.error);
  };

  const menuObj = (() => {
    switch (user.rol) {
      case "administrador":
        return MenuAdminAlbergue;
      case "veterinario":
        return MenuAdminAlbergue;
      default:
        return {};
    }
  })();

  const abrirModal = (num, examen = null, evento = null) => {
    setErrores({});
    setMensajeExito("");

    if (num === 1) {
      setFormRegistrarExamen(formExamenVacio);
    } else if (num === 2 && examen) {
      setExamenSeleccionado(examen);
    } else if (num === 3 && examen) {
      setExamenSeleccionado(examen);
      setFormEditarExamen({
        id_historia_medica,
        frecuencia_cardiaca: examen.frecuencia_cardiaca ?? "",
        frecuencia_respiratoria: examen.frecuencia_respiratoria ?? "",
        mucosa: examen.mucosas ?? "",
        tiempo_llenado_capilar: examen.tiempo_llenado ?? "",
        temperatura_rectal: examen.temperatura ?? "",
        condicion_corporal: examen.condicion_corporal ?? "",
        fecha: examen.fecha ?? "",
      });
    } else if (num === 4) {
      setFormRegistrarEvento({ ...formEventoVacio, responsable: user.nombre });
      setListaProductos([]);
      setModalOrigen(4);
    } else if (num === 5 && evento) {
      setEventoSeleccionado(evento);
      setFormEditarEvento({
        id_historia_medica,
        fecha: evento.fecha ?? "",
        responsable: evento.responsable ?? "",
        descripcion: evento.descripcion ?? "",
        requiere_producto: Number(evento.requiere_producto ?? 0),
      });
      if (Number(evento.requiere_producto) === 1) {
        fetch(`api/productos_eventos_clinicos.php?id=${evento.id_evento}`, {
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
      setModalOrigen(5);
    } else if (num === 6 || num === 7) {
    } else {
      return;
    }

    setModalActiva(num);
  };

  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActiva(null);
    setExamenSeleccionado(null);
    setEventoSeleccionado(null);
    setFormRegistrarExamen(formExamenVacio);
    setFormEditarExamen(formExamenVacio);
    setFormRegistrarEvento(formEventoVacio);
    setFormEditarEvento(formEventoVacio);
    setListaProductos([]);
    setProductosOriginales([]);
    setFormProducto(productoVacio);
    setProductoElegido(null);
    setStockDisponible(null);
    setModalOrigen(null);
    setIndexEditandoProducto(null);
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => cerrarModal(), 1500);
  };

  const examenesFiltrados = examenes.filter((e) =>
    (e.fecha ?? "").toLowerCase().includes(busquedaExamen.toLowerCase()),
  );

  const eventosFiltrados = eventos.filter(
    (ev) =>
      (ev.fecha ?? "").toLowerCase().includes(busquedaEvento.toLowerCase()) ||
      (ev.responsable ?? "")
        .toLowerCase()
        .includes(busquedaEvento.toLowerCase()) ||
      (ev.descripcion ?? "")
        .toLowerCase()
        .includes(busquedaEvento.toLowerCase()),
  );

  const enviar = async (api, method, body, onExito, recargar) => {
    return fetch(api, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          recargar();
          mostrarExito(onExito);
        } else
          setErrores(response.errores ?? { general: "Error desconocido." });
      })
      .catch(() =>
        setErrores({ general: "Error de conexión con el servidor." }),
      );
  };

  const handleRegistrarExamen = async (e) => {
    e.preventDefault();
    if (enviandoRef.current) return;
    enviandoRef.current = true;
    bloquearBtn(btnRegistrarExamenRef);
    setCargando(true);
    try {
      await enviar(
        API_EXAMENES,
        "POST",
        formRegistrarExamen,
        "¡Examen registrado correctamente!",
        cargarExamenes,
      );
    } finally {
      enviandoRef.current = false;
      setCargando(false);
      desbloquearBtn(btnRegistrarExamenRef);
    }
  };

  const handleEditarExamen = async (e) => {
    e.preventDefault();
    setCargando(true);
    setErrores({});
    setMensajeExito("");
    try {
      await enviar(
        API_EXAMENES,
        "PUT",
        { id_examen: examenSeleccionado.id_examen_fisico, ...formEditarExamen },
        "¡Examen actualizado correctamente!",
        cargarExamenes,
      );
    } finally {
      setCargando(false);
    }
  };

  const handleRegistrarEvento = () => {
    if (enviandoRef.current) return;

    const nuevosErrores = {};
    if (
      formRegistrarEvento.requiere_producto === 1 &&
      listaProductos.length === 0
    ) {
      nuevosErrores.productos = "❗Debes agregar al menos un producto.";
      setErrores(nuevosErrores);
      return;
    }

    enviandoRef.current = true;
    bloquearBtn(btnRegistrarEventoRef);
    setCargando(true);
    setErrores({});

    const data = {
      ...formRegistrarEvento,
      responsable: user.nombre,
      requiere_producto: Number(formRegistrarEvento.requiere_producto),
      productos:
        formRegistrarEvento.requiere_producto === 1
          ? listaProductos.map((p) => ({
              id_producto: p.id_producto,
              cantidad_presentacion: p.cantidad_presentacion,
              cantidad_total: p.cantidad_total,
            }))
          : [],
    };

    fetch(API_EVENTOS, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (r) => {
        const res = await r.json();
        if (!r.ok) {
          setErrores(res.errores || {});
          return;
        }
        cargarEventos();
        setMensajeExito("¡Evento registrado correctamente!");
        setTimeout(() => cerrarModal(), 1500);
      })
      .catch(() =>
        setErrores({ general: "❗Error de conexión con el servidor." }),
      )
      .finally(() => {
        enviandoRef.current = false;
        setCargando(false);
        desbloquearBtn(btnRegistrarEventoRef);
      });
  };

  const hayCambiosEvento = () => {
    if (!eventoSeleccionado) return false;
    const camposEvento =
      eventoSeleccionado.fecha !== formEditarEvento.fecha ||
      eventoSeleccionado.descripcion !== formEditarEvento.descripcion ||
      Number(eventoSeleccionado.requiere_producto) !==
        Number(formEditarEvento.requiere_producto);

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

  const handleEditarEvento = (e) => {
    e.preventDefault();

    if (!hayCambiosEvento()) {
      setErrores({ general: "No se realizaron cambios." });
      return;
    }

    setCargando(true);
    setErrores({});
    setMensajeExito("");

    fetch(API_EVENTOS, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_evento: eventoSeleccionado.id_evento,

        ...formEditarEvento,

        responsable: user.nombre,

        requiere_producto: Number(formEditarEvento.requiere_producto),

        productos:
          Number(formEditarEvento.requiere_producto) === 1
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
          cargarEventos();

          setMensajeExito(res.mensaje || "¡Evento actualizado correctamente!");

          setTimeout(() => {
            cerrarModal();
          }, 1500);
        } else {
          setErrores(
            res.errores || {
              general: res.error || "Error al actualizar el evento.",
            },
          );
        }
      })
      .catch(() => {
        setErrores({
          general: "Error de conexión con el servidor.",
        });
      })
      .finally(() => {
        setCargando(false);
      });
  };

  const handleGuardarProducto = (e) => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!formProducto.id_producto)
      nuevosErrores.id_producto = "❗Selecciona un producto.";
    if (
      !formProducto.cantidad_presentacion ||
      Number(formProducto.cantidad_presentacion) <= 0
    )
      nuevosErrores.cantidad_presentacion = "❗La cantidad debe ser mayor a 0.";
    if (
      stockDisponible !== null &&
      Number(formProducto.cantidad_total) > stockDisponible
    )
      nuevosErrores.cantidad_presentacion = "❗Stock insuficiente.";
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setListaProductos((prev) => [...prev, formProducto]);
    setFormProducto(productoVacio);
    setProductoElegido(null);
    setStockDisponible(null);
    setModalActiva(6);
  };

  const buscarProductoPorCodigo = (codigo) => {
       
         fetch(`${API_PROD_COD}?codigo=${encodeURIComponent(codigo)}`, {
           credentials: "include"
         })
           .then(response => response.json())
           .then(data => {
       
           
       
           if (data.success) {
       
             const prod = data.data;
      
             if (modalActiva === 6) {
              setModalActiva(7);
    
              setProductoElegido(prod);
    
              setFormProducto({
                  id_producto: prod.id_producto,
                  nombre: prod.nombre,
                  tipo_medida: prod.tipo_medida,
                  cantidad_por_unidad: prod.cantidad_por_unidad,
                  cantidad_presentacion: "",
                  cantidad_total: "",
              });
            }
       
             // Modal registrar
             if (modalActiva === 7) {
       
               setProductoElegido(prod);
       
               setFormProducto(prev => ({
                 ...prev,
                 id_producto: prod.id_producto,
                 nombre: prod.nombre,
                 tipo_medida: prod.tipo_medida,
                 cantidad_por_unidad: prod.cantidad_por_unidad,
                 cantidad_presentacion: "",
                 cantidad_total: "",
               }));
       
             }
       
             // Modal editar
             if (modalActiva === 8) {
       
               setProductoElegido(prod);
       
               setFormProducto(prev => ({
                 ...prev,
                 id_producto: prod.id_producto,
                 nombre: prod.nombre,
                 tipo_medida: prod.tipo_medida,
                 cantidad_por_unidad: prod.cantidad_por_unidad,
                 cantidad_presentacion: "",
                 cantidad_total: "",
               }));
             }
             setErrores({});
       
           } else {
       
             setErrores({
               general: `No se encontró el producto con código ${codigo}`
             });
           }
         })
         };
         useEffect(() => {
       
         const applyScannedCode = () => {
           
       
           if (scannedCodeRef.current.length < 6) {
       
             scannedCodeRef.current = "";
             return;
           }
       
           const code = scannedCodeRef.current;
       
           buscarProductoPorCodigo(code);
       
           scannedCodeRef.current = "";
           isScanningRef.current = false;
         };
       
         const handleKeyDown = (e) => {
       
           
       
           // ENTER
           if (e.key === "Enter") {
       
             if (scanTimeoutRef.current) {
               clearTimeout(scanTimeoutRef.current);
             }
       
             applyScannedCode();
             return;
           }
       
           // SOLO números
           if (!/^[0-9]$/.test(e.key)) return;
       
           const now = Date.now();
       
           // Primera tecla
           if (lastKeyTimeRef.current === 0) {
       
             isScanningRef.current = true;
       
           } else {
       
             const interval = now - lastKeyTimeRef.current;
       
             
       
             // Escritura humana
             if (interval > 120) {
       
               scannedCodeRef.current = "";
             }
           }
       
           lastKeyTimeRef.current = now;
       
           scannedCodeRef.current += e.key;
       
           
       
           // Timeout
           if (scanTimeoutRef.current) {
             clearTimeout(scanTimeoutRef.current);
           }
       
           scanTimeoutRef.current = setTimeout(() => {
       
             applyScannedCode();
       
           }, 150);
         };
       
         document.addEventListener("keydown", handleKeyDown);
       
         return () => {
       
           document.removeEventListener("keydown", handleKeyDown);
       
           if (scanTimeoutRef.current) {
             clearTimeout(scanTimeoutRef.current);
           }
         };
       
       }, [modalActiva]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Ver Historias Médicas - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={menuObj} user={user} />
        <Notificaciones />
        <section className="secciones-area-gestion ver-historia-medica">
          <section className="examenes-fisicos">
            <button
              className="volver-btn-anim"
              onClick={() => navigate("/historias_medicas")}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h2 className="titulo-dashboard">
              Historia Médica de {historia?.nombre_animal ?? ""}
            </h2>
            <div className="fecha-creacion">
              <strong>Fecha de Creación: </strong>
              <p>{historia?.fecha_creacion ?? ""}</p>
            </div>
            <h2 className="titulo-dashboard titulo-examen-fisico">
              Exámenes Físicos
            </h2>

            <section className="seccion1-busqueda-agregar">
              <form
                className="busqueda-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="busqueda-input1"
                  type="text"
                  placeholder="Busca un Examen Físico"
                  value={busquedaExamen}
                  onChange={(e) => setBusquedaExamen(e.target.value)}
                />
                <button className="diff_busqueda-icono" type="submit">
                  <img
                    className="busqueda-icono-img"
                    src={lupaBusqueda}
                    alt=""
                  />
                </button>
              </form>
              <button className="registrar-btn" onClick={() => abrirModal(1)}>
                Registrar un Examen Físico
              </button>
            </section>

            <table className="tabla-examenes-fisicos">
              <thead className="header-tabla-examenes-fisicos">
                <tr>
                  <td>Fecha de Examen</td>
                  <td></td>
                </tr>
              </thead>
              <tbody className="body-tabla-examenes-fisicos">
                {examenesFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="2">
                      {busquedaExamen
                        ? "No se encontraron exámenes que coincidan."
                        : "No hay exámenes registrados."}
                    </td>
                  </tr>
                ) : (
                  examenesFiltrados.map((examen) => (
                    <tr key={examen.id_examen_fisico}>
                      <td>{examen.fecha}</td>
                      <td>
                        <button
                          className="tabla-examenes-fisicos-btn"
                          onClick={() => abrirModal(2, examen)}
                        >
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>

          <section className="eventos-clinicos">
            <h2 className="titulo-dashboard">Eventos Clínicos</h2>

            <section className="seccion1-busqueda-agregar-eventos-clinicos">
              <form
                className="busqueda-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="busqueda-input1"
                  type="text"
                  placeholder="Buscar un Evento Clínico"
                  value={busquedaEvento}
                  onChange={(e) => setBusquedaEvento(e.target.value)}
                />
                <button className="diff_busqueda-icono" type="submit">
                  <img
                    className="busqueda-icono-img"
                    src={lupaBusqueda}
                    alt=""
                  />
                </button>
              </form>
              <button className="registrar-btn" onClick={() => abrirModal(4)}>
                Registrar Evento Clínico
              </button>
            </section>

            <table className="tabla-eventos-clinicos">
              <thead className="header-tabla-eventos-clinicos">
                <tr>
                  <td>Fecha</td>
                  <td>Descripción</td>
                  <td>Responsable</td>
                  <td>Editar</td>
                </tr>
              </thead>
              <tbody className="body-tabla-eventos-clinicos">
                {eventosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="4">
                      {busquedaEvento
                        ? "No se encontraron eventos que coincidan."
                        : "No hay eventos clínicos registrados."}
                    </td>
                  </tr>
                ) : (
                  eventosFiltrados.map((evento) => (
                    <tr key={evento.id_evento}>
                      <td>{evento.fecha}</td>
                      <td>{evento.descripcion}</td>
                      <td>{evento.responsable}</td>
                      <td>
                        <div className="last-td-flex-content-wrapper">
                          <figure
                            className="editar-icono"
                            onClick={() => abrirModal(5, null, evento)}
                            style={{ cursor: "pointer" }}
                          >
                            <img
                              className="editar-icono-img"
                              src={editarIcon}
                              alt="Editar"
                            />
                          </figure>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
        </section>
      </main>
      <Footer />
      <div
        className="modales-historias-medicas-detalle"
        style={{ display: modalActiva ? "flex" : "none" }}
      >
        {/* ── MODAL 1: Registrar Exámen Físico ───────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-registrar-examen-fisico">
            <button
              className="volver-btn-ver-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Registrar Examen Físico</h1>

            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}

            <form className="ar-form" onSubmit={handleRegistrarExamen}>
              <section className="ar-form-inputs-area-examen-fisico">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label">Historia Médica</label>
                  <div className="union-input-icono">
                    <input
                      className="ir-input4"
                      type="text"
                      value={` ${historia?.id_historia_medica ?? ""} - ${historia?.nombre_animal ?? ""}`}
                      readOnly
                    />
                    <figure className="candado-icono">
                      <img
                        className="candado-icono-img"
                        src={campoRestringido}
                        alt=""
                      />
                    </figure>
                  </div>
                </div>
                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label">
                    Frecuencia Cardiaca <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input2"
                    type="text"
                    value={formRegistrarExamen.frecuencia_cardiaca}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        frecuencia_cardiaca: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.frecuencia_cardiaca ?? ""}
                  </span>
                </div>
                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label">
                    Mucosa <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4"
                    type="text"
                    value={formRegistrarExamen.mucosa}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        mucosa: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.mucosa ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label">
                    Tiempo de Llenado Capilar <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4"
                    type="text"
                    value={formRegistrarExamen.tiempo_llenado_capilar}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        tiempo_llenado_capilar: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.tiempo_llenado_capilar ?? ""}
                  </span>
                </div>
                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ar-label">
                    Fecha <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input5"
                    type="date"
                    value={formRegistrarExamen.fecha}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        fecha: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.fecha ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt6" }}>
                  <label className="ar-label">
                    Frecuencia Respiratoria <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formRegistrarExamen.frecuencia_respiratoria}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        frecuencia_respiratoria: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.frecuencia_respiratoria ?? ""}
                  </span>
                </div>
                <div
                  className="label-and-input-container"
                  style={{ gridArea: "divInpt7" }}
                >
                  <label className="ar-label">Temperatura Rectal</label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formRegistrarExamen.temperatura_rectal}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        temperatura_rectal: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.temperatura_rectal ?? ""}
                  </span>
                </div>
                <div style={{ gridArea: "divInpt8" }}>
                  <label className="ar-label">
                    Condición Corporal <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formRegistrarExamen.condicion_corporal}
                    onChange={(e) =>
                      setFormRegistrarExamen({
                        ...formRegistrarExamen,
                        condicion_corporal: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.condicion_corporal ?? ""}
                  </span>
                </div>
              </section>
              <button
                ref={btnRegistrarExamenRef}
                className="ar-btn"
                type="submit"
                disabled={cargando}
              >
                {cargando ? "Registrando..." : "Registrar Exámen Físico"}
              </button>
            </form>
          </aside>
        )}

        {/* ── MODAL 2: Ver Detalle Exámen Físico ─────────────────────────────── */}
        {modalActiva === 2 && examenSeleccionado && (
          <aside className="modal-detalle-examen-fisico">
            <button
              className="volver-btn-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <section className="secciones-area-gestion-examenes-fisicos">
              <h2 className="titulo-dashboard titulo-examenes-fisicos-modal">
                Examen Físico {examenSeleccionado.fecha}
              </h2>
              <section className="seccion1-busqueda-agregar seccion1-ver-historia-medica">
                <button
                  className="registrar-btn"
                  onClick={() => abrirModal(3, examenSeleccionado)}
                >
                  Editar Examen
                </button>
              </section>
              <table className="tabla-detalles-examenes-fisicos">
                <thead className="header-tabla-detalles-examenes-fisicos">
                  <tr>
                    <td>Frecuencia Cardiaca</td>
                    <td>Frecuencia Respiratoria</td>
                    <td>Mucosa</td>
                  </tr>
                </thead>
                <tbody className="body-tabla-detalles-examenes-fisicos">
                  <tr>
                    <th>{examenSeleccionado.frecuencia_cardiaca}</th>
                    <th>{examenSeleccionado.frecuencia_respiratoria}</th>
                    <th>{examenSeleccionado.mucosas}</th>
                  </tr>
                </tbody>
                <thead className="header-tabla-detalles-examenes-fisicos">
                  <tr>
                    <td>Temperatura Rectal</td>
                    <td>Tiempo de Llenado Capilar</td>
                    <td>Condición Corporal</td>
                  </tr>
                </thead>
                <tbody className="body-tabla-detalles-examenes-fisicos">
                  <tr>
                    <th>{examenSeleccionado.temperatura}</th>
                    <th>{examenSeleccionado.tiempo_llenado}</th>
                    <th>{examenSeleccionado.condicion_corporal}</th>
                  </tr>
                </tbody>
              </table>
            </section>
          </aside>
        )}

        {/* ── MODAL 3: Editar Exámen Físico ──────────────────────────────────── */}
        {modalActiva === 3 && examenSeleccionado && (
          <aside className="modal-editar-examen-fisico">
            <button
              className="volver-btn-ver-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Editar Examen Físico</h1>

            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}

            <form className="ar-form" onSubmit={handleEditarExamen}>
              <section className="ar-form-inputs-area-examen-fisico">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label">Historia Médica</label>
                  <div className="union-input-icono">
                    <input
                      className="ir-input4"
                      type="text"
                      value={`${historia?.id_historia_medica ?? ""} - ${historia?.nombre_animal ?? ""}`}
                      readOnly
                    />
                    <figure className="candado-icono">
                      <img
                        className="candado-icono-img"
                        src={campoRestringido}
                        alt=""
                      />
                    </figure>
                  </div>
                </div>
                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label">
                    Frecuencia Cardiaca <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input2"
                    type="text"
                    value={formEditarExamen.frecuencia_cardiaca}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        frecuencia_cardiaca: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.frecuencia_cardiaca ?? ""}
                  </span>
                </div>
                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label">
                    Mucosa <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4"
                    type="text"
                    value={formEditarExamen.mucosa}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        mucosa: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.mucosa ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label">
                    Tiempo de Llenado Capilar <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4"
                    type="text"
                    value={formEditarExamen.tiempo_llenado_capilar}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        tiempo_llenado_capilar: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.tiempo_llenado_capilar ?? ""}
                  </span>
                </div>
                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ar-label">
                    Fecha <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input5"
                    type="date"
                    value={formEditarExamen.fecha}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        fecha: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.fecha ?? ""}</span>
                </div>
                <div style={{ gridArea: "divInpt6" }}>
                  <label className="ar-label">
                    Frecuencia Respiratoria <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formEditarExamen.frecuencia_respiratoria}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        frecuencia_respiratoria: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.frecuencia_respiratoria ?? ""}
                  </span>
                </div>
                <div
                  className="label-and-input-container"
                  style={{ gridArea: "divInpt7" }}
                >
                  <label className="ar-label">Temperatura Rectal</label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formEditarExamen.temperatura_rectal}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        temperatura_rectal: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ gridArea: "divInpt8" }}>
                  <label className="ar-label">
                    Condición Corporal <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6"
                    type="text"
                    value={formEditarExamen.condicion_corporal}
                    onChange={(e) =>
                      setFormEditarExamen({
                        ...formEditarExamen,
                        condicion_corporal: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.condicion_corporal ?? ""}
                  </span>
                </div>
              </section>
              <button className="ar-btn" type="submit" disabled={cargando}>
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </aside>
        )}

        {/* ── MODAL 4: Registrar Evento Clínico ──────────────────────────────── */}
        {modalActiva === 4 && (
          <aside className="modal-registrar-evento-clinico">
            <button
              className="volver-btn-ver-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Registrar Evento Clínico</h1>

            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}
            {errores.sesion && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form-registrar-evento-clinico" onSubmit={(e) => e.preventDefault()}>
              <section className="ar-form-inputs-area-registrar-evento-clinico">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label">
                    Fecha <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input1"
                    type="date"
                    value={formRegistrarEvento.fecha}
                    onChange={(e) =>
                      setFormRegistrarEvento({
                        ...formRegistrarEvento,
                        fecha: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.fecha ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label">Responsable</label>
                  <div className="union-input-icono">
                    <input
                      className="ir-input4"
                      type="text"
                      value={user.nombre}
                      readOnly
                    />
                    <figure className="candado-icono">
                      <img
                        className="candado-icono-img"
                        src={campoRestringido}
                        alt=""
                      />
                    </figure>
                  </div>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label">¿Requiere producto?</label>
                  <CustomSelect
                    options={opcionesRequiere}
                    value={formRegistrarEvento.requiere_producto}
                    onChange={(val) =>
                      setFormRegistrarEvento((prev) => ({
                        ...prev,
                        requiere_producto: Number(val),
                      }))
                    }
                  />
                </div>

                {formRegistrarEvento.requiere_producto === 1 && (
                  <div style={{ gridArea: "divInpt6" }}>
                    <button
                      type="button"
                      className="registrar-producto-btn"
                      onClick={() => {
                        setModalOrigen(4);

                        if (listaProductos.length === 0) {
                          abrirModal(7);
                        } else {
                          abrirModal(6);
                        }
                      }}
                    >
                      Ver productos ({listaProductos.length})
                    </button>
                    {errores.productos && (
                      <span className="error-mensaje">{errores.productos}</span>
                    )}
                  </div>
                )}

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label">
                    Descripción <h6 className="obligatorio">*</h6>
                  </label>
                  <textarea
                    className="ar-input3"
                    value={formRegistrarEvento.descripcion}
                    onChange={(e) =>
                      setFormRegistrarEvento({
                        ...formRegistrarEvento,
                        descripcion: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.descripcion ?? ""}
                  </span>
                </div>
              </section>
              <button
                ref={btnRegistrarEventoRef}
                className="ar-btn"
                type="button"
                onClick={handleRegistrarEvento}
                disabled={cargando}
              >
                {cargando ? "Registrando..." : "Registrar Evento Clínico"}
              </button>
            </form>
          </aside>
        )}

        {/* ── MODAL 5: Editar Evento Clínico ─────────────────────────────────── */}
        {modalActiva === 5 && eventoSeleccionado && (
          <aside className="modal-editar-evento-clinico">
            <button
              className="volver-btn-ver-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Editar Evento Clínico</h1>

            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}

            <form className="ar-form-registrar-evento-clinico" onSubmit={handleEditarEvento}>
              <section className="ar-form-inputs-area-registrar-evento-clinico">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label">
                    Fecha <h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input1"
                    type="date"
                    value={formEditarEvento.fecha}
                    onChange={(e) =>
                      setFormEditarEvento({
                        ...formEditarEvento,
                        fecha: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">{errores.fecha ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label">Responsable</label>
                  <div className="union-input-icono">
                    <input
                      className="ir-input4"
                      type="text"
                      value={user.nombre}
                      readOnly
                    />
                    <figure className="candado-icono">
                      <img
                        className="candado-icono-img"
                        src={campoRestringido}
                        alt=""
                      />
                    </figure>
                  </div>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label">¿Requiere producto?</label>
                  <CustomSelect
                    options={opcionesRequiere}
                    value={formEditarEvento.requiere_producto}
                    onChange={(val) =>
                      setFormEditarEvento((prev) => ({
                        ...prev,
                        requiere_producto: Number(val),
                      }))
                    }
                  />
                </div>

                {formEditarEvento.requiere_producto === 1 && (
                  <div style={{ gridArea: "divInpt6" }}>
                    <button
                      type="button"
                      className="registrar-producto-btn"
                      onClick={() => {
                        setModalOrigen(5);

                        if (listaProductos.length === 0) {
                          abrirModal(7);
                        } else {
                          abrirModal(6);
                        }
                      }}
                    >
                      Ver productos ({listaProductos.length})
                    </button>
                    {errores.productos && (
                      <span className="error-mensaje">{errores.productos}</span>
                    )}
                  </div>
                )}

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label">
                    Descripción <h6 className="obligatorio">*</h6>
                  </label>
                  <textarea
                    className="ar-input3"
                    value={formEditarEvento.descripcion}
                    onChange={(e) =>
                      setFormEditarEvento({
                        ...formEditarEvento,
                        descripcion: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.descripcion ?? ""}
                  </span>
                </div>
              </section>
              <button className="ar-btn" type="submit" disabled={cargando}>
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </form>
          </aside>
        )}

        {/* ── MODAL 6: Lista de productos del evento clínico ─────────────────── */}
        {modalActiva === 6 && (
          <aside className="modal-eventos-productos-lista">
            <button
              className="volver-btn-ver-historias-medicas"
              type="button"
              onClick={() => {
                setErrores({});
                setModalActiva(modalOrigen);
              }}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>

            <h1 className="modal-ep-titulo">Productos del Evento Clínico</h1>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="registrar-producto-btn"
                onClick={() => {
                  setErrores({});
                  setFormProducto(productoVacio);
                  setProductoElegido(null);
                  setStockDisponible(null);
                  setModalActiva(7);
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
                          <figure
                            className="editar-icono"
                            style={{ cursor: "pointer" }}
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
                              setModalActiva(8);
                            }}
                          >
                            <img
                              className="editar-icono-img"
                              src={editarIcon}
                              alt="Editar"
                            />
                          </figure>
                          <figure
                            className="desactivar-icono"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setListaProductos((prev) =>
                                prev.filter((_, index) => index !== i),
                              )
                            }
                          >
                            <img
                              className="desactivar-icono-img"
                              src={desactivarIcon}
                              alt="Quitar"
                            />
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

        {/* ── MODAL 7: Agregar producto al evento clínico ────────────────────── */}
        {modalActiva === 7 && (
          <aside className="modal-eventos-rp">
            <button
              className="volver-btn-ver-historias-medicas"
              type="button"
              onClick={() => {
                setErrores({});
                setModalActiva(6);
              }}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>

            <h1 className="modal-rp-titulo">
              Agregar producto al Evento Clínico
            </h1>

            <span style={{ color: "red" }}>{errores.general}</span>

            <form className="rp-form" onSubmit={handleGuardarProducto}>
              <section className="rp-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="rp-label">
                    Producto <span className="obligatorio">*</span>
                  </label>
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
                        fetch(`api/stock_producto.php?id=${prod.id_producto}`, {
                          credentials: "include",
                        })
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
                  <span className="error-mensaje">
                    {errores.id_producto ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="rp-label">
                    Cantidad <span className="obligatorio">*</span>
                    {productoElegido && (
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
                  <input
                    className="rp-input1"
                    type="number"
                    min="1"
                    value={formProducto.cantidad_presentacion}
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
                  <span className="error-mensaje">
                    {errores.cantidad_presentacion ?? ""}
                  </span>
                  {cargandoStock && (
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      Consultando stock...
                    </p>
                  )}
                  {!cargandoStock &&
                    stockDisponible !== null &&
                    productoElegido && (
                      <p>
                        Stock disponible:{" "}
                        <strong>
                          {stockDisponible} {productoElegido.tipo_medida}
                        </strong>
                      </p>
                    )}
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="rp-label">
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
                  <input
                    className="rp-input3"
                    type="text"
                    readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
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
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <button
                  type="submit"
                  className="er-btn"
                  style={{ marginTop: 0 }}
                >
                  Agregar producto
                </button>
              </div>
            </form>
          </aside>
        )}

        {/* ── MODAL 8: Editar producto del evento clínico ────────────────────── */}
        {modalActiva === 8 && (
          <aside className="modal-eventos-rp">
            <button
              className="volver-btn-ver-historias-medicas"
              type="button"
              onClick={() => {
                setErrores({});
                setModalActiva(6);
              }}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>

            <h1 className="modal-rp-titulo">
              Editar producto del Evento Clínico
            </h1>

            <span style={{ color: "red" }}>{errores.general}</span>

            <form
              className="rp-form"
              onSubmit={(e) => {
                e.preventDefault();
                const nuevosErrores = {};
                if (!formProducto.id_producto)
                  nuevosErrores.id_producto = "❗Selecciona un producto.";
                if (
                  !formProducto.cantidad_presentacion ||
                  Number(formProducto.cantidad_presentacion) <= 0
                )
                  nuevosErrores.cantidad_presentacion =
                    "❗La cantidad debe ser mayor a 0.";
                if (
                  stockDisponible !== null &&
                  Number(formProducto.cantidad_total) > stockDisponible
                )
                  nuevosErrores.cantidad_presentacion = `❗Stock insuficiente. Disponible: ${stockDisponible} ${productoElegido?.tipo_medida ?? ""}`;
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
                setModalActiva(6);
              }}
            >
              <section className="rp-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="rp-label">
                    Producto <span className="obligatorio">*</span>
                  </label>
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
                        fetch(`api/stock_producto.php?id=${prod.id_producto}`, {
                          credentials: "include",
                        })
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
                  <span className="error-mensaje">
                    {errores.id_producto ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="rp-label">
                    Cantidad <span className="obligatorio">*</span>
                    {(productoElegido || formProducto.cantidad_por_unidad) && (
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
                  <input
                    className="rp-input1"
                    type="number"
                    min="1"
                    value={formProducto.cantidad_presentacion}
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
                  <span className="error-mensaje">
                    {errores.cantidad_presentacion ?? ""}
                  </span>
                  {cargandoStock && (
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      Consultando stock...
                    </p>
                  )}
                  {!cargandoStock &&
                    stockDisponible !== null &&
                    (productoElegido || formProducto.nombre) && (
                      <p style={{ fontSize: 12, marginTop: 4, color: "#555" }}>
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
                    {(productoElegido || formProducto.cantidad_por_unidad) && (
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
                  <input
                    className="rp-input3"
                    type="text"
                    readOnly
                    style={{ background: "#f5f5f5", cursor: "not-allowed" }}
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
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                  marginTop: "10px",
                }}
              >
                <button
                  type="submit"
                  className="er-btn"
                  style={{ marginTop: 0 }}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </aside>
        )}
      </div>
    </>
  );
};
