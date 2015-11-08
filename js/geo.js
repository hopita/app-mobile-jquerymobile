var miapp = {
	control:"",
    geo:"",    // para el objeto geolocation
    mapa:"",    // para el objeto google map
    marcador:"",  // para el objeto marker de google map  

    // opciones de posición
    MAXIMUM_AGE: 200, // milisegundos
    TIMEOUT: 300000,
    HIGHACCURACY: true,
    
    iniciar: function(){
		if((miapp.geo = miapp.dameGeoLocalizacion())) {
        	miapp.damePosicion();
        } else {
           alert('Tu navegador no soporta geolocalización');
        }
	},

    dameGeoLocalizacion: function() {
		try {
        	if( !! navigator.geolocation ) return navigator.geolocation;
            else return undefined;
        } 
        catch(e) {
          	return undefined;
       }
    },

    mostrarMapa: function(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var latlng = new google.maps.LatLng(lat, lon);

            if(miapp.mapa) {
                miapp.mapa.panTo(latlng);
                miapp.marcador.setPosition(latlng);
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
                miapp.mapa = new google.maps.Map(document.getElementById("mapa"), myOptions);

                miapp.marcador = new google.maps.Marker({
                    position: latlng,
                    title:"Estás aquí"
                });
                miapp.marcador.setMap(miapp.mapa);
            }
        },

    errores: function(error) {
           miapp.cancelaPosicion();
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
       },

    cancelaPosicion: function() {
            if(miapp.control) miapp.geo.clearWatch(miapp.control);
            miapp.control = null;
       },

    damePosicion: function() {
            miapp.control = miapp.geo.watchPosition(miapp.mostrarMapa, miapp.errores, {
                enableHighAccuracy: miapp.HIGHACCURACY,
                maximumAge: miapp.MAXIMUM_AGE,
                timeout: miapp.TIMEOUT
            });
       }
        
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});