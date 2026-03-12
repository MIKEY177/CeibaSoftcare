// Imports Base
import { Link } from "react-router-dom"

// Estilos

// Componentes

export const LandingPage = () =>{
    return(
        <>
            <p>This'll be the Landing Page, currently used for an easy Navegation to every Page</p>
            <Link to="/">Landing Page</Link><br/>
            <br/>
            <Link to="/iniciar_sesion">Inicio de Sesión</Link><br/>
            <br/>
            <Link to="/inicio">Inicio</Link><br/>
            <br/>
            <Link to="/farmacia">Farmacia</Link><br/>
            <br/>
            <Link to="/entradas_prod">Entradas Productos</Link><br/>
            <br/>
            <Link to="/detalles_entradas_prod">Detalles Entradas de Productos</Link><br/>
            <br/>
            <Link to="/productos">Productos</Link><br/>
            <br/>
        </>
    )
}