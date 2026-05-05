import {
  MenuAdmin,
  MenuAdminFarmacia,
  MenuAdminAlbergue,
  MenuFarmaceutico,
  MenuVeterinario,
} from "../utils/menu.jsx";

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
        <section className="secciones-area-gestion">
          <section className="examenes-fisicos">
            <h2 className="titulo-dashboard">
              Historia Médica del Animal [id_animal]
            </h2>
            <section className="seccion1-fecha-agregar">
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
                    <button class="tabla-examenes-fisicos-btn">Ver Detalles</button>
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
    </>
  );
};
