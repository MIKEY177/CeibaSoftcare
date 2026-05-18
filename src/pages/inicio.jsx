import React, { useEffect, useState } from 'react'
import { data, Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"

import "../styles/global_styles.css"
import "../styles/inicio.css"
import farmaciaIcon from "../images/icons/farmacia-icon.png"
import albergueIcon from "../images/icons/albergue-icon.png"
import usuariosIcon from "../images/icons/usuarios-icon.png"
import eventosIcon from "../images/icons/eventos-icon.png"
import closeEye from "../images/password_close_eye.png"
import openEye from "../images/password_open_eye.png"

import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Notificaciones } from '../components/Notificaciones'

export const indexSelector = 0;

export const Inicio = () => {
  const [eventos, setEventos] = useState([]);
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const [modalActiva, setModalActiva] = useState(false);
  const [nuevaPass, setNuevaPass] = useState("");
  const [confirmarPass, setConfirmarPass] = useState("");
  const [erroresModal, setErroresModal] = useState({});
  const [message, setMessage] = useState("");
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const navigate = useNavigate();

  const API_SESSION = `api/session.php`;
  const API_EVE = `api/eventos.php`;
  const API_CAMBIAR_PASS = `api/cambiar_contrasena.php`;
  const API_CS = `api/logout.php`;
  useEffect(() => {
    // consultar eventos
    fetch(API_EVE, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setEventos(response.data);
        } else {
          console.error(response.error);
        }
      })
      .catch(error => console.error(error));

    // consultar sesión
    fetch(API_SESSION, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {

        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol, foto_perfil: data.foto_perfil, cuenta_activa: data.cuenta_activa });

        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(error => {
        console.error("Error al obtener sesión:", error);
        navigate("/iniciar_sesion");
      });


  }, []);

  useEffect(() => {
    if (user.cuenta_activa === 0) {
      abrirModal();
    }
  }, [user]);

  const abrirModal = () => {
    setModalActiva(true);
  }

  const cerrarModal = () => {
    setModalActiva(false);
    setNuevaPass("");
    setConfirmarPass("");
    setErroresModal({});
    cerrarSesion();
  }

  const handleCambiarPass = (e) => {
    e.preventDefault();
    fetch(API_CAMBIAR_PASS, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nuevaPass: nuevaPass,
        confirmarPass: confirmarPass
      })
    })
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          mostrarExito();
        } else {
          setErroresModal(response.errors);
        }
      })
      .catch(error => console.error(error));
  };


  const cerrarSesion = async () => {
    try {
      const response = await fetch(API_CS, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.status === "success") {
        navigate("/iniciar_sesion");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const mostrarExito = () => {
    setMessage("Contraseña cambiada exitosamente. Por favor, inicie sesión nuevamente.");
    setTimeout(() => cerrarModal(), 1500);
  }
  // compute menu object based on user role
  const menuObj = (() => {
    switch (user.rol) {
      case "administrador":
        return MenuAdmin;
      case "farmacéutico":
        return MenuFarmaceutico;
      case "veterinario":
        return MenuVeterinario;
      default:
        return {};
    }
  })();

  const eventosOrdenados = [...eventos]
    .filter(ev => new Date(ev.fecha_hora) > new Date())
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
    .slice(0, 5);
  return (
    <>
      <Helmet>
        <title>Inicio - Softcare</title>
      </Helmet>
      <main>
        {/* determine menu based on role */}
        <Navbar user={user} menu={menuObj} />
        <Notificaciones />
        <section className="secciones-dashboard">
          <h2 className="titulo-dashboard">¡Bienvenido al Dashboard!</h2>
          <section className="seccion1-proximas-eventos">
            <h3 className="subtitulo-dashboard">Próximos Eventos</h3>
            <section className="area-eventos">
              {eventosOrdenados.length === 0 ? (
                <p className="no-hay-eventos">No hay eventos programados.</p>
              ) : (
                eventosOrdenados.map((evento) => (
                  <React.Fragment key={evento.id_evento}>
                    <div className="subarea-evento">
                      <h4 className="fecha">{evento.fecha_hora}</h4>
                      <article className="articulo-evento">
                        <h5 className="detalles-evento">{evento.nombre}</h5>
                        <h6 className="detalles-evento">Lugar:</h6>
                        <p className="detalles-evento">{evento.lugar}</p>
                        <h6 className="detalles-evento">Descripción:</h6>
                        <p className="detalles-evento">{evento.descripcion}</p>
                      </article>
                    </div>
                    <div className="separador-vertical"></div>
                  </React.Fragment>
                ))
              )}
            </section>
          </section>
          <section className="seccion2-modulos-i">
            <h3 className="subtitulo-dashboard">Módulos de Gestión</h3>
            <section className="area-modulos-i">
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/farmacia">
                  <div className="modulo-farmacia">
                    <h4 className="titulo-modulo-farmacia">Farmacia</h4>
                    <figure className="modulo-farmacia-icono">
                      <img className="modulo-farmacia-img" src={farmaciaIcon} alt="" />
                    </figure>
                  </div>
                </Link>
              ) : ''}
              {user.rol === "administrador" || user.rol === "veterinario" ? (
                <Link to="/albergue">
                  <div className="modulo-albergue">
                    <h4 className="titulo-modulo-albergue">Albergue</h4>
                    <figure className="modulo-albergue-icono">
                      <img className="modulo-albergue-img" src={albergueIcon} alt="" />
                    </figure>
                  </div>
                </Link>
              ) : ''}
              {user.rol === "administrador" ? (
                <Link to="/usuarios">
                  <div className="modulo-usuarios">
                    <h4 className="titulo-modulo-usuarios">Usuarios</h4>
                    <figure className="modulo-usuarios-icono">
                      <img className="modulo-usuarios-img" src={usuariosIcon} alt="" />
                    </figure>
                  </div>
                </Link>
              ) : ''}
              {user.rol === "administrador" ? (
                <Link to="/eventos">
                  <div className="modulo-eventos">
                    <h4 className="titulo-modulo-eventos">Eventos</h4>
                    <figure className="modulo-eventos-icono">
                      <img
                        className="modulo-eventos-img"
                        src={eventosIcon}
                        alt=""
                      />
                    </figure>
                  </div>
                </Link>
              ) : (
                ""
              )}
            </section>
          </section>
        </section>
      </main>
      <Footer />
      <div className="modales-dashboards" style={{ display: modalActiva ? 'flex' : 'none' }}>
        {modalActiva && (
          <aside className="modal-p">
            <section className="modal-p-area">
              <h1 className="modal-p-titulo">Cambiar contraseña</h1>
              <h3 className="modal-p-mensaje">Por motivos de seguridad y privacidad le sugerimos que  cambie su contraseña a continuación.</h3>
              <span className="exito-login-p">{message}</span>
              <form
                className="p-form"
                onSubmit={(e) => {
                  handleCambiarPass(e);
                }}
              >

                <label className="p-label">
                  Nueva Contraseña
                </label>

                <div className="p-password-container">

                  <input
                    className="p-input4"
                    type={showNueva ? "text" : "password"}
                    value={nuevaPass}
                    onChange={(e) => setNuevaPass(e.target.value)}
                  />

                  <button
                    type="button"
                    className="p-eye"
                    onClick={() => setShowNueva(!showNueva)}
                  >
                    <figure class="p-eye-fig"><img src={showNueva ? openEye : closeEye}/></figure>
                  </button>

                </div>

                <span className="error-login-p">
                  {erroresModal.nuevaPass ?? ""}
                </span>

                <label className="p-label">
                  Confirmar Contraseña
                </label>

                <div className="p-password-container">

                  <input
                    className="p-input4"
                    type={showConfirmar ? "text" : "password"}
                    value={confirmarPass}
                    onChange={(e) => setConfirmarPass(e.target.value)}
                  />

                  <button
                    type="button"
                    className="p-eye"
                    onClick={() => setShowConfirmar(!showConfirmar)}
                  >
                    <figure class="p-eye-fig"><img src={showConfirmar ? openEye : closeEye}/></figure>
                  </button>

                </div>

                <span className="error-login-p">
                  {erroresModal.confirmarPass ?? ""}
                </span>

                <span className="error-login-p">
                  {erroresModal.general ?? ""}
                </span>

                <input
                  className="p-btn"
                  type="submit"
                  value="Cambiar Contraseña"
                />

              </form>
            </section>
          </aside>
        )}
      </div>
    </>
  )
}