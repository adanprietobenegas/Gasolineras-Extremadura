const IDMERIDA = 712;
const IDBADAJOZ = 644;
const IDCACERES = 1579;

let container;
let ultimaLista = []; // Guarda la última lista recibida

let userLat = null;
let userLng = null;

if (navigator.geolocation) { // Si el navegador soporta geolocalización y se da permiso muestra los kilómetros desde tu ubicación actual
  navigator.geolocation.getCurrentPosition(
    position => {
      userLat = position.coords.latitude;
      userLng = position.coords.longitude;
      if (ultimaLista.length > 0) mostrarEstaciones(ultimaLista);
    },
    error => {
notify("warning", "Necesitamos tu permiso para calcular distancias. Puedes permitir la ubicación o continuar sin este cálculo.", "Permiso denegado");
    }
  );
}

function calcularDistancia(lat1, lon1, lat2, lon2) { 
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function notify(type, text, title) { // Notificación de SweetAlert para el modal
  Swal.fire({
    icon: type,                  
    title: title || undefined,
    text,
    confirmButtonText: "Aceptar"
  });
}


// Llama a la API con un ID de municipio y devuelve una lista de estaciones
function cargarEstaciones(idMunicipio) {
  const spinner = document.getElementById("spinner");
  spinner.style.display = "block";
  container.innerHTML = "";

  const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`;
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Error en la petición");
      return response.json();
    })
    .then(data => {
      spinner.style.display = "none";
      ultimaLista = data.ListaEESSPrecio;
      mostrarEstaciones(ultimaLista);
    })
    .catch(error => {
      spinner.style.display = "none";
notify("error", "No se pudieron cargar las estaciones. Inténtalo de nuevo más tarde.", "Error de red");
    });
}

// Función principal para mostrar en pantalla las estaciones y sus precios
function mostrarEstaciones(lista, resaltarExtremos = false) {
  container.innerHTML = "";
  const listaFiltrada = lista.filter(e =>  // Si no existen precios al ordenar, no se muestran
    (e["Precio Gasoleo A"] && e["Precio Gasoleo A"].trim() !== "") ||
    (e["Precio Gasolina 95 E5"] && e["Precio Gasolina 95 E5"].trim() !== "")
  );
  const max = Math.min(listaFiltrada.length, 30);

  const row = document.createElement("div");
  row.className = "row g-4 justify-content-center";

  for (let i = 0; i < max; i++) {
    const estacion = listaFiltrada[i];

    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    const card = document.createElement("div");
    card.className = "station card shadow-sm h-100";

    // Resalta la primera y última estación si están ordenadas por precio o distancia
    if (resaltarExtremos && i === 0) card.classList.add("bg-barato");
    if (resaltarExtremos && i === max - 1) card.classList.add("bg-caro");

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const direccion = document.createElement("h5");
    direccion.className = "card-title";

    // Muestra la dirección proporcionada por la API
    direccion.textContent = estacion.Dirección;

    // Enlace a Google Maps usando la dirección y/o coordenadas recogidas en la API
    const mapsUrl = estacion["Latitud"] && estacion["Longitud (WGS84)"]
      ? `https://www.google.com/maps/search/?api=1&query=${estacion["Latitud"].replace(",", ".")},${estacion["Longitud (WGS84)"].replace(",", ".")}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(estacion.Dirección)}`;

    const enlaceMaps = document.createElement("a");
    enlaceMaps.href = mapsUrl;
    enlaceMaps.target = "_blank";
    enlaceMaps.rel = "noopener noreferrer"; // Seguridad, evita filtrar la URL de origen
    enlaceMaps.className = "ms-2";
    enlaceMaps.innerHTML = `<img src="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/geo-alt.svg" alt="Abrir en Google Maps" style="height: 24px; vertical-align: middle;">`;

    direccion.appendChild(enlaceMaps);
    
    const gasoleo = document.createElement("p");
    gasoleo.className = "card-text mb-1 text-success";
    gasoleo.innerHTML = `<strong>Gasóleo A:</strong> ${estacion["Precio Gasoleo A"] || "N/D"} €`;
    
    const gasolina = document.createElement("p");
    gasolina.className = "card-text text-warning";
    gasolina.innerHTML = `<strong>Gasolina 95 E5:</strong> ${estacion["Precio Gasolina 95 E5"] || "N/D"} €`;
    
    cardBody.append(direccion, gasoleo, gasolina);
    
    if (userLat !== null && userLng !== null && estacion["Latitud"] && estacion["Longitud (WGS84)"]) {
      const latEst = parseFloat(estacion["Latitud"].replace(",", "."));
      const lngEst = parseFloat(estacion["Longitud (WGS84)"].replace(",", "."));
      const distancia = calcularDistancia(userLat, userLng, latEst, lngEst);
    
      const distanciaElem = document.createElement("p");
      distanciaElem.className = "card-text text-info fw-bold mt-2";
      distanciaElem.innerHTML = `<strong>Distancia:</strong> ${distancia.toFixed(2)} km`;
      cardBody.appendChild(distanciaElem);
    }

    card.appendChild(cardBody);
    col.appendChild(card);
    row.appendChild(col);
  }
  container.appendChild(row);
}


