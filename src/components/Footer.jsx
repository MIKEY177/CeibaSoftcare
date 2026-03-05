// Imports Base
import React from 'react'
// import { Link } from 'react-router-dom'

// Estilos e imágenes
import "../styles/compsStyles/Footer.css"
import softcareLogo from "../images/ceiba_logo.png"
import ceibaLogo from "../images/softcare_logo.png"

export const Footer = (props) => {
  return (
    <>
    <footer {...props}>
        <p>© Derechos Reservados.</p>
        <section className="asociaciones">
            <div className="softcare">
                <figure className="softcare-logo">
                    <img className="softcare-logo-img" src={softcareLogo} alt=""/>
                </figure>
                <h6 className="softcare-titulo">SoftCare</h6>
            </div>
            <div className="ceiba">
                <figure className="ceiba-logo">
                    <img className="ceiba-logo-img" src={ceibaLogo} alt=""/>
                </figure>
                <h6 className="ceiba-titulo">Ceiba</h6>
            </div>
        </section>
    </footer>
    </>
  )
}
