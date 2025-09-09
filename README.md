# Gasolineras Extremadura

Este repositorio contiene una aplicación web sencilla para consultar los precios de las gasolineras en Extremadura, España. La aplicación permite a los usuarios ver los precios de la gasolina 95 E5 y el gasóleo A, así como ordenar las estaciones por precio o cercanía (requiere permiso de geolocalización).

## Características

*   Consulta de precios de gasolina 95 E5 y gasóleo A.
*   Filtrado por municipios: Mérida, Badajoz y Cáceres.
*   Ordenación de estaciones por precio de gasolina 95 E5, gasóleo A o por cercanía.
*   Integración con Google Maps para la ubicación de las gasolineras.
*   Notificaciones interactivas mediante SweetAlert2.
*   Diseño responsivo para diferentes dispositivos.

## Tecnologías Utilizadas

*   **HTML5**: Estructura de la aplicación.
*   **CSS3**: Estilos y diseño, incluyendo un gradiente de fondo y tarjetas para las estaciones.
*   **JavaScript**: Lógica de la aplicación, interacción con la API y manejo de la geolocalización.
*   **Bootstrap 5.3.3**: Framework CSS para un diseño responsivo y componentes predefinidos.
*   **SweetAlert2**: Librería para notificaciones y alertas personalizadas.
*   **API del Ministerio para la Transición Ecológica y el Reto Demográfico (España)**: Para obtener los datos actualizados de los precios de los carburantes.

## Instalación y Uso

Para ejecutar esta aplicación no es necesario realizar ningún tipo de descarga, ya que puede ser visitada mediante GitHub Pages en este enlance: https://adanprietobenegas.github.io/Gasolineras-Extremadura/ 

## Estructura del Proyecto

*   `index.html`: Archivo principal HTML que define la estructura de la interfaz de usuario.
*   `script.js`: Contiene la lógica JavaScript para la obtención de datos de la API, cálculo de distancias, manejo de eventos de los botones y renderizado de las estaciones de servicio.
*   `style.css`: Define los estilos CSS para la apariencia de la aplicación, incluyendo el diseño responsivo y los colores.

## Propuesta de Mejora
* Añadir distintos pueblos y ciudades de la comarca de Extremadura.
* Añadir otras Comunidades Autónomas.
