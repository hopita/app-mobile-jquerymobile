/**
 * Ajax is used to load the contents of each page into the DOM as you navigate. 
 * Because of this $(document).ready() will trigger before your first page is loaded 
 * and every code intended for page manipulation will be executed after a page refresh. 
 */
 $( document ).on( "pagecreate", "#inicio", function() {
 	console.log("pagecreate inicio");
  var miEfecto;
  
  //Compruebo si hay imágenes almacenadas en localStorage, si no ejecuto resetapp()
	if (!hayImagenes()) resetapp();

	mostrarInicio();
});
$(document).on( "updatelayout", function( event ) { 
     mostrarInicio();
});
function mostrarInicio(){
	console.log("mostrarInicio");
	
	//Almaceno la referencia al elemento donde se va mostrar el grid en inicio y lo limpio
	var $cajadatos = $('#cajadatos');
	$cajadatos.html("");
	
	var texto ="";	
	
	//En este bucle recupero los items y los almaceno en la variable texto
	for (var f = 0; f < localStorage.length; f++){
		var clave = localStorage.key(f);
			
		//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
		var n = clave.indexOf("img_");
		if (n>-1){
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<div class="thumb"><a class="thumbnail" href="#carrusel" data-rel="popup" data-position-to="window" data-image-id="" data-title="' +  datos.titulo + '" data-caption="' +  datos.descripcion + '" data-image="' + datos.imagen  + '" data-target="#image-gallery"><img class="imglistado" src="' + datos.imagen  + '" alt="Short alt text"></a></div>';
			
		}
	}
	
	//Pinto el grid en patalla
	$cajadatos.html(texto);
	
	
	//Inicializo el plugin masonry
	init_masonry(); 

	/*
	* LLamo a la función cargargaleria que genera el id de las imagenes y gestiona el carrusel que se mostrará en la ventana modal a hacer click en las miniaturas.
	* Le paso como parámetro el elemento al que al hacer onclick carga la imagen en la ventana modal
	*/
	cargar_galeria();
		
	//guardo en la variable miefecto el efecto actualmente aplicado
	miEfecto =sessionStorage.getItem('efecto');
    aplicar_efecto(miEfecto);
    poner_checked(miEfecto);  
 	
}

//Esta función inicializa el plugin masonry, que se ha utilizado para obtener la disposición de la imágenes del listado en pantalla tipo pinterest
function init_masonry(){
	console.log("init_masonry");
	//Almaceno la referencia al elemento con clase content, donde se va a mostrar el listado de imágenes 
	var $container = $('#cajadatos');
	
	$container.imagesLoaded( function() {
	  // init Masonry
	  $container.masonry({
	     //Opciones
		        itemSelector: '.thumb'
		        
	  });
	  
	});
}

//Función que aplica el efecto seleccionado a todas las imágenes del listado
function aplicar_efecto(efecto) {
	    //Recorro el array con las imágenes y le asigno la clase con el nombre del efecto que voy a utilizar en el css
		$('.imglistado').each(function () {
			$(this).attr('class', 'imglistado ' + efecto);
		});
		
		//Llamo a la función que guarda el efecto con localSotarage, para no perderlo cuando abra otra página
		guardar_efecto(efecto);
}

//Función que guarda el efecto en localSotrage y lo almacena en la varible de app miefecto para tenerla disponible en los efectos de las imágenes de la ventana modal
function guardar_efecto(efecto){
	sessionStorage.setItem('efecto',efecto);
	miEfecto = efecto;
}

//Función que establece el elemento chekeado cuando cargo la página
function poner_checked(valor){
	 //Recorro el array y si encuentro un radio button con el mismo valor pongo el atributo cheked=true
	 $("input[name*=optradio]").each(function () {
	 	$(this).attr( "checked", false ).checkboxradio( "refresh" );
	 		
        if($(this).val()== valor){
            $(this).attr( "checked", true ).checkboxradio( "refresh" );  	
        }
    });
	 	
}

