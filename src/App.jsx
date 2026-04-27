// Imports Base
import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { LandingPage } from './pages/landing_page.jsx'
import { Inicio } from './pages/inicio.jsx'
import { Farmacia } from './pages/farmacia.jsx'
import { IniciarSesion } from './pages/iniciar_sesion.jsx'
import { Productos } from './pages/productos.jsx'
import { EntradasProd } from './pages/entradas_prod.jsx'
import { SalidasProd } from './pages/salidas_prod.jsx'
import { Eventos } from './pages/eventos.jsx'
import { Animales } from './pages/animales.jsx'
import { Verificaciones } from './pages/verificaciones.jsx'
import { RegistrarVerificacion } from './pages/registrar_verificacion.jsx'
import { EditarVerificacion } from './pages/editar_verificacion.jsx'
import { SalidaAnimales } from './pages/salidas_animales.jsx'

function App() {
    return (
        <>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap" rel="stylesheet" />
            </head>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/inicio" element={<Inicio />} />
                    <Route path="/farmacia" element={<Farmacia />} />
                    <Route path="/iniciar_sesion" element={<IniciarSesion />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/entradas_prod" element={<EntradasProd />} />
                    <Route path="/salidas_prod" element={<SalidasProd />} />
                    <Route path="/eventos" element={<Eventos />} />
                    <Route path="/animales" element={<Animales />} />
                    <Route path="/verificaciones" element={<Verificaciones />} />
                    <Route path="/registrar_verificacion" element={<RegistrarVerificacion />} />
                    <Route path="/editar_verificacion" element={<EditarVerificacion />} />
                    <Route path="/salida_animales" element={<SalidaAnimales />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
