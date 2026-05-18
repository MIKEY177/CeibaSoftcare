// Imports Base
import { Helmet } from "react-helmet-async";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

// Estilos
import "../styles/global_styles.css";
import productosIcon from "../images/icons/productos-icon.png";
import salidaIcon from "../images/icons/salida-icon.png";
import entradaIcon from "../images/icons/entrada-icon.png";
import eventosIcon from "../images/icons/eventos-icon.png";

// Componentes
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Notificaciones } from "../components/Notificaciones";

export const indexSelector = 1;

export const Farmacia = () => {
  const [actividad, setActividad] = useState([]);
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const [modalActiva, setModalActiva] = useState(false);
  const [codigoEscaneado, setCodigoEscaneado] = useState("");
  const scannedCodeRef = useRef("");
  const isScanningRef = useRef(false);
  const lastKeyTimeRef = useRef(0);
  const scanTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const API_SESSION = `api/session.php`;
  const API_ACT = `api/actividad_reciente.php`;
  const API_PRODUCTOS = `api/inventario.php`;

  useEffect(() => {
    fetch(API_ACT, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          setActividad(response.data);
        } else {
          console.error(response.error);
        }
      })
      .catch((error) => console.error(error));

    // consultar sesión
    fetch(API_SESSION, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        
        if (data.status === "ok") {
          setUser({
            nombre: data.usuario,
            rol: data.rol,
            foto_perfil: data.foto_perfil,
          });
          if (data.rol !== "administrador" && data.rol !== "farmacéutico") {
            navigate("/inicio");
          }
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch((error) => {
        console.error("Error al obtener sesión:", error);
        navigate("/iniciar_sesion");
      });
  }, []);
  const abrirModalEscaneo = (codigo) => {
    setModalActiva(true);
    setCodigoEscaneado(codigo);
  };

  const cerrarModalEscaneo = () => {
    setModalActiva(false);
    setCodigoEscaneado("");
  };

  const buscarProductoPorCodigo = async (codigo) => {
    try {
      const res = await fetch(`${API_PRODUCTOS}?codigo=${codigo}`, {
        credentials: "include",
      });

      const data = await res.json();

      

      if (res.ok && data.success === true) {
        navigate(`/productos/${codigo}/1`);
      } else {
        abrirModalEscaneo(codigo);
      }
    } catch (error) {
      console.error("Error al buscar producto:", error);

      abrirModalEscaneo(codigo);
    }
  };

  useEffect(() => {
    const applyScannedCode = () => {
      const code = scannedCodeRef.current;

      // Validar longitud mínima
      if (code.length < 6) {
        scannedCodeRef.current = "";
        return;
      }

      

      buscarProductoPorCodigo(code);

      scannedCodeRef.current = "";
    };

    const handleKeyDown = (e) => {
      // ENTER del lector
      if (e.key === "Enter") {
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }

        applyScannedCode();
        return;
      }

      // Solo números
      if (/^[0-9]$/.test(e.key)) {
        // Evita escribir visible
        e.preventDefault();

        // Acumula código
        scannedCodeRef.current += e.key;

        // Reinicia timeout
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current);
        }

        // Algunos lectores no envían ENTER
        scanTimeoutRef.current = setTimeout(() => {
          applyScannedCode();
        }, 300);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  const verActividad = (actividad, fecha, id, nombre_producto) => {
    const path = actividad === "Entrada" ? "/entradas_prod" : "/salidas_prod";

    navigate(
      `${path}/${id}/${encodeURIComponent(fecha)}/${encodeURIComponent(nombre_producto)}`,
    );
  };

  const menuObj = (() => {
    switch (user.rol) {
      case "administrador":
        return MenuAdminFarmacia;
      case "farmacéutico":
        return MenuFarmaceutico;
      default:
        return {};
    }
  })();

  return (
    <>
      <Helmet>
        <title>Farmacia - Softcare</title>
      </Helmet>
      <main>
        <Navbar user={user} menu={menuObj} />
        <Notificaciones />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Módulo Farmacia</h2>
          <section className="seccion1-actividad-reciente">
            <h3 className="titulo-area-gestion">Actividad Reciente</h3>
            <table className="tabla-actividad-reciente">
              <thead className="header-tabla-actividad-reciente">
                <tr>
                  <td>Producto</td>
                  <td>Fecda</td>
                  <td>Cantidad</td>
                  <td>Actividad</td>
                  <td>Acciones</td>
                </tr>
              </thead>

              <tbody className="body-tabla-actividad-reciente">
                {actividad.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No hay actividad reciente.
                    </td>
                  </tr>
                ) : (
                  actividad.map((activity, index) => (
                    <tr key={`${activity.id}-${index}`}>
                      <td>{activity.producto}</td>
                      <td>{activity.fecha}</td>
                      <td>{activity.cantidad}</td>
                      <td>{activity.actividad}</td>
                      <td>
                        <button
                          className="tabla-actividad-reciente-btn"
                          onClick={() =>
                            verActividad(
                              activity.actividad,
                              activity.fecha,
                              activity.id,
                              activity.producto,
                            )
                          }
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </section>
          <section className="seccion2-modulos">
            <h3 className="titulo-area-gestion">Sub-Módulos de Gestión</h3>
            <section className="area-modulos">
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/productos">
                  <div className="modulo-productos">
                    <h4 className="titulo-modulo-productos">Productos</h4>
                    <figure className="modulo-productos-icono">
                      <img
                        className="modulo-productos-img"
                        src={productosIcon}
                        alt=""
                      />
                    </figure>
                  </div>
                </Link>
              ) : (
                ""
              )}
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/entradas_prod">
                  <div className="modulo-entradas-productos">
                    <h4 className="titulo-modulo-entradas-productos">
                      Entradas Productos
                    </h4>
                    <figure className="modulo-entradas-productos-icono">
                      <img
                        className="modulo-entradas-productos-img"
                        src={entradaIcon}
                        alt=""
                      />
                    </figure>
                  </div>
                </Link>
              ) : (
                ""
              )}
              {user.rol === "administrador" || user.rol === "farmacéutico" ? (
                <Link to="/salidas_prod">
                  <div className="modulo-salidas-productos">
                    <h4 className="titulo-modulo-salidas-productos">
                      Salidas Productos
                    </h4>
                    <figure className="modulo-salidas-productos-icono">
                      <img
                        className="modulo-salidas-productos-img"
                        src={salidaIcon}
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
      <div
        className="modales-dashboards"
        style={{ display: modalActiva ? "flex" : "none" }}
      >
        {modalActiva && (
          <aside className="modal-codigo">
            <h1 className="modal-c-titulo">Registrar Nuevo Producto</h1>
            {/* {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>} */}
            <h3 className="modal-c-mensaje">
              ¿Desea registrar nuevo producto{" "}
              <span class="second-line">
                {" "}
                con código <h6 className="subrayar-c">{codigoEscaneado}</h6>
                ?{" "}
              </span>
            </h3>
            <section className="modal-c-buttons">
              <button
                className="registrar-c-btn"
                onClick={() => {
                  navigate(`/productos/${codigoEscaneado}/2`);
                }}
              >
                Registrar
              </button>
              <button
                className="cancelar-c-btn"
                onClick={() => cerrarModalEscaneo()}
              >
                Cancelar
              </button>
            </section>
          </aside>
        )}
      </div>
    </>
  );
};
