$("document").ready(function() {
	//Variable para almacenar el efecto seleccionado.
	var miEfecto;
	//Para prevenir que la imagen sea más alta que la pantalla
	
    
	//Compruebo si hay imágenes almacenadas en localStorage, si no ejecuto resetapp()
	if (!hayImagenes()) resetapp();
	mostrar();
});

function mostrar(){
	var $cajadatos = $('#cajadatos');
		
	var texto ="";
	
	$cajadatos.html("");

	//En este bucle recupero los items y los almaceno en la variable texto
	for (var f = 0; f < localStorage.length; f++){
		var clave = localStorage.key(f);
			
		//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
		var n = clave.indexOf("img_");
		if (n>-1){
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<div class="thumb"><a class="thumbnail" href="#carrusel" data-rel="popup" data-position-to="#inicio header"  data-image-id="" data-title="' +  datos.titulo + '" data-caption="' +  datos.descripcion + '" data-image="' + datos.imagen  + '" data-target="#image-gallery"><img class="imglistado" src="' + datos.imagen  + '" alt="Short alt text"></a></div>';
		}
	}
	
	//Pinto el listado en patalla
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
	//Almaceno la referencia al elemento con clase content, donde se va a mostrar el listado de imágenes 
	var $container = $('#cajadatos');
	
	//Llamo al método imagesLoaded del plugin imagesloaded.js utilizado para detectar cuando las imágenes se han cargado, entonces inicializo el plugin masonry
	$container.imagesLoaded( function(){
	    $container.masonry({
	        //Opciones
	        itemSelector: '.thumb',
	        isAnimated: true
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
		
	//Cuando se hace click en los botones de navegación se determina qué dispositiva se debe visualizar y se llama a la función actualizagaleria() 		
	//a la que se le pasa el id de la dispositiva que se debe mostrar
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
	*Se muestra la imagen actual con el título y la descripción y se llama a la función que activa o desactiva los botones
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