// Inicializa el contenedor y los botones
document.addEventListener("DOMContentLoaded", () => {
  container = document.getElementById("container");

  const btnMerida = document.getElementById("btn-merida");
  const btnBadajoz = document.getElementById("btn-badajoz");
  const btnCaceres = document.getElementById("btn-caceres");
  const btnOrdenarGasolina = document.getElementById("ordenar-gasolina");
  const btnOrdenarGasoleo = document.getElementById("ordenar-gasoleo");
  const btnOrdenarCercania = document.getElementById("ordenar-cercania");

  function activarBoton(activo) {
    btnMerida.disabled = activo === "merida";
    btnBadajoz.disabled = activo === "badajoz";
    btnCaceres.disabled = activo === "caceres";

    btnMerida.classList.toggle("activo", activo === "merida");
    btnBadajoz.classList.toggle("activo", activo === "badajoz");
    btnCaceres.classList.toggle("activo", activo === "caceres");
  }

  btnBadajoz.addEventListener("click", () => {
    cargarEstaciones(IDBADAJOZ);
    activarBoton("badajoz");
  });
  btnCaceres.addEventListener("click", () => {
    cargarEstaciones(IDCACERES);
    activarBoton("caceres");
  });
  btnMerida.addEventListener("click", () => {
    cargarEstaciones(IDMERIDA);
    activarBoton("merida");
  });

  btnOrdenarGasolina.addEventListener("click", () => {
    const listaFiltrada = ultimaLista.filter(e =>
      e["Precio Gasolina 95 E5"] && e["Precio Gasolina 95 E5"].trim() !== ""
    );
    const listaOrdenada = listaFiltrada.sort((a, b) => {
      const precioA = parseFloat(a["Precio Gasolina 95 E5"].replace(",", "."));
      const precioB = parseFloat(b["Precio Gasolina 95 E5"].replace(",", "."));
      return precioA - precioB;
    });
    mostrarEstaciones(listaOrdenada, true);
  });

  btnOrdenarGasoleo.addEventListener("click", () => {
    const listaFiltrada = ultimaLista.filter(e =>
      e["Precio Gasoleo A"] && e["Precio Gasoleo A"].trim() !== ""
    );
    const listaOrdenada = listaFiltrada.sort((a, b) => {
      const precioA = parseFloat(a["Precio Gasoleo A"].replace(",", "."));
      const precioB = parseFloat(b["Precio Gasoleo A"].replace(",", "."));
      return precioA - precioB;
    });
    mostrarEstaciones(listaOrdenada, true);
  });

  btnOrdenarCercania.addEventListener("click", () => {
    if (userLat === null || userLng === null) {
      notify("error", "No se pudo obtener tu ubicación. Activa la geolocalización o recarga la página.", "Ubicación no disponible");
      return;
    }
    const listaFiltrada = ultimaLista.filter(e =>
      ((e["Latitud"] && e["Latitud"].trim() !== "") &&
       (e["Longitud (WGS84)"] && e["Longitud (WGS84)"].trim() !== ""))
    );
    const listaOrdenada = listaFiltrada.sort((a, b) => {
      const distA = calcularDistancia(
        userLat,
        userLng,
        parseFloat(a["Latitud"].replace(",", ".")),
        parseFloat(a["Longitud (WGS84)"].replace(",", "."))
      );
      const distB = calcularDistancia(
        userLat,
        userLng,
        parseFloat(b["Latitud"].replace(",", ".")),
        parseFloat(b["Longitud (WGS84)"].replace(",", "."))
      );
      return distA - distB;
    });
    mostrarEstaciones(listaOrdenada, false);
  });

  // Por defecto Mérida, también deshabilita Mérida de los botones
  activarBoton("merida");
  cargarEstaciones(IDMERIDA);
});