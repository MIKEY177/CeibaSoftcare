// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import CustomSelect from "../components/CustomSelect.jsx";
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css";
import "../styles/ingreso_animales.css";
import "../styles/ver_ingreso_animal.css";
import editarIcon from "../images/icons/editar.png";
import desactivarIcon from "../images/icons/desactivar.png";
import lupaBusqueda from "../images/lupa_busqueda.png";
import barrasBusqueda from "../images/codigo_barras.png";
import campoRestringido from "../images/candado.png";
import flecha from "../images/flecha_salir.png";

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Menu } from '../components/Menu.jsx'
import { Notificaciones } from '../components/Notificaciones'

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
    const { id, fecha } = useParams();
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

    const opcionesVerificaciones = verificaciones.map((verificacion) => ({
    value: verificacion.id_verificacion,
    label: `${verificacion.fecha} - ${verificacion.nombre}`,
  }));
  const [busqueda, setBusqueda] = useState("");
  const cargarIngresos = () => {
    fetch(API, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setIngresos(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  };
  const abrirModal = (modal, ingreso = null) => {
  setModalActiva(modal);

  if (ingreso) {
    setIngresoSeleccionado(ingreso);

    setFormEditar({
      persona_reporta: ingreso.persona_reporta || "",
      cedula_reporta: ingreso.cedula_reporta || "",
      direccion_reporta: ingreso.direccion_reporta || "",
      telefono_reporta: ingreso.telefono_reporta || "",
      funcionario_autoriza: ingreso.funcionario_autoriza || "",
      persona_realiza: ingreso.persona_realiza || "",
      cedula_realiza: ingreso.cedula_realiza || "",
      motivo_ingreso: ingreso.motivo_ingreso || "",
      fecha_hora_ingreso: ingreso.fecha_hora_ingreso || "",
      id_verificacion: ingreso.id_verificacion || "",
      id_usuario: ingreso.id_usuario || "",
    });
  }
};

const cerrarModal = () => {
  setModalActiva(null);
  setIngresoSeleccionado(null);
  setErrores({});
  setMensajeExito("");
};

const handleVer = (ingreso) => {
  abrirModal(3, ingreso);
};

  const cargarVerificaciones = () => {
    fetch(API_VERIFICACIONES, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setVerificaciones(response.data);
        } else {
          console.error(response.error);
        }
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
          if (data.rol === "farmacéutico") navigate("/albergue");
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => {
    cargarIngresos();
    cargarVerificaciones();
  }, []);

  // ─── Menú ────────────────────────────────────────────────────────────────────

  const menuObj = (() => {
    switch (user.rol) {
      case "administrador":
        return MenuVeterinario;
      case "veterinario":
        return MenuVeterinario;
      default:
        return {};
    }
  })();

  // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  const ingresosFiltrados = ingresos.filter(
    (ingreso) =>
      ingreso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      ingreso.motivo_ingreso.toLowerCase().includes(busqueda.toLowerCase()) ||
      (busqueda === fecha ? ingreso.id_ingreso === id : ingreso.fecha.includes(busqueda))
      
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

      useEffect(() => {
    
        if (!id || ingresos.length === 0) return;
    
        setBusqueda(fecha);
    
      }, [id, fecha, ingresos]);

    // ─── Render ──────────────────────────────────────────────────────────────────
  
  return (
    <>
      <Helmet>
        <title>Ingreso Animales - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={menuObj} user={user}/>
        <Notificaciones />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Ingreso Animales</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input
                className="busqueda-input1"
                type="text"
                name="busqueda"
                placeholder="Busca un ingreso"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                }}
              />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button className="registrar-btn" onClick={() => abrirModal(1)}>
              Registrar Ingreso
            </button>
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
              {ingresosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    {busqueda
                      ? "No se encontraron ingresos de animales que coincidan."
                      : "No hay ingresos de animales registrados."}
                  </td>
                </tr>
              ) : (
                ingresosFiltrados.map((ingreso) => (
                  <tr key={ingreso.id_ingreso}>
                    <td>{ingreso.nombre}</td>
                    <td>{ingreso.motivo_ingreso}</td>
                    <td>{ingreso.fecha}</td>
                    <td><button className="ver-detalles-btn" onClick={()=>abrirModal(3, ingreso)}>Ver</button></td>
                    <td>
                      <div className="last-td-flex-content-wrapper">
                        <figure
                          className="editar-icono"
                          onClick={() => abrirModal(2, ingreso)}
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
        className="modales-ingreso-animales"
        style={{ display: modalActiva ? "flex" : "none" }}
      >
        {/* ── MODAL 1: Registrar Animal ──────────────────────────────────── */}
        {modalActiva === 1 && (
          <aside className="modal-ingreso-animales-registrar">
            <button className="volver-btn-ingreso-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ar-titulo">Registrar Ingreso de Animal</h1>
            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}
            {errores.sesion && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ar-form" onSubmit={(e) => handleRegistrar(e)}>
              <section className="ar-form-inputs-area-ingresos">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label" for="">
                    Persona que reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input1-ingreso"
                    type="text"
                    value={formRegistrar.persona_reporta}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        persona_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.persona_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label" for="">
                    Dirección de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input2-ingreso"
                    type="text"
                    value={formRegistrar.direccion_reporta}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        direccion_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.direccion_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label" for="">
                    Funcionario que Autoriza<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4-ingreso"
                    type="text"
                    value={formRegistrar.funcionario_autoriza}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        funcionario_autoriza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.funcionario_autoriza ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label" for="">
                    Motivo de ingreso<h6 className="obligatorio">*</h6>
                  </label>
                  <textarea
                    className="ar-input3"
                    name="ar-observaciones"
                    value={formRegistrar.motivo_ingreso}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        motivo_ingreso: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.motivo_ingreso ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ar-label" for="">
                    Cédula de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input5-ingreso"
                    type="text"
                    value={formRegistrar.cedula_reporta}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        cedula_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.cedula_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt6" }}>
                  <label className="ar-label" for="">
                    Telefono de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formRegistrar.telefono_reporta}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        telefono_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.telefono_reporta ?? ""}
                  </span>
                </div>

                <div
                  className="label-and-input-container"
                  style={{ gridArea: "divInpt7" }}
                >
                  <label className="ar-label" for="">
                    Persona que realiza
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formRegistrar.persona_realiza}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        persona_realiza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.persona_realiza ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt8" }}>
                  <label className="ar-label" for="">
                    cédula de persona que realiza
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formRegistrar.cedula_realiza}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        cedula_realiza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.cedula_realiza ?? ""}
                  </span>
                  <label className="ar-label" for="">
                    Fecha y hora de ingreso<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="datetime-local"
                    value={formRegistrar.fecha_hora_ingreso}
                    onChange={(e) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        fecha_hora_ingreso: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.fecha_hora_ingreso ?? ""}
                  </span>
                  <label className="ar-label" for="">
                    Verificación<h6 className="obligatorio">*</h6>
                  </label>
                  <CustomSelect
                    options={opcionesVerificaciones}
                    value={formRegistrar.id_verificacion}
                    placeholder="Seleccione una verificación"
                    onChange={(val) =>
                      setFormRegistrar({
                        ...formRegistrar,
                        id_verificacion: Number(val),
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.id_verificacion ?? ""}
                  </span>
                </div>
              </section>
              <input
                className="ar-btn"
                type="submit"
                value="Registrar Ingreso de un Animal"
              />
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
            <h1 className="modal-aed-titulo">Editar Ingreso de Animal</h1>

            {mensajeExito && (
              <p style={{ color: "green", fontWeight: "bold" }}>
                {mensajeExito}
              </p>
            )}
            {errores.general && (
              <p style={{ color: "red" }}>{errores.general}</p>
            )}

            <form className="ar-form" onSubmit={(e) => handleEditar(e)}>
              <section className="ar-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ar-label" for="">
                    Persona que reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input1-ingreso"
                    type="text"
                    value={formEditar.persona_reporta}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        persona_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.persona_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ar-label" for="">
                    Dirección de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input2-ingreso"
                    type="text"
                    value={formEditar.direccion_reporta}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        direccion_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.direccion_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ar-label" for="">
                    Funcionario que Autoriza<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input4-ingreso"
                    type="text"
                    value={formEditar.funcionario_autoriza}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        funcionario_autoriza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.funcionario_autoriza ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt3" }}>
                  <label className="ar-label" for="">
                    Motivo de ingreso<h6 className="obligatorio">*</h6>
                  </label>
                  <textarea
                    className="ar-input3"
                    name="ar-observaciones"
                    value={formEditar.motivo_ingreso}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        motivo_ingreso: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.motivo_ingreso ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ar-label" for="">
                    Cédula de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input5-ingreso"
                    type="text"
                    value={formEditar.cedula_reporta}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        cedula_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.cedula_reporta ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt6" }}>
                  <label className="ar-label" for="">
                    Telefono de quien reporta<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formEditar.telefono_reporta}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        telefono_reporta: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.telefono_reporta ?? ""}
                  </span>
                </div>

                <div
                  className="label-and-input-container"
                  style={{ gridArea: "divInpt7" }}
                >
                  <label className="ar-label" for="">
                    persona que realiza
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formEditar.persona_realiza}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        persona_realiza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.persona_realiza ?? ""}
                  </span>
                  <label className="ar-label" for="">
                    Cedula de quien realiza
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="text"
                    value={formEditar.cedula_realiza}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        cedula_realiza: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.cedula_realiza ?? ""}
                  </span>
                </div>

                <div style={{ gridArea: "divInpt8" }}>
                  <label className="ar-label" for="">
                    Fecha de ingreso<h6 className="obligatorio">*</h6>
                  </label>
                  <input
                    className="ar-input6-ingreso"
                    type="datetime-local"
                    value={formEditar.fecha_hora_ingreso}
                    onChange={(e) =>
                      setFormEditar({
                        ...formEditar,
                        fecha_hora_ingreso: e.target.value,
                      })
                    }
                  />
                  <span className="error-mensaje">
                    {errores.fecha_hora_ingreso ?? ""}
                  </span>
                  <label className="ar-label" for="">
                    Verificación<h6 className="obligatorio">*</h6>
                  </label>
                  <CustomSelect
                    options={opcionesVerificaciones}
                    value={formEditar.id_verificacion}
                    placeholder="Seleccione una verificación"
                    onChange={(val) =>
                      setFormEditar({
                        ...formEditar,
                        id_verificacion: Number(val),
                      })
                    }
                  />
                </div>
              </section>
              <input className="ar-btn" type="submit" value="Guardar Cambios" />
            </form>
          </aside>
        )}
          {/* ── MODAL 3: Detalle de ingreso Animal ──────────────────────────────────── */}
        {modalActiva === 3 && ingresoSeleccionado && (
          
          <aside className='modal-detalle-ingreso'>
            <button className="volver-btn-ingreso-anim" onClick={cerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-aed-titulo">
              Ingreso del animal [{ingresoSeleccionado.nombre}]
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
                <th>{ingresoSeleccionado.persona_reporta}</th>
                <th>{ingresoSeleccionado.cedula_reporta}</th>
                <th>{ingresoSeleccionado.direccion_reporta}</th>
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
                <th>{ingresoSeleccionado.telefono_reporta}</th>
                <th>{ingresoSeleccionado.funcionario_autoriza}</th>
                <th>{ingresoSeleccionado.cedula_realiza}</th>
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
                <th>{ingresoSeleccionado.fecha_hora_ingreso}</th>
                <th>{ingresoSeleccionado.motivo_ingreso}</th>
                <th>{`[${ingresoSeleccionado.fecha}] ${ingresoSeleccionado.nombre}`}</th>
              </tr>
            </tbody>
          </table>
          </aside>
        )}
      </div>
    </>
  );
};
