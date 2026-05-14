// Imports Base
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { LandingPage } from "./pages/landing_page.jsx";
import { Inicio } from "./pages/inicio.jsx";
import { Farmacia } from "./pages/farmacia.jsx";
import { IniciarSesion } from "./pages/iniciar_sesion.jsx";
import { Productos } from "./pages/productos.jsx";
import { EntradasProd } from "./pages/entradas_prod.jsx";
import { SalidasProd } from "./pages/salidas_prod.jsx";
import { Eventos } from "./pages/eventos.jsx";
import { Animales } from "./pages/animales.jsx";
import { Verificaciones } from "./pages/verificaciones.jsx";
import { RegistrarVerificacion } from "./pages/registrar_verificacion.jsx";
import { EditarVerificacion } from "./pages/editar_verificacion.jsx";
import { SalidaAnimales } from "./pages/salidas_animales.jsx";
import { IngresoAnimales } from "./pages/ingreso_animales.jsx";
import { HistoriasMedicas } from "./pages/historias_medicas.jsx";
import { VerHistoriaMedicas } from "./pages/ver_historias_medicas.jsx";
import { DetalleVerificacion } from "./pages/detalle_verificacion.jsx";
import { Albergue } from "./pages/albergue.jsx";
import {Ajustes} from "./pages/ajustes.jsx";
import { Usuarios } from "./pages/usuarios.jsx";

function App() {
  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/farmacia" element={<Farmacia />} />
          <Route path="/iniciar_sesion" element={<IniciarSesion />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:code/:op" element={<Productos />} />
          <Route path="/entradas_prod" element={<EntradasProd />} />
          <Route path="/entradas_prod/:id/:fecha/:nombre_producto" element={<EntradasProd />} />
          <Route path="/salidas_prod" element={<SalidasProd />} />
          <Route path="/salidas_prod/:id/:fecha/:nombre_producto" element={<SalidasProd />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/animales" element={<Animales />} />
          <Route path="/verificaciones" element={<Verificaciones />} />
          <Route  path="/registrar_verificacion" element={<RegistrarVerificacion />} />
          <Route path="/editar_verificacion" element={<EditarVerificacion />} />
          <Route path="/salida_animales" element={<SalidaAnimales />} />
          <Route path="/salida_animales/:id/:fecha" element={<SalidaAnimales />} />
          <Route path="/ingreso_animales" element={<IngresoAnimales />} />
          <Route path="/ingreso_animales/:id/:fecha" element={<IngresoAnimales />} />
          <Route path="/historias_medicas" element={<HistoriasMedicas />} />
          <Route path="/ver_historias_medicas" element={<VerHistoriaMedicas />} />
          <Route path="/detelle_verificacion" element={<DetalleVerificacion/>} />
          <Route path="/albergue" element={<Albergue />} />
          <Route path="/ajustes" element={<Ajustes />} />
          <Route path="/usuarios" element={<Usuarios />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
