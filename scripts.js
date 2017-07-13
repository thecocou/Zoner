/*jshint esversion: 6*/

function initZoner(){
  var Mapa = cargarMapa();  // Cargo Mapa
      infoZonas = cargarDataSobreZonas();	// Cargo info sobre las Zonas
      Zonas = crearZonas(infoZonas, Mapa);

      Geocoder = new google.maps.Geocoder();
      CedulaDeNotificacion = [];
      botonBuscar = document.getElementById('buscar');
      numero = 0;

  // Al hacer click en buscar geocodificar la direccion
  botonBuscar.addEventListener("click", function() {
    CedulaDeNotificacion[numero] = new Cedula(Mapa)
    .geocodificarDireccion(Geocoder, Zonas);
    if (numero > 0) { ocultarMarcadorPrevio(numero, CedulaDeNotificacion); }
    setearOpcionesDelMapaPorDefault(Mapa);
    setearCursorEnCampoDireccion();
    blanquearInputsYTips();
    numero++;
  });
}

// FUNCION PARA INICIAR EL MAPA
function cargarMapa() {
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
    this.HTMLzona = document.createElement("table");
    this.poligonos = new google.maps.Polygon({
		  path: this.coordenadas,
		  strokeColor: this.color,
		  strokeOpacity: 0.8,
		  strokeWeight: 0,
		  fillColor: this.color,
		  fillOpacity: 1,
	  });
  }

  // metodo PARA MOSTRAR ZONAS creadas EN EL MAPA
  setearZonasEnMapa(Mapa) {
    let self = this;
  	self.poligonos.setMap(Mapa);
    return this;
  }

  // Metodo PARA MOSTRAR LA LISTA DE ZONAS creadas en la barra lateral
  setearZonasEnHTML() {
    let self = this;
    self.HTMLzona.className = "nombreZona";   // le asigno la clase
    self.HTMLzona.id = self.nombre;           // asigno id
    self.HTMLzona.innerHTML = '<th colspan="2">' + self.nombre +
      "<th colspan='2'><span class='notbold'> Notificador: " + self.notificador + '</span></th><td colspan="2">'+
      '<button id="'+self.HTMLzona.id+'" class="descargar" onclick="exportarExcel(this.id)">Descargar</button></td>'; // imprimo nombre
    self.HTMLzona.style.borderColor = self.color; // asigno color
    self.HTMLzona.style["background-color"] = self.color;
    // Agrego el texto al elemento id
    document.getElementById("listaDeZonas").appendChild(self.HTMLzona);
    return this;
  }
}

// CLASE CEDULA
class Cedula {
  constructor(Mapa) {
    this.direccion = document.getElementById('direccion').value;
    this.ciudad = "Capital Federal";
    this.expediente = document.getElementById('expediente').value;
    this.observaciones = document.getElementById('observaciones').value;
    this.Marcador = new google.maps.Marker({map: Mapa});
    this.zona = "";
    this.HTMLement = document.createElement("tr");
  }

  // Metodo para geocodificar la direccion
  geocodificarDireccion(Geocoder, Zonas) {
    let self = this;
    Geocoder.geocode({'address': self.direccion, componentRestrictions:{'locality': self.ciudad}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {        // si google pudo geocodificar la direccion
        var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        self.Marcador.setPosition(results[0].geometry.location);                // ubicar marcador
        self.Marcador.setAnimation(google.maps.Animation.DROP);                 // animar marcador
        self.zona = self.obtenerAqueZonaPertenece(Zonas, latlng);               // obtener la zona
        self.imprimirCedulasEnHTML("cedulaStyle").scrollHastaElemento();      // Agregar la cedula al html y hacer Scroll hasta esta
      } else {
        alert('No pude encontrar la direccion por el siguiente motivo: ' + status);
      }
    });
    return this;
  }

  // metodo PARA DETERMINAR EN QUE ZONA ESTA LA DIRECCION
  obtenerAqueZonaPertenece(Zonas, latlng){
    // chequeo cada uno de los poligonos hasta encontrar el que contiene la direccion
    for (let numero = 0; numero < Zonas.length; numero++) {
      if (google.maps.geometry.poly.containsLocation(latlng, Zonas[numero].poligonos)){
        return Zonas[numero].nombre;
      }
    }
  }

  // metodo PARA mostrar la DIRECCION en la ZONA
  imprimirCedulasEnHTML(clase){
    let self = this;
    self.HTMLement.className = clase; // le asigno la clase
    self.HTMLement.innerHTML = '<td class="col" id="numorden">' + document.getElementById(self.zona).rows.length +
      '<td class="col">' + self.direccion +
      '</td><td class="col">' + self.expediente + '</td><td class="col">' + self.observaciones + '</td>' +
      '<td class="col"><button class="marcadorIcon" onclick=""></td><td class="col">' +
      '<input type="button" class="botonEliminar" value="X" onclick="eliminarRow(this)"></td>'; // creo las celdas
    document.getElementById(self.zona).appendChild(self.HTMLement); // asigno las celdas a la tabla
    return this;
  }

  switchVisibilidadDeMarcador() {
    let self = this;
    self.Marcador.getVisible() ? self.Marcador.setVisible(false) : self.Marcador.setVisible(true);
    return this;
  }

