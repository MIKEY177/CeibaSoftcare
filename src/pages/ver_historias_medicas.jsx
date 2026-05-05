import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

import flecha from "../images/flecha_salir.png";

import lupaBusqueda from "../images/lupa_busqueda.png";
import editarIcon from "../images/icons/editar.png";

import "../styles/global_styles.css";
import "../styles/ver_historias_medicas.css";

// Componentes
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx";
import { Menu } from "../components/Menu.jsx";

export const indexSelector = 6;

export const VerHistoriaMedicas = () => {
  return (
    <>
      <head>
        <title>Ver Historias Médicas - Softcare</title>
      </head>
      <main>
        <Navbar menu={MenuVeterinario} />
        <section className="secciones-area-gestion ver-historia-medica">
          <section className="examenes-fisicos">
            <h2 className="titulo-dashboard">
              Historia Médica del Animal [id_animal]
            </h2>
            <section className="seccion1-fecha-agregar seccion1-ver-historia-medica">
              <div className="fecha-creacion">
                <strong>Fecha de Creación: </strong>
                <p>{/*Fecha*/}[dd/mm/aaaa]</p>
              </div>
              <button className="registrar-btn" onClick={""}>
                Registrar Exámen Físico
              </button>
            </section>
            <table className="tabla-examenes-fisicos">
              <thead className="header-tabla-examenes-fisicos">
                <tr>
                  <td>Exámenes Físicos</td>
                </tr>
              </thead>
              <tbody className="body-tabla-examenes-fisicos">
                <td className="td-examenes-fisicos">
                  [dd/mm/aaaa]
                  <a href="">
                    <button class="tabla-examenes-fisicos-btn">
                      Ver Detalles
                    </button>
                  </a>
                </td>
              </tbody>
            </table>
          </section>
          <section className="eventos-clinicos">
            <h2 className="titulo-dashboard">Eventos Clínicos</h2>
            <section className="seccion1-busqueda-agregar-eventos-clinicos">
              <form className="busqueda-form" onSubmit={""}>
                <input
                  className="busqueda-input1"
                  type="text"
                  name="busqueda"
                  placeholder="Buscar un Evento Clínico"
                  value={""}
                />
                <button className="diff_busqueda-icono" type="submit">
                  <img
                    className="busqueda-icono-img"
                    src={lupaBusqueda}
                    alt=""
                  />
                </button>
              </form>
              <button className="registrar-btn" onClick={""}>
                Registrar Evento Clínico
              </button>
            </section>
            <table className="tabla-eventos-clinicos">
              <thead className="header-tabla-eventos-clinicos">
                <tr>
                  <td>Fecha</td>
                  <td>Descripción</td>
                  <td>Responsable</td>
                  <td>Editar</td>
                </tr>
              </thead>
              <tbody className="body-tabla-eventos-clinicos">
                <td>{/*Fecha*/}</td>
                <td>{/*Descripción*/}</td>
                <td>{/*Responsable*/}</td>
                <td>
                  <div className="last-td-flex-content-wrapper">
                    <figure className="editar-icono">
                      <img
                        className="editar-icono-img"
                        src={editarIcon}
                        alt="Editar"
                      />
                    </figure>
                  </div>
                </td>
              </tbody>
            </table>
          </section>
        </section>
      </main>
      <Footer />

      <div className="modales-historias-medicas-detalle">
        <aside className="modal-registrar-examen-fisico">
          <button className="volver-btn-ver-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">Registrar Exámen Físico</h1>

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="ar-label" for="">
                  {" "}
                  Historia Médica <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Frecuencia Cardiaca<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input2"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt4" }}>
                <label className="ar-label" for="">
                  Mucosa<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input4"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="ar-label" for="">
                  Tiempo de Llenado Capilar<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input4"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt5" }}>
                <label className="ar-label" for="">
                  Fecha<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input5"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt6" }}>
                <label className="ar-label" for="">
                  Frecuencia Respiratoria<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input6"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div
                className="label-and-input-container"
                style={{ gridArea: "divInpt7" }}
              >
                <label className="ar-label" for="">
                  Temperatura Rectal
                </label>
                <input className="ar-input6" type="text" value={""} readOnly />
              </div>

              <div style={{ gridArea: "divInpt8" }}>
                <label className="ar-label" for="">
                  Condición Corporal<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input6"
                  type="text"
                  value={""}
                  onChange={""}
                />
              </div>
            </section>
            <input
              className="ar-btn"
              type="submit"
              value="Registrar Exámen Físico"
            />
          </form>
        </aside>

        <aside className="modal-editar-examen-fisico">
          <button className="volver-btn-ver-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">Registrar Exámen Físico</h1>

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="ar-label" for="">
                  {" "}
                  Historia Médica <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Frecuencia Cardiaca<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input2"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt4" }}>
                <label className="ar-label" for="">
                  Mucosa<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input4"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="ar-label" for="">
                  Tiempo de Llenado Capilar<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input4"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt5" }}>
                <label className="ar-label" for="">
                  Fecha<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input5"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt6" }}>
                <label className="ar-label" for="">
                  Frecuencia Respiratoria<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input6"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div
                className="label-and-input-container"
                style={{ gridArea: "divInpt7" }}
              >
                <label className="ar-label" for="">
                  Temperatura Rectal
                </label>
                <input className="ar-input6" type="text" value={""} readOnly />
              </div>

              <div style={{ gridArea: "divInpt8" }}>
                <label className="ar-label" for="">
                  Condición Corporal<h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input6"
                  type="text"
                  value={""}
                  onChange={""}
                />
              </div>
            </section>
            <input className="ar-btn" type="submit" value="Guardar Cambios" />
          </form>
        </aside>

        <aside className="modal-registrar-evento-clinico">
          <button className="volver-btn-ver-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">Registrar Evento Clínico</h1>

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="ar-label" for="">
                  {" "}
                  Fecha <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Responsable <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input2"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{gridArea: "divInpt3"}}>
                  <label className="ar-label" for="">Motivo<h6 className="obligatorio">*</h6></label>
                  <textarea className="ar-input3" name="ar-observaciones" value={''} onChange={''}/>
                  {/* <span className="error-mensaje">{errores.descripcion ?? ""}</span> */}
                </div>

            </section>
            <input className="ar-btn" type="submit" value="Registrar Evento Clínico" />
          </form>
        </aside>
        
        <aside className="modal-editar-evento-clinico">
          <button className="volver-btn-ver-historias-medicas" onClick={""}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ar-titulo">Registrar Evento Clínico</h1>

          <form className="ar-form" onSubmit={""}>
            <section className="ar-form-inputs-area">
              <div style={{ gridArea: "divInpt1" }}>
                <label className="ar-label" for="">
                  {" "}
                  Fecha <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input1"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ar-label" for="">
                  Responsable <h6 className="obligatorio">*</h6>
                </label>
                <input
                  className="ar-input2"
                  type="text"
                  value={""}
                  onChange={""}
                />
                {/* <span className="error-mensaje">{errores.nombre ?? ""}</span> */}
              </div>

              <div style={{gridArea: "divInpt3"}}>
                  <label className="ar-label" for="">Motivo<h6 className="obligatorio">*</h6></label>
                  <textarea className="ar-input3" name="ar-observaciones" value={''} onChange={''}/>
                  {/* <span className="error-mensaje">{errores.descripcion ?? ""}</span> */}
                </div>

            </section>
            <input className="ar-btn" type="submit" value="Guardar Cambios" />
          </form>
        </aside>

      </div>
    </>
  );
};
