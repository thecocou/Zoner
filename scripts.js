/*jshint esversion: 6*/

function initZoner(){
  // Cargo mapa
  var mapa = initMap();
	// Cargo info sobre las Zonas
  var Zonas = cargarZonas();
  // muestro las Zonas en el mapa
  var poligonosZonas = mostrarZonasEnMapa(Zonas, mapa);
  // Cargo Zonas a la barra lateral
  mostrarZonasEnHTML(Zonas, "listaDeZonas", "nombreZona");
  // variable para encontrar la direccion
  var geocoder = new google.maps.Geocoder();
  var marcador = new google.maps.Marker({map: mapa});
  var botonBuscar = document.getElementById('buscar');
  var direccion = document.getElementById('direccion').value;
  var ciudad = document.getElementById('ciudad').value;
  // Al hacer click en buscar geocodificar la direccion
  botonBuscar.addEventListener('click', function(geocoder, mapa, direccion, ciudad, marcador) {
    // geocodificar la direccion
    GeocodificarDireccion(geocoder, mapa, direccion, ciudad, marcador);
    console.log(marcador);

    var latlng = marcador.getPosition();
    // listar la direccion en la variable que le corresponde a la zona
    var listaDeDirecciones = enQueZonaEsta(latlng, Zonas, direccion);

  //  blanquearInput("direccion");
  //  eliminarElemento("tips");
  });
  //lista[numero].push(ultimadireccion);
}
  //imprimirDireccionesHTML(listaDeDirecciones, elemento, "Zona 1", "direccionesListadas");

  // AGREGAR LA ULTIMA DIRECCION AL ARRAY
  //direccionesIngresadas.push(address);

  // Guardar direccion ingresada
  //listar(direccionesIngresadas,"direcciones","");

  // FUNCION PARA INICIAR EL MAPA
