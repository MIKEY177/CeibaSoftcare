// Imports Base
import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { MenuAdmin, MenuAdminFarmacia, MenuAdminAlbergue, MenuFarmaceutico, MenuVeterinario } from "../utils/menu.jsx"
import Avatar from 'react-avatar';
import Cropper from "react-easy-crop";

// Estilos e imágenes
import "../styles/global_styles.css"
import "../styles/ajustes.css"
import editarIcon from "../images/icons/editar.png"
import subirIcon from "../images/subir.png"
import campoRestringido from "../images/candado.png"
import flecha from "../images/flecha_salir.png"
import pfpPlaceholder from "../../images/pfp_placeholder.png"

// Componentes
import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Menu } from '../components/Menu.jsx'
import { getColorFromName } from '../utils/initial_colors.jsx';

// const API = `api/inventario.php`;
const API_SESSION = `api/session.php`;
const API_USER = `api/ajustes.php`;
export const indexSelector = 6;

export const Ajustes = () => {
  const [user, setUser] = useState(null);
  const [userajustes, setUserAjustes] = useState(null);
  const [file, setFile] = useState(null);
  const [abri, setAbri] = useState(false);
  const [modalId, setModalId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [mostrarCropper, setMostrarCropper] = useState(false);
  const [previewCropped, setPreviewCropped] = useState(null);
  const [errores, setErrores] = useState({});
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [correoNuevo, setCorreoNuevo] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [confirmarContrasenaNueva, setConfirmarContrasenaNueva] = useState("");
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const enviandoRef = useRef(false);

  const cargarSesion = async () => {
    fetch(API_SESSION, {
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === "ok") {
          setUser({ nombre: data.usuario, rol: data.rol, foto_perfil: data.foto_perfil });
        } else {
          navigate("/iniciar_sesion");
        }
      })
      .catch(error => {
        console.error("Error al verificar sesión:", error);
        navigate("/iniciar_sesion");
      });
  };

  const cargarUsuario = async () => {
    try {
      const response = await fetch(API_USER, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.status === "ok") {
        setUserAjustes(data);
      }
    } catch (error) {
      console.error("Error al cargar usuario:", error);
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFile(file);
  const url = URL.createObjectURL(file);
  setPreview(url);

  setMostrarCropper(true); 
  };

  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";

    await new Promise((resolve) => {
      image.onload = resolve;
    });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

    
  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
  setCroppedAreaPixels(croppedAreaPixels);

  const croppedImage = await getCroppedImg(preview, croppedAreaPixels);
    setPreviewCropped(URL.createObjectURL(croppedImage)); 
  };

  

  useEffect(() => {
    cargarUsuario()
    cargarSesion()
  }, []);

  

  const AbrirModal = (modalId) => {
    setAbri(true);
    setModalId(modalId);
    if (modalId === 1) {
      setNombre(userajustes.usuario); 
    }

  };

  const CerrarModal = () => {
      setErrores({});
      setLoadingCodigo(false);
      setAbri(false);
      setModalId(null);

      setFile(null);
      setPreview(null);
      setPreviewCropped(null);

      setMostrarCropper(false);

      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setNombre("");
      setCorreo("");
      setCorreoNuevo("");
      setContrasenaActual("");
      setContrasenaNueva("");
      setConfirmarContrasenaNueva("");
  };

  const enviar = (method, body, mensajeOk) => {
    if (enviandoRef.current) return;  
    enviandoRef.current = true;
    setLoadingCodigo(true);
    setErrores({});
    fetch(API_USER, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === "ok") {
        mostrarExito(mensajeOk);
      } else {
        setErrores(response.errores ?? { general: "Error desconocido." });
        setLoadingCodigo(false);
      }
    })
    .catch(() => setErrores({ general: "Error de conexión con el servidor." }))
    .finally(() => {
      enviandoRef.current = false; 
    });
    
  };

 

  const subirImagen = async (e) => {
    e.preventDefault();
    setLoadingCodigo(true);
    if (!preview || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(preview, croppedAreaPixels);

    const formData = new FormData();
    formData.append("file", croppedBlob, "perfil.jpg");

    const res = await fetch(API_USER, {
      method: "POST",
      body: formData, 
      credentials: "include"
    });
      
        
    const data = await res.json();
    console.log(data);

      if (data.status === "ok") {
        mostrarExito("Imagen de perfil actualizada con éxito");
        setMostrarCropper(false);
      }else{
        setMensajeExito("");
        setErrores({ general: "Error al subir la imagen. Intenta nuevamente." });

      }
  };


  const menuObj = {
    "administrador": MenuAdmin,
    "veterinario": MenuVeterinario,
    "farmaceutico": MenuFarmaceutico,
    "albergue": MenuAdminAlbergue,
    "farmacia": MenuAdminFarmacia
  }[user?.rol] || MenuAdmin; 
    
  const username = userajustes?.usuario; 
  const { bg, fg } = getColorFromName(username);  

  const mostrarExito = (msg) => {
    setMensajeExito(msg);
    cargarUsuario(); 
    cargarSesion();
    setTimeout(() => {
      CerrarModal();
      setMensajeExito(""); 
    }, 1500); 
  };
  return (
    <>
      <Helmet>
          <title>Ajustes - Softcare</title>
      </Helmet>
      <main>
        <Navbar menu={menuObj} user={user} />
        <section className="secciones-area-gestion">
          <h2 className="titulo-dashboard">Ajustes e Información del Usuario</h2>
          <section className='seccion1-ajustes'>
            <label className='user-info-avatar' style={{ gridArea: "avatar" }}>
              <figure className="avatar-ajustes" style={{ width: "220px", height: "220px" }}>
                {userajustes?.foto_perfil == null || userajustes?.foto_perfil === undefined ? (
                  <Avatar className="avatar-img-ajustes" name={userajustes?.usuario} size="100%" style={{ width: "100%", height: "100%" }} color={bg} fgColor={fg}  />
                ) : (
                  <img className="avatar-img-ajustes" src={userajustes.foto_perfil} alt="Foto de Perfil" />)} 
                  
              </figure>
              <h4>Imágen de Perfil</h4>
              <figure className="editar-ajustes" onClick={() => AbrirModal(5)}>
                <img className="editar-ajustes-img" src={editarIcon} alt="" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "nombre" }}>
              <h3>Nombre:&nbsp;</h3>
              <h4>{userajustes?.usuario}</h4>
              <figure className="editar-icono-ajus" onClick={() => AbrirModal(1)}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "correo" }}>
              <h3>Correo:&nbsp;</h3>
              <h4>{userajustes?.correo}</h4>
              <figure className="editar-icono-ajus" onClick={() => AbrirModal(2)}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "contrasena" }}>
              <h3>Contraseña:&nbsp;</h3>
              <h4>••••••••</h4>
              <figure className="editar-icono-ajus" onClick={() => AbrirModal(3)}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure>
            </label>
            <label className='user-info' style={{ gridArea: "rol" }}>
              <h3>Rol Actual:&nbsp;</h3>
              <h4>{userajustes?.rol}</h4>
              {/* <figure className="editar-icono-ajus" onClick={''}>
                <img className="editar-icono-img" src={editarIcon} alt="Editar" />
              </figure> */}
              <figure className="candado-icono-ajus">
                <img className="candado-icono-img" src={campoRestringido} alt="" />
              </figure>
            </label>
          </section>
        </section>
      </main>
      <Footer />

      <div className="modales-ajustes" style={{display: abri ? "flex" : "none"}}>

        {/* modal #1 editar Nombres */}
        {modalId === 1 && (
        <aside className="modal-ajustes-editar1">
          <button className="volver-btn-ajus" onClick={CerrarModal}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Nombres
          </h1>

          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

          <form className="ajustes-form" onSubmit={(e) => {
            e.preventDefault();

            enviar(
              "PUT",
              { campo: "nombre", valor: nombre },
              "Nombre actualizado con éxito"
            );
          }}>
            <section className="ajustes-form-inputs-area1">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Nombres y Apellidos<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input1" type="text" value={nombre} onChange={(e)=>setNombre(e.target.value)} />
                <span className="error-mensaje">{errores.nombre ?? ""}</span>
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={loadingCodigo ? 'Enviando...' : 'Enviar'} disabled={loadingCodigo}  />
          </form>
        </aside>
          )}
        {/* modal #2 editar Correo */}
        {modalId === 2 && (
        <aside className="modal-ajustes-editar2">
          <button className="volver-btn-ajus" onClick={CerrarModal}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Correo
          </h1>
          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}

          <form className="ajustes-form" onSubmit={(e) => {
            e.preventDefault();

            enviar(
              "PUT",
              { campo: "correo", valor: correo, campo_2: "newcorreo", valor_2: correoNuevo },
              "Correo actualizado con éxito"
            );
          }}>
            <section className="ajustes-form-inputs-area2">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Correo Actual<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input2" type="text" value={correo} onChange={(e)=>setCorreo(e.target.value)} />
                <span className="error-mensaje">{errores.correo ?? ""}</span>
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ajustes-label" for="">Nuevo Correo<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input2" type="text" value={correoNuevo} onChange={(e)=>setCorreoNuevo(e.target.value)} />
                <span className="error-mensaje">{errores.newcorreo ?? ""}</span>
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={loadingCodigo ? 'Enviando...' : 'enviar'} disabled={loadingCodigo} />
          </form>
        </aside>
        )}
        {/* modal #3 editar Contraseña */}
        {modalId === 3 && (
        <aside className="modal-ajustes-editar3">
          <button className="volver-btn-ajus" onClick={CerrarModal}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Contraseña
          </h1>
          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores.general && <p style={{ color: "red" }}>{errores.general}</p>}
          <form className="ajustes-form" onSubmit={(e) => {
            e.preventDefault();

            enviar(
              "PUT",
              { campo: "contraseña", valor: contrasenaActual, campo_2: "newcontraseña", valor_2: contrasenaNueva, campo_3: "confirmarnewcontraseña", valor_3: confirmarContrasenaNueva },
              "Contraseña actualizada con éxito"
            );
          }}>
            <section className="ajustes-form-inputs-area3">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Contraseña Actual<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" value={contrasenaActual} onChange={(e)=>setContrasenaActual(e.target.value)} />
                <span className="error-mensaje">{errores.contraseña ?? ""}</span>
              </div>

              <div style={{ gridArea: "divInpt2" }}>
                <label className="ajustes-label" for="">Nueva Contraseña<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" value={contrasenaNueva} onChange={(e)=>setContrasenaNueva(e.target.value)} />
                <span className="error-mensaje">{errores.newcontraseña ?? ""}</span>
              </div>

              <div style={{ gridArea: "divInpt3" }}>
                <label className="ajustes-label" for="">Confirmar Contraseña Nueva<h6 className="obligatorio">*</h6></label>
                <input className="ajustes-input3" type="password" value={confirmarContrasenaNueva} onChange={(e)=>setConfirmarContrasenaNueva(e.target.value)} />
                <span className="error-mensaje">{errores.confirmarnewcontraseña ?? ""}</span>
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={loadingCodigo?'enviando...':'enviar'} disabled={loadingCodigo} />
          </form>
        </aside>
        )}
        {/* modal #4 editar Rol */}
        {/* <aside className="modal-ajustes-editar4">
          <button className="volver-btn-ajus" onClick={''}>
            <img className="volver-icono" src={flecha} alt="" />
            <h2>Volver</h2>
          </button>
          <h1 className="modal-ajustes-titulo">
            Editar Rol del Usuario
          </h1>


        </aside> */}

        {/* modal #5 editar Correo */}
        {modalId === 5 && (
          <aside className="modal-ajustes-editar5">
            <button className="volver-btn-ajus" onClick={CerrarModal}>
              <img className="volver-icono" src={flecha} alt="" />
              <h2>Volver</h2>
            </button>
          <h1 className="modal-ajustes-titulo">
            Editar Imágen de Perfil
          </h1>
          {mensajeExito    && <p style={{ color: "green", fontWeight: "bold" }}>{mensajeExito}</p>}
          {errores?.general && <p style={{ color: "red" }}>{errores.general}</p>}
          <form className="ajustes-form-img-file" onSubmit={(e) =>subirImagen(e)}>
            <section className="ajustes-form-inputs-area5">

              <div style={{ gridArea: "divInpt1" }}>
                <label className="ajustes-label" for="">Subir Foto de Perfil<h6 className="obligatorio">*</h6></label>
                
               

                  {mostrarCropper && preview ? (
                        <>
                        <div style={{ position: "relative", width: "100%", height: 500 }}>
                          <Cropper
                            image={preview}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            cropShape="round"
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                            style={{ width: "100%", height:"100%" }}
                          />
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(e.target.value)}
                            className='slider-zoom'
                          /> 
                          </>
                      ) : (
                   <label className="ajustes-input5">
                  <label className="ajustes-input5-form" for="file">
                  
                      {previewCropped ? (
                        <figure className="subir-icono-ajus">
                          <img
                            src={previewCropped}
                            className='subir-icono-img'
                            style={{ maxHeight: 115 }}
                          />
                        </figure>
                      ) : (
                        <>
                          <figure className="subir-icono-ajus">
                            <img className="subir-icono-img" src={subirIcon} alt="Editar" />
                          </figure>
                          <h5>Seleccionar Archivo...</h5>
                        </>
                      )}
                    
                    
                    <input className="ajustes-input5-file-input" type="file" accept="image/*" id="file"  onChange={(e) => handleFileChange(e)} disabled={loadingCodigo}/>
                  </label>


                  </label>
                      )}
                      
                
              </div>

            </section>
            <input className="ajustes-btn" type="submit" value={loadingCodigo?'enviando...':'enviar'} disabled={loadingCodigo} />
          </form>
        </aside>
        )}



      </div>
    </>
  )};
