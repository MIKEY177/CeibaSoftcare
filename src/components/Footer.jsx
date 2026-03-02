// Imports Base
import React from 'react'
// import { Link } from 'react-router-dom'

// Estilos e imágenes
import "../styles/Footer.css"
import softcareLogo from "../images/ceiba_logo.png"
import ceibaLogo from "../images/softcare_logo.png"

export const Footer = () => {
  return (
    <>
    <footer>
        <p>© Derechos Reservados.</p>
        <section class="asociaciones">
            <div class="softcare">
                <figure class="softcare-logo">
                    <img class="softcare-logo-img" src={softcareLogo} alt=""/>
                </figure>
                <h6 class="softcare-titulo">SoftCare</h6>
            </div>
            <div class="ceiba">
                <figure class="ceiba-logo">
                    <img class="ceiba-logo-img" src={ceibaLogo} alt=""/>
                </figure>
                <h6 class="ceiba-titulo">Ceiba</h6>
            </div>
        </section>
    </footer>
    </>
  )
}
