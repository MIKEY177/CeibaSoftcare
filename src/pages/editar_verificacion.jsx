// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MenuAdminAlbergue } from "../utils/menu.jsx";
import campoRestringido from "../images/candado.png";
import CustomSelect from "../components/CustomSelect";
import subirIcon from "../images/subir.png";
import flecha from "../images/flecha_salir.png";
import { Helmet } from "react-helmet-async";

// Estilos
import "../styles/global_styles.css";
import "../styles/verificaciones.css";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";

const API = `api/verificaciones.php`;
const API_SESSION = `api/session.php`;
const API_ANIMALES = `api/animales.php`;

export const EditarVerificacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imagenActual, setImagenActual] = useState("");

  const [user, setUser] = useState({ nombre: "", rol: "" });
  const [animales, setAnimales] = useState([]);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [imagen, setImagen] = useState(null);
  const enviandoRef = useRef(false);
  const [verificacionOriginal, setVerificacionOriginal] = useState(null);

  const opcionesTipoVerificacion = [
    { value: "Semovientes", label: "Semovientes" },
    { value: "Maltrato Animal", label: "Maltrato Animal" },
    { value: "Palomas", label: "Palomas" },
  ];

  const opcionesAnimal = animales.map((a) => ({
    value: String(a.id_animal),
    label: a.nombre,
  }));

  const opcionesTipoCodigo = [
    { value: "Registro AU", label: "Registro AU" },
    { value: "N° Radicado", label: "N° Radicado" },
  ];

  const [formEditarVerificacion, setFormEditarVerificacion] = useState({
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

  // ─── Sesión ───────────────────────────────────────────────────────────────────

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

  // ─── Cargar animales ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetch(API_ANIMALES, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setAnimales(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  }, []);

  // ─── Cargar verificación a editar ─────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    fetch(`${API}?id=${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          const v = response.data;
          setVerificacionOriginal(v);
          setImagenActual(v.registro_fotografico ?? "");
          setFormEditarVerificacion({
            tipo_verificacion: v.tipo_verificacion ?? "",
            id_animal1: v.id_animal1 ? String(v.id_animal1) : "",
            fecha: v.fecha ?? "",
            tipo_codigo: v.tipo_codigo ?? "",
            codigo: v.codigo ?? "",
            propietario: v.propietario ?? "",
            id_propietario: v.id_propietario ?? "",
            contacto: v.contacto ?? "",
            correo: v.correo ?? "",
            direccion: v.direccion ?? "",
            descripcion: v.descripcion ?? "",
          });
        }
      })
      .catch(console.error);
  }, [id]);
  // ─── Menú ─────────────────────────────────────────────────────────────────────

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

  // ─── Envío al backend ─────────────────────────────────────────────────────────

  const enviar = (e) => {
    e.preventDefault();

    // ── Detectar si no hay cambios ──────────────────────────────
    const sinCambios =
      formEditarVerificacion.tipo_verificacion ===
        (verificacionOriginal?.tipo_verificacion ?? "") &&
      formEditarVerificacion.id_animal1 ===
        String(verificacionOriginal?.id_animal1 ?? "") &&
      formEditarVerificacion.fecha === (verificacionOriginal?.fecha ?? "") &&
      formEditarVerificacion.tipo_codigo ===
        (verificacionOriginal?.tipo_codigo ?? "") &&
      formEditarVerificacion.codigo === (verificacionOriginal?.codigo ?? "") &&
      formEditarVerificacion.propietario ===
        (verificacionOriginal?.propietario ?? "") &&
      formEditarVerificacion.id_propietario ===
        (verificacionOriginal?.id_propietario ?? "") &&
      formEditarVerificacion.contacto ===
        (verificacionOriginal?.contacto ?? "") &&
      formEditarVerificacion.correo === (verificacionOriginal?.correo ?? "") &&
      formEditarVerificacion.direccion ===
        (verificacionOriginal?.direccion ?? "") &&
      formEditarVerificacion.descripcion ===
        (verificacionOriginal?.descripcion ?? "") &&
      !imagen;

    if (sinCambios) {
      setErrores({ general: "No se realizaron cambios." });
      return;
    }

    if (enviandoRef.current) return;
    enviandoRef.current = true;
    setCargando(true);
    setErrores({});
    setMensajeExito("");

    const body = new FormData();
    body.append("_method", "PUT");
    body.append("id_verificacion", id);
    Object.entries(formEditarVerificacion).forEach(([key, value]) =>
      body.append(key, value),
    );
    if (imagen) body.append("registro_fotografico", imagen);

    fetch(API, { method: "POST", credentials: "include", body })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setMensajeExito("¡Verificación actualizada correctamente!");
          setTimeout(() => navigate("/verificaciones"), 1500);
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
  // ─── Render ───────────────────────────────────────────────────────────────────
console.log(imagenActual);
  return (
    <>
    <Helmet>
      <title>Editar Verificación</title>
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
          <h1 className="titulo-registrar-verificacion">Editar Verificación</h1>

          {mensajeExito && (
            <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>
          )}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
          {errores.sesion && <p style={{ color: "red" }}>{errores.sesion}</p>}

          <form className="form-verificaciones" onSubmit={enviar}>
            <div className="content-form">
              <label className="ied-label">
                Tipo de Verificación <h6 className="obligatorio">*</h6>
              </label>
              <CustomSelect
                options={opcionesTipoVerificacion}
                value={formEditarVerificacion.tipo_verificacion}
                onChange={(val) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.id_animal1}
                onChange={(val) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.fecha}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.tipo_codigo}
                onChange={(val) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.codigo}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.propietario}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.id_propietario}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.contacto}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.correo}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                value={formEditarVerificacion.direccion}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
                  htmlFor="registro_fotografico_editar"
                >
                  {imagen ? (
                    <figure className="subir-icono-rft">
                      <img
                        src={URL.createObjectURL(imagen)}
                        className="subir-icono-img"
                        style={{ maxHeight: 115, borderRadius: 8 }}
                      />
                    </figure>
                  ) : imagenActual ? (
                    <figure className="subir-icono-rft">
                      <img
                        src={`http://localhost/CeibaSoftcare/backend/${imagenActual}`}
                        className="subir-icono-img"
                        style={{ maxHeight: 115, borderRadius: 8 }}
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
                    id="registro_fotografico_editar"
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
                value={formEditarVerificacion.descripcion}
                onChange={(e) =>
                  setFormEditarVerificacion((prev) => ({
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
              value={cargando ? "Guardando..." : "Guardar Cambios"}
              disabled={cargando}
            />
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};
