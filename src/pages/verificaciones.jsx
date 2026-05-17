// Imports Base
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MenuAdminAlbergue} from "../utils/menu.jsx";
import { Helmet } from "react-helmet-async";
import editarIcon from "../images/icons/editar.png";
import desactivarIcon from "../images/icons/desactivar.png";
import lupaBusqueda from "../images/lupa_busqueda.png";
import flecha from "../images/flecha_salir.png";

// Estilos
import "../styles/global_styles.css";
import "../styles/verificaciones.css";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";
import { Notificaciones } from "../components/Notificaciones";

const API = `api/verificaciones.php`;
const API_SESSION = `api/session.php`;
export const indexSelector = 2;

export const Verificaciones = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const [verificaciones, setVerificaciones] = useState([]);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const enviandoRef = useRef(false);

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
    cargarVerificaciones();
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

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const cargarVerificaciones = () => {
    fetch(API, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) setVerificaciones(response.data);
        else console.error(response.error);
      })
      .catch(console.error);
  };

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    setTimeout(() => {
      cerrarModal();
      cargarVerificaciones();
    }, 1500);
  };
  // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  const verificacionesFiltradas = verificaciones.filter(
    (v) =>
      (v.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (v.tipo_verificacion ?? "")
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (v.codigo ?? "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (v.descripcion ?? "").toLowerCase().includes(busqueda.toLowerCase()),
  );

  // ─── Envío al backend ─────────────────────────────────────────────────────────

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

  const handleEliminar = () => {
    enviar(
      "DELETE",
      { id_verificacion: verificacionSeleccionada.id_verificacion },
      "¡Verificación desactivada correctamente!",
    );
  };
  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Verificaciones - Softcare</title>
      </Helmet>
      <main>
        <Navbar user={user} menu={menuObj} />
        <Notificaciones />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard titulo-verificaciones">Verificaciones</h2>

          <section className="seccion1-busqueda-agregar">
            <form
              className="busqueda-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                className="busqueda-input1"
                type="text"
                placeholder="Busca una verificación"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="diff_busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
            </form>
            <button
              className="registrar-btn"
              onClick={() => navigate("/registrar_verificacion")}
            >
              Registrar Verificación
            </button>
          </section>

          <table className="tabla-verificaciones">
            <thead className="header-tabla-verificaciones">
              <tr>
                <td>Tipo de verificación</td>
                <td>Código</td>
                <td>Fecha</td>
                <td>Animal</td>
                <td></td>
                <td>Editar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-verificaciones">
              {verificacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    {busqueda
                      ? "No se encontraron verificaciones que coincidan."
                      : "No hay verificaciones registradas."}
                  </td>
                </tr>
              ) : (
                verificacionesFiltradas.map((verificacion) => (
                  <tr key={verificacion.id_verificacion}>
                    <td>{verificacion.tipo_verificacion}</td>
                    <td>{verificacion.codigo}</td>
                    <td>{verificacion.fecha}</td>
                    <td>{verificacion.nombre}</td>
                    <td>
                      <button
  className="tabla-verificaciones-btn"
  onClick={() =>
    navigate(`/detalle_verificacion/${verificacion.id_verificacion}`)
  }
>
  Ver
</button>
                    </td>
                    <td>
                      <div className="last-td-flex-content-wrapper">
                        <figure
                          className="editar-icono"
                          onClick={() =>
                            navigate(
                              `/editar_verificacion/${verificacion.id_verificacion}`,
                            )
                          }
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
    </>
  );
};
