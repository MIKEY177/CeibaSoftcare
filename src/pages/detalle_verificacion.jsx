import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import flecha from "../images/flecha_salir.png";

import "../styles/global_styles.css";
import "../styles/verificaciones.css";

import { MenuAdminAlbergue } from "../utils/menu.jsx";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Notificaciones } from "../components/Notificaciones";

const API = "/api/verificaciones.php";
const API_SESSION = "/api/session.php";
export const indexSelector = 2;
export const DetalleVerificacion = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ nombre: "", rol: "" });
    const navigate = useNavigate();
  const [verificacion, setVerificacion] = useState(null);
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

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
    });
}, []);

  useEffect(() => {
    fetch(API, { credentials: "include" })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          const encontrada = response.data.find(
            (v) => String(v.id_verificacion) === String(id),
          );

          setVerificacion(encontrada);
        }
      });
  }, [id]);

  if (!verificacion) {
    return <p>Cargando...</p>;
  }
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
  

  return (
    <>
      <Helmet>
        <title>Detalle Verificación - Softcare</title>
      </Helmet>

      <main>
        <Navbar user={user}  menu={menuObj} />
        <Notificaciones />

        <section className="secciones-area-gestion">
          <button
            className="volver-btn-anim"
            onClick={() => navigate("/verificaciones")}
          >
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h2 className="titulo-dashboard titulo-detalle-verificacion">
            Verificación {verificacion.codigo}
          </h2>

<section className="detalles-verificacion">
  <div className="datos-verificacion">
    <h5>Datos de Verificación</h5>

    <div className="campo-verificaciones">
      <strong>Tipo de Verificación</strong>
      <p>{verificacion.tipo_verificacion}</p>
    </div>

    <div className="campo-verificaciones">
      <strong>Tipo de Código</strong>
      <p>{verificacion.tipo_codigo}</p>
    </div>

    <div className="campo-verificaciones">
      <strong>Código</strong>
      <p>{verificacion.codigo}</p>
    </div>

    <div className="campo-verificaciones">
      <strong>Fecha Verificación</strong>
      <p>{verificacion.fecha}</p>
    </div>

    <div className="campo-verificaciones p-final">
      <strong>Responsable de la verificación</strong>
      <p>{verificacion.responsable}</p>
    </div>
  </div>

  <div className="datos-verificacion-propietario">
    <h5>Datos del Propietario</h5>

    <div className="campo-verificaciones propietario">
      <strong>Nombre</strong>
      <p>{verificacion.propietario}</p>
    </div>

    <div className="campo-verificaciones propietario">
      <strong>Identificación</strong>
      <p>{verificacion.id_propietario}</p>
    </div>

    <div className="campo-verificaciones propietario">
      <strong>Teléfono</strong>
      <p>{verificacion.contacto}</p>
    </div>

    <div className="campo-verificaciones propietario">
      <strong>Correo</strong>
      <p>{verificacion.correo}</p>
    </div>

    <div className="campo-verificaciones propietario p-final">
      <strong>Dirección</strong>
      <p>{verificacion.direccion}</p>
    </div>
  </div>

  <div className="datos-verificacion-especificaciones">
    <h5>Especificaciones</h5>

    <div className="campo-verificaciones">
      <strong>Nombre del animal</strong>
      <p>{verificacion.nombre}</p>
    </div>

    <div className="campo-verificaciones especificacion-descripcion">
      <strong>Descripción</strong>
      <p>{verificacion.descripcion}</p>
    </div>

    {verificacion?.registro_fotografico && (
      <div className="img-registro-fotografico">
        <strong>Registro Fotográfico:</strong>

        <img
          src={verificacion.registro_fotografico}
          alt="Registro fotográfico"
          className="img-preview-verificacion"
          onClick={() =>
            setImagenAmpliada(verificacion.registro_fotografico)
          }
        />
      </div>
    )}
  </div>
</section>

{imagenAmpliada && (
  <div
    className="modal-imagen-overlay"
    onClick={() => setImagenAmpliada(null)}
  >
    <div
      className="modal-imagen-contenido"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="volver-btn-anim"
        onClick={() => setImagenAmpliada(null)}
      >
        <img className="volver-icono" src={flecha} alt="" />
        <h2>Volver</h2>
      </button>

      <img
        src={imagenAmpliada}
        alt="Imagen ampliada"
        className="imagen-ampliada"
      />
    </div>
  </div>
)}
     </section>
      </main>

      <Footer />
    </>
  );
};