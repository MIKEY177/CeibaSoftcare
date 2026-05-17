// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MenuAdmin,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";
// Estilos e imágenes
import "../styles/global_styles.css";
import "../styles/historias_medicas.css";
import editarIcon from "../images/icons/editar.png";
import lupaBusqueda from "../images/lupa_busqueda.png";
import flecha from "../images/flecha_salir.png";
import CustomSelect from "../components/CustomSelect.jsx";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Notificaciones } from "../components/Notificaciones";

const API = `api/historias_medicas.php`;
const API_SESSION = `api/session.php`;
const API_ANIMALES = `api/animales.php`;
export const indexSelector = 7;

export const HistoriasMedicas = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const [historias, setHistorias] = useState([]);
  const [animales, setAnimales] = useState([]);
  const [modalActiva, setModalActiva] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [historiaSeleccionada, setHistoriaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const enviandoRef = useRef(false);
  const [historiaOriginal, setHistoriaOriginal] = useState(null);

  const [formRegistrar, setFormRegistrar] = useState({
    id_animal1: "",
    fecha_creacion: "",
  });
  const [formEditar, setFormEditar] = useState({
    id_animal1: "",
    fecha_creacion: "",
  });

  const animalesConHistoria = new Set(
    historias.map((h) => String(h.id_animal1)),
  );

  const opcionesAnimal = animales
    .filter((a) => !animalesConHistoria.has(String(a.id_animal)))
    .map((a) => ({
      value: a.id_animal,
      label: a.nombre,
    }));

  const opcionesAnimalEditar = animales
    .filter((a) => {
      // permitir el animal actual que se está editando
      if (String(a.id_animal) === String(formEditar.id_animal1)) {
        return true;
      }

      // ocultar animales que ya tienen historia
      return !animalesConHistoria.has(String(a.id_animal));
    })
    .map((a) => ({
      value: String(a.id_animal),
      label: a.nombre,
    }));

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const abrirModal = (num, historia = null) => {
    setErrores({});
    setMensajeExito("");
    setHistoriaSeleccionada(historia);

    if (num === 2 && historia) {
      setHistoriaOriginal(historia);

      setFormEditar({
        id_animal1: String(historia.id_animal1 ?? ""),
        fecha_creacion: historia.fecha_creacion ?? "",
      });
    }

    setModalActiva(num);
  };

  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActiva(null);
    setHistoriaSeleccionada(null);
    setFormRegistrar({ id_animal1: "", fecha_creacion: "" });
    setFormEditar({ id_animal1: "", fecha_creacion: "" });
  };

  const cargarHistorias = () => {
    fetch(API, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setHistorias(response.data);
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
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setUser({
            nombre: data.usuario,
            rol: data.rol,
            foto_perfil: data.foto_perfil,
          });
          if (data.rol === "veterinario") navigate("/farmacia");
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => {
    cargarHistorias();
  }, []);

  useEffect(() => {
    fetch(API_ANIMALES, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setAnimales(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  }, []);

  // ─── Menú ────────────────────────────────────────────────────────────────────

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

  // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  const historiasFiltradas = historias.filter(
  (historia) =>
    (historia.nombre_animal ?? "")
      .toLowerCase()
      .includes(busqueda.toLowerCase()) ||

    (historia.fecha_creacion ?? "")
      .toLowerCase()
      .includes(busqueda.toLowerCase()) ||

    (historia.especie ?? "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
);

  const handleBusqueda = (e) => {
    e.preventDefault();
  };

  // ─── Envío genérico al backend ───────────────────────────────────────────────

  const enviar = async (method, body, onExito) => {
    return fetch(API, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          cargarHistorias();
          mostrarExito(onExito);
        } else {
          setErrores(response.errores ?? { general: "Error desconocido." });
        }
      })
      .catch(() =>
        setErrores({ general: "Error de conexión con el servidor." }),
      );
  };

  const handleRegistrar = async (e) => {
    e.preventDefault();

    // bloqueo extra
    if (enviandoRef.current || cargando) return;

    enviandoRef.current = true;
    setCargando(true);

    try {
      await enviar(
        "POST",
        formRegistrar,
        "¡Historia registrada correctamente!",
      );
    } finally {
      enviandoRef.current = false;
      setCargando(false);
    }
  };
  const handleEditar = async (e) => {
    e.preventDefault();

    // detectar si no hubo cambios
    const sinCambios =
      Number(formEditar.id_animal1) === Number(historiaOriginal?.id_animal1) &&
      formEditar.fecha_creacion === (historiaOriginal?.fecha_creacion ?? "");

    if (sinCambios) {
      setErrores({
        general: "❗No realizaste ningún cambio.",
      });
      return;
    }

    // evitar doble envío
    if (enviandoRef.current || cargando) return;

    enviandoRef.current = true;
    setCargando(true);
    setErrores({});
    setMensajeExito("");

    try {
      await enviar(
        "PUT",
        {
          id_historia_medica: historiaSeleccionada.id_historia_medica,
          ...formEditar,
        },
        "¡Historia actualizada correctamente!",
      );
    } finally {
      enviandoRef.current = false;
      setCargando(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Historias Médicas - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={menuObj} user={user} />
        <Notificaciones />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Historias Médicas</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input
                className="busqueda-input1"
                type="text"
                name="busqueda"
                placeholder="Busca una Historia Médica"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="registrar-btn" onClick={() => abrirModal(1)}>
              Registrar Historia
            </button>
          </section>

          <table className="tabla-historias-medicas">
            <thead className="header-tabla-historias-medicas">
              <tr>
                <td>Nombre del Animal</td>
                <td>Especie</td>
                <td>Fecha de Creación</td>
                <td>{/* Botón ver */}</td>
                <td>Editar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-historias-medicas">
              {historiasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    {busqueda
                      ? "No se encontraron historias que coincidan."
                      : "No hay historias registradas."}
                  </td>
                </tr>
              ) : (
                historiasFiltradas.map((historia) => (
                  <tr key={historia.id_historia_medica}>
                    <td>{historia.nombre_animal}</td>
                    <td>{historia.especie}</td>
                    <td>{historia.fecha_creacion}</td>
                    <td>
                      <button
                        className="tabla-historias-medicas-btn"
                        onClick={() =>
                          navigate(
                            `/ver_historias_medicas/${historia.id_historia_medica}`,
                          )
                        }
                      >
                        Ver
                      </button>
                    </td>
                    <td>
                      <div className="last-td-flex-content-wrapper">
                        <figure
                          className="editar-icono"
                          onClick={() => abrirModal(2, historia)}
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
      </main>
      <Footer />

      <div
        className="modales-historias-medicas"
        style={{ display: modalActiva ? "flex" : "none" }}
      >
        {/* ── MODAL 1: Registrar Historia Médica ──────────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-historias-medicas-registrar">
            <button
              className="volver-btn-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Registrar Historia Médica</h1>
            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}
            {errores.sesion && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form" onSubmit={handleRegistrar}>
              <section className="ar-form-inputs-area-historias">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label" htmlFor="">
                    Animal
                  </label>
                  <CustomSelect
                    options={opcionesAnimal}
                    value={formRegistrar.id_animal1}
                    placeholder="Seleccione un animal"
                    onChange={(val) =>
                      setFormRegistrar((prev) => ({
                        ...prev,
                        id_animal1: val,
                      }))
                    }
                  />
                  <span className="error-mensaje">{errores.animal ?? ""}</span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label" htmlFor="">
                    Fecha de Creación
                  </label>
                  <input
                    className="ar-input1"
                    type="date"
                    value={formRegistrar.fecha_creacion}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        fecha_creacion: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.fecha_creacion ?? ""}
                  </span>
                </div>
              </section>
              <input
                className="ar-btn"
                type="submit"
                value={
                  cargando ? "Registrando..." : "Registrar Historia Médica"
                }
                disabled={cargando}
              />
            </form>
          </aside>
        )}

        {/* ── MODAL 2: Editar Historia Médica ──────────────────────────────────── */}
        {modalActiva === 2 && historiaSeleccionada && (
          <aside className="modal-historias-medicas-editar">
            <button
              className="volver-btn-historias-medicas"
              onClick={cerrarModal}
            >
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">Editar Historia Médica</h1>
            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}

            <form className="ar-form" onSubmit={handleEditar}>
              <section className="ar-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label" htmlFor="">
                    Nombre del Animal
                  </label>
                  <CustomSelect
                    options={opcionesAnimalEditar}
                    value={formEditar.id_animal1}
                    onChange={(val) =>
                      setFormEditar((prev) => ({
                        ...prev,
                        id_animal1: val,
                      }))
                    }
                  />

                  <span className="error-mensaje">
                    {errores.id_animal1 ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label" htmlFor="">
                    Fecha de Creación
                  </label>
                  <input
                    className="ar-input2"
                    type="date"
                    value={formEditar.fecha_creacion}
                    onChange={(e) =>
                      setFormEditar((prev) => ({
                        ...prev,
                        fecha_creacion: e.target.value,
                      }))
                    }
                  />
                  <span className="error-mensaje">
                    {errores.fecha_creacion ?? ""}
                  </span>
                </div>
              </section>
              <input
                className="ar-btn"
                type="submit"
                value={cargando ? "Guardando..." : "Guardar Cambios"}
                disabled={cargando}
              />
            </form>
          </aside>
        )}
      </div>
    </>
  );
};
