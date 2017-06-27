/*jshint esversion: 6*/

function initZoner(){
  // Cargo Mapa
  var Mapa = initMap();
	// Cargo info sobre las Zonas
  var infoZonas = obtenerZonas();
  var Zonas = [];

  for (n = 0; n < infoZonas.length; n++) {
    Zonas[n] = new Zona(infoZonas[n].nombre, infoZonas[n].notificador, infoZonas[n].coordenadas, infoZonas[n].color)
      .setearZonasEnMapa(Mapa)
      .setearZonasEnHTML("listaDeZonas", "nombreZona");
  }

  var Geocoder = new google.maps.Geocoder();
  var botonBuscar = document.getElementById('buscar');
  //var numero=0;
  var CedulaDeNotificacion = [];
  // Al hacer click en buscar geocodificar la direccion
  botonBuscar.addEventListener('click', function() {

    CedulaDeNotificacion = new Cedula(Mapa)
      .geocodificarDireccion(Geocoder)
      .obtenerAqueZonaPertenece(Zonas)
      .imprimirCedulasEnHTML("cedulaStyle");

    blanquearInput("direccion");
    eliminarElemento("tips");
    console.log(CedulaDeNotificacion);
  });
}

// FUNCION PARA INICIAR EL MAPA
function initMap() {
  // Creo el Mapa
  var Mapa = new google.maps.Map(document.getElementById('map'), {
    center: {lat:-34.618356, lng:-58.433464},
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  return Mapa;
}

// CLASE ZONA
class Zona {
  constructor(nombre, notificador, coords, color) {
    this.nombre = nombre;
    this.notificador = notificador;
    this.coordenadas = coords;
    this.color = color;
    this.HTMLzona = document.createElement("p");
    this.poligonos = new google.maps.Polygon({
		  path: this.coordenadas,
		  strokeColor: this.color,
		  strokeOpacity: 0.8,
		  strokeWeight: 0,
		  fillColor: this.color,
		  fillOpacity: 0.4,
	  });
  }

  // metodo PARA MOSTRAR ZONAS creadas EN EL MAPA
  setearZonasEnMapa(Mapa){
    let self = this;
  	self.poligonos.setMap(Mapa);
    return this;
  }

  // Metodo PARA MOSTRAR LA LISTA DE ZONAS creadas en la barra lateral
  setearZonasEnHTML(id, clase){
    let self = this;
    self.HTMLzona.className = clase; // le asigno la clase
    self.HTMLzona.id = self.nombre; // asigno id
    self.HTMLzona.innerHTML = self.nombre + " | Notificador: " + self.notificador + " |"; // imprimo nombre
    self.HTMLzona.style.borderColor = self.color; // asigno color
    self.HTMLzona.style.color = self.color; // asigno color
    // Agrego el texto al elemento id
    document.getElementById(id).appendChild(self.HTMLzona);
    return this;
  }
}

// CLASE CEDULA
class Cedula {
  constructor(Mapa) {
    this.direccion = document.getElementById('direccion').value;
    this.ciudad = document.getElementById('ciudad').value;
    this.Marcador = new google.maps.Marker({map: Mapa});
    this.zona = "Zona ";
    this.latlng = new google.maps.LatLng({lat: 0, lng: 0});
    this.HTMLement = document.createElement("p");
  }

  // Metodo para geocodificar la direccion
  geocodificarDireccion(Geocoder) {
    let self = this;
    Geocoder.geocode({'address': self.direccion, componentRestrictions:{'locality': self.ciudad}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {        // si google pudo geocodificar la direccion
        self.Marcador.setPosition(results[0].geometry.location);   // ubicar marcador
        self.latlng = {
          lat: self.Marcador.getPosition().lat(),
          lng: self.Marcador.getPosition().lng()
        };
      } else {
        alert('No pude encontrar la direccion por el siguiente motivo: ' + status);
      }
    });
    return this;
  }

  // metodo PARA DETERMINAR EN QUE ZONA ESTA LA DIRECCIONES
  obtenerAqueZonaPertenece(Zonas){
    let self = this;
    // chequeo cada uno de los poligonos hasta encontrar el que contiene la direccion
  	for (let numero = 0; numero < Zonas.length; numero++) {
      console.log("chequeando en " + Zonas[numero].nombre + ": " + google.maps.geometry.poly.containsLocation(self.latlng, Zonas[numero].poligonos));
      if (numero === 2){//google.maps.geometry.poly.containsLocation(self.latlng, Zonas[numero].poligonos)){
        console.log("lo encontre en " + Zonas[numero].nombre);
        self.zona += (numero + 1);
      }
    }
    return this;
  }

  // metodo PARA mostrar la LISTA de DIRECCIONES EN LA ZONA QUE CORRESPONDA
  imprimirCedulasEnHTML(clase){
    let self = this;
    // agrego las direcciones a las zonas de la derecha segun corresponda
    self.HTMLement.className = clase; // le asigno la clase
    self.HTMLement.innerHTML = self.direccion + ", " + self.ciudad;
    document.getElementById(self.zona).appendChild(self.HTMLement);

    return this;
  }
}

// FUNCION PARA ELIMINAR UN ELEMENTO
function eliminarElemento(elemento){
  if(document.getElementById(elemento))
		document.getElementById(elemento).remove();
}

// FUNCION PARA DEJAR EN BLANCO UN INPUT
function blanquearInput(elemento){
  document.getElementById(elemento).value = "";
}

//cargar info de las zonas (temporal)
function obtenerZonas(){
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
