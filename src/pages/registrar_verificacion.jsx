import React from 'react'

import { Navbar } from '../components/Navbar.jsx'
import { Footer } from '../components/Footer.jsx'
import { Menu } from '../components/Menu.jsx'
import { MenuVeterinario } from '../utils/menu';

import "../styles/global_styles.css"
import "../styles/verificaciones.css"

export const indexSelector = 6;

export const RegistrarVerificacion = () => {
    return (
        <>
            <head>
                <title>Registrar Verificación - Softcare</title>
            </head>
            <main className='main-registrar-verificacion'>
                <Navbar menu={MenuVeterinario} />
                <section className="secciones-area-gestion">
                    <h1 className='titulo-registrar-verificacion'>Registrar Verificación</h1>
                    <form action="" className="form-verificaciones">
                        <div className="content-form">
                            <label className="ied-label" for="">Tipo de Verificación<h6 className="obligatorio">*</h6></label>
                            <select className="ied-select" name="" id="">
                                <option value=""></option>
                            </select>
                        </div>
                        <div className="content-form">
                            <label className='ied-label'>Animal <h6 className='obligatorio'>*</h6></label>
                            <select name="" id="" className="ied-select">
                                <option value=""></option>
                            </select>
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className='ied-label'>Fecha de Verificación <h6 className="obligatorio">*</h6></label>
                            <input type="date" className='ied-input' />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Tipo de Código <h6 className="obligatorio">*</h6></label>
                            <select name="" id="" className="ied-select">
                                <option value=""></option>
                            </select>
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Código <h6 className="obligatorio">*</h6></label>
                            <input type="number" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Propietario <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Identificación propietario <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Contacto propietario <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Correo propietario <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className="ied-label">Dirección propietario <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                            <label htmlFor="" className="ied-label">Responsable de Verificación <h6 className="obligatorio">*</h6></label>
                            <input type="text" className="ied-input" />
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className='ied-label'>Registro fotografico <h6 className="obligatorio">*</h6></label>
                            <div className="registro-ft">
                                <input type="text" className="epr-input2 registro-fotografico" placeholder='Subir imagen'/>
                            </div>
                        </div>
                        <div className="content-form">
                            <label htmlFor="" className='ied-label'>Descripción <h6 className="obligatorio">*</h6></label>
                            <textarea className='epr-input2'></textarea>
                        </div>
                        <input type='submit' className="btn-registrar-verificacion" value="Registrar Verificación" />
                    </form>
                </section>
            </main>
            <Footer />
        </>
    )
}