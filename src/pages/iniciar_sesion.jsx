// Imports Base

import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/iniciar_sesion.css"
import logoSoftcare from "../images/logo_softcare.png"
import disenoPrincipal from "../images/diseno_principal.png"
import flecha from "../images/flecha_salir.png"

// Componentes
import { Footer } from '../components/Footer'

export const IniciarSesion = () => {
    const [correo,setcorreo]= useState("")
    const [contrasena,setcontrasena]= useState("")
    const [modalActiva, setModalActiva] = useState(null);
    const navigate = useNavigate();

    const abrirModal = (num) => setModalActiva(num);
    const cerrarModal = () => setModalActiva(null);

    const iniciarSesion = async(e) => {
        e.preventDefault();

        const respuesta = await fetch("http://localhost/Ceibasoftcare/backend/api/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo,
                contrasena: contrasena
            })
        })
        const data = await respuesta.json();

        if (data.status === "success") {
            navigate("/inicio");
        } else {
            alert(data.mensaje);
        }
    }
  return (
    <>
        <head>
            <title>Iniciar Sesión - Softcare</title>
        </head>
        <main className='main-inicio-de-sesion'>
            <section className="area-grafica">
                <figure className="logo-softcare">
                    <img className="logo-softcare-img" src={logoSoftcare} alt=""/>
                </figure>
                <figure className="diseno-principal">
                    <img className="diseno-principal-img" src={disenoPrincipal} alt=""/>
                </figure>
            </section>
            <aside className="inicio-sesion-vertical-navbar">
                <h1 className="titulo-inicio-sesion">Ingrese los siguientes datos y acceda a la plataforma</h1>
                <form className="iniciar-sesion-form" onSubmit={iniciarSesion}>
                    <label className="iniciar-sesion-label" htmlFor="correo">Correo Electrónico</label>
                    
                    <input className="iniciar-sesion-input1" type="text" placeholder="ejemplo@email.com" name="correo" value={correo} onChange={(e) => setcorreo(e.target.value)}/>
        
                    <label className="iniciar-sesion-label" htmlFor="contrasena">Contraseña</label>
                    <input className="iniciar-sesion-input2" type="password" placeholder="Contraseña123" name="contrasena" value={contrasena} onChange={(e) => setcontrasena(e.target.value)}/>
                    <a className="olvido-contra" href="" onClick={(e) => {e.preventDefault(); abrirModal(1);}}>¿Olvidó su contraseña?</a>
                    
                    <input className="iniciar-sesion-btn" type="submit" value="Ingresar"/>
                </form> 
            </aside>
        </main>
        <Footer style={{ color: "#212121" }} />
        <div className="modales-iniciar-sesion" style={{display: modalActiva ? 'block' : 'none'}}> {/* ESTE DIV LO TUVE QUE AÑADIR PARA QUE FUNCIONEN LOS ESTILOS SRRY (Contiene las 3 modales) */}
            {modalActiva === 1 && (
            <aside className="modal-recuperar-contrasena mdc1" onClick={(e)=>e.stopPropagation()}>
                <a href="#" onClick={(e) => { e.preventDefault(); cerrarModal(); }}>
                    <img className="volver-icono" src={flecha} alt=""/>
                    <h2>Volver</h2>
                </a>
                <section className="modal-rc-area">
                    <h1 className="modal-rc-titulo">Recuperar contraseña - 1er paso</h1>
                    <h3 className="modal-rc-mensaje">Le enviaremos un código al correo electrónico con el que está registrado en el sistema.</h3>
                    <form className="rc-form" onSubmit={(e) => { e.preventDefault(); abrirModal(2) }}>
                        <label className="rc-label" for="">Correo electrónico</label>
                        <input className="rc-input1" type="text" placeholder="ejemplo@email.com" name="rc-correo"/>
                        <input className="rc-btn" type="submit" value="Enviar Código" />
                    </form> 
                </section>
            </aside>
            )
            }
            {modalActiva === 2 && (
            <aside className="modal-recuperar-contrasena mdc2">
                <a href="">
                    <img className="volver-icono" src={flecha} alt=""/>
                    <h2>Volver</h2>
                </a>
                <section className="modal-rc-area">
                    <h1 className="modal-rc-titulo">Recuperar contraseña - 2do paso</h1>
                    <h3 className="modal-rc-mensaje">Por favor, digite a continuación el código que le enviamos a su correo, si no lo encuentra, revise la carpeta de Spam.</h3>
                    <form className="rc-form" onSubmit={(e) => { e.preventDefault(); abrirModal(3) }}>
                        <label className="rc-label" for="">Código</label>
                        <input className="rc-input2" maxLength="5" type="text" name="rc-codigo"/>
                        <input className="rc-btn" type="submit" value="Siguiente" />
                    </form> 
                </section>
            </aside>
            )}
            {modalActiva === 3 && (
            <aside className="modal-recuperar-contrasena mdc3">
                <a href="">
                    <img className="volver-icono" src={flecha} alt=""/>
                    <h2>Volver</h2>
                </a>
                <section className="modal-rc-area">
                    <h1 className="modal-rc-titulo">Recuperar contraseña - 3er paso</h1>
                    <h3 className="modal-rc-mensaje">El código digitado es correcto. Digite una nueva contraseña segura y fácil de recordar.</h3>
                    <form className="rc-form" onSubmit={(e) => { e.preventDefault(); cerrarModal(); }}>
                                <label className="rc-label">Nueva Contraseña</label>
                                <input className="rc-input4" type="password" />
                                <label className="rc-label">Confirmar Contraseña</label>
                                <input className="rc-input4" type="password" />
                                <input className="rc-btn" type="submit" value="Cambiar Contraseña" />
                    </form>
                </section>
            </aside>
            )}
        </div>
    </>
  )
}