//Esta función se ejecuta para determinar si alguno de los botones de navegación se tiene que esconder cdo es la primera diapositiva o la última
function desactivar_botones(contador_max, contador_actual){
    $('#imagen-anterior, #imagen-siguiente').show();
    if (contador_max == 1){
	    $('#imagen-siguiente').hide();
	    $('#imagen-anterior').hide();
    }else {
	    if(contador_max == contador_actual){
	        $('#imagen-siguiente').hide();
	    } else if (contador_actual == 1){
	        $('#imagen-anterior').hide();
	    }
    }       
}

//Esta función gestiona la galería para su visualización en la ventana modal, se ejecuta una vez que se ha generado el listado de imágenes
function cargar_galeria(){
    var imagen_actual,
        selector,
        contador = 0;
		
	//Cuando se hace click en los botones de navegación se determina qué dispositiva se debe visualizar y se llama a la función actualizagaleria() 		a la que se le pasa el id de la dispositiva que se debe mostrar
    $('#imagen-siguiente, #imagen-anterior').click(function(){
        if($(this).attr('id') == 'imagen-anterior'){
            imagen_actual--;
        } else {
            imagen_actual++;
        }

        selector = $('[data-image-id="' + imagen_actual + '"]');
        actualiza_galeria(selector);
	});
		
	/*
	*Se muestra la imagen actual con el título y la descripción y se determina si se debe ocultar alguno de los botones de navegación
	* A esta función se le llama cada vez que hacemos click en uno de los botones de navegación y cuando se hace click a una de las miniaturas del listado
	*/
    function actualiza_galeria(selector) {
        var $sel = selector;
        imagen_actual = $sel.data('image-id');
        $('#image-gallery-caption').text($sel.data('caption'));
        $('#image-gallery-title').text($sel.data('title'));
        
        desactivar_botones(contador, $sel.data('image-id'));
        
        //Almaceno la altura máxima que le voy a asignar a la imagen 
        //para no tener que hacer scroll vertical (los 200px son del caption y del título)
        var maxHeight = $( window ).height() - 200 + "px";
        
        //Creo el elemento <img>
        var imgData = $sel.data('image');    
		var img = new Image();       
		img.onload = function(){
		  //Añado al DOM el elemento img que acabo de crear
		  $('#imagen').html(img);
		  //Le asigno la altura máxima
		  $(this).css( "max-height", maxHeight );
		  //Recupero el ancho de la imagen despues de haberle dado el alto máximo
		  var ancho = $(this).width();
		  //Le doy ancho al caption	 
		  $('#image-gallery-caption').css('width', ancho + 'px');

		  //Le asigno la clase para que muestre el efecto
	        $(this).removeClass( );
	        $(this).addClass( "img-responsive");
	        $(this).addClass(miEfecto);
	        
			posicion = $( window ).width()/2 - ancho/2;
			if (posicion>0) $('#carrusel-popup').css('left',posicion + 'px');
			else $('#carrusel-popup').css('left','10px');
			console.log('posicion' + posicion);
			console.log('ancho' + ancho);				
  
		};
		img.src = imgData;

    }
		
	/*Se asigna un id a cada diapositiva y se asigna a la variable contador el total de items,
	* para posteriormente enviarlo como uno de los parámetro a la funcion desactivarbotones, para determinar si es la última diapositiva
	*/
    $('[data-image-id]').each(function(){
        contador++;
        $(this).attr('data-image-id',contador);
    });
        
        
    /*
    * Al hacer click en un enlace a.thumbnail se muestra la galería en la ventana modal llamando al método actualizagaleria();
    */
    $('a.thumbnail').on('click',function(){
       actualiza_galeria($(this));
    });
    
    
}

