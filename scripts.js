/*jshint esversion: 6*/

function initZoner(){
  // Cargo Mapa
  var Mapa = cargarMapa();
  // Cargo info sobre zonas
      infoZonas = cargarDataSobreZonas();
  // Creo zonas
      Zonas = crearZonas(infoZonas, Mapa);
  // Creo Geocodificador
      Geocoder = new google.maps.Geocoder();

      CedulaDeNotificacion = [];
      cantidadDeCedulas = 0;
      botonBuscar = document.getElementById('buscar');

  // Al hacer click en buscar geocodificar la direccion
  botonBuscar.addEventListener("click", function() {
    CedulaDeNotificacion[cantidadDeCedulas] = new Cedula(Mapa)
    .geocodificarDireccion(Geocoder, Zonas);
    if (cantidadDeCedulas > 0) {
      ocultarMarcadorPrevio(cantidadDeCedulas, CedulaDeNotificacion);
    }
    setearOpcionesDelMapaPorDefault(Mapa);
    setearCursorEnCampoDireccion();
    blanquearInputsYTips();
    cantidadDeCedulas++;
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
    self.HTMLzona.innerHTML = "<th colspan='2'>" + self.nombre +
      "<th colspan='2'><span class='notbold'> Notificador: " + self.notificador + "</span></th><td colspan='2'>" +
      "<button id='" + self.HTMLzona.id; // imprimo nombre
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
    this.expediente = document.getElementById('expediente').value;
    this.observaciones = document.getElementById('observaciones').value;
    this.Marcador = new google.maps.Marker({map: Mapa});
    this.zona = "";
    this.HTMLement = document.createElement("tr");
  }
  // Metodo para geocodificar la direccion
  geocodificarDireccion(Geocoder, Zonas) {
    let self = this;
    Geocoder.geocode({'address': self.direccion + ", Capital Federal", componentRestrictions:{'locality': "Capital Federal"}}, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {        // si google pudo geocodificar la direccion
        var latlng = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
        self.Marcador.setPosition(results[0].geometry.location);                // ubicar marcador
        self.Marcador.setAnimation(google.maps.Animation.DROP);                 // animar marcador
        self.zona = self.obtenerAqueZonaPertenece(Zonas, latlng);               // obtener la zona
        self.imprimirCedulasEnHTML().scrollHastaElemento();      // Agregar la cedula al html y hacer Scroll hasta esta
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
  imprimirCedulasEnHTML(){
    let self = this;
    self.HTMLement.className = "cedulaStyle"; // le asigno la clase
    self.HTMLement.innerHTML = "<td class='col' id='numorden'>" + document.getElementById(self.zona).rows.length +
      "<td class='col'>" + self.direccion +
      "</td><td class='col'>" + self.expediente + "</td><td class='col'>" + self.observaciones + "</td>" +
      "<td class='col'><input type='button' class='botonEliminar' value='X' onclick='eliminarRow(this)'></td>"; // creo las celdas
    document.getElementById(self.zona).appendChild(self.HTMLement); // asigno las celdas a la tabla
    return this;
  }
  // Mostrar / Ocultar el Marcador en el Mapa
  switchVisibilidadDeMarcador() {
    let self = this;
    self.Marcador.getVisible() ? self.Marcador.setVisible(false) : self.Marcador.setVisible(true);
    return this;
  }
  // Scroll hasta la ultima cedula agregada
  scrollHastaElemento() {
    let self = this;
    let element = self.HTMLement;
    element.scrollIntoView(false);
    return this;
  }
}

// Funcion para limpiar los inputs
function blanquearInputsYTips(){
  blanquearInput("direccion");
  blanquearInput("expediente");
  blanquearInput("observaciones");
  eliminarElemento("tips");
}
// Funcion para ocultar el marcador anterior
function ocultarMarcadorPrevio(numero, Cedula) {
  var anterior = numero - 1;
  Cedula[anterior].switchVisibilidadDeMarcador();
}
// FUNCION PARA ELIMINAR UN ELEMENTO
function eliminarElemento(elemento){
  if(document.getElementById(elemento))
		document.getElementById(elemento).remove();
}
// Funcion para eliminar una fila (cedula)
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
// funcion para volver el cursor al imput direccion
function setearCursorEnCampoDireccion() {
  document.getElementById("direccion").focus();
}
//cargar info de las zonas
function cargarDataSobreZonas(){
  let zona = [
    {
      nombre: "Zona 40",
      notificador: "Marina Duran",
      coordenadas: [
          { lat: -34.547185279662706, lng: -58.49418545302524 }, 
          { lat: -34.55156021615945, lng: -58.49108412997316 }, 
          { lat: -34.55591780292511, lng: -58.48805690294512 }, 
          { lat: -34.55855845340877, lng: -58.48623206936634 }, 
          { lat: -34.56130946273058, lng: -58.48434219221889 }, 
          { lat: -34.565141410164685, lng: -58.481421415361126 }, 
          { lat: -34.56533495165949, lng: -58.48181838229533 }, 
          { lat: -34.56585203254029, lng: -58.48138198335164 }, 
          { lat: -34.566375736357934, lng: -58.480916750661095 }, 
          { lat: -34.56741595585819, lng: -58.47999433190694 }, 
          { lat: -34.56947868674528, lng: -58.478142788876085 }, 
          { lat: -34.56752860277333, lng: -58.47484384739232 }, 
          { lat: -34.5665621023981, lng: -58.473217007789 }, 
          { lat: -34.5655867558375, lng: -58.471604249782956 }, 
          { lat: -34.565028536248064, lng: -58.47068748111519 }, 
          { lat: -34.564825903342765, lng: -58.470351472567586 }, 
          { lat: -34.56460891297797, lng: -58.47002552230384 }, 
          { lat: -34.56409099703156, lng: -58.469251245989994 }, 
          { lat: -34.56358467401528, lng: -58.468478310780654 }, 
          { lat: -34.562973470483946, lng: -58.46753593739027 }, 
          { lat: -34.56220705158031, lng: -58.466460918390624 }, 
          { lat: -34.56151903969182, lng: -58.46538724049549 }, 
          { lat: -34.55887423119905, lng: -58.46095088271778 }, 
          { lat: -34.558291790901244, lng: -58.45992896904954 }, 
          { lat: -34.55816771731069, lng: -58.45976300935837 }, 
          { lat: -34.557156749996054, lng: -58.457992418124036 }, 
          { lat: -34.55606062708222, lng: -58.456227193299355 }, 
          { lat: -34.55497237205989, lng: -58.454289724347746 }, 
          { lat: -34.554311988688134, lng: -58.45328813281151 }, 
          { lat: -34.5539890325614, lng: -58.45273547600908 }, 
          { lat: -34.55293167748608, lng: -58.450909151093526 }, 
          { lat: -34.55230780786514, lng: -58.44987019523228 }, 
          { lat: -34.55064122835256, lng: -58.447060981421146 }, 
          { lat: -34.5494910095194, lng: -58.44512482664442 }, 
          { lat: -34.54891230422153, lng: -58.44415306121863 }, 
          { lat: -34.54833193800177, lng: -58.44320945898755 }, 
          { lat: -34.54086351619575, lng: -58.43085188336954 }, 
          { lat: -34.52795392493281, lng: -58.4513630366983 }        
      ],
      color: "rgba(0,0,128,0.6)"
    },
    {
      nombre: "Zona 41",
      notificador: "Matias Semelis",
      coordenadas: [
        { lat: -34.6092220, lng: -58.39199439 },
        { lat: -34.5958525, lng: -58.39333090 },
        { lat: -34.5938346, lng: -58.39307470 },
        { lat: -34.5926939, lng: -58.39286429 },
        { lat: -34.5875521, lng: -58.38708529 },
        { lat: -34.5725909, lng: -58.36649882 },
        { lat: -34.6060835, lng: -58.33353984 }],
      color: "rgba(60,180,75,0.6)"
    },
    {
      nombre: "Zona 42",
      notificador: "Patricia Goicoechea",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(255,225,25,0.6)"
    },
    {
      nombre: "Zona 43",
      notificador: "Sol Irustia",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(0,130,200,0.6)"
    },
    {
      nombre: "Zona 44",
      notificador: "Emiliano Garcia",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(245,130,48,0.6)"
    },
    {
      nombre: "Zona 45",
      notificador: "Jorge Lopez",
      coordenadas: [
        { lat: -34.6092220, lng: -58.39199439 },
        { lat: -34.5958525, lng: -58.39333090 },
        { lat: -34.5938346, lng: -58.39307470 },
        { lat: -34.5926939, lng: -58.39286429 },
        { lat: -34.5875521, lng: -58.38708529 },
        { lat: -34.5725909, lng: -58.36649882 },
        { lat: -34.5607169, lng: -58.39018809 },
        { lat: -34.5787050, lng: -58.40679645 },
        { lat: -34.5778040, lng: -58.40857744 },
        { lat: -34.5819963, lng: -58.41109670 },
        { lat: -34.6022390, lng: -58.44241619 },
        { lat: -34.6042977, lng: -58.43661109 },
        { lat: -34.6087526, lng: -58.43045240 },
        { lat: -34.6154640, lng: -58.43004600 },
        { lat: -34.6114395, lng: -58.42100729 }],
      color: "rgba(70,240,240,0.6)"
    },
    {
      nombre: "Zona 46",
      notificador: "Gabriela Belen Ferreyra",
      coordenadas: [
        { lat: -34.6394577, lng: -58.52957725 },
        { lat: -34.6388220, lng: -58.52253389 },
        { lat: -34.6393221, lng: -58.51141530 },
        { lat: -34.6380897, lng: -58.50393489 },
        { lat: -34.6365836, lng: -58.49363560 },
        { lat: -34.6307082, lng: -58.46964969 },
        { lat: -34.6279616, lng: -58.45985559 },
        { lat: -34.6204466, lng: -58.44124039 },
        { lat: -34.6154640, lng: -58.43004600 },
        { lat: -34.6087526, lng: -58.43045240 },
        { lat: -34.6042977, lng: -58.43661109 },
        { lat: -34.6022090, lng: -58.44246420 },
        { lat: -34.5993800, lng: -58.45100000 },
        { lat: -34.5966673, lng: -58.45920999 },
        { lat: -34.5962296, lng: -58.47031229 },
        { lat: -34.5978207, lng: -58.48308329 },
        { lat: -34.5968256, lng: -58.49676880 },
        { lat: -34.5897030, lng: -58.51784959 },
        { lat: -34.6157624, lng: -58.53086471 }],
      color: "rgba(145,30,180,0.6)"
    },
    {
      nombre: "Zona 47",
      notificador: "Pablo Blascetta",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(240,50,230,0.6)"
    },
    {
      nombre: "Zona 48",
      notificador: "Pablo Di Pietro",
      coordenadas: [
        { lat: -34.5458023, lng: -58.41507911 },
        { lat: -34.5615662, lng: -58.43679428 },
        { lat: -34.5699171, lng: -58.44491790 },
        { lat: -34.5804886, lng: -58.45096339 },
        { lat: -34.5860586, lng: -58.45454110 },
        { lat: -34.5966673, lng: -58.45920999 },
        { lat: -34.6022390, lng: -58.44241619 },
        { lat: -34.5819963, lng: -58.41109670 },
        { lat: -34.5778040, lng: -58.40857744 },
        { lat: -34.5787050, lng: -58.40679645 },
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(210,245,60,0.6)"
    },
    {
      nombre: "Zona 49",
      notificador: "Matias Martinez",
	    coordenadas: [
        {lat:-34.6590200, lng:-58.38837810},
        {lat:-34.6092220, lng:-58.39199439},
        {lat:-34.6060835, lng:-58.33353984},
        {lat:-34.6281219, lng:-58.33079326},
        {lat:-34.6552390, lng:-58.36606979}],
      color: "rgba(250,190,190,0.6)"
    },
    {
      nombre: "Zona 50",
      notificador: "Maria Fernanda Canay",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(0,128,128,0.6)"
    },
    {
      nombre: "Zona 51",
      notificador: "Matias Moscardi",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(230,190,255,0.6)"
    },
    {
	    nombre: "Zona 52",
      notificador: "Ariel Cortina",
	    coordenadas: [
        {lat:-34.6590200, lng:-58.38837810},
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
      color: "rgba(170,110,40,0.6)"
    },
    {
      nombre: "Zona 53",
      notificador: "Guido",
      coordenadas: [
        {lat:-34.6204466, lng:-58.44124039},
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
      color: "rgba(255,250,200,0.6)"
    },
    {
      nombre: "Zona 54",
      notificador: "Mabel Marcos",
      coordenadas: [
        {lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(128,0,0,0.6)"
    },
    {
      nombre: "Zona 55",
      notificador: "Marcela Otalora",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(170,255,195,0.6)"
    },
    {
      nombre: "Zona 56",
      notificador: "Gaston Fresco",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(128,128,0,0.6)"
    },
    {
      nombre: "Zona 57",
      notificador: "Pablo Ramos",
      coordenadas: [
        { lat: -34.5897030, lng: -58.51784959 },
        { lat: -34.5968256, lng: -58.49676880 },
        { lat: -34.5978207, lng: -58.48308329 },
        { lat: -34.5962296, lng: -58.47031229 },
        { lat: -34.5966673, lng: -58.45920999 },
        { lat: -34.5860586, lng: -58.45454110 },
        { lat: -34.5804886, lng: -58.45096339 },
        { lat: -34.5699171, lng: -58.44491790 },
        { lat: -34.5615662, lng: -58.43679428 },
        { lat: -34.5458023, lng: -58.41507911 },
        { lat: -34.5284799, lng: -58.44941139 },
        { lat: -34.5498319, lng: -58.49987983 }],
      color: "rgba(255,215,180,0.6)"
    },
    {
      nombre: "Zona 59",
      notificador: "ZONA de RIESGO",
      coordenadas: [
        { lat: -34.5607169, lng: -58.39018809 }],
      color: "rgba(230,25,75,0.6)"
    },
  ];
  return zona;
}
