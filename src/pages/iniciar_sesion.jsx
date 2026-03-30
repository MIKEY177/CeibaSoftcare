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
         const API_LOGIN = `api/login.php`;
         const API_REC = `api/recuperar.php`;
         const API_CODE= `api/verificar_codigo.php`;
         const API_PASS = `api/cambiar_password.php`;

        //Login
        const [correo,setcorreo]= useState("")
        const [contrasena,setcontrasena]= useState("")

        //Paso 1, 2, 3 recuperar contraseña
        const [correoRecuperar,setCorreoRecuperar] = useState("")
        const [nuevaPass,setNuevaPass] = useState("")
        const [confirmarPass,setConfirmarPass] = useState("")
        const [codigoIngresado, setCodigoIngresado] = useState("")

        //Modal
        const [modalActiva, setModalActiva] = useState(null);
        const navigate = useNavigate();

        const [errores, setErrores] = useState({})
        const [loadingCodigo, setLoadingCodigo] = useState(false);

        const abrirModal = (num) => {
            setErrores({})
            setModalActiva(num)
        }
        const cerrarModal = () => {
            setErrores({})
            setModalActiva(null);
        }

                const iniciarSesion = async(e) => {
                     e.preventDefault();
                    const nuevosErrores = {}
                    if (correo === "") {
                        nuevosErrores.correo = "❗El correo es obligatorio."
                    }
                    if (contrasena === "") {
                    nuevosErrores.contrasena = "❗La contraseña es obligatoria."
                    }
                    if (Object.keys(nuevosErrores).length > 0) {
                        setErrores(nuevosErrores)
                    return
                    }
                    const respuesta = await fetch(API_LOGIN, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        credentials: "include",
                        body:JSON.stringify({
                        correo: correo,
                        contrasena: contrasena
                        })
                    })
                    const data = await respuesta.json();
                    if (data.status === "success") {
                        navigate("/inicio");
                    } else {
                        setErrores({login: data.mensaje});
                    }
                }

                const enviarCodigo = async (e) => {
                    e.preventDefault()
                    if (correoRecuperar === "") {
                        setErrores({correoRecuperar: "❗El correo es obligatorio."})
                        return
                    }
                    setLoadingCodigo(true);
                    try {
                        const respuesta = await fetch(API_REC,{
                            method:"POST",
                            headers:{
                                "Content-Type":"application/json"
                            },
                            credentials: "include",
                            body: JSON.stringify({ correoModal: correoRecuperar }) 
                        })
                        const data = await respuesta.json()
                        if(data.success){
                            abrirModal(2)
                        }else{
                            setErrores({correoRecuperar: data.errors?.correoModal || data.error || "❗Error al enviar el código."})
                        }
                    } catch (error) {
                        setErrores({correoRecuperar: "❗No se pudo conectar al servidor."})
                    } finally {
                        setLoadingCodigo(false);
                    }
                }

                const verificarCodigo = async (e) => {
                    e.preventDefault()
                    const respuesta = await fetch(API_CODE, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include", 
                        body: JSON.stringify({ codigo: codigoIngresado })
                    });
                    const data = await respuesta.json()
                    if(data.success){
                        abrirModal(3)
                    }else{
                        setErrores({codigo: data.error})
                    }
                }
                const cambiarPassword = async (e) => {
                    e.preventDefault()

                    const respuesta = await fetch(API_PASS, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ nuevaPass, confirmarPass })
                    })
                    const data = await respuesta.json()
                    if (data.success) {
                        setErrores({})
                        cerrarModal()
                    } else {
                        setErrores(data.errors || { confirmarPass: data.error || "❗Error al cambiar la contraseña." })
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
                            {errores.contrasena && <span className="error-mensaje-iniciar-sesion1">{errores.contrasena}</span>}
                            {errores.login && <span className="error-mensaje-iniciar-sesion2">{errores.login}</span>}
                            {errores.correo && <span className="error-mensaje-iniciar-sesion3">{errores.correo}</span>}
                        <a className="olvido-contra" href="" onClick={(e) => {e.preventDefault(); abrirModal(1);}}>¿Olvidó su contraseña?</a>
                    
                        <input className="iniciar-sesion-btn" type="submit" value="Ingresar"/>
                    </form> 
                </aside>
            </main>
            <Footer style={{ color: "#212121" }} />
                <div className="modales-iniciar-sesion" style={{display: modalActiva ? 'flex' : 'none'}}>
                    {modalActiva === 1 && (
                        <aside className="modal-recuperar-contrasena mdc1" onClick={(e)=>e.stopPropagation()}>
                            <a href="#" onClick={(e) => { e.preventDefault(); cerrarModal(); }}>
                                <img className="volver-icono" src={flecha} alt=""/>
                                <h2>Volver</h2>
                            </a>
                            <section className="modal-rc-area">
                                <h1 className="modal-rc-titulo">Recuperar contraseña - 1er paso</h1>
                                <h3 className="modal-rc-mensaje">Le enviaremos un código al correo electrónico con el que está registrado en el sistema.</h3>
                                <form className="rc-form" onSubmit={enviarCodigo}>
                                    <label className="rc-label" htmlfor="correoRecuperar">Correo electrónico</label>
                                    <input className="rc-input1" type="text" id="correoRecuperar" placeholder="ejemplo@email.com" value={correoRecuperar} onChange={(e) => setCorreoRecuperar(e.target.value)} />
                                    {errores.correoRecuperar && <span className="error-mensaje-iniciar-sesion-mod1">{errores.correoRecuperar}</span>}
                                    <input
                                        className="rc-btn"
                                        type="submit"
                                        value={loadingCodigo ? "Enviando..." : "Enviar Código"}
                                        disabled={loadingCodigo}
                                    />
                                </form> 
                            </section>
                        </aside>
                    )}
                    {modalActiva === 2 && (
                        <aside className="modal-recuperar-contrasena mdc2">
                            <a href="#" onClick={(e) => {e.preventDefault(); cerrarModal();}}>
                                <img className="volver-icono" src={flecha} alt=""/>
                                <h2>Volver</h2>
                            </a>
                            <section className="modal-rc-area">
                                <h1 className="modal-rc-titulo">Recuperar contraseña - 2do paso</h1>
                                <h3 className="modal-rc-mensaje">Por favor, digite a continuación el código que le enviamos a su correo, si no lo encuentra, revise la carpeta de Spam.</h3>
                                <form className="rc-form" onSubmit={verificarCodigo}>
                                    <label className="rc-label" htmlfor="rc-codigo">Código</label>
                                    <input className="rc-input2" maxLength="8" type="text" value={codigoIngresado}  onChange={(e) => setCodigoIngresado(e.target.value)}  />
                                    {errores.codigo && <span className="error-mensaje-iniciar-sesion-mod2">{errores.codigo}</span>}
                                    <input className="rc-btn" type="submit" value="Siguiente" />
                                </form> 
                            </section>
                        </aside>
                    )}
                    {modalActiva === 3 && (
                        <aside className="modal-recuperar-contrasena mdc3">
                            <a href="#" onClick={(e) => { e.preventDefault(); cerrarModal(); }}>
                                <img className="volver-icono" src={flecha} alt=""/>
                                <h2>Volver</h2>
                            </a>
                            <section className="modal-rc-area">
                                <h1 className="modal-rc-titulo">Recuperar contraseña - 3er paso</h1>
                                <h3 className="modal-rc-mensaje">El código digitado es correcto. Digite una nueva contraseña segura y fácil de recordar.</h3>
                                <form className="rc-form" onSubmit={cambiarPassword}>
                                    <label className="rc-label">Nueva Contraseña</label>
                                    <input className="rc-input4" type="password" value={nuevaPass} onChange={(e) => setNuevaPass(e.target.value)} />
                                        {errores.nuevaPass && <span className="error-mensaje-iniciar-sesion-mod3">{errores.nuevaPass}</span>}
                                    <label className="rc-label">Confirmar Contraseña</label>
                                    <input className="rc-input4" type="password" value={confirmarPass} onChange={(e) => setConfirmarPass(e.target.value)} />
                                        {errores.confirmarPass && <span className="error-mensaje-iniciar-sesion-mod4">{errores.confirmarPass}</span>}
                                    <input className="rc-btn" type="submit" value="Cambiar Contraseña" />
                                </form>
                            </section>
                        </aside>
                    )}
                </div>
            </>
        )
    }