// Esta función se ejecuta cuando se entra por primera vez a la app 
//o bien no hay ninguna imagen en localstorage (porque se han eliminado todas la imágenes) y almacena 2 imágenes de ejemplo
function resetapp(){
	var arrayImagenesMuestra=['images/amparomegiascastillo.jpg', 'images/beate.jpg', 'images/chupachup.jpg', 'images/foto1.jpg', 'images/pl.jpg', 'images/pragalomo.jpg'];	
	var datos;
			
	for (var f = 0; f < arrayImagenesMuestra.length; f++){
		var key = "img_" + f;
		var id= key;
		//Almaceno en  un objeto todos los datos del item a grabar
		datos = {
			titulo: "imagen muestra" + f,
			descripcion: "imagen muestra" + f + ". Lorem fistrum pecador hasta luego Lucas tiene musho peligro diodenoo condemor mamaar te va a hasé pupitaa pupita mamaar. ",
			imagen: arrayImagenesMuestra[f]			
		};
		/*
		* Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
		* Y llamo al método setItem() para crear un item
		*/
		localStorage.setItem(id, JSON.stringify(datos));
	}
}

//Esta función se ejecuta para comprobar si en localStorage hay almacenadas imágenes de la app.
//La clave de las imágenes de la app emplieza por img_
function hayImagenes(){
	//En esta variable almaceno el número de imágenes de la app que hay en localStorage
	var numeroImagenes=0;
		
	for (var f = 0; f < localStorage.length; f++){
		var clave = localStorage.key(f);
		//Compruebo que el tem que estoy leyendo es una imagen de la app, si es así aumento en uno el contador de imágenes
		var n = clave.indexOf("img_");
		if (n>-1){
			numeroImagenes++;			
		}
	}
	//Si hay imágenes devuelvo true y si no false
	if (numeroImagenes > 0) return true;
	else return false;
}

$( document ).on( "pagecreate", "#imagenes", function() {
	console.log("pagecreate imagenes");
/*Variable para almacenar los datos de la imagen*/
	var miImagen,
	/* Variable para almacenar la referencia al elemento type file de formulario*/
	miArchivo,
	/* Variable para almacenar el objeto con los datos del item a almacenar o modificar*/
	miImg_datos;


	/* Almaceno la referencia al elemento type file de formulario y le registro un detector para el evento 'onchange'*/
	$('#archivoimagen').on("change", procesarfile );
		
	/* Le registro un detector para el evento 'onclick' al boton grabar
		
	*/
	var $botongrabar = $('#grabar');
	$botongrabar.bind('click', { elementoTitulo: '#titulo',  elementoDescripcion: '#descripcion', elementoModal:'#altaModal'}, nuevoitem);
		
	/* Almaceno la referencia al elemento type button con id grabareditar de formularioeditar y le registro un detector para el evento 'onclick'*/
	var $botoneditar = $('#grabareditar');
	$botoneditar.on('click', modificaritem);
		
	//El evento popupafterclose se lanza cuando la ventana(en este caso de alta) se cierra.
	$('#altaModal').on('popupafterclose',resetformalta);
	mostrarImagenes();
});

