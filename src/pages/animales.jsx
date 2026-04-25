// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/animales.css"
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

const API = `api/animales.php`;
const API_SESSION = `api/session.php`;
export const indexSelector = 6;

export const Animales = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const [animales, setAnimales] = useState([]);
  const [modalActiva, setModalActiva] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [animalSeleccionado, setAnimalSeleccionado] = useState(null);
  const enviandoRef = useRef(false);

  const [formRegistrar, setFormRegistrar] = useState({
    n_microchip: "",
    nombre: "",
    especie: "",
    sexo: "",
    fecha_nac_estimada: "",
    observaciones: "",
  });

  const [formEditar, setFormEditar] = useState({
    n_microchip: "",
    nombre: "",
    especie: "",
    sexo: "",
    fecha_nac_estimada: "",
    observaciones: "",
  });

  const [busqueda, setBusqueda] = useState("");

  const scanTimeoutRef = useRef(null);
  const scannedCodeRef = useRef("");
  const lastKeyTimeRef = useRef(0);
  const isScanningRef = useRef(false);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const abrirModal = (num, animal = null) => {
    setErrores({});
    setMensajeExito("");
    setAnimalSeleccionado(animal);
    if (num === 2 && animal) {
      setFormEditar({
        n_microchip: animal.n_microchip ?? "",
        nombre: animal.nombre ?? "",
        especie: animal.especie ?? "",
        sexo: animal.sexo ?? "",
        fecha_nac_estimada: animal.fecha_nac_estimada ?? "",
        observaciones: animal.observaciones ?? "",
      });
    }
    setModalActiva(num);
  };

  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActiva(null);
    setAnimalSeleccionado(null);

    setFormRegistrar({
      n_microchip: "",
      nombre: "",
      especie: "",
      sexo: "",
      fecha_nac_estimada: "",
      observaciones: "",
    });

    setFormEditar({
      n_microchip: "",
      nombre: "",
      especie: "",
      sexo: "",
      fecha_nac_estimada: "",
      observaciones: "",
    });
  };

  const cargarAnimales = () => {
    fetch(API, { credentials: "include" })
      .then(res => res.json())
      .then(response => {
        if (response.success) setAnimales(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => {
      cerrarModal();
      cargarAnimales();
    }, 1500);
  };

  // ─── Sesión ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(API_SESSION, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol });
          if (data.rol !== "veterinario" && data.rol !== "administrador") {
            navigate("/iniciar_sesion");
          }
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => { cargarAnimales(); }, []);

  // ─── Menú ────────────────────────────────────────────────────────────────────

  const menuObj = (() => {
    switch (user.rol) {
      case "administrador": return MenuAdminFarmacia;
      case "veterinario":   return MenuVeterinario;
      default: return {};
    }
  })();

  // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  const animalesFiltrados = animales.filter(animal =>
    (animal.n_microchip?.toString() ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.especie ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.sexo ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.fecha_nac_estimada ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (animal.observaciones ?? "").toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleBusqueda = (e) => {
    e.preventDefault();
  };

  // ─── Envío genérico al backend ───────────────────────────────────────────────

  const enviar = (method, body, mensajeOk) => {
    if (enviandoRef.current) return;  
    enviandoRef.current = true;
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
        mostrarExito(mensajeOk);
      } else {
        setErrores(response.errores ?? { general: "Error desconocido." });
      }
    })
    .catch(() => setErrores({ general: "Error de conexión con el servidor." }))
    .finally(() => {
      setCargando(false);
      enviandoRef.current = false; 
    });
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    enviar("POST", formRegistrar, "¡Animal registrado correctamente!");
  };

  const handleEditar = (e) => {
    e.preventDefault();
    const sinCambios =
      formEditar.nombre === (animalSeleccionado.nombre ?? "") &&
      formEditar.n_microchip === (animalSeleccionado.n_microchip ?? "") &&
      formEditar.especie === (animalSeleccionado.especie ?? "") &&
      formEditar.sexo === (animalSeleccionado.sexo ?? "") &&
      formEditar.fecha_nac_estimada === (animalSeleccionado.fecha_nac_estimada ?? "") &&
      formEditar.observaciones === (animalSeleccionado.observaciones ?? "");

    if (sinCambios) {
      setErrores({ general: "No se realizaron cambios." });
      return;
    }
    enviar("PUT", { id_animal: animalSeleccionado.id_animal, ...formEditar }, "¡Animal actualizado correctamente!");
  };

  const handleEliminar = () => {
    enviar("DELETE", { id_animal: animalSeleccionado.id_animal }, "¡Animal desactivado correctamente!");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <head>
        <title>Animales - Softcare</title>
      </head>
      <main>
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Registro Animales</h2>
          <section className="seccion1-busqueda-agregar">

            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input
                className="busqueda-input1"
                type="text"
                name="busqueda"
                placeholder="Busca un animal"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="registrar-btn" onClick={() => abrirModal(1)}>
              Registrar Animal
            </button>
          </section>

          <table className="tabla-animales">
            <thead className="header-tabla-animales">
              <tr>
                <td>Nombre del Animal</td>
                <td>Especie</td>
                <td>Sexo</td>
                <td>Fecha Nac. Estimada</td>
                <td>Observaciones</td>
                <td>Tipo</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-animales">
              {animalesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    {busqueda
                      ? "No se encontraron animales que coincidan."
                      : "No hay animales registrados."}
                  </td>
                </tr>
              ) : (
                animalesFiltrados.map((animal) => (
                  <tr key={animal.id_animal}>
                    <td>{animal.nombre}</td>
                    <td>{animal.especie}</td>
                    <td>{animal.sexo}</td>
                    <td>{animal.fecha_nac_estimada}</td>
                    <td>{animal.observaciones}</td>
                    <td>{animal.tipo}</td>
                    <td>
                      <div className="last-td-flex-content-wrapper">
                        <figure
                          className="editar-icono"
                          onClick={() => abrirModal(2, animal)}
                          style={{ cursor: "pointer" }}
                        >
                          <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                        </figure>
                        <figure
                          className="desactivar-icono"
                          onClick={() => abrirModal(3, animal)}
                          style={{ cursor: "pointer" }}
                        >
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
      <Footer />

      <div className="modales-animales" style={{ display: modalActiva ? "flex" : "none" }}>

        {/* ── MODAL 1: Registrar Animal ──────────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-animales-registrar">
            <button className="volver-btn-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Registre un Animal</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form" onSubmit={handleRegistrar}>
              <section className="ar-form-inputs-area">

                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label">Nombre del Animal<h6 className="obligatorio">*</h6></label>
                  <input
                    className="ar-input1"
                    type="text"
                    value={formRegistrar.nombre}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.nombre ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label">Fecha de Nacimiento Estimada<h6 className="obligatorio">*</h6></label>
                  <input
                    className="ar-input2"
                    type="date"
                    value={formRegistrar.fecha_nac_estimada}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, fecha_nac_estimada: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.fecha_nac_estimada ?? ""}</span>
                </div>
                

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label">Observaciones</label>
                  <textarea
                    className="ar-input3"
                    name="ar-observaciones"
                    value={formRegistrar.observaciones}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, observaciones: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.observaciones ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label">N° de microchip</label>
                  <input
                    className="ar-input4"
                    type="text" 
                    value={formRegistrar.n_microchip}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, n_microchip: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.n_microchip ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ar-label">Especie<h6 className="obligatorio">*</h6></label>
                  <select
                    className="ar-input5"
                    value={formRegistrar.especie}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, especie: e.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Semoviente">Semoviente</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <span className="error-mensaje">{errores.especie ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt6" }}>
                  <label className="ar-label">Sexo<h6 className="obligatorio">*</h6></label>
                  <select
                    className="ar-input6"
                    value={formRegistrar.sexo}
                    onChange={(e) => setFormRegistrar(prev => ({ ...prev, sexo: e.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                  <span className="error-mensaje">{errores.sexo ?? ""}</span>
                </div>  

                <div className="label-and-input-container" style={{ gridArea: "divInpt8" }}>
                  <label className="ar-label">Usuario que Registra</label>
                  <div className="union-input-icono">
                    {/* FIX: muestra el nombre del usuario en sesión */}
                    <input className="ar-input8" type="text" value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>

              </section>
              <input
                className="ar-btn"
                type="submit"
                value={cargando ? "Registrando..." : "Registrar Animal"}
                disabled={cargando}
              />
            </form>
          </aside>
        )}

        {/* ── MODAL 2: Editar Animal ──────────────────────────────────── */}
        {modalActiva === 2 && (
          <aside className="modal-animales-editar">
            <button className="volver-btn-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">Editar Animal Registrado</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="aed-form" onSubmit={handleEditar}>
              <section className="aed-form-inputs-area">

                <div style={{ gridArea: "divInpt1" }}>
                  <label className="aed-label">Nombre del Animal<h6 className="obligatorio">*</h6></label>
                  <input
                    className="aed-input1"
                    type="text"
                    value={formEditar.nombre}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, nombre: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.nombre ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="aed-label">Fecha de Nacimiento Estimada<h6 className="obligatorio">*</h6></label>
                  <input
                    className="aed-input2"
                    type="date"
                    value={formEditar.fecha_nac_estimada}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, fecha_nac_estimada: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.fecha_nac_estimada ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="aed-label">Observaciones</label>
                  <textarea
                    className="aed-input3"
                    name="aed-observaciones"
                    value={formEditar.observaciones}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, observaciones: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.observaciones ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="aed-label">N° Microchip</label>
                   <input
                    className="aed-input4"
                    type="text"
                    value={formEditar.n_microchip}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, n_microchip: e.target.value }))}
                  />
                  <span className="error-mensaje">{errores.n_microchip ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="aed-label">Especie<h6 className="obligatorio">*</h6></label>
                  <select
                    className="aed-input5"
                    value={formEditar.especie}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, especie: e.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Canino">Canino</option>
                    <option value="Felino">Felino</option>
                    <option value="Semoviente">Semoviente</option>
                    <option value="Ave">Ave</option>
                    <option value="Otro">Otro</option>
                  </select>
                  <span className="error-mensaje">{errores.especie ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt6" }}>
                  <label className="aed-label">Sexo<h6 className="obligatorio">*</h6></label>
                  <select
                    className="aed-input6"
                    value={formEditar.sexo}
                    onChange={(e) => setFormEditar(prev => ({ ...prev, sexo: e.target.value }))}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                  <span className="error-mensaje">{errores.sexo ?? ""}</span>
                </div>

                <div className="label-and-input-container" style={{ gridArea: "divInpt8" }}>
                  <label className="aed-label">Usuario que Registra</label>
                  <div className="union-input-icono">
                    <input className="aed-input8" type="text" value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>

              </section>
              <input
                className="aed-btn"
                type="submit"
                value={cargando ? "Guardando..." : "Guardar Cambios"}
                disabled={cargando}
              />
            </form>
          </aside>
        )}

        {/* ── MODAL 3: Desactivar Animal ──────────────────────────────────── */}
        {modalActiva === 3 && (
          <aside className="modal-animales-desactivar">
            <h1 className="modal-ael-titulo">Desactivar Animal Registrado</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <h3 className="modal-ael-mensaje">
              ¿Desea desactivar&nbsp;
              <span className="subrayar">{animalSeleccionado?.nombre ?? "este animal"}</span>?
            </h3>

            <section className="modal-buttons">
              <button
                className="desactivar-btn"
                onClick={handleEliminar}
                disabled={cargando}
              >
                {cargando ? "Desactivando..." : "Desactivar"}
              </button>
              <button className="cancelar-btn" onClick={cerrarModal}>
                Cancelar
              </button>
            </section>
          </aside>
        )}

      </div>
    </>
  );
};
