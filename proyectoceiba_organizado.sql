-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-04-2026 a las 23:06:17
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `proyectoceiba` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `proyectoceiba`;

SET FOREIGN_KEY_CHECKS = 0;

START TRANSACTION;

-- --------------------------------------------------------
-- Tabla `animales`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `animales`;
CREATE TABLE `animales` (
  `id_animal` int(11) NOT NULL,
  `n_microchip` bigint(20) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `especie` enum('Canino','Felino','Semoviente','Ave','Otro') NOT NULL,
  `sexo` enum('Macho','Hembra') NOT NULL,
  `fecha_nac_estimada` date NOT NULL,
  `observaciones` varchar(1000) DEFAULT NULL,
  `tipo` enum('Albergado','No Albergado') NOT NULL,
  `id_usuario1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `animales` (`id_animal`, `n_microchip`, `nombre`, `especie`, `sexo`, `fecha_nac_estimada`, `observaciones`, `tipo`, `id_usuario1`) VALUES
(1, 0, 'Lulú', 'Canino', 'Hembra', '2026-03-04', 'Pata coja', 'Albergado', 6),
(2, 132994743672, 'Perla', 'Felino', 'Hembra', '2026-03-04', 'Ninguna', 'Albergado', 6);

-- --------------------------------------------------------
-- Tabla `detalles_entradas_pro`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `detalles_entradas_pro`;
CREATE TABLE `detalles_entradas_pro` (
  `id_detalle_entrada` int(11) NOT NULL,
  `cantidad_presentacion` int(11) NOT NULL,
  `cantidad_total` decimal(10,2) NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `motivo` varchar(100) NOT NULL,
  `id_producto1` int(11) NOT NULL,
  `id_entrada1` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `detalles_entradas_pro` (`id_detalle_entrada`, `cantidad_presentacion`, `cantidad_total`, `fecha_vencimiento`, `motivo`, `id_producto1`, `id_entrada1`, `activo`) VALUES
(1, 10, 2500.00, '2027-06-01', 'Reposición de stock', 1, 1, 1),
(2, 20, 80.00, '2027-08-01', 'Reposición de stock', 6, 1, 1),
(3, 15, 150.00, '2027-05-01', 'Compra mensual', 4, 2, 1),
(4, 10, 500.00, '2027-07-01', 'Compra mensual', 8, 2, 1),
(5, 20, 480.00, '2027-09-01', 'Reposición', 2, 3, 1),
(6, 15, 45.00, '2027-10-01', 'Reposición', 3, 3, 1),
(7, 25, 800.00, '2027-06-15', 'Compra quincenal', 5, 4, 1),
(8, 30, 1500.00, '2027-08-15', 'Compra quincenal', 11, 4, 1),
(9, 50, 50.00, '2027-01-01', 'Campaña de vacunación', 16, 5, 1),
(10, 20, 40.00, '2027-07-01', 'Reposición mensual', 10, 6, 1),
(11, 25, 400.00, '2027-09-01', 'Reposición mensual', 9, 6, 1),
(12, 20, 280.00, '2027-06-01', 'Compra bimestral', 14, 7, 1),
(13, 15, 90.00, '2027-08-01', 'Compra bimestral', 20, 7, 1),
(14, 15, 750.00, '2027-10-01', 'Reposición', 13, 8, 1),
(15, 10, 5000.00,'2027-10-02', 'Reposición', 17, 8, 1),
(16, 30, 30.00, '2027-10-03','Compra trimestral', 7, 9, 1),
(17, 20, 120.00, '2027-10-04', 'Compra trimestral', 20, 9, 1),
(18, 20, 2000.00, '2027-10-05', 'Reposición', 15, 10, 1),
(19, 15, 225.00, '2027-10-06', 'Reposición', 12, 10, 1),
(20, 20, 1500.00, '2027-10-07', 'Compra mensual', 18, 11, 1),
(21, 10, 100.00, '2027-10-08', 'Reposición quirúrgica', 19, 12, 1),
(22, 8, 2000.00, '2027-10-09', 'Reposición trimestral', 1, 13, 1),
(23, 10, 240.00, '2027-10-10', 'Reposición trimestral', 2, 13, 1),
(24, 10, 100.00, '2027-10-11', 'Compra mensual', 4, 14, 1),
(25, 12, 600.00, '2027-10-12', 'Compra mensual', 8, 14, 1),
(26, 20, 640.00, '2027-10-13', 'Reposición', 5, 15, 1),
(27, 15, 30.00, '2027-10-14', 'Reposición', 10, 15, 1),
(28, 40, 40.00, '2027-10-15', 'Campaña vacunación marzo', 16, 16, 1),
(29, 15, 60.00, '2027-10-16', 'Reposición', 6, 17, 1),
(30, 10, 140.00, '2027-10-17', 'Reposición', 14, 17, 1),
(31, 20, 1000.00, '2027-10-18', 'Reposición semestral', 13, 18, 1),
(32, 15, 7500.00, '2027-10-19', 'Reposición semestral', 17, 18, 1),
(33, 10, 30.00, '2027-10-20', 'Reposición', 3, 19, 1),
(34, 20, 20.00, '2027-10-21', 'Reposición', 7, 19, 1),
(35, 15, 240.00, '2027-10-22', 'Reposición mensual', 9, 20, 1),
(36, 20, 1000.00, '2027-10-23', 'Reposición mensual', 11, 20, 1),
(39, 50, 800.00, '2026-04-17', 'Donación', 9, 21, 0),
(40, 8, 24.00, '2026-04-14', 'Compra', 3, 21, 0),
(41, 124, 4340.00, '2026-04-16', 'Donación', 23, 20, 1),
(42, 325, 81250.00, '2026-04-17', 'Compra', 1, 20, 1),
(43, 50, 12500.00, '2026-04-14', 'Donación', 1, 22, 0);

-- --------------------------------------------------------
-- Tabla `detalles_salidas_pro`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `detalles_salidas_pro`;
CREATE TABLE `detalles_salidas_pro` (
  `id_detalle_salida` int(11) NOT NULL,
  `cantidad_presentacion` int(11) NOT NULL,
  `cantidad_total` decimal(10,2) NOT NULL,
  `motivo` varchar(100) NOT NULL,
  `id_producto1` int(11) NOT NULL,
  `id_salida1` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `detalles_salidas_pro` (`id_detalle_salida`, `cantidad_presentacion`, `cantidad_total`, `motivo`, `id_producto1`, `id_salida1`, `activo`) VALUES
(1, 8, 8.00, 'Evento: Vacunación contra la rabia', 16, 1, 1),
(2, 10, 240.00, 'Evento: Desparasitación masiva', 2, 2, 1),
(3, 5, 500.00, 'Evento: Desparasitación masiva', 15, 2, 1),
(4, 5, 1250.00, 'Evento: Jornada antiparasitaria externa', 1, 3, 1),
(5, 8, 32.00, 'Evento: Jornada antiparasitaria externa', 6, 3, 1),
(6, 5, 50.00, 'Evento: Jornada de esterilización', 19, 4, 1),
(7, 3, 30.00, 'Evento: Jornada de esterilización', 4, 4, 1),
(8, 10, 10.00, 'Evento: Control de ectoparásitos', 7, 5, 1),
(9, 5, 250.00, 'Evento: Control de ectoparásitos', 13, 5, 1),
(10, 10, 10.00, 'Evento: Vacunación contra la rabia', 16, 2, 1),
(11, 5, 120.00, 'Evento: Desparasitación masiva', 2, 12, 0),
(12, 3, 300.00, 'Evento: Desparasitación masiva', 15, 12, 0),
(13, 3, 750.00, 'Evento: Jornada antiparasitaria externa', 1, 13, 1),
(14, 5, 20.00, 'Evento: Jornada antiparasitaria externa', 6, 13, 1),
(15, 3, 30.00, 'Evento: Jornada de esterilización', 19, 14, 1),
(16, 2, 20.00, 'Evento: Jornada de esterilización', 4, 14, 1),
(17, 5, 5.00, 'Evento: Control de ectoparásitos', 7, 15, 0),
(18, 4, 200.00, 'Evento: Control de ectoparásitos', 13, 15, 0),
(19, 5, 1250.00, 'Evento: Vacunación contra la rabia', 1, 16, 0),
(20, 5, 80.00, 'Evento: Vacunación contra la rabia', 9, 16, 0),
(21, 3, 150.00, 'Evento: Vacunación contra la rabia', 8, 16, 0),
(22, 3, 72.00, 'Vencimiento', 2, 17, 0),
(23, 60, 2100.00, 'Evento', 23, 18, 0),
(24, 300, 75000.00, 'Animal', 1, 18, 0),
(25, 10, 350.00, 'Animal', 23, 18, 0),
(26, 10, 350.00, 'Evento', 23, 18, 0),
(27, 10, 30.00, 'Evento', 3, 19, 0),
(28, 4, 140.00, 'Evento: Evento 1', 23, 20, 0),
(29, 4, 96.00, 'Evento: Evento 1', 2, 21, 1);

-- --------------------------------------------------------
-- Tabla `entradas_productos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `entradas_productos`;
CREATE TABLE `entradas_productos` (
  `id_entrada` int(11) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `observaciones` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `entradas_productos` (`id_entrada`, `fecha_hora`, `observaciones`, `activo`) VALUES
(1, '2026-01-05 13:00:00', 'Entrada inicial de antiparasitarios', 1),
(2, '2026-01-10 14:00:00', 'Entrada de antibióticos', 1),
(3, '2026-01-15 15:00:00', 'Entrada de antiparasitarios orales', 1),
(4, '2026-01-20 13:30:00', 'Entrada de antiinflamatorios', 1),
(5, '2026-01-25 16:00:00', 'Entrada de vacunas', 1),
(6, '2026-02-01 14:00:00', 'Entrada de analgésicos', 1),
(7, '2026-02-05 15:30:00', 'Entrada de tratamientos tópicos', 1),
(8, '2026-02-10 13:00:00', 'Entrada de antiparasitarios inyectables', 1),
(9, '2026-02-15 14:30:00', 'Entrada de collares y pipetas', 1),
(10, '2026-02-20 15:00:00', 'Entrada de suspensiones orales', 1),
(11, '2026-02-25 13:00:00', 'Entrada suplementos y ansiolíticos', 1),
(12, '2026-03-01 14:00:00', 'Entrada de anestésicos y premedicación', 1),
(13, '2026-03-05 15:00:00', 'Entrada general antiparasitarios', 1),
(14, '2026-03-10 13:30:00', 'Entrada de antibióticos inyectables', 1),
(15, '2026-03-15 16:00:00', 'Entrada de antiinflamatorios y analgésicos', 1),
(16, '2026-03-20 14:00:00', 'Entrada de vacunas y biológicos', 1),
(17, '2026-03-25 15:00:00', 'Entrada de tratamientos dérmicos', 1),
(18, '2026-04-01 13:00:00', 'Entrada de ivermectinas', 1),
(19, '2026-04-05 14:30:00', 'Entrada de antiparasitarios spot-on', 1),
(20, '2026-04-08 15:00:00', 'Entrada general mixta', 1),
(21, '2026-04-13 15:50:44', '', 0),
(22, '2026-04-13 17:53:38', '', 0);

-- --------------------------------------------------------
-- Tabla `eventos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `eventos`;
CREATE TABLE `eventos` (
  `id_evento` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `lugar` varchar(100) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `requiere_producto` tinyint(1) NOT NULL,
  `activo` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `eventos` (`id_evento`, `nombre`, `fecha_hora`, `lugar`, `descripcion`, `requiere_producto`, `activo`) VALUES
(1, 'Jornada de adopción', '2026-05-10 09:00:00', 'Parque El Poblado', 'Evento de adopción de mascotas rescatadas', 0, 1),
(2, 'Vacunación contra la rabia', '2026-05-15 08:00:00', 'Barrio Boston', 'Campaña anual de vacunación antirrábica', 1, 1),
(3, 'Charla de tenencia responsable', '2026-05-20 10:00:00', 'Biblioteca Pública', 'Charla educativa sobre cuidado y bienestar animal', 0, 1),
(4, 'Desparasitación masiva', '2026-05-25 09:00:00', 'Villa Hermosa', 'Jornada de desparasitación para perros y gatos', 1, 1),
(5, 'Feria de mascotas', '2026-06-01 10:00:00', 'Centro Comercial Oviedo', 'Exposición y concurso de mascotas', 0, 1),
(6, 'Jornada antiparasitaria externa', '2026-06-05 08:00:00', 'Corregimiento San Cristóbal', 'Aplicación de antiparasitarios externos en zona rural', 1, 1),
(7, 'Taller de primeros auxilios', '2026-06-10 14:00:00', 'Sede Ceiba', 'Taller de primeros auxilios para mascotas', 0, 1),
(8, 'Jornada de esterilización', '2026-06-15 07:00:00', 'Clínica Móvil Laureles', 'Campaña de esterilización de perros y gatos callejeros', 1, 1),
(9, 'Concurso de disfraces', '2026-10-31 15:00:00', 'Parque Aranjuez', 'Concurso de disfraces de Halloween para mascotas', 0, 1),
(10, 'Control de ectoparásitos', '2026-06-25 09:00:00', 'Barrio Robledo', 'Jornada de control de pulgas y garrapatas', 0, 1),
(11, 'Vacunación contra la rabia', '2026-04-22 08:38:00', 'Casa de juanes', 'Los vacunaron y les dio rabia', 1, 0),
(12, 'Evento 1', '2026-04-24 11:29:00', 'El porvenir', 'gshsdhhad', 1, 1);

-- --------------------------------------------------------
-- Tabla `eventos_clinicos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `eventos_clinicos`;
CREATE TABLE `eventos_clinicos` (
  `id_evento` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `responsable` varchar(20) NOT NULL,
  `requiere_producto` tinyint(1) NOT NULL,
  `id_historia1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `eventos_clinicos` (`id_evento`, `fecha`, `descripcion`, `responsable`, `requiere_producto`, `id_historia1`) VALUES
(1, '2026-03-19', 'Se vacunó contra la rabia y le dio rabia', 'Gatito Feroz', 0, 1),
(2, '2026-03-31', 'Desparacitante aplicado', 'Gatito Feroz', 1, 1);

-- --------------------------------------------------------
-- Tabla `examenes_fisicos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `examenes_fisicos`;
CREATE TABLE `examenes_fisicos` (
  `id_examen_fisico` int(11) NOT NULL,
  `frecuencia_cardiaca` varchar(10) NOT NULL,
  `frecuencia_respiratoria` varchar(10) NOT NULL,
  `mucosas` varchar(10) NOT NULL,
  `temperatura` varchar(10) NOT NULL,
  `tiempo_llenado` varchar(10) NOT NULL,
  `condicion_corporal` varchar(10) NOT NULL,
  `fecha` date NOT NULL,
  `id_historia1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Tabla `historias_medicas`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `historias_medicas`;
CREATE TABLE `historias_medicas` (
  `id_historia_medica` int(11) NOT NULL,
  `fecha_creacion` date NOT NULL,
  `id_animal1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `historias_medicas` (`id_historia_medica`, `fecha_creacion`, `id_animal1`) VALUES
(1, '2026-03-04', 1);

-- --------------------------------------------------------
-- Tabla `ingresos_animales`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `ingresos_animales`;
CREATE TABLE `ingresos_animales` (
  `id_ingreso` int(11) NOT NULL,
  `n_radicado` int(11) DEFAULT NULL,
  `persona_reporta` varchar(100) NOT NULL,
  `cedula_reporta` varchar(20) NOT NULL,
  `direccion_resporta` varchar(30) NOT NULL,
  `telefono_reporta` varchar(13) NOT NULL,
  `funcionario_autoriza` varchar(13) NOT NULL,
  `fecha_hora_ingreso` datetime NOT NULL,
  `persona_realiza` varchar(100) NOT NULL,
  `cedula_realiza` varchar(20) NOT NULL,
  `motivo_ingreso` varchar(100) NOT NULL,
  `id_verificacion1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Tabla `inicio_sesion`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `inicio_sesion`;
CREATE TABLE `inicio_sesion` (
  `id_inicio_sesion` int(11) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_usuario1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `inicio_sesion` (`id_inicio_sesion`, `correo`, `contrasena`, `id_usuario1`) VALUES
(1, 'admin@gmail.com', '@Abcd1234', 1),
(2, 'admin@gmail.com', '@Abcd1234', 1),
(3, 'admin@gmail.com', '@Abcd1234', 1),
(4, 'admin@gmail.com', '@Abcd1234', 1),
(5, 'admin@gmail.com', '@Abcd1234', 1),
(6, 'andrew@ej.com', '@Admin1234', 4),
(7, 'andrew@ej.com', '@Admin123', 4),
(8, 'admin@gmail.com', '@Admin123', 1),
(9, 'admin@gmail.com', '$2y$10$GCbeGPXPOCkDfYm3zN0KnO3Pcp1AAE7tQROre7pcce8uS10y4zLQS', 1),
(10, 'admin@gmail.com', '$2y$10$AU3kfztOYMLc0w2rvC8hquiP.zCs4c2bkzy8B0JQe0.J5v7iC7kXy', 1),
(11, 'admin@gmail.com', '$2y$10$rN5l3VQOWv8.dS5ax8Dt.u3vJGOW68WSiMawEsgHseJjfMZjwig0K', 1),
(12, 'admin@gmail.com', '$2y$10$mwjz.vI8qW0wKJyFCMNv4ebmD061IjvG0OPqpfDCL/jLNzRxok9k6', 1),
(13, 'admin@gmail.com', '$2y$10$y1y8GRIzatUi7byYXJopweqFnf/JgB8U99iAYVkntfR45.EwI50.6', 1),
(14, 'admin@gmail.com', '$2y$10$Nde7h8QkgO8VqTj8PEyv4.a1zypYrmFpAr0KYy1aw4I4.9NKecKzu', 1),
(15, 'admin@gmail.com', '$2y$10$eBJ35U5F7XgEt6F8CdW0iOA379pXVp.9/JVW8yAMJFERQq8tuZCu6', 1),
(16, 'admin@gmail.com', '$2y$10$6N5UvRZlPN3ypfraFNRbR.M.Ys61hhju4w89t/JZyz/D3QPSe50Gi', 1),
(17, 'admin@gmail.com', '$2y$10$yn0VuiBGH9a8A9wSyFwYOe8/29EtIfw/7i68B7bn4naDfSoTFYis.', 1),
(18, 'carl@gmail.com', '$2y$10$Pku2LW/LDGKzLfiny/m3AOYWjj506qMa1RBVEeEECp0eQpO5xnY.K', 2),
(19, 'fab@gmail.com', '$2y$10$B//TN0CIfUjkb7Uem92u6ORb.lheIFdB/LrEqujxiOW4qvWwm/ONq', 3),
(20, 'admin@gmail.com', '$2y$10$J2OPqFMfICwGXBv0I0h8X.5U9irhqI1moCYgtgzQKTaoA4VghjpWO', 1),
(21, 'admin@gmail.com', '$2y$10$Tep2l0mJto3R/EkiDmYfyOR4KKEIFFllAWF.0/hkTTcJy0x6gfRGu', 1),
(22, 'fab@gmail.com', '$2y$10$q2h3qaAYz2ygRss0lZ6NL.xbCS/J7DlkynlG6IHx.J0UISzEEBWpq', 3),
(23, 'admin@gmail.com', '$2y$10$sznh8f14tRSk7vbW/HWSfOXsU8DarXM6P7Ti0UheN3AfRFFJ.JYgK', 1),
(24, 'fab@gmail.com', '$2y$10$uAIXlagHpCM0ZQE4JLSxX.7RBgcuguh7Qi/aJf3AVujHgnZG3206y', 3),
(25, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$cEOaetOFuJEhcLPqRt5hcue6AAhbCxoFd0RP/MKkUo0cea9lIsYAK', 5),
(26, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$F61qr7pN/tv568Dt6YSgUex/oETyy2MgQy4el343h3qU9cCi0.EX.', 5),
(27, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$GFVcPrycqBdhuNvqdUWXGeVZl9KP/uwo94IX3kIBuM60L8XkH9Tne', 5),
(28, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$P1OGJEqUxVoyD7hOSLMFhO2NhGg/CHpF42EPkXlClxPq1tpfNvFum', 5),
(29, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$ky7j8poP8pfjQpDcTCMcCOylKy.CQDISKA0Wz2YocFwQ8GSDSaHMW', 5),
(30, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$84VpmwqEn7KuNa8WJ.tw3.CovRVM/EMH.xm7RpqRMqvzWZAmH9gNm', 5),
(31, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$PbsTOI.H6Z30MKbkRWP/n.olQoxNO7rVtzVE9xUI7oFwDVuPLVA/i', 5),
(32, 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$I0RadZL6SKPdIZGuw37KTuUbVh30oGbozkB0Igo54o1KUCMA3pEJ.', 5),
(33, 'admin@gmail.com', '$2y$10$/N8fm6mA1Z.LbKXgdgPKyODI.zl5DpSA6opfLPYEOVEJsNDHl.gsm', 1),
(34, 'ferozgatito807@gmail.com', '$2y$10$FXHQfzngwaMJcD.CmyHzP.2ObiMd1VLZqmncEE54dgOtCUAOuOOdy', 6),
(35, 'ferozgatito807@gmail.com', '$2y$10$hyReXhjoGgUbQ5DhyEnezeR5ld0YVBCbpSAzL1Kzixz7rPEk0WeyC', 6),
(36, 'ferozgatito807@gmail.com', '$2y$10$pOQscL1V12aBbKs1lqr5DOZLveByg8YWUIfJ22dkEo9LQBEXH.bZS', 6),
(37, 'ferozgatito807@gmail.com', '$2y$10$NmFAGyYoniowDUBVfPSMWeKFnOs1g1kHJnP1xvY8XE/FL.WOd0zoS', 6),
(38, 'ferozgatito807@gmail.com', '$2y$10$VEptt2LjTCFl.iDDo2aD3.ipIab81aQWusE4iP3mp/zxTMmuH3khC', 6),
(39, 'ferozgatito807@gmail.com', '$2y$10$7iVK8ORymhFeFrsOhpC2qumkbv9iQr5zutvy5wKlj6bMPTEF4PeVC', 6),
(40, 'ferozgatito807@gmail.com', '$2y$10$tQN75OJgVD7o6vDCZxV5uOKbvqjyea5OQoATg.9eEfS2KZxrTiqp.', 6),
(41, 'ferozgatito807@gmail.com', '$2y$10$pyMHBFu6jccM9mqyHSWmfOQyv0VgavYh6qRi4QSHhwGiK1LYCbCde', 6),
(42, 'ferozgatito807@gmail.com', '$2y$10$/Ps/icvGuCXf9kUeo6ns6OT5fHmcPDn9Xz63R8KUzER99jx5urJvW', 6),
(43, 'ferozgatito807@gmail.com', '$2y$10$rpQabyHyEwYdK4EoQ7MKpuQFuS4QsYYjbMaNkk3ud69WZNyXLsJGS', 6),
(44, 'ferozgatito807@gmail.com', '$2y$10$yPj3W8DMO8hzDWZHtGqvyeFXQAM5lBRx4bBUZ4KXJ9B8maoxCxkJ.', 6),
(45, 'ferozgatito807@gmail.com', '$2y$10$y9.Wg4Q35S45PdU4flM/BO0JV5BEmquNNVoNWp3s9EiIhxtLhbP5.', 6),
(46, 'ferozgatito807@gmail.com', '$2y$10$uBUGUTP7a1PMZF33DxVUUexfv7gyanGjB9obHhehqv/UnBuzaAWBS', 6),
(47, 'ferozgatito807@gmail.com', '$2y$10$YEwIGXmrJ8iWF9332QBYo..qevd8UU57WDhqG5VpNRwKOeUjwhofO', 6),
(48, 'ferozgatito807@gmail.com', '$2y$10$LYhdTIjNncSDOojJrk4C0.DeOiVpIgZICgrzTA1DbiwCGPtwactwq', 6),
(49, 'ferozgatito807@gmail.com', '$2y$10$l/DQTsVaDRVCWT1TGg17/eY0UGE8c7/IKF5RK2u9/JBOfAIPKXgfi', 6),
(50, 'ferozgatito807@gmail.com', '$2y$10$tGWxe25Lg5Ae0bcz58gwROm/2rV1IR7Vh2d8fE10y9kLMXrVjvmtC', 6),
(51, 'ferozgatito807@gmail.com', '$2y$10$veEgc1BdoWaiQZNptBrA0Oe7lwdwTcD1b5RoVLyZFPArrmwsTtYQu', 6),
(52, 'ferozgatito807@gmail.com', '$2y$10$m9Di8tENJlnczE5uLAvnaukpVtNGMvQb2Ifj.Iu34W4V46.p/J.eq', 6),
(53, 'ferozgatito807@gmail.com', '$2y$10$ebIdFdWEM5bkYvM/c7rAmugEvHdA8t39RgdqvC2fXjd3rbqlBUeJS', 6),
(54, 'ferozgatito807@gmail.com', '$2y$10$Qu81WcFzcl5QeFMLJnQjAuXMPYOmRBGD8jgK1s6W0k5wWRJ7i0dLO', 6),
(55, 'ferozgatito807@gmail.com', '$2y$10$9lmSOrzgf//hIr82M6jsIeL23wMWL/JlIeONpNzbfLedXrnrYgsma', 6),
(56, 'ferozgatito807@gmail.com', '$2y$10$afvYDuF9JCyCFB9BaGqAhe/mwrVb/hKhUON6iOBT0i9NephipynHC', 6),
(57, 'ferozgatito807@gmail.com', '$2y$10$m3UAeMiw2M2KYcZ1GEY2GeCm6mvryIfXnRZQTIjZEQ6F7//FyzeZu', 6),
(58, 'ferozgatito807@gmail.com', '$2y$10$UFyO9W6vJucPGbgI2fIcD.W6mmIkNNqLbecjOVU7T/5bg2qkp9R5S', 6),
(59, 'ceibasoftcare@gmail.com', '$2y$10$Fbd8hBtubxfMyEWU7TeDOu9Nx157iXr22mDIh8/31dCqnM1lems6G', 7),
(60, 'ferozgatito807@gmail.com', '$2y$10$UqJo0kStUzZ6q5r2KSKo.u90aOn8FrCs7JxjcG3D27IKJEXSctly.', 6),
(61, 'ferozgatito807@gmail.com', '$2y$10$ljWy.2ROxi842xLIgPy6Q.6NRDtS8aGJOyUy3lJd54bv0u.SbDV1K', 6),
(62, 'ceibasoftcare@gmail.com', '$2y$10$Iu/PhI8ElFbrCVIF7XAxTeodmphs2uoZdAdjmg4nllOoHXvfRHgIW', 7),
(63, 'ceibasoftcare@gmail.com', '$2y$10$Dh4MCbxM27yeXEkfyLSWUOQ48tUuyWRtd22wdfG3QWBEP8pWjqwlu', 7),
(64, 'ceibasoftcare@gmail.com', '$2y$10$B3ufHUGzCjhh.rfBhw49E.bv8JhFkSYKNwV.kxnmXx6NqgT.ZygW.', 7),
(65, 'ferozgatito807@gmail.com', '$2y$10$ajO3IxaagUsae39IjLiHieQLdwMpp6eP07vEHHtBdo6tk98ihmZ.i', 6),
(66, 'ceibasoftcare@gmail.com', '$2y$10$fk9NEbLTdbP/n/CysjyO6.p1y/O912Q.kDcc4rAyKEmGWtl/kAlUi', 7),
(67, 'ceibasoftcare@gmail.com', '$2y$10$V803JJZ2kQFQPgo7SHwmSekKuTUTWEYwEiSUQMz9PQ4VHG4HBHiya', 7),
(68, 'ceibasoftcare@gmail.com', '$2y$10$hO9SrY04p4mGm66cWJbeo.objRjaACaUd/Y.PqpKaW7fVT72rO0nC', 7),
(69, 'ceibasoftcare@gmail.com', '$2y$10$pl8/ovYFL2r3SoCc3kgl0.cfpoy6u7im0O6rMIiYgz4gRX31i0S8i', 7),
(70, 'ceibasoftcare@gmail.com', '$2y$10$i/6RSqMRxKF59yQ5W/5QReDhdbzYTx3HRDafNYygW1gS8WDjYE.YS', 7),
(71, 'ceibasoftcare@gmail.com', '$2y$10$WKgnRqyHeBLgikAzk6r1DeMPQWBYTEevtZHQfJhmHXbpH7UdEU8De', 7),
(72, 'ceibasoftcare@gmail.com', '$2y$10$VHVP7cGj0TMP98fVjfRPA.pS8IPIdu7hU/QZ0sKp9n8EGx5rRRaq', 7),
(73, 'ceibasoftcare@gmail.com', '$2y$10$XgAHcXju/5..kzNNXFFHKejZNtkuXOUyIMCfxxjqnISn4iLFdQtQ2', 7),
(74, 'ceibasoftcare@gmail.com', '$2y$10$HVg2Moj/HIaMWyfbcZJWq.2STdIuAznW3.KMgsXh62rseHVuRu3nK', 7),
(75, 'ceibasoftcare@gmail.com', '$2y$10$5p.KrZ5XusYcw4waJT.zIOVz0Q5UXmpAeRNxX2c9o7Gs', 7),
(76, 'ceibasoftcare@gmail.com', '$2y$10$hyE7WdK8JL0BEzRi9W2f5OEhPwASXRLGnzl9Cu.oTU17AP3HsXGHq', 7),
(77, 'ceibasoftcare@gmail.com', '$2y$10$Au8YvKu4tWks45V0lZDR7eRoOg08ycebHIHhxAA58q/VwJTgpvz/y', 7),
(78, 'ceibasoftcare@gmail.com', '$2y$10$jJdjsOrNMs47deSDcNTxm.v.EoCd0BMy1adjtc.4GbWVOR04QpKLy', 7),
(79, 'ferozgatito807@gmail.com', '$2y$10$KYlsyJFNfckeCP1GcpYhpOUDO0EWJ1SFgRPfaUiGDK49QaKT.5M3i', 6),
(80, 'ceibasoftcare@gmail.com', '$2y$10$dFnjHMqpjiBDCb4z4w7kTeeHR1OFY.maCy2IfRE5GksHTEqg5Kmwi', 7),
(81, 'ceibasoftcare@gmail.com', '$2y$10$W./X3MGew0e4UdmL.uwV9uaHYpzaAxjJiyad42T/Suw7xUgst7Zxa', 7),
(82, 'ceibasoftcare@gmail.com', '$2y$10$jkG1yOH9Ug8MMBiRaGYiUOF.gcvtdIBTa46Y2yuoDMJEanUeOVgEy', 7),
(83, 'ceibasoftcare@gmail.com', '$2y$10$G81Bx3eRcoxY5Mq6baorHO737yKfgLLpgRhcoVTjaRBubrSWAO6eG', 7),
(84, 'ceibasoftcare@gmail.com', '$2y$10$dj53RXTqjezPlDXQWONeaOye5luMfDeLC.Z1LyQ/LRqZsHXsHXkQ4', 7),
(85, 'ceibasoftcare@gmail.com', '$2y$10$Y4J83DZ3IzZemp.md4LlQ.1QEzJIWvXfZFQiPNR2tiHu2vz/5ttsC', 7),
(86, 'ceibasoftcare@gmail.com', '$2y$10$G7DyYftYB0gDQSgIxRn8R.TMB51NnwRSN0tpW2CzbF22DN2.rmL0a', 7),
(87, 'ceibasoftcare@gmail.com', '$2y$10$hWZlebiUF1fzA/KHvN/eYOQ67UA0rlNRRiY7P3.vbh8Wx6IRbYsEy', 7),
(88, 'ceibasoftcare@gmail.com', '$2y$10$tCi.9WbOk4Y7amqGaIe8Vu5P99gGxMfMKXQWGDLOb1IsTpMcLGIC6', 7),
(89, 'ceibasoftcare@gmail.com', '$2y$10$gbq2YxYxy2iK3Cs01x6yeJF3sZSu7lRqZsHXsHXkQ4', 7),
(90, 'ceibasoftcare@gmail.com', '$2y$10$3DVyTsheVw66jyJs2O4wM.J1KheHHTHyiV3z9ebFvSAXlYjpSgQAe', 7),
(91, 'ferozgatito807@gmail.com', '$2y$10$wCbisp1gC5monSk9r/Y.XeZnLSmHxw0pDPMfA5voBJutZZqxdI9M.', 6),
(92, 'ferozgatito807@gmail.com', '$2y$10$JYoeRT9Y.WuLHKp6udKKs.dGGv/Xqqe47Pfjb3J2rlS2uZ8Z.bSO', 6),
(93, 'ferozgatito807@gmail.com', '$2y$10$eumQPuA4cVkmbuwX/Zfn8u7BAVUSwNEMVWjRXJTyMEaSjlDq5J1/m', 6),
(94, 'ferozgatito807@gmail.com', '$2y$10$pb8jKRb1QO.pJZHdk0wfaerFV2CsUrDn9dEh9wqxrALC6flpLdqW.', 6),
(95, 'ferozgatito807@gmail.com', '$2y$10$7wD7LuWwLPPIlI.dmy/7QuJCu3YJWMoJmPZI4KzuTYHdfAGMr5E2i', 6),
(96, 'ferozgatito807@gmail.com', '$2y$10$Eu9Fw5KTg11LmG7P1Oa1ducLTHBFe7emyNgvIpG5i5/r7fBJajKMK', 6),
(97, 'ferozgatito807@gmail.com', '$2y$10$ikPUpN.xCKdEI3Kvp7RZoON7zy/p/wHYsxXpicrtJDAutszMr2Zm.', 6),
(98, 'ferozgatito807@gmail.com', '$2y$10$a.zpBOQfFU1xDXBDMPr35uXPmoCW6C4L0JO4NknpD51mQ4sggiDmK', 6),
(99, 'ferozgatito807@gmail.com', '$2y$10$lkugPAdBlEZfPKHI1ZkCY.H8K9DfEyZIIPYgST1/OqUvZcJg0lfg.', 6),
(100, 'ferozgatito807@gmail.com', '$2y$10$nchHQsM9SUoWOhu.TNOTNeMIRKV0if085GarePlPA/2Uky1umalSC', 6),
(101, 'ferozgatito807@gmail.com', '$2y$10$lr330ISdZIGZWOxrUfSccOjr3pJ2xp93hmv2QUOgqXmHDteJd17RG', 6),
(102, 'ferozgatito807@gmail.com', '$2y$10$/7FoXSaH4dLfamXPAxmu0.jtwsbTkUzyealDrrUNCY/yDarT8gzwS', 6),
(103, 'ceibasoftcare@gmail.com', '$2y$10$iBfntBeLIQDD5rhzyTuejuhgeLHCAoprzV03xK2R7JnPyjz7lAeF6', 7),
(104, 'ferozgatito807@gmail.com', '$2y$10$Pl.ZyYn56DEQAo885aeaXumOuqq6f2.u2giHqbIcfwggUVPmjPxWa', 6),
(105, 'ferozgatito807@gmail.com', '$2y$10$FC5AoZXPYL9ZZQ2u3df.mOgAjJp1qZzKKCiguzB5b2PZv0SBYYdpC', 6),
(106, 'ceibasoftcare@gmail.com', '$2y$10$IN3/m7lAc7vwz7wN9hbsx.Yq5RL.iTFDOj7.7gT6vZK.lG/bc./US', 7);

-- --------------------------------------------------------
-- Tabla `productos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `codigo_barras` bigint(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `tipo_medida` enum('ml','mg','g','kg','L','Unidades') NOT NULL,
  `cantidad_por_unidad` int(11) NOT NULL,
  `id_usuario1` int(11) NOT NULL,
  `activo` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `productos` (`id_producto`, `codigo_barras`, `nombre`, `descripcion`, `tipo_medida`, `cantidad_por_unidad`, `id_usuario1`, `activo`) VALUES
(1, 3400915965222, 'Frontline Spray', 'Antiparasitario externo con fipronil para perros y gatos', 'ml', 250, 7, 1),
(2, 7702295000183, 'Drontal Plus', 'Antiparasitario interno (prazicuantel, pirantel, febantel) para perros', 'Unidades', 24, 6, 1),
(3, 7898131491100, 'Nexgard Spectra', 'Antiparasitario oral contra pulgas, garrapatas y parásitos internos', 'Unidades', 3, 6, 1),
(4, 7798990006078, 'Convenia 80 mg/mL', 'Antibiótico inyectable de larga acción (cefovecin sódica) para perros y gatos', 'ml', 10, 6, 1),
(5, 7707213490014, 'Meloxicam Vet 0,5%', 'Antiinflamatorio y analgésico oral (meloxicam) para perros', 'ml', 32, 6, 1),
(6, 4007221034629, 'Advocate Perros', 'Antiparasitario tópico spot-on con imidacloprid y moxidectina', 'ml', 4, 6, 1),
(7, 3400918519009, 'Scalibor Protectorband', 'Collar antiparasitario con deltametrina para perros', 'Unidades', 1, 6, 1),
(8, 7707213100201, 'Enrofloxacina 50 mg/mL', 'Antibiótico inyectable de amplio espectro para uso veterinario general', 'ml', 50, 6, 1),
(9, 3400914899498, 'Cerenia 16 mg', 'Antiemético (maropitant) para perros con vómito y náuseas', 'mg', 16, 6, 1),
(10, 7707284760025, 'Tramadol Vet 100 mg/2mL', 'Analgésico opioide inyectable para manejo del dolor posoperatorio', 'ml', 2, 6, 1),
(11, 7798990005583, 'Rimadyl 50 mg', 'Antiinflamatorio no esteroidal (carprofeno) para dolor y artritis en perros', 'mg', 50, 6, 1),
(12, 4007221038702, 'Baytril 2,5% Oral', 'Antibiótico (enrofloxacina) solución oral para perros y gatos', 'ml', 15, 7, 1),
(13, 7707228100108, 'Duramectin 1%', 'Antiparasitario inyectable (ivermectina) de amplio espectro', 'ml', 50, 7, 1),
(14, 7798990001258, 'Otomax Ungüento', 'Tratamiento ótico con gentamicina, betametasona y clotrimazol para otitis', 'g', 14, 7, 1),
(15, 4007221021858, 'Panacur 10% Suspensión', 'Antiparasitario interno (fenbendazol) suspensión oral para perros', 'ml', 100, 7, 1),
(16, 8713184004505, 'Nobivac Puppy DP', 'Vacuna bivalente (moquillo + parvovirus) para cachorros', 'Unidades', 1, 7, 1),
(17, 7707241120019, 'Neomec 1% Injectable', 'Ivermectina inyectable para bovinos, equinos y porcinos', 'ml', 500, 7, 1),
(18, 3594920003028, 'Zylkene 75 mg', 'Suplemento ansiolítico natural (alfa-casozepina) para perros y gatos', 'mg', 75, 7, 1),
(19, 7707213800068, 'Atropina 1% Inyectable', 'Anticolinérgico inyectable para premedicación anestésica veterinaria', 'ml', 10, 7, 1),
(20, 3760098110119, 'Dermoscent Essential 6', 'Pipetas tópicas de ácidos grasos esenciales para piel y pelo en perros', 'ml', 6, 7, 1),
(21, 5633473, 'holi', '', 'ml', 8, 6, 0),
(22, 3482013820901, 'Holi', 'Ninguna', 'Unidades', 3, 6, 0),
(23, 702090073065, 'Asuntol x 100 gramos', 'Jabon antipulgas para perro', 'Unidades', 35, 6, 1),
(24, 6546897643, 'Gatito Feroz', '', 'mg', 0, 6, 0),
(25, 771713738741, 'Vacuna contra la rabia', 'Frascos de 50 ml', 'g', 50, 7, 0);

-- --------------------------------------------------------
-- Tabla `roles`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(15) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `roles` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'administrador', 'el admin'),
(2, 'farmacéutico', 'encargado de farmacia'),
(3, 'veterinario', 'Encargado de salud');

-- --------------------------------------------------------
-- Tabla `salidas_animales`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `salidas_animales`;
CREATE TABLE `salidas_animales` (
  `id_salida` int(11) NOT NULL,
  `fecha_salida` date NOT NULL,
  `motivo_salida` varchar(1000) NOT NULL,
  `responsable_salida` varchar(100) NOT NULL,
  `animales_id_animales` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Tabla `salidas_productos`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `salidas_productos`;
CREATE TABLE `salidas_productos` (
  `id_salida` int(11) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `observaciones` varchar(100) DEFAULT NULL,
  `id_evento_clinico1` int(11) DEFAULT NULL,
  `id_evento1` int(11) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `salidas_productos` (`id_salida`, `fecha_hora`, `observaciones`, `id_evento_clinico1`, `id_evento1`, `activo`) VALUES
(1, '2026-04-12 22:45:07', 'Salida automática del evento: Vacunación contra la rabia', NULL, NULL, 1),
(2, '2026-05-15 08:00:00', 'Salida automática para evento: Vacunación contra la rabia', NULL, NULL, 1),
(3, '2026-04-12 22:45:07', 'Salida automática del evento: Desparasitación masiva', NULL, NULL, 1),
(4, '2026-05-25 09:00:00', 'Salida automática para evento: Desparasitación masiva', NULL, NULL, 1),
(5, '2026-04-12 22:45:07', 'Salida automática del evento: Jornada antiparasitaria externa', NULL, NULL, 1),
(6, '2026-06-05 08:00:00', 'Salida automática para evento: Jornada antiparasitaria externa', NULL, NULL, 1),
(7, '2026-04-12 22:45:07', 'Salida automática del evento: Jornada de esterilización', NULL, NULL, 1),
(8, '2026-06-15 07:00:00', 'Salida automática para evento: Jornada de esterilización', NULL, NULL, 1),
(9, '2026-04-12 22:45:07', 'Salida automática del evento: Control de ectoparásitos', NULL, NULL, 1),
(10, '2026-06-25 09:00:00', 'Salida automática para evento: Control de ectoparásitos', NULL, NULL, 1),
(11, '2026-04-12 22:47:40', 'Salida automática del evento: Vacunación contra la rabia', NULL, 2, 1),
(12, '2026-04-12 22:47:40', 'Salida automática del evento: Desparasitación masiva', NULL, 4, 0),
(13, '2026-04-12 22:47:40', 'Salida automática del evento: Jornada antiparasitaria externa', NULL, 6, 1),
(14, '2026-04-12 22:47:40', 'Salida automática del evento: Jornada de esterilización', NULL, 8, 1),
(15, '2026-04-12 22:47:40', 'Salida automática del evento: Control de ectoparásitos', NULL, 10, 0),
(16, '2026-04-13 08:41:24', 'Salida automática del evento: Vacunación contra la rabia', NULL, 11, 0),
(17, '2026-04-13 09:05:00', '', NULL, NULL, 0),
(18, '2026-04-13 11:04:00', '', NULL, NULL, 0),
(19, '2026-04-13 11:15:00', '', NULL, NULL, 0),
(20, '2026-04-13 11:30:46', 'Salida automática del evento: Evento 1', NULL, 12, 0),
(21, '2026-04-13 11:35:02', 'Salida automática del evento: Evento 1', NULL, 12, 1);

-- --------------------------------------------------------
-- Tabla `stocks`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `stocks`;
CREATE TABLE `stocks` (
  `id_stock` int(11) NOT NULL,
  `cantidad_actual` int(11) NOT NULL,
  `cantidad_total_por_unidad` int(11) NOT NULL,
  `ultima_actualizacion` datetime DEFAULT NULL,
  `id_producto1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `stocks` (`id_stock`, `cantidad_actual`, `cantidad_total_por_unidad`, `ultima_actualizacion`, `id_producto1`) VALUES
(1, 7500, 30, '2026-04-13 12:53:38', 1),
(2, 88, 22, '2026-04-12 22:47:40', 6),
(3, 200, 20, '2026-04-12 22:47:40', 4),
(4, 950, 19, '2026-04-13 08:44:01', 8),
(5, 192, 8, '2026-04-13 11:35:02', 2),
(6, 45, 15, '2026-04-13 11:17:22', 3),
(7, 1440, 45, '2026-04-12 22:43:21', 5),
(8, 2500, 50, '2026-04-12 22:43:21', 11),
(9, 72, 50, '2026-04-13 09:07:28', 16),
(10, 70, 35, '2026-04-12 22:43:21', 10),
(11, 560, 35, '2026-04-13 10:50:44', 9),
(12, 420, 30, '2026-04-12 22:43:21', 14),
(13, 210, 35, '2026-04-12 22:43:21', 20),
(14, 1300, 26, '2026-04-12 22:48:08', 13),
(15, 12500, 25, '2026-04-12 22:43:21', 17),
(16, 35, 35, '2026-04-12 22:48:08', 7),
(17, 1200, 12, '2026-04-13 11:13:54', 15),
(18, 225, 15, '2026-04-12 22:43:21', 12),
(19, 2250, 30, '2026-04-12 22:43:21', 18),
(20, 20, 2, '2026-04-12 22:47:40', 19),
(21, 1400, 60, '2026-04-13 11:33:05', 23);

-- --------------------------------------------------------
-- Tabla `usuarios`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `id_rol1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `id_rol1`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$mND6DbaYm1z8k3hU6Q5vTuyGeuSWR5aXZcumIURk/fQRZZvyL41vG', 1),
(2, 'Carlos', 'carl@gmail.com', '$2y$10$EmwXrxf2Hz/Ji78GDtoUY.Xjd451sXEgCr5m7JiRZ8kZWL7483grG', 2),
(3, 'Fabian', 'fab@gmail.com', '$2y$10$SYDQruIBcME2s.7Om11u1.8M2f1ti9jIGkEscQDH1IWEH.BkNrCnG', 3),
(4, 'Andrew', 'andrew@ej.com', '$2y$10$yalBUzBEGPlLqsp3gjaR5enJBibEKV1GrSYg1X4J03XOC4kMh2JmW', 2),
(5, 'Juanito', 'rodriguezgiljuanesteban7@gmail.com', '$2y$10$sprLFFPfj8CqwjKO245iWulTDZ.jpzg3PgZksnURIXFsuPZChY9b6', 1),
(6, 'Gatito Feroz', 'ferozgatito807@gmail.com', '$2y$10$ATLxgphDd4by8IJlhV6KQuGBsRjDDV8pxGM3lBntjDgIeLHziqgOu', 2),
(7, 'Ceiba', 'ceibasoftcare@gmail.com', '$2y$10$0.D/oVVN1KzMD60uB6wjNekz4PZRhV6xWBhRayqJ311AgMdfSNEfC', 1);

-- --------------------------------------------------------
-- Tabla `verificaciones`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `verificaciones`;
CREATE TABLE `verificaciones` (
  `id_verificacion` int(11) NOT NULL,
  `tipo_verificacion` varchar(10) NOT NULL,
  `fecha` date NOT NULL,
  `reistro_au` int(11) NOT NULL,
  `propietario` varchar(100) NOT NULL,
  `id_propietario` varchar(20) NOT NULL,
  `direccion` varchar(30) NOT NULL,
  `contacto` varchar(13) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `descripcion` varchar(1000) NOT NULL,
  `registro_fotografico` varchar(250) DEFAULT NULL,
  `id_animal1` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------
-- Índices
-- --------------------------------------------------------

ALTER TABLE `animales`
  ADD PRIMARY KEY (`id_animal`),
  ADD KEY `fk_animales_usuarios1` (`id_usuario1`);

ALTER TABLE `detalles_entradas_pro`
  ADD PRIMARY KEY (`id_detalle_entrada`),
  ADD KEY `fk_detalles_entradas_pro_productos1` (`id_producto1`),
  ADD KEY `fk_detalles_entradas_pro_entradas_productos1` (`id_entrada1`);

ALTER TABLE `detalles_salidas_pro`
  ADD PRIMARY KEY (`id_detalle_salida`),
  ADD KEY `fk_detalles_salidas_pro_productos1` (`id_producto1`),
  ADD KEY `fk_detalles_salidas_pro_salidas_productos1` (`id_salida1`);

ALTER TABLE `entradas_productos`
  ADD PRIMARY KEY (`id_entrada`);

ALTER TABLE `eventos`
  ADD PRIMARY KEY (`id_evento`);

ALTER TABLE `eventos_clinicos`
  ADD PRIMARY KEY (`id_evento`),
  ADD KEY `fk_eventos_clinicos_historias_medicas1` (`id_historia1`);

ALTER TABLE `examenes_fisicos`
  ADD PRIMARY KEY (`id_examen_fisico`),
  ADD KEY `fk_examenes_fisicos_historias_medicas1` (`id_historia1`);

ALTER TABLE `historias_medicas`
  ADD PRIMARY KEY (`id_historia_medica`),
  ADD KEY `fk_historias_medicas_animales1` (`id_animal1`);

ALTER TABLE `ingresos_animales`
  ADD PRIMARY KEY (`id_ingreso`),
  ADD KEY `fk_ingresos_animales_verificaciones1` (`id_verificacion1`);

ALTER TABLE `inicio_sesion`
  ADD PRIMARY KEY (`id_inicio_sesion`),
  ADD KEY `fk_inicio_sesion_usuarios` (`id_usuario1`);

ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_productos_usuarios1` (`id_usuario1`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

ALTER TABLE `salidas_animales`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `fk_salidas_animales_animales1` (`animales_id_animales`);

ALTER TABLE `salidas_productos`
  ADD PRIMARY KEY (`id_salida`),
  ADD KEY `fk_salida_evento` (`id_evento1`),
  ADD KEY `fk_salida_evento_clinico` (`id_evento_clinico1`);

ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id_stock`),
  ADD KEY `fk_stocks_productos1` (`id_producto1`);

ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `fk_usuarios_roles1` (`id_rol1`);

ALTER TABLE `verificaciones`
  ADD PRIMARY KEY (`id_verificacion`),
  ADD KEY `fk_verificaciones_animales1` (`id_animal1`);

-- --------------------------------------------------------
-- Triggers `detalles_entradas_pro`
-- --------------------------------------------------------

DROP TRIGGER IF EXISTS `tr_desactivar_detalle_entrada`;
DROP TRIGGER IF EXISTS `tr_insertar_detalle_entrada`;
DELIMITER $$
CREATE TRIGGER `tr_desactivar_detalle_entrada`
BEFORE UPDATE ON `detalles_entradas_pro`
FOR EACH ROW
BEGIN
    IF OLD.activo = 1 AND NEW.activo = 0 THEN
        UPDATE stocks
        SET cantidad_actual = cantidad_actual - OLD.cantidad_total,
            cantidad_total_por_unidad = cantidad_total_por_unidad - OLD.cantidad_presentacion,
            ultima_actualizacion = NOW()
        WHERE id_producto1 = OLD.id_producto1;
    END IF;
END
$$
CREATE TRIGGER `tr_insertar_detalle_entrada`
AFTER INSERT ON `detalles_entradas_pro`
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM stocks WHERE id_producto1 = NEW.id_producto1) THEN
        UPDATE stocks
        SET cantidad_actual = cantidad_actual + NEW.cantidad_total,
            cantidad_total_por_unidad = cantidad_total_por_unidad + NEW.cantidad_presentacion,
            ultima_actualizacion = NOW()
        WHERE id_producto1 = NEW.id_producto1;
    ELSE
        INSERT INTO stocks (id_producto1, cantidad_actual, cantidad_total_por_unidad, ultima_actualizacion)
        VALUES (NEW.id_producto1, NEW.cantidad_total, NEW.cantidad_presentacion, NOW());
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Triggers `detalles_salidas_pro`
-- --------------------------------------------------------

DROP TRIGGER IF EXISTS `tr_insertar_detalle_salida`;
DROP TRIGGER IF EXISTS `trg_after_delete_detalle_salida`;
DROP TRIGGER IF EXISTS `trg_after_update_detalle_salida`;
DELIMITER $$
CREATE TRIGGER `tr_insertar_detalle_salida`
BEFORE INSERT ON `detalles_salidas_pro`
FOR EACH ROW
BEGIN
    SET @stock_actual = (
        SELECT cantidad_actual FROM stocks WHERE id_producto1 = NEW.id_producto1
    );

    IF @stock_actual IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto no tiene stock registrado.';
    END IF;

    IF @stock_actual - NEW.cantidad_total < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Stock insuficiente para registrar la salida.';
    END IF;

    UPDATE stocks
    SET cantidad_actual = cantidad_actual - NEW.cantidad_total,
        cantidad_total_por_unidad = cantidad_total_por_unidad - NEW.cantidad_presentacion,
        ultima_actualizacion = NOW()
    WHERE id_producto1 = NEW.id_producto1;
END
$$
CREATE TRIGGER `trg_after_delete_detalle_salida`
AFTER DELETE ON `detalles_salidas_pro`
FOR EACH ROW
BEGIN
    UPDATE stocks
    SET cantidad_actual = cantidad_actual + OLD.cantidad_total,
        cantidad_total_por_unidad = cantidad_total_por_unidad + OLD.cantidad_presentacion,
        ultima_actualizacion = NOW()
    WHERE id_producto1 = OLD.id_producto1;
END
$$
CREATE TRIGGER `trg_after_update_detalle_salida`
AFTER UPDATE ON `detalles_salidas_pro`
FOR EACH ROW
BEGIN
    DECLARE stock_disponible DECIMAL(10,2);

    SELECT (cantidad_actual + OLD.cantidad_total) INTO stock_disponible
    FROM stocks
    WHERE id_producto1 = NEW.id_producto1;

    IF stock_disponible < NEW.cantidad_total THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: Stock insuficiente para actualizar la salida.';
    ELSE
        UPDATE stocks
        SET cantidad_actual = stock_disponible - NEW.cantidad_total,
            ultima_actualizacion = NOW()
        WHERE id_producto1 = NEW.id_producto1;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Triggers `eventos`
-- --------------------------------------------------------

DROP TRIGGER IF EXISTS `after_insert_eventos`;
DROP TRIGGER IF EXISTS `after_update_evento`;
DROP TRIGGER IF EXISTS `desactivar_salidas_evento`;
DELIMITER $$
CREATE TRIGGER `after_insert_eventos`
AFTER INSERT ON `eventos`
FOR EACH ROW
BEGIN
    IF NEW.requiere_producto = 1 THEN
        INSERT INTO salidas_productos (
            id_evento1,
            fecha_hora,
            observaciones
        ) VALUES (
            NEW.id_evento,
            NOW(),
            CONCAT('Salida automática del evento: ', NEW.nombre)
        );
    END IF;
END
$$
CREATE TRIGGER `after_update_evento`
AFTER UPDATE ON `eventos`
FOR EACH ROW
BEGIN
    IF OLD.requiere_producto = 1 AND NEW.requiere_producto = 0 THEN
        UPDATE detalles_salidas_pro dp
        JOIN salidas_productos sp ON sp.id_salida = dp.id_salida1
        SET dp.activo = 0
        WHERE sp.id_evento1 = OLD.id_evento;

        UPDATE salidas_productos
        SET activo = 0
        WHERE id_evento1 = OLD.id_evento;
    END IF;

    IF OLD.requiere_producto = 0 AND NEW.requiere_producto = 1 THEN
        INSERT INTO salidas_productos (id_evento1, fecha_hora, observaciones)
        VALUES (NEW.id_evento, NOW(), CONCAT('Salida automática del evento: ', NEW.nombre));
    END IF;

    IF OLD.requiere_producto = 1 AND NEW.requiere_producto = 1 AND OLD.nombre <> NEW.nombre THEN
        UPDATE salidas_productos
        SET observaciones = CONCAT('Salida automática del evento: ', NEW.nombre)
        WHERE id_evento1 = NEW.id_evento AND activo = 1;
    END IF;
END
$$
CREATE TRIGGER `desactivar_salidas_evento`
AFTER UPDATE ON `eventos`
FOR EACH ROW
BEGIN
    IF NEW.activo = 0 AND OLD.activo = 1 THEN
        UPDATE detalles_salidas_pro dp
        JOIN salidas_productos sp ON sp.id_salida = dp.id_salida1
        SET dp.activo = 0
        WHERE sp.id_evento1 = OLD.id_evento;

        UPDATE salidas_productos
        SET activo = 0
        WHERE id_evento1 = OLD.id_evento;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Triggers `eventos_clinicos`
-- --------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_crear_salida_evento`;
DROP TRIGGER IF EXISTS `trg_crear_salida_evento_clinico`;
DELIMITER $$
CREATE TRIGGER `trg_crear_salida_evento`
AFTER INSERT ON `eventos_clinicos`
FOR EACH ROW
BEGIN
    IF NEW.requiere_producto = 1 THEN
        INSERT INTO salidas_productos (
            fecha_hora,
            observaciones,
            id_evento1
        ) VALUES (
            NOW(),
            CONCAT('Salida generada - Evento #', NEW.id_evento),
            NEW.id_evento
        );
    END IF;
END
$$
CREATE TRIGGER `trg_crear_salida_evento_clinico`
AFTER INSERT ON `eventos_clinicos`
FOR EACH ROW
BEGIN
    IF NEW.requiere_producto = 1 THEN
        INSERT INTO salidas_productos (
            fecha_hora,
            observaciones,
            id_evento_clinico1
        ) VALUES (
            NOW(),
            CONCAT('Salida generada - Evento #', NEW.id_evento),
            NEW.id_evento
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Triggers `salidas_productos`
-- --------------------------------------------------------

DROP TRIGGER IF EXISTS `trg_un_solo_evento`;
DROP TRIGGER IF EXISTS `trg_un_solo_evento_update`;
DELIMITER $$
CREATE TRIGGER `trg_un_solo_evento`
BEFORE INSERT ON `salidas_productos`
FOR EACH ROW
BEGIN
    IF NEW.id_evento1 IS NOT NULL AND NEW.id_evento_clinico1 IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Una salida no puede pertenecer a dos eventos al mismo tiempo';
    END IF;
END
$$
CREATE TRIGGER `trg_un_solo_evento_update`
BEFORE UPDATE ON `salidas_productos`
FOR EACH ROW
BEGIN
    IF NEW.id_evento1 IS NOT NULL AND NEW.id_evento_clinico1 IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Una salida no puede pertenecer a dos eventos al mismo tiempo';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------
-- Procedimientos
-- --------------------------------------------------------

DROP PROCEDURE IF EXISTS `ActividadReciente`;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `ActividadReciente` () NO SQL
BEGIN
    SELECT p.nombre AS producto,
           e.fecha_hora AS fecha,
           dep.cantidad_presentacion AS cantidad,
           'Entrada' AS actividad
      FROM detalles_entradas_pro dep
      JOIN productos p ON dep.id_producto1 = p.id_producto
      JOIN entradas_productos e ON dep.id_entrada1 = e.id_entrada
    UNION
    SELECT p.nombre AS producto,
           s.fecha_hora AS fecha,
           dsp.cantidad_presentacion AS cantidad,
           'Salida' AS actividad
      FROM detalles_salidas_pro dsp
      JOIN productos p ON dsp.id_producto1 = p.id_producto
      JOIN salidas_productos s ON dsp.id_salida1 = s.id_salida
    ORDER BY fecha DESC;
END$$
DELIMITER ;

-- --------------------------------------------------------
-- AUTO_INCREMENT
-- --------------------------------------------------------

ALTER TABLE `animales`
  MODIFY `id_animal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `detalles_entradas_pro`
  MODIFY `id_detalle_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

ALTER TABLE `detalles_salidas_pro`
  MODIFY `id_detalle_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

ALTER TABLE `entradas_productos`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

ALTER TABLE `eventos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `eventos_clinicos`
  MODIFY `id_evento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `examenes_fisicos`
  MODIFY `id_examen_fisico` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `historias_medicas`
  MODIFY `id_historia_medica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `inicio_sesion`
  MODIFY `id_inicio_sesion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `salidas_productos`
  MODIFY `id_salida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

ALTER TABLE `stocks`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