function mostrarImagenes(){
console.log("mostrarimagenes");
	//Almaceno la referencia al elemento donde se va mostrar el listado en imagenes y lo limpio
	var $cajadatosimagenes = $('#cajadatosimagenes ul');
	$cajadatosimagenes.html("");
	
	//Este botón lanza la ventana modal del formulario de altas
	$cajadatosimagenes.append('<li data-role="list-divider" role="heading"><a class="ui-btn ui-icon-plus ui-mini  ui-btn-icon-notext ui-btn-inline" data-icon="plus" href="#altaModal" data-rel="popup" data-position-to="window" ></a></li>');
	
	//En esta variable creo el html del listado, no lo hago directamente sobre cajadatosimagenes porque no genera bien el <ul>
	var texto ="";	
	
	//En este bucle recupero los items y los almaceno en la variable texto
	for (var f = 0; f < localStorage.length; f++){
		var clave = localStorage.key(f);
			
		//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
		var n = clave.indexOf("img_");
		if (n>-1){
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<li><img class="" src="' + datos.imagen  + '" ><h2 class="h4">' +  datos.titulo + '</h2>' + datos.descripcion + '<div><a class="ui-btn ui-icon-edit ui-mini  ui-btn-icon-notext ui-btn-inline"  data-icon="edit" href="#modificacionModal" data-rel="popup" data-position-to="window" onclick="dameitem(\'' + clave + '\')"></a><a class="ui-btn ui-icon-delete ui-mini  ui-btn-icon-notext ui-btn-inline" onclick="eliminar(\'' + clave + '\')"></a></div></li>';
			
		}
	}  
	   
    //Pinto el listado en patalla
	$cajadatosimagenes.append(texto);
	//Ahora tengo que refrescar para que el framework jquerymobile aplique las clases a los elemento recientemente creados
	$cajadatosimagenes.listview().listview('refresh');  	
}



