// Imports Base
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { LandingPage } from './pages/landing_page'
import { Inicio } from './pages/inicio'
import { Farmacia } from './pages/farmacia'
import { IniciarSesion } from './pages/iniciar_sesion'

// Estilos
// import "./styles/main_style.css" NO DEBERÍA HABER NINGÚN ESTILO ACÁ

// Componentes

function App(){
    return(
    <>
        <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet"/>
        </head>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage/>}/>
                <Route path="/inicio" element={<Inicio/>}/>
                <Route path="/farmacia" element={<Farmacia/>}/>
                <Route path="/iniciar_sesion" element={<IniciarSesion/>}/>
            </Routes>
        </Router>
    </>
    ) 
}

export default App
