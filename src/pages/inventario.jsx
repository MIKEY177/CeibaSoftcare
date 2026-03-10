import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MenuAdminFarmacia } from "../utils/menu.jsx"

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/inventario.css"
import editarIcon from "../images/icons/editar.png"
import eliminarIcon from "../images/icons/eliminar.png"
import lupaBusqueda from "../images/lupa_busqueda.png"
import barrasBusqueda from "../images/codigo_barras.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const API = "http://localhost/Ceibasoftcare/backend/api/inventario.php";

export const indexSelector = 2;

export const Inventario = () => {
  const [user, setUser] = useState({ nombre: "", rol: "" });
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [modalActiva, setModalActiva] = useState(null);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [formRegistrar, setFormRegistrar] = useState({
    nombre: "", 
    descripcion: "", 
    tipo_medida: "",
  });
  const [formEditar, setFormEditar] = useState({
    nombre: "", 
    descripcion: "", 
    tipo_medida: "",
  });

  const [busqueda, setBusqueda] = useState("");

  // ─── Helpers ────────────────────────────────────────────────────────────────

  const abrirModal = (num, producto = null) => {
    setErrores({});
    setMensajeExito("");
    setProductoSeleccionado(producto);
    if (num === 2 && producto) {
      setFormEditar({
        nombre:      producto.nombre      ?? "",
        descripcion: producto.descripcion ?? "",
        tipo_medida: producto.tipo_medida ?? "",
        codigo_barras: producto.codigo_barras ?? "",
        cantidad_por_unidad: producto.cantidad_por_unidad ?? "",
      });
    }
    setModalActiva(num);
  };

  const cerrarModal = () => {
    setErrores({});
    setMensajeExito("");
    setModalActiva(null);
    setProductoSeleccionado(null);

    setFormRegistrar({ 
      nombre: "", 
      descripcion: "", 
      tipo_medida: "", 
      codigo_barras: "", 
      cantidad_por_unidad: "" 
    });

    setFormEditar({   
      nombre: "", 
      descripcion: "", 
      tipo_medida: "", 
      codigo_barras: "", 
      cantidad_por_unidad: "" 
    });
  };

  const cargarProductos = () => {
    fetch(API, { credentials: "include" })
      .then(res => res.json())
      .then(response => {
        if (response.success) setProductos(response.data);
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
    fetch("http://localhost/Ceibasoftcare/backend/api/session.php", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol });
          if (data.rol === "Veterinario") navigate("/farmacia");
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(() => navigate("/iniciar_sesion"));
  }, []);

  useEffect(() => { cargarProductos(); }, []);

  // ─── Menú ────────────────────────────────────────────────────────────────────

  const menuObj = (() => {
    switch (user.rol) {
      case "administrador": return MenuAdminFarmacia;
      case "farmacéutico":  return MenuAdminFarmacia;
      default:              return {};
    }
  })();

  // ─── Búsqueda ─────────────────────────────────────────────────────────────────

  const productosFiltrados = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.tipo_medida.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.codigo_barras.toLowerCase().includes(busqueda.toLowerCase())
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
          cargarProductos();
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
    enviar("PUT", { id_producto: productoSeleccionado.id_producto, ...formEditar }, "¡Producto actualizado correctamente!");
  };

  const handleEliminar = () => {
    enviar("DELETE", { id_producto: productoSeleccionado.id_producto }, "¡Producto desactivado correctamente!");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <head>
        <title>Inventario - Softcare</title>
      </head>
      <main>
        <Navbar user={user} menu={menuObj} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Productos</h2>
          <section className="seccion1-busqueda-agregar">
            <form className="busqueda-form" onSubmit={handleBusqueda}>
              <input className="busqueda-input1" type="text" name="busqueda" placeholder="Busca un producto" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}/>
              <button className="busqueda-icono" type="submit">
                <img className="busqueda-icono-img" src={lupaBusqueda} alt="" />
              </button>
              <figure className="busqueda-barras-icono" style={{ cursor: "pointer" }}>
                <img className="busqueda-barras-icono-img" src={barrasBusqueda} alt="" />
              </figure>
            </form>
            <button className="registrar-btn" onClick={() => abrirModal(1)}>
              Registrar Producto
            </button>
          </section>

          <table className="tabla-inventario">
            <thead className="header-tabla-inventario">
              <tr>
                <td>Producto</td>
                <td>Descripción</td>
                <td>Cantidad por unidad</td>
                <td>Registró</td>
                <td>Editar | Desactivar</td>
              </tr>
            </thead>
            <tbody className="body-tabla-inventario">
              {productosFiltrados.length === 0 ? (
                <tr><td colSpan="6">{busqueda ? "No se encontraron productos que coincidan." : "No hay productos registrados."}</td></tr>
                ) : (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id_producto}>
                    <td>{producto.nombre}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.cantidad_por_unidad} {producto.tipo_medida}</td>
                    <td>{producto.nombre_usuario}</td>
                    <td>
                      <figure className="editar-icono" onClick={() => abrirModal(2, producto)} style={{ cursor: "pointer" }}>
                        <img className="editar-icono-img" src={editarIcon} alt="Editar" />
                      </figure>
                      <figure className="eliminar-icono" onClick={() => abrirModal(3, producto)} style={{ cursor: "pointer" }}>
                        <img className="eliminar-icono-img" src={eliminarIcon} alt="Eliminar" />
                      </figure>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
      <Footer />

      {/* ── Modales ── */}
      <div className="modales-inventario" style={{ display: modalActiva ? 'block' : 'none' }}>

        {/* ── Modal 1: Registrar ── */}
        {modalActiva === 1 && (
          <aside className="modal-inventario-registrar">
            <button className="volver-btn" onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ir-titulo">Registre un nuevo Producto</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
            {errores.sesion  && <p style={{ color: "red" }}>{errores.sesion}</p>}

            <form className="ir-form" onSubmit={handleRegistrar}>
              <section className="ir-form-inputs-area">

                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ir-label">Código de barras <h6 className="obligatorio">*</h6></label>
                  <input className="ir-input1" type="text"
                    value={formRegistrar.codigo_barras} onChange={e => setFormRegistrar({ ...formRegistrar, codigo_barras: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                  {errores.codigo_barras && <span className="error-mensaje">{errores.codigo_barras}</span>}
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ir-label">Nombre del Producto <h6 className="obligatorio">*</h6></label>
                  <input className="ir-input4" type="text"value={formRegistrar.nombre} onChange={e => setFormRegistrar({ ...formRegistrar, nombre: e.target.value })}/>
                  {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ir-label">Descripción del Producto</label>
                  <textarea className="ir-input2"
                    value={formRegistrar.descripcion} onChange={e => setFormRegistrar({ ...formRegistrar, descripcion: e.target.value })}/>
                  {errores.descripcion && <span className="error-mensaje">{errores.descripcion}</span>}
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ir-label">Tipo de Medida <h6 className="obligatorio">*</h6></label>
                  <select className="ir-input5" value={formRegistrar.tipo_medida} onChange={e => setFormRegistrar({ ...formRegistrar, tipo_medida: e.target.value })}>
                    <option value="">-- Selecciona --</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unidad">Unidad</option>
                  </select>
                  {errores.tipo_medida && <span className="error-mensaje">{errores.tipo_medida}</span>}
                </div>

                <div className="label-and-input-container" style={{ gridArea: "divInpt6" }}>
                  <label className="ir-label">Usuario que Registra</label>
                  <div className="union-input-icono">
                    <input className="ir-input6" type="text" value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>

                <div className="label-and-input-container" style={{ gridArea: "divInpt3" }}>
                  <label className="ir-label">Cantidad por unidad <h6 className="obligatorio">*</h6></label>
                  <div className="union-input-icono">
                    <input className="ir-input3" type="text"
                    value={formRegistrar.cantidad_por_unidad} onChange={e => setFormRegistrar({ ...formRegistrar, cantidad_por_unidad: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                  </div>
                </div>
              </section>
              <input className="ir-btn" type="submit" value={cargando ? "Registrando..." : "Registrar Producto"} disabled={cargando} />
            </form>
          </aside>
        )}

        {/* ── Modal 2: Editar ── */}
        {modalActiva === 2 && (
          <aside className="modal-inventario-editar">
            <button className="volver-btn" onClick={cerrarModal} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
            <h1 className="modal-ied-titulo">Editar Producto Registrado</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <form className="ied-form" onSubmit={handleEditar}>
              <section className="ied-form-inputs-area">
                <div style={{ gridArea: "divInpt1" }}>
                  <label className="ied-label">Código de Barras <h6 className="obligatorio">*</h6></label>
                  <input className="ied-input1" type="text"
                    value={formEditar.codigo_barras} onChange={e => setFormEditar({ ...formEditar, codigo_barras: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                  {errores.codigo_barras && <span className="error-mensaje">{errores.codigo_barras}</span>}
                </div>

                <div style={{ gridArea: "divInpt4" }}>
                  <label className="ied-label">Nombre del Producto <h6 className="obligatorio">*</h6></label>
                  <input className="ied-input4" type="text"
                    value={formEditar.nombre} onChange={e => setFormEditar({ ...formEditar, nombre: e.target.value })}/>
                  {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
                </div>

                <div style={{ gridArea: "divInpt2" }}>
                  <label className="ied-label">Descripción del Producto</label>
                  <textarea className="ied-input2"
                    value={formEditar.descripcion} onChange={e => setFormEditar({ ...formEditar, descripcion: e.target.value })}/>
                  {errores.descripcion && <span className="error-mensaje">{errores.descripcion}</span>}
                </div>

                <div style={{ gridArea: "divInpt5" }}>
                  <label className="ied-label">Tipo de Medida <h6 className="obligatorio">*</h6></label>
                  <select className="ied-input5" value={formEditar.tipo_medida} onChange={e => setFormEditar({ ...formEditar, tipo_medida: e.target.value })}>
                    <option value="">-- Selecciona --</option>
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="L">L</option>
                    <option value="unidades">Unidades</option>
                  </select>
                  {errores.tipo_medida && <span className="error-mensaje">{errores.tipo_medida}</span>}
                </div>

                <div className="label-and-input-container" style={{ gridArea: "divInpt6" }}>
                  <label className="ied-label">Usuario que Registra</label>
                  <div className="union-input-icono">
                    <input className="ied-input6" type="text" value={user.nombre} readOnly />
                    <figure className="candado-icono">
                      <img className="candado-icono-img" src={campoRestringido} alt="" />
                    </figure>
                  </div>
                </div>

                <div className="label-and-input-container" style={{ gridArea: "divInpt3" }}>
                  <label className="ied-label">Cantidad por unidad <h6 className="obligatorio">*</h6></label>
                  <div className="union-input-icono">
                    <input className="ied-input3" type="text"
                    value={formEditar.cantidad_por_unidad}
                    onChange={e => setFormEditar({ ...formEditar, cantidad_por_unidad: e.target.value })} onKeyDown={e => { if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {e.preventDefault();}}}/>
                  </div>
                   {errores.cantidad_por_unidad && <span className="error-mensaje">{errores.cantidad_por_unidad}</span>}
                </div>
              </section>
              <input className="ied-btn" type="submit" value={cargando ? "Guardando..." : "Realizar Cambios"} disabled={cargando} />
            </form>
          </aside>
        )}

        {/* ── Modal 3: Eliminar ── */}
        {modalActiva === 3 && (
          <aside className="modal-inventario-eliminar">
            <h1 className="modal-iel-titulo">Desactivar Producto Registrado</h1>

            {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
            {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

            <h3 className="modal-iel-mensaje">
              ¿Desea desactivar&nbsp;
              <span className="subrayar">{productoSeleccionado?.nombre}</span>?
            </h3>
            <section className="modal-buttons">
              <button className="eliminar-btn" onClick={handleEliminar} disabled={cargando}>
                {cargando ? "Desactivando..." : "Desactivar"}
              </button>
              <button className="cancelar-btn" onClick={cerrarModal}>Cancelar</button>
            </section>
          </aside>
        )}

      </div>
    </>
  );
};