/*
	* Si el archivo no es una imagen, creo una referencia al elemento alerta e inserto el texto de aviso y le asigno la clase text-danger para mostralo con el texto en rojo
	*/
	function mostraralerta(){

		$('#alerta').html("El tipo de archivo no es correcto");
	}
	
	/* Función que resetea el elemento alerta*/
	function resetalerta(){
		$('#alerta').html("");
	}
	
	//Esta función se ejecuta cuando se cierra la ventana modal que contiene el formulario de altas
	function resetformalta(){
		/*
		*Limpio todos los campos del formulario de alta.
		* Por ejemplo si selecciono un fichero y cierro la ventana sin grabarlo,
		* cdo vuelvo a abrir la ventana de altas, aún tengo seleccionado el fichero, 
		* para evitar esto, es por lo que limpio los campos del formulario.
		*/ 
		$('#titulo').val("");
		$('#descripcion').val("");
		$('#archivoimagen').val("");
		
		//Reseteo el elemento alerta
		resetalerta();
		
		//Desactivo el botón de grabación del formulario de altas
		$('#grabar').attr("disabled", "disabled");
		
		/*
		*Limpio todos los campos del formulario de alta de la camara.
		*/ 
		$('#titulocamara').val("");
		$('#descripcioncamara').val("");
	}
	
	/* Esta función se ejecuta cuando seleccionamos un archivo desde nuestro ordenador */
		function procesarfile(e){
		 /*
		  * La propiedad files enviada por el evento onchange de archivoimagen es una matriz, que contiene todos los archivos seleccionados.
		  * La almacenamos en el array archivos.
		  */
		var archivos = e.target.files;
		/*
		 * Como el atributo multiple no está presente en este elemento, el único elemento disponible será el primero 
		 * y lo almacenamos en la variable archivo
		 */
		var archivo = archivos[0];
		
		/*
		 * Comprobamos que el archivo seleccionado es una imagen
		 */
		if (archivo.type == "image/png" || archivo.type == "image/jpg" || archivo.type == "image/jpeg") {
			
			// Elimino la alerta, si existiese
			resetalerta();
			
			//Activo el botón del formulario de alta
			$('#grabar').removeAttr("disabled");
			
			//Creo el objeto lector, lo necesitamos para leer el archivo
			var lector = new FileReader();
			/*
			 * Registro un detector para el evento onload con el objetivo de detectar cuando se carga el archivo.
			 * Guardo en la variable miImagen el contenido del  archivo, que tomamos de la propiedad result del objeto lector
			 */
			lector.addEventListener('load', function(e){miImagen=e.target.result;});	
			/*
			 * El método readAsDataURL() genera una cadena del tipo dat:url codificada en base64 que representa los datos de archivo.
			 * Cuando este método finaliza la lectura del archivo, el evento load se dispara. 
			 * Le pasamos como parámetro archivo, que es un objeto File	
			 */
			lector.readAsDataURL(archivo);
		
		}else 	{
			//Si el archivo no es una imagen 
			
			//Muestro un aviso
			mostraralerta();
			
			//Desactivo el botón de grabación del formulario de altas
			$('#grabar').attr("disabled", "disabled");
		}
	}
	
	// Esta función ejecuta el código para hacer altas de nuevas imágenes
	function nuevoitem(event){
		
			/*
			 * El método getTime() me devuelde el número de mm desde 1970/01/01
			 * Lo voy a utilizar, junto con el string "img_" para generar una clave para el elemento que voy a almacenar
			 */ 
			var currentDate = new Date();
			var time = currentDate.getTime();
			var key = "img_" + time;
			var id= key;
			
			//Almaceno en  un objeto todos los datos del item a grabar
			miImg_datos = {
			    titulo: $(event.data.elementoTitulo).val(),
			    descripcion: $(event.data.elementoDescripcion).val(),
			    imagen: miImagen			
			};
			
			/*
			 * Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
			 * Y llamo al método setItem() para crear un item
			 */
			localStorage.setItem(id, JSON.stringify(miImg_datos));
			
			//Cierro la ventana modal donde se encuentra el formulario
			$(event.data.elementoModal).popup( "close" );

			//Ejecuto mostrar() para actualizar el listado y que se muestre el nuevo item
			mostrarImagenes();
		
	}

	//Esta función se ejecuta al hacer click en el botón Modificar de formularioeditar
   function modificaritem(){
		//Almaceno en variables el contenido de los campos id y datos de la imagen del item a modificar del formulario formularioeditar
		//En el elemento idrecord he almacenado el id del item a modificar
		var $id = $('#idrecord').val();		
		var $imagensrc = $('#imageneditar').attr('src');
		
		//Almaceno en  un objeto todos los datos del item a modificar
		miImg_datos = {
		    titulo: $('#tituloeditar').val(),
		    descripcion: $('#descripcioneditar').val(),
		    imagen: $imagensrc
		
		};
		
		/*
		* Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
		* Y llamo al método set.Item() para actualizar el item
		*/
		localStorage.setItem($id, JSON.stringify(miImg_datos));
		
		//Cierro la ventana modal donde se encuentra el formulario de modificación
		//$("#modificacionModal" ).popup( "close" );
		
		//Ejecuto mostrarImagenes() para actualizar el listado.
		mostrarImagenes();
	}
	
	/*
	 * Esta función se ejecuta al hacer click sobre el botón editar del listado.
	 * Se le pasa como parámetro el id de la imagen a modificar
	 * Muestra en el formuario los datos del item a modificar
	 */	
  	function dameitem(clave){
		
		//Almaceno las referencias a los diferentes campos de formularioeditar
		//El elemento idrecord es un campo de tipo hidden donde almacenaré el id de la imagen, para posteriormente grabarla
		var $id=$('#idrecord');
		var $cajaimagen = $('#cajaimagen');
		
		/*
		 * Llamo al método get.Item() para obtener el valor del item a modificar
		* Con el método JSON.parse() analizo el string devuelto como JSON y lo almaceno en un objeto
		*/
		var valor = localStorage.getItem(clave);
		var datos = JSON.parse(valor);
		
		//Asigno estos datos a los campos del formulario para mostrarlos
		$id.val(clave);
		$('#tituloeditar').val(datos.titulo);
		$('#descripcioneditar').val(datos.descripcion);
		$cajaimagen.html('<img id="imageneditar" class="img-responsive" src="' + datos.imagen + '" >');
	}

