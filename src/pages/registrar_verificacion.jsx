// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { MenuAdminAlbergue, MenuVeterinario } from "../utils/menu.jsx";
import campoRestringido from "../images/candado.png";
import CustomSelect from "../components/CustomSelect";
import subirIcon from "../images/subir.png";
import flecha from "../images/flecha_salir.png";
// Estilos
import "../styles/global_styles.css";
import "../styles/verificaciones.css";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

const API = `api/verificaciones.php`;
const API_SESSION = `api/session.php`;
const API_ANIMALES = `api/animales.php`;

export const indexSelector = 6;

export const RegistrarVerificacion = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const [animales, setAnimales] = useState([]);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const enviandoRef = useRef(false);

  // ─── Opciones ────────────────────────────────────
  const opcionesTipoVerificacion = [
    { value: "Semovientes", label: "Semovientes" },
    { value: "Maltrato Animal", label: "Maltrato Animal" },
    { value: "Palomas", label: "Palomas" },
  ];

  const opcionesAnimal = animales.map((a) => ({
    value: a.id_animal,
    label: a.nombre,
  }));

  const opcionesTipoCodigo = [
    { value: "Registro AU", label: "Registro AU" },
    { value: "N° Radicado", label: "N° Radicado" },
  ];

  const [formRegistrarVerificacion, setFormRegistrarVerificacion] = useState({
    tipo_verificacion: "",
    id_animal1: "",
    fecha: "",
    tipo_codigo: "",
    codigo: "",
    propietario: "",
    id_propietario: "",
    contacto: "",
    correo: "",
    direccion: "",
    descripcion: "",
  });

  const [imagen, setImagen] = useState(null);

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
          if (data.rol !== "veterinario" && data.rol !== "administrador") {
            navigate("/iniciar_sesion");
          }
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
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

  // ─── Mostrar éxito ────────────────────────────────────────────────────────────

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setFormRegistrarVerificacion({
      tipo_verificacion: "",
      id_animal1: "",
      fecha: "",
      tipo_codigo: "",
      codigo: "",
      propietario: "",
      id_propietario: "",
      contacto: "",
      correo: "",
      direccion: "",
      responsable_verificacion: "",
      descripcion: "",
    });
    setImagen(null);
    setTimeout(() => navigate("/verificaciones"), 1500);
  };

  // ─── Envío al backend ─────────────────────────────────────────────────────────

  const enviar = (method, mensajeOk) => {
    if (enviandoRef.current) return;
    enviandoRef.current = true;
    setCargando(true);
    setErrores({});
    setMensajeExito("");

    // FormData porque hay imagen
    const body = new FormData();
    Object.entries(formRegistrarVerificacion).forEach(([key, value]) =>
      body.append(key, value),
    );
    if (imagen) body.append("registro_fotografico", imagen);

    fetch(API, {
      method,
      credentials: "include",
      body,
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          mostrarExito(mensajeOk);
        } else {
          setErrores(response.errores ?? { general: "Error desconocido." });
        }
      })
      .catch(() =>
        setErrores({ general: "Error de conexión con el servidor." }),
      )
      .finally(() => {
        setCargando(false);
        enviandoRef.current = false;
      });
  };

  const handleRegistrar = (e) => {
    e.preventDefault();
    enviar("POST", "¡Verificación registrada correctamente!");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
    <Helmet>
      <title>Registrar Verificación</title>
    </Helmet>
      <main className="main-registrar-verificacion">
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <button
            className="volver-btn-anim"
            onClick={() => navigate("/verificaciones")}
          >
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="titulo-registrar-verificacion">
            Registrar Verificación
          </h1>

          {mensajeExito && (
            <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>
          )}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
          {errores.sesion && <p style={{ color: "red" }}>{errores.sesion}</p>}

          <form className="form-verificaciones" onSubmit={handleRegistrar}>
            <div className="content-form">
              <label className="ied-label">
                Tipo de Verificación <h6 className="obligatorio">*</h6>
              </label>

              <CustomSelect
                options={opcionesTipoVerificacion}
                value={formRegistrarVerificacion.tipo_verificacion}
                onChange={(val) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    tipo_verificacion: val,
                  }))
                }
              />
              <span className="error-mensaje">
                {errores.tipo_verificacion ?? ""}
              </span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Animal <h6 className="obligatorio">*</h6>
              </label>
              <CustomSelect
                options={opcionesAnimal}
                value={formRegistrarVerificacion.id_animal1}
                onChange={(val) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    id_animal1: val,
                  }))
                }
              />
              <span className="error-mensaje">{errores.id_animal1 ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Fecha de Verificación <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="date"
                className="ied-input"
                value={formRegistrarVerificacion.fecha}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    fecha: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.fecha ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Tipo de Código <h6 className="obligatorio">*</h6>
              </label>
              <CustomSelect
                options={opcionesTipoCodigo}
                value={formRegistrarVerificacion.tipo_codigo}
                onChange={(val) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    tipo_codigo: val,
                  }))
                }
              />
              <span className="error-mensaje">{errores.tipo_codigo ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Código <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="number"
                className="ied-input"
                value={formRegistrarVerificacion.codigo}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    codigo: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.codigo ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Propietario <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="text"
                className="ied-input"
                value={formRegistrarVerificacion.propietario}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    propietario: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.propietario ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Identificación propietario <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="text"
                className="ied-input"
                value={formRegistrarVerificacion.id_propietario}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    id_propietario: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">
                {errores.id_propietario ?? ""}
              </span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Contacto propietario <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="text"
                className="ied-input"
                value={formRegistrarVerificacion.contacto}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    contacto: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.contacto ?? ""}</span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Correo propietario <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="email"
                className="ied-input"
                value={formRegistrarVerificacion.correo}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    correo: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.correo ?? ""}</span>
            </div>

            <div className="content-form contenedor-formulario">
              <label className="ied-label">
                Dirección propietario <h6 className="obligatorio">*</h6>
              </label>
              <input
                type="text"
                className="ied-input"
                value={formRegistrarVerificacion.direccion}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    direccion: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.direccion ?? ""}</span>

              <label className="ar-label">Responsable de la verificación</label>
              <div className="union-input-icono">
                <input
                  className="ar-input8"
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

            <div className="content-form">
              <label className="ied-label">Registro fotográfico</label>
              <label className="registro-ft">
                <label
                  className="registro-ft-form"
                  htmlFor="registro_fotografico"
                >
                  {imagen ? (
                    <figure className="subir-icono-prev">
                      <img
                        src={URL.createObjectURL(imagen)}
                        alt="Registro fotográfico a subir"
                      />
                    </figure>
                  ) : (
                    <>
                      <figure className="subir-icono-rft">
                        <img
                          className="subir-icono-img"
                          src={subirIcon}
                          alt="Subir"
                        />
                      </figure>
                      <h5>Seleccionar Archivo...</h5>
                    </>
                  )}
                  <input
                    id="registro_fotografico"
                    type="file"
                    style={{ display: "none" }}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => setImagen(e.target.files[0] || null)}
                  />
                </label>
              </label>
              <span className="error-mensaje">
                {errores.registro_fotografico ?? ""}
              </span>
            </div>

            <div className="content-form">
              <label className="ied-label">
                Descripción <h6 className="obligatorio">*</h6>
              </label>
              <textarea
                className="epr-input2"
                value={formRegistrarVerificacion.descripcion}
                onChange={(e) =>
                  setFormRegistrarVerificacion((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
              />
              <span className="error-mensaje">{errores.descripcion ?? ""}</span>
            </div>

            <input
              type="submit"
              className="btn-registrar-verificacion"
              value={cargando ? "Registrando..." : "Registrar Verificación"}
              disabled={cargando}
            />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
