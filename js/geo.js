$("document").ready(function() {
	// opciones de posición
    MAXIMUM_AGE = 200; // milisegundos
    TIMEOUT = 300000;
    HIGHACCURACY = true;
    
    var miGeo;
    var miControl;
    //Si el navegador soporta geolocalización ejecuto damePosicion()
    if((miGeo = dameGeoLocalizacion())) {
        damePosicion(miGeo);
    } else {
         alert('Tu navegador no soporta geolocalización');
    }
	
});
//Compruebo que el navegador soporta geolocalización
function dameGeoLocalizacion() {
	try {
       if( !! navigator.geolocation ) return navigator.geolocation;
          else return undefined;
       } 
       catch(e) {
          return undefined;
       }
}
//Esta función muestra el mapa de google con los datos que se le mandan cada 20mls.
function mostrarMapa(position) {
     var lat = position.coords.latitude;
     var lon = position.coords.longitude;
     var latlng = new google.maps.LatLng(lat, lon);
     
     var miMapa;
     var miMarcador;

     if(miMapa) {
         miMapa.panTo(latlng);
         miMarcador.setPosition(latlng);
     } else {
	     var myOptions = {
		         zoom: 18,
		         center: latlng,
		
		         // mapTypeID --
		         // ROADMAP muestra la vista por defecto road map
		         // SATELLITE muestra imágenes de satélite Google Earth 
		         // HYBRID muestra una mezcla de la vista por defecto y satélite
		         // TERRAIN muestra un mapa físico basado en información del terreno.
		         mapTypeId: google.maps.MapTypeId.ROADMAP
	         };
	      miMapa = new google.maps.Map(document.getElementById("mapa"), myOptions);
	
	      miMarcador = new google.maps.Marker({
	                    position: latlng,
	                    title:"Estás aquí"
	                });
	      miMarcador.setMap(miMapa);
     }
}
//Esta función se ejecuta si falla el envío de información mediante watchPosition
function errores(error) {
    cancelaPosicion();
    switch(error.code) {
        case error.TIMEOUT:
            alert('Tiempo de espera de Geolocalización agotado');
            break;
         case error.POSITION_UNAVAILABLE:
             alert('Posición no disponible');
             break;
         case error.PERMISSION_DENIED:
             alert('Permiso de geolocalización denegado');
             break;
         default:
             alert('Geolocalización devolvió un error de código desonocido: ' + error.code);
      }
}
//Esta función cancela watchPosition
function cancelaPosicion(){
   if(miControl) miGeo.clearWatch(miControl);
   miControl = null;
}
//Esta función se ejecuta una vez que se comprueba que el navegador soporta geolocation.
function damePosicion(geo) {
	//Obtengo la ubicación del dispositivo, cada vez que el dispositiov cambia(watchPosition)
    //Cada 200mls. se ejecutará mostrarMapa(), si al cabo de este tiempo no se obtiene información se ejecuta errores()
     miControl = geo.watchPosition(mostrarMapa, errores, {
                enableHighAccuracy:HIGHACCURACY,
                maximumAge: MAXIMUM_AGE,
                timeout: TIMEOUT
            });
}