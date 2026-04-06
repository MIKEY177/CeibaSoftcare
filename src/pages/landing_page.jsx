import { Link } from 'react'
import '../styles/global_styles.css'
import logo from '../images/softcare_logo_blanco.png'
import img_hero from '../images/image-hero.png'
import img_about from '../images/image-about.png'
import logo_ceiba from '../images/ceiba_logo.png'
import logo_ceibasoftcare from '../images/softcare_logo.png'

export const LandingPage = () => {
    return (
        <main>
            <header className="header">
                <nav className="navbar">
                    <figure className="content-logo">
                        <img src={logo} alt="Logo Ceiba SoftCare" />
                        <h2>Ceiba SoftCare</h2>
                    </figure>
                    <ul>
                        <li><a href="#about">Nosotros</a></li>
                        <li><a href="#functions">Funciones</a></li>
                        <li><a href="#contact">Contactenos</a></li>
                        <li><a href="#" className="nav-btn-iniciar"><button>Iniciar Sesión</button></a></li>
                    </ul>
                </nav>
            </header>
            <section className="hero-section">
                <article className="content-hero">
                    <h1>Bienvenido a Ceiba SoftCare</h1>
                    <div className="separator-hero"></div>
                    <p className="text-hero">Solución integral para el albergue Ceiba, gestionando y organizando de manera
                        eficiente el cuidado de nuestros animales.
                    </p>
                    {/* <a href="#" class="btn-iniciar"><button>Iniciar Sesión</button></a> */}
                </article>
                <figure className="image-hero">
                    <img src={img_hero} alt="Imagen Hero Section" />
                </figure>
            </section>
            <section className="about" id='about'>
                <figure className="img-about">
                    <img src={img_about} alt="Imagen Sobre Nosotros" />
                </figure>
                <article className="content-about">
                    <h1>Sobre nosotros</h1>
                    <div className="separator-about"></div>
                    <p className="text-about">Somos el Centro Integral de Bienestar Animal CEIBA, trabajamos por los caninos y felinos más
                        vulnerables de las áreas urbanas y rurales de nuestro municipio. Fomentamos la tenencia responsable
                        de animales de compañía y semovientes como vacas, caballos, burros entre otros.
                    </p>
                </article>
            </section>
            <section className="functions" id='functions'>
                <h1>Principales Funciones</h1>
                <p className="text-functions">Solución completa para la gestion de productos veterinarios y animales.</p>
                <section className="cards-functions">
                    <article className="content-card">
                        <h3>Registro y Gestión de Animales</h3>
                        <p className="text-card-function">Administra ingresos y salidas de animales.</p>
                    </article>
                    <article className="content-card">
                        <h3>Farmacia e Inventario</h3>
                        <p className="text-card-function">Control de los productos veterinarios y suministros.</p>
                    </article>
                    <article className="content-card">
                        <h3>Historias Clínicas</h3>
                        <p className="text-card-function">Historial medico de cada animal.</p>
                    </article>
                </section>
            </section>
            <section className="contact" id='contact'>
                <h1>Contactanos</h1>
                <p className="text-contact">Conozca acá todas nuestras rutas de atención </p>
                <table>
                    <thead>
                        <tr>
                            <th className="tipo">Tipo de Ruta</th>
                            <th>Linea de Contacto</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Apoyo en búsqueda de animales de compañía perdidos o búsqueda de sus propietarios.</td>
                            <td className="line-contact">WhatsApp 3228201944</td>
                        </tr>
                        <tr>
                            <td>Animales en situación de calle y en condición de vulnerabilidad que requiran atención
                                medico
                                veterinaria.</td>
                            <td className="line-contact">3105613104</td>
                        </tr>
                        <tr>
                            <td>Rescate de animales en situación de riesgo atrapados en infraestructuras, rios,
                                incendios,
                                entre otros.</td>
                            <td className="line-contact">Cuerpo de Bomberos 3108317797</td>
                        </tr>
                        <tr>
                            <td>Emergencias con fauna silvestre </td>
                            <td className="line-contact">WhatsApp de Cornare 3217811388</td>
                        </tr>
                        <tr>
                            <td className='final-td'>Casos de maltrato donde cuentas con las pruebas de los hechos.</td>
                            <td className="line-contact final-td">Dirígete a la inspección de Policia más cercana o al correo
                                atencionusuario@rionegro.gov.co
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
            <footer>
                <p>© Derechos Reservados.</p>
                <section className="asociaciones">
                    <div className="softcare">
                        <figure className="softcare-logo">
                            <img className="softcare-logo-img" src={logo_ceiba} alt="" />
                        </figure>
                        <h6 className="softcare-titulo">Ceiba</h6>
                    </div>
                    <div className="ceiba">
                        <figure className="ceiba-logo">
                            <img className="ceiba-logo-img" src={logo_ceibasoftcare} alt="" />
                        </figure>
                        <h6 className="ceiba-titulo">SoftCare</h6>
                    </div>
                </section>
            </footer>
        </main>
    )
}