//Esta función se ejecuta al hacer click en el botón eliminar de cada item, elimina el item selecionado
   function eliminar(clave){
	
		if (confirm('¿Va a eliminar un item, está seguro?')){
			localStorage.removeItem(clave);
		}
		mostrarImagenes();
	}
	
	//Esta función se ejecuta al hacer click en el botom 'Eliminar todos'
   function eliminarTodos(){
   	
		if (confirm('¿Va a eliminar todos los items,Está seguro?')){
			//Guardo el total de items en esta variable porque tengo que recorrer el bucle tantas veces como items hay antes de eliminar ninguno
			var totalInicial = localStorage.length;
			
			for (var f = 0; f < totalInicial; f++){
				//En cada iteración se elimina el primer item
				var clave = localStorage.key(0);
				
				localStorage.removeItem(clave);
				
			}
			mostrarImagenes();
		}
	}
$( document ).on( "pagecreate", "#camara", function() {
	/* Variable para almacenar el objeto con los datos del item a almacenar o modificar*/
	var miImg_datos,
	
	//Variable que va a almacenar los datos de la imagen
	miContexto;
	
	$titulocamara = $('#titulocamara');
	$descripcioncamara = $('#descripcioncamara');
		
	//Al elemento con id media le asigno alto y ancho de la ventana
	$('#media').width = window.innerWidth;
	$('#media').height = window.innerHeight;
		
	//En la variable miFoto se almacena una referencia al elemento con id foto
	$miFoto = $('#foto');
		
	// Almaceno la referencia al elemento type button con id grabar del formulario y le registro un detector para el evento 'onclick'*/
	$('#grabarcamara').bind('click', { elementoTitulo: '#titulocamara',  elementoDescripcion: '#descripcioncamara', elementoModal:'#altacamaraModal'}, nuevoitem);
		
	//El evento popupafterclose se lanza cuando la ventana(en este caso de alta) se cierra.
	$('#altacamaraModal').on('popupafterclose',resetformalta);
		
	//Aseguro la compatibilidad de la API en los distintos navegadores
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	//Método para tener acceso a la cámara web. En caso de éxito se ejecuta la función exito()
	navigator.getUserMedia({video:true}, exito, mostraerror);
	
	
});

//Esta función se ejecuta si el usuario accede a que la app tenga acceso a la cámara web.
//Esta función recibe el objeto LocalMediaStream y lo almacena en la variable stream
function exito(stream){
	//El vídeo de la cámara web se asigna al elemento <video>
		
	//Usando el método createObjectURL() se obtiene la URL que representa el stream
	//La URL se asigna al atributo src de elemento <video>
	$('#media').attr('src', URL.createObjectURL(stream));
	
	/*
	El objeto jquery $('#media'), no tiene el método play, este método se encuentra en el nativo elemento dom dentro del objeto. Por eso se produce un 	error si se intenta ejecutar $('#media').play()
	El vídeo se reproduce
	*/
	$('#media').get(0).play();	
	
	//Se añade un detector para el evento onclick en el elemento <video>, que ejecuta el código para tomar una instatánea, cuando se hace click en el elemento con id foto
	//Se toma el fotograma de vídeo actual y se dibuja en el lienzo, tomando una instantánea
	$miFoto.bind( "click", function() {
		var miVideo = document.getElementById('media');
		var miCanvas = document.getElementById('canvas');
		
		//Se crea el contexto del lienzo
		miContexto = miCanvas.getContext('2d');
		
		//Se llama al método de canvas drawImage() con una referencia al vídeo a los valores correspondientes al tamaño del elemento <canvas>
		miContexto.drawImage(miVideo, 0, 0, 320, 240);

		//Método que devuelve los datos de la imagen
		miImagen = miCanvas.toDataURL();	

		$("#altacamaraModal").popup('open');		
   });	
}
	
function mostraerror(e){
	console.log(e.code);	
}

$( document ).on( "pagecreate", "#localizacion", function() {
  var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        }
        function fail(error) {
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map
    }
    function drawMap(latlng) {
        var myOptions = {
            zoom: 16,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        var map = new google.maps.Map(document.getElementById('mapa'), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "GeoLocalización"
        });
    }
});





	