function initMap() {
  // Creo el mapa
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.618356, lng:-58.433464},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  return map;
}
//Agregar Polygons
function cargarZonas(){
  let zona =
  [
    {
      //   zona 1
      nombre: "Zona 1",
      notificador: "Manzur",
	    coordenadas: [{lat:-34.6590200, lng:-58.38837810},
					          {lat:-34.6092438, lng:-58.39195599},
					          {lat:-34.6060835, lng:-58.33353984},
					          {lat:-34.6281219, lng:-58.33079326},
					          {lat:-34.6552390, lng:-58.36606979}],
      color: "#FE2E2E"
    },
    {
      // Zona 2
      nombre: "Zona 2",
      notificador: "ATilio",
	    coordenadas: [{lat:-34.6092220, lng:-58.39199439},
                    {lat:-34.5958525, lng:-58.39333090},
                    {lat:-34.5938346, lng:-58.39307470},
                    {lat:-34.5926939, lng:-58.39286429},
                    {lat:-34.5875521, lng:-58.38708529},
                    {lat:-34.5725909, lng:-58.36649882},
                    {lat:-34.6060835, lng:-58.33353984}],
     color: "#FF00BF"
    },
    {
	  // Zona 3
      nombre: "Zona 3",
      notificador: "Gonzalez",
	    coordenadas: [{lat:-34.6590200, lng:-58.38837810},
                    {lat:-34.6092438, lng:-58.39195599},
                    {lat:-34.6114395, lng:-58.42100729},
                    {lat:-34.6204466, lng:-58.44124039},
                    {lat:-34.6263987, lng:-58.44043799},
                    {lat:-34.6265536, lng:-58.44125769},
                    {lat:-34.6346166, lng:-58.43573340},
                    {lat:-34.6363153, lng:-58.43363180},
                    {lat:-34.6388898, lng:-58.43256680},
                    {lat:-34.6451739, lng:-58.43209439},
                    {lat:-34.6554344, lng:-58.41805560},
                    {lat:-34.6562693, lng:-58.41643709},
                    {lat:-34.6613460, lng:-58.41696739},
                    {lat:-34.6639581, lng:-58.39113235}],
      color: "#ff903e"
    },
    {
    // Zona 4
      nombre: "Zona x",
      notificador: "Xrivier",
      coordenadas: [{lat:-34.6204466, lng:-58.44124039},
                    {lat:-34.6263987, lng:-58.44043799},
                    {lat:-34.6265536, lng:-58.44125769},
                    {lat:-34.6346166, lng:-58.43573340},
                    {lat:-34.6363153, lng:-58.43363180},
                    {lat:-34.6388898, lng:-58.43256680},
                    {lat:-34.6451739, lng:-58.43209439},
                    {lat:-34.6554344, lng:-58.41805560},
                    {lat:-34.6562693, lng:-58.41643709},
                    {lat:-34.6625109, lng:-58.41748237},
                    {lat:-34.7082452, lng:-58.45829486},
                    {lat:-34.6544624, lng:-58.52781772},
                    {lat:-34.6394577, lng:-58.52957725},
                    {lat:-34.6388220, lng:-58.52253389},
                    {lat:-34.6393221, lng:-58.51141530},
                    {lat:-34.6380897, lng:-58.50393489},
                    {lat:-34.6365836, lng:-58.49363560},
                    {lat:-34.6307082, lng:-58.46964969},
                    {lat:-34.6279616, lng:-58.45985559}],
      color: "#fce000"
    },
    {
	  // Zona 5
      nombre: "Zona 5",
      notificador: "Pablo",
	    coordenadas: [{lat:-34.6394577, lng:-58.52957725},
                    {lat:-34.6388220, lng:-58.52253389},
                    {lat:-34.6393221, lng:-58.51141530},
                    {lat:-34.6380897, lng:-58.50393489},
                    {lat:-34.6365836, lng:-58.49363560},
                    {lat:-34.6307082, lng:-58.46964969},
                    {lat:-34.6279616, lng:-58.45985559},
                    {lat:-34.6204466, lng:-58.44124039},
                    {lat:-34.6154380, lng:-58.43004600},
                    {lat:-34.6087526, lng:-58.43045240},
                    {lat:-34.6042977, lng:-58.43661109},
                    {lat:-34.6022090, lng:-58.44246420},
                    {lat:-34.5993044, lng:-58.45093059},
                    {lat:-34.5966673, lng:-58.45920999},
                    {lat:-34.5962296, lng:-58.47031229},
                    {lat:-34.5978207, lng:-58.48308329},
                    {lat:-34.5968256, lng:-58.49676880},
                    {lat:-34.5897030, lng:-58.51784959},
                    {lat:-34.6157624, lng:-58.53086471}],
      color: "#00c2ac"
    },
	  {
       // Zona 6
       nombre: "Zona 6",
       notificador: "Hilda",
  	   coordenadas: [{lat:-34.6092220, lng:-58.39199439},
                    {lat:-34.5958525, lng:-58.39333090},
                    {lat:-34.5938346, lng:-58.39307470},
                    {lat:-34.5926939, lng:-58.39286429},
                    {lat:-34.5875521, lng:-58.38708529},
                    {lat:-34.5725909, lng:-58.36649882},
                    {lat:-34.5607169, lng:-58.39018809},
                    {lat:-34.5787050, lng:-58.40679645},
                    {lat:-34.5778040, lng:-58.40857744},
                    {lat:-34.5819963, lng:-58.41109670},
                    {lat:-34.6021990, lng:-58.44241619},
                    {lat:-34.6042977, lng:-58.43661109},
                    {lat:-34.6087526, lng:-58.43045240},
                    {lat:-34.6154380, lng:-58.43004600},
                    {lat:-34.6114395, lng:-58.42100729}],
      color: "#cf3aa0"
    },
    {
	    // Zona 7
      nombre: "Zona 7",
      notificador: "Leandro",
      coordenadas: [{lat:-34.5897030, lng:-58.51784959},
                    {lat:-34.5968256, lng:-58.49676880},
                    {lat:-34.5978207, lng:-58.48308329},
                    {lat:-34.5962296, lng:-58.47031229},
                    {lat:-34.5966673, lng:-58.45920999},
                    {lat:-34.5860586, lng:-58.45454110},
                    {lat:-34.5804886, lng:-58.45096339},
                    {lat:-34.5699171, lng:-58.44491790},
                    {lat:-34.5615662, lng:-58.43679428},
                    {lat:-34.5458023, lng:-58.41507911},
                    {lat:-34.5284799, lng:-58.44941139},
                    {lat:-34.5498319, lng:-58.49987983}],
      color: "#0098da"
    },
    {
      // Zona 8
      nombre: "Zona 8",
      notificador: "ALberto",
	    coordenadas: [{lat:-34.5458023, lng:-58.41507911},
                    {lat:-34.5615662, lng:-58.43679428},
                    {lat:-34.5699171, lng:-58.44491790},
                    {lat:-34.5804886, lng:-58.45096339},
                    {lat:-34.5860586, lng:-58.45454110},
                    {lat:-34.5966673, lng:-58.45920999},
                    {lat:-34.6021990, lng:-58.44241619},
                    {lat:-34.5819963, lng:-58.41109670},
                    {lat:-34.5778040, lng:-58.40857744},
                    {lat:-34.5787050, lng:-58.40679645},
                    {lat:-34.5607169, lng:-58.39018809}],
      color: "#0000FF"
    }
  ];
  return zona;
}
// FUNCION PARA MOSTRAR el array de ZONAS creadas EN EL MAPA
function mostrarZonasEnMapa(zona, map){
  let poligonos = [];
	for (let numero = 0; numero < zona.length; numero++) {
		poligonos[numero] = new google.maps.Polygon({
		  path: zona[numero].coordenadas,
		  strokeColor: zona[numero].color,
		  strokeOpacity: 0.8,
		  strokeWeight: 0,
		  fillColor: zona[numero].color,
		  fillOpacity: 0.4,
	  });
	poligonos[numero].setMap(map);
	}
  return poligonos;
}
// FUNCION PARA MOSTRAR LA LISTA DE ZONAS creadas en la barra lateral
function mostrarZonasEnHTML(zona, id, clase){
  let elemento = [];
  for (let numero = 0; numero < zona.length; numero++) {
    // agrego las zonas al visor de la derecha
    elemento[numero] = document.createElement("p"); // creo elemento
      elemento[numero].className = clase; // le asigno la clase
      elemento[numero].id = zona[numero].nombre; // asigno id
      elemento[numero].innerHTML = zona[numero].nombre + " | Notificador: " + zona[numero].notificador + " |"; // imprimo nombre
      elemento[numero].style.borderColor = zona[numero].color; // asigno color
      elemento[numero].style.color = zona[numero].color; // asigno color
    // Agrego el texto al elemento id
    document.getElementById(id).appendChild(elemento[numero]);
  }
  return elemento;
}
// FUNCION PARA GEOCODIFICAR LA DIRECCION
function GeocodificarDireccion(geocodificador, map, address, locality, Marker) {
  geocodificador.geocode({'address': address, componentRestrictions:{'locality': locality}}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {                                // si google pudo geocodificar la direccion
      //map.setCenter(results[0].geometry.location);       // Centrar del mapa
      Marker.setPosition(results[0].geometry.location);
    } else {
      alert('No pude geocodificar la direccion por el siguiente motivo: ' + status);
    }
  });
}
// FUNCION PARA DETERMINAR EN QUE ZONA ESTA LA DIRECCIONES
function enQueZonaEsta(latlng, poligonos, ultimadireccion){
  let lista = [];
	for (let numero = 0; numero < poligonos.length; numero++) {
    if (google.maps.geometry.poly.containsLocation(latlng, poligonos[numero].coordenadas)) // compara la direccion con la zona
      lista[numero].push(ultimadireccion);
  }
  return lista;
}
// FUNCION PARA mostrar la LISTA de DIRECCIONES EN LA ZONA QUE CORRESPONDA
function imprimirDireccionesHTML(direcciones2, elemento, id, clase){
  // agrego las direcciones a las zonas de la derecha segun corresponda
  elemento = document.createElement("p"); // creo elemento
  elemento.className = clase; // le asigno la clase
  elemento.innerHTML = direcciones2;

  document.getElementById(id).appendChild(elemento);
}
// FUNCION PARA ELIMINAR UN ELEMENTO
function eliminarElemento(elemento){
	if (document.getElementById(elemento))
		document.getElementById(elemento).remove();
}
// FUNCION PARA DEJAR EN BLANCO UN INPUT
function blanquearInput(elemento){
  document.getElementById(elemento).value = "";
}
/*
//FUNCION PARA IMPRIMIR ARRAY EN EL HTML
function listar(direcciones, id, lista) {
	for(let cantidad = 0; cantidad < direcciones.length; cantidad++) {
		lista += "<br>" + direcciones[cantidad];
	}
  // mostrar lista en el elemento id
  document.getElementById(id).innerHTML = lista;
}
*/
