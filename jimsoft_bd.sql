-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3603
-- Tiempo de generación: 15-09-2023 a las 14:57:53
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.0.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `jimsoft_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleadocliente`
--

CREATE TABLE `empleadocliente` (
  `idEmpleadoCliente` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `apellido` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `tipoIdentificacion` enum('Cedula','Tarjeta de Identidad','Pasaporte') COLLATE utf8_unicode_ci NOT NULL,
  `identificacion` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `telefono` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `direccion` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `estado` enum('Activo','Eliminado') COLLATE utf8_unicode_ci NOT NULL,
  `genero` enum('Masculino','Femenino') COLLATE utf8_unicode_ci NOT NULL,
  `registradopor` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `modificadopor` varchar(100) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `fechahorareg` datetime NOT NULL DEFAULT current_timestamp(),
  `fechahoramod` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `empleadocliente`
--

INSERT INTO `empleadocliente` (`idEmpleadoCliente`, `nombre`, `apellido`, `tipoIdentificacion`, `identificacion`, `fechaNacimiento`, `email`, `telefono`, `direccion`, `estado`, `genero`, `registradopor`, `modificadopor`, `fechahorareg`, `fechahoramod`) VALUES
(1, 'Jimmy Andrés', 'Núñez Astudillo', 'Cedula', '1061730370', '1990-07-10', 'jimmy-9010@hotmail.com', '3206048323', 'Car 20A # 2-14 B/Pandiguando', 'Activo', 'Masculino', 'Sistema', '', '2023-09-07 12:06:31', '0000-00-00 00:00:00'),
(2, 'Cristian Jesús', 'Núñez Astudillo', 'Cedula', '1061790706', '1996-05-27', 'cjnacris@gmail.com', '3104044115', 'Car 20A # 2-14 B/Pandiguando', 'Activo', 'Masculino', 'Sistema', '', '2023-09-07 12:06:31', '0000-00-00 00:00:00'),
(3, 'RUBIELA', 'ASTUDILLO ESPINOSA', 'Cedula', '34550334', '1960-07-18', 'rubiela600718@gmail.com', '3206053503', 'CAR 20A # 2-14 B/PANDIGUANDO', 'Activo', 'Femenino', 'jnunez', '', '2023-09-09 16:10:17', '0000-00-00 00:00:00'),
(4, 'BEATRIZ EUGENIA', 'CUCUÑAME VALENCIA', 'Cedula', '25279114', '1979-02-19', 'beatrizeu2006@gmail.com', '3166168147', 'MANZANA 13 CASA 10 APARTAMENTO 101', 'Activo', 'Femenino', 'jnunez', 'jnunez', '2023-09-09 16:12:58', '2023-09-09 18:19:53'),
(5, 'JOSÉ IVÁN', 'NÚÑEZ ASTDUILLO', 'Cedula', '1061744911', '1992-01-21', 'ivancho909090@gmail.com', '3123699193', 'CAR 20A # 2-14 B/PANDIGUANDO', 'Activo', 'Masculino', 'jnunez', '', '2023-09-10 13:58:28', '0000-00-00 00:00:00'),
(6, 'JOSÉ GILBERTO', 'NÚÑEZ SERRANO', 'Cedula', '13440392', '1956-07-20', 'jognuse@hotmail.com', '3105059015', 'CAR 20A # 2-14 B/PANDIGUANDO', 'Activo', 'Masculino', 'jnunez', '', '2023-09-14 12:49:53', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `eventos`
--

CREATE TABLE `eventos` (
  `idEvento` int(11) UNSIGNED NOT NULL,
  `title` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8_unicode_ci NOT NULL,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `color` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `textColor` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `allDay` enum('false','true') COLLATE utf8_unicode_ci NOT NULL,
  `estado` enum('Activo','Eliminado') COLLATE utf8_unicode_ci NOT NULL,
  `registradopor` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `modificadopor` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `fechahorareg` datetime NOT NULL DEFAULT current_timestamp(),
  `fechahoramod` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `eventos`
--

INSERT INTO `eventos` (`idEvento`, `title`, `descripcion`, `start`, `end`, `color`, `textColor`, `allDay`, `estado`, `registradopor`, `modificadopor`, `fechahorareg`, `fechahoramod`) VALUES
(1, 'SEMANA SANTA', 'La Semana Santa​ es la conmemoración cristiana anual de la pasión de Cristo, es decir, de la entrada a Jerusalén, la última cena, el viacrucis, la muerte y resurrección de Jesús de Nazaret.', '2023-09-11 00:00:00', '2023-09-16 00:00:00', '#ac3956', '#ffffff', 'true', 'Activo', 'jnunez', 'jnunez', '2023-09-12 14:35:12', '2023-09-13 12:14:52'),
(2, 'PARTIDO DE COLOMBIA', 'El próximo martes 12 de septiembre Colombia se medirá frente a Chile en Santiago. El duelo es válido por la segunda jornada de las Eliminatorias rumbo a la Copa Mundial de la FIFA, en Estados Unidos, México y Canadá 2026.', '2023-09-12 19:30:00', '2023-09-12 21:30:00', '#e3e60f', '#2f2d8b', 'false', 'Activo', 'jnunez', '', '2023-09-12 14:39:39', '0000-00-00 00:00:00'),
(3, 'FELIZ NAVIDAD', 'La Navidad es una de las festividades más importantes del cristianismo, junto con la Pascua de resurrección y Pentecostés', '2023-09-25 00:00:00', '2023-09-25 00:00:00', '#47ac39', '#990000', 'true', 'Activo', 'jnunez', '', '2023-09-12 14:56:13', '0000-00-00 00:00:00'),
(4, 'REUNION CON LOS INVERSIONISTAS', 'Reunión con los inversionistas', '2023-09-12 08:00:00', '2023-09-12 18:00:00', '#3987ad', '#ffffff', 'false', 'Activo', 'jnunez', 'jnunez', '2023-09-12 15:00:23', '2023-09-13 12:14:47'),
(5, 'SALIR ALMORZAR CON LOS INVERSIONISTAS', 'Salir almorzar con los inversionistas.', '2023-09-14 12:00:00', '2023-09-14 14:00:00', '#3987ad', '#ffffff', 'false', 'Activo', 'jnunez', 'jnunez', '2023-09-12 15:01:59', '2023-09-13 14:17:15'),
(6, 'PARTIDO DE COLOMBIA', 'La selección de fútbol de Colombia es el equipo que representa a dicho país en las competiciones oficiales de fútbol masculino desde 1924. Su organización está a cargo de la Federación Colombiana de Fútbol y desde 1936 se encuentra afiliada tanto a la FIFA como a la Conmebol, de la cual es miembro asociado.', '2023-09-14 14:00:00', '2023-09-14 16:00:00', '#e8f901', '#2328b3', 'false', 'Activo', 'jnunez', 'jnunez', '2023-09-12 15:04:06', '2023-09-13 14:17:19'),
(7, 'REUNIÓN CON LOS INVERSIONISTAS', 'Reunión con los inversionistas', '2023-09-14 08:00:00', '2023-09-14 18:00:00', '#3987ad', '#ffffff', 'false', 'Activo', 'jnunez', 'jnunez', '2023-09-13 14:19:04', '2023-09-13 14:19:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(10) UNSIGNED NOT NULL,
  `idEmpleadoCliente` int(10) UNSIGNED DEFAULT NULL,
  `idRol` int(10) UNSIGNED NOT NULL,
  `usuario` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `login` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordseguro` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('Activo','Bloqueado','Eliminado','Registrado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `registradopor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `modificadopor` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fechahorareg` datetime NOT NULL,
  `fechahoramod` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `idEmpleadoCliente`, `idRol`, `usuario`, `login`, `password`, `passwordseguro`, `foto`, `estado`, `registradopor`, `modificadopor`, `fechahorareg`, `fechahoramod`) VALUES
(1, 1, 1, 'Jimmy Andrés Núñez Astudillo', 'jnunez', '$2y$10$veHGEgoTMntc6tjO4I1KEej38B3ehOBmbk/qY6.Joa4BYnPKxyGNC', 'F0rc3@rmy4lfa', '521AAFCE422405BC074A4A1EB42B9125.jpg', 'Activo', 'Sistema', 'jnunez', '2022-04-11 16:24:29', '2023-09-15 14:02:24');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `empleadocliente`
--
ALTER TABLE `empleadocliente`
  ADD PRIMARY KEY (`idEmpleadoCliente`);

--
-- Indices de la tabla `eventos`
--
ALTER TABLE `eventos`
  ADD PRIMARY KEY (`idEvento`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD KEY `idEmpleado` (`idEmpleadoCliente`),
  ADD KEY `idRol` (`idRol`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `empleadocliente`
--
ALTER TABLE `empleadocliente`
  MODIFY `idEmpleadoCliente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `eventos`
--
ALTER TABLE `eventos`
  MODIFY `idEvento` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