  scrollHastaElemento() {
    let self = this;
    let element = self.HTMLement;
    element.scrollIntoView(false);
    return this;
  }
}

// Funcion para crear las zonas
function crearZonas(infoZonas, Mapa) {
  var Zonas = [];
  for (n = 0; n < infoZonas.length; n++) {
    Zonas[n] = new Zona(infoZonas[n].nombre, infoZonas[n].notificador, infoZonas[n].coordenadas, infoZonas[n].color)
      .setearZonasEnMapa(Mapa)
      .setearZonasEnHTML();
  }
  return Zonas;
}

function exportarExcel(tabla) {
  console.log(document.getElementById(tabla));
}

function blanquearInputsYTips(){
  blanquearInput("direccion");
  blanquearInput("expediente");
  blanquearInput("observaciones");
  eliminarElemento("tips");
}

function ocultarMarcadorPrevio(numero, Cedula) {
  var anterior = numero - 1;
  Cedula[anterior].switchVisibilidadDeMarcador();
}

// FUNCION PARA ELIMINAR UN ELEMENTO
function eliminarElemento(elemento){
  if(document.getElementById(elemento))
		document.getElementById(elemento).remove();
}

function eliminarRow(row) {
  if (confirm("Estas seguro que deseas eliminar esta cedula?")) {
    var rowSeleccionada = row.parentNode.parentNode;
    rowSeleccionada.parentNode.removeChild(rowSeleccionada);
  }
}

// FUNCION PARA DEJAR EN BLANCO UN INPUT
function blanquearInput(elemento){
  document.getElementById(elemento).value = "";
}

// FUNCION PARA SETEAR LA POSICION DEL MAPA POR DEFECTO
function setearOpcionesDelMapaPorDefault(map) {
  map.setCenter({lat:-34.618356, lng:-58.433464});
  map.setZoom(12);
}

function setearCursorEnCampoDireccion() {
  document.getElementById("direccion").focus();
}

//cargar info de las zonas (temporal)
function cargarDataSobreZonas(){
  let zona = [
    {
      //   zona 1
      nombre: "Zona 1",
      notificador: "Manzur",
	    coordenadas: [{lat:-34.6590200, lng:-58.38837810},
					          {lat:-34.6092220, lng:-58.39199439},
					          {lat:-34.6060835, lng:-58.33353984},
					          {lat:-34.6281219, lng:-58.33079326},
					          {lat:-34.6552390, lng:-58.36606979}],
      color: "rgba(254,46,46,0.6)"
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
      color: "rgba(255,0,191,0.6)"
    },
    {
	  // Zona 3
      nombre: "Zona 3",
      notificador: "Gonzalez",
	    coordenadas: [{lat:-34.6590200, lng:-58.38837810},
                    {lat:-34.6092220, lng:-58.39199439},
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
      color: "rgba(255,144,62,0.6)"
    },
    {
    // Zona 4
      nombre: "Zona X",
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
                    {lat:-34.6625109, lng:-58.41709237},
                    {lat:-34.7082452, lng:-58.45829486},
                    {lat:-34.6544624, lng:-58.5291772},
                    {lat:-34.6394577, lng:-58.52957725},
                    {lat:-34.6388220, lng:-58.52253389},
                    {lat:-34.6393221, lng:-58.51141530},
                    {lat:-34.6380897, lng:-58.50393489},
                    {lat:-34.6365836, lng:-58.49363560},
                    {lat:-34.6307082, lng:-58.46964969},
                    {lat:-34.6279616, lng:-58.45985559}],
      color: "rgba(252,224,0,0.6)"
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
                    {lat:-34.6154640, lng:-58.43004600},
                    {lat:-34.6087526, lng:-58.43045240},
                    {lat:-34.6042977, lng:-58.43661109},
                    {lat:-34.6022090, lng:-58.44246420},
                    {lat:-34.5993800, lng:-58.45100000},
                    {lat:-34.5966673, lng:-58.45920999},
                    {lat:-34.5962296, lng:-58.47031229},
                    {lat:-34.5978207, lng:-58.48308329},
                    {lat:-34.5968256, lng:-58.49676880},
                    {lat:-34.5897030, lng:-58.51784959},
                    {lat:-34.6157624, lng:-58.53086471}],
      color: "rgba(0,194,172,0.6)"
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
                    {lat:-34.6022390, lng:-58.44241619},
                    {lat:-34.6042977, lng:-58.43661109},
                    {lat:-34.6087526, lng:-58.43045240},
                    {lat:-34.6154640, lng:-58.43004600},
                    {lat:-34.6114395, lng:-58.42100729}],
      color: "rgba(207,58,160,0.6)"
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
      color: "rgba(0,152,218,0.6)"
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
                    {lat:-34.6022390, lng:-58.44241619},
                    {lat:-34.5819963, lng:-58.41109670},
                    {lat:-34.5778040, lng:-58.40857744},
                    {lat:-34.5787050, lng:-58.40679645},
                    {lat:-34.5607169, lng:-58.39018809}],
      color: "rgba(0,0,255,0.6)"
    }
  ];
  return zona;
}
