//Declaro objeto global
var miapp = {
	//Variable donde almaceno el efecto actual
	miefecto:"",
	
	//La función iniciar() llama al método mostrar() que listará las imágenes en pantalla
	iniciar: function(){		
		this.mostrar();
	},
	
	//Esta función inicializa el plugin masonry, que se ha utilizado para obtener la disposición de la imágenes del listado en pantalla tipo pinterest
	init_masonry: function(){
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
	},
	
	//Función que aplica el efecto seleccionado a todas las imágenes del listado
	aplicarefecto: function(efecto) {
		
		//Almaceno las referencias a los elementos con clase imglistado, son las imágenes del listado 
	    var mithumbnail = document.getElementsByClassName('imglistado');
	    
	    //Recorro el array con las imágenes y le asigno la clase con el nombre del efecto que voy a utilizar en el css
	    for (var i = 0; i < mithumbnail.length; i++) {	    	
	    	mithumbnail[i].className = "imglistado " + efecto;
		}
		
		//Llamo a la función que guarda el efecto con localSotarage, para no perderlo cuando abra otra página
		miapp.guardarefecto(efecto);
	 },
	 
	 //Función que guarda el efecto en localSotrage y lo almacena en la varible de app miefecto para tenerla disponible en los efectos de las imágenes de la ventana modal
	 guardarefecto: function(efecto){
	 	sessionStorage.setItem('efecto',efecto);
	 	miapp.miefecto = efecto;
	 },
	 
	 //Función que establece el elemento chekeado cuando cargo la página
	 ponerchecked: function(valor){
	 	
	 	//Almaceno las referencias a los radio buttons 
	 	var radio = document.getElementsByName("optradio");
	 	
	 	//Recorro el array y si encuentro un radio button con el mismo valor pongo el atributo cheked=true
	 	 for (var i = 0; i < radio.length; i++) {
	    	if (radio[i].value == valor){
	    		console.log(radio[i].value );
	    		radio[i].checked = true;
	    	}	    	
		}
	 },
	
	//Esta función se ejecuta para determinar si alguno de los botones de navegación se tiene que esconder cdo es la primera diapositiva o la última
	desactivarbotones: function(contador_max, contador_actual){
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
    },
	
	//Esta función gestiona la galería para su visualización en la ventana modal, se ejecuta una vez que se ha generado el listado de imágenes
    cargargaleria: function(){
        var imagen_actual,
            selector,
            contador = 0;
		
		//Cuando se hace click en los botones de navegación se determina qué dispositiva se debe visualizar y se llama a la función actualizagaleria() a la que se le pasa el id de la dispositiva que se debe mostrar
        $('#imagen-siguiente, #imagen-anterior').click(function(){
            if($(this).attr('id') == 'imagen-anterior'){
                imagen_actual--;
            } else {
                imagen_actual++;
            }

            selector = $('[data-image-id="' + imagen_actual + '"]');
            actualizagaleria(selector);
        });
		
		/*
		 *Se muestra la imagen actual con el título y la descripción y se determina si se debe ocultar alguno de los botones de navegación
		 * A esta función se le llama cada vez que hacemos click en uno de los botones de navegación y cuando se hace click a una de las miniaturas del listado
		 */
        function actualizagaleria(selector) {
            var $sel = selector;
            imagen_actual = $sel.data('image-id');
            $('#image-gallery-caption').text($sel.data('caption'));
            $('#image-gallery-title').text($sel.data('title'));
            $('#image-gallery-image').attr('src', $sel.data('image'));
            $('#image-gallery-image').removeClass( );
            $('#image-gallery-image').addClass( "img-responsive");
            $('#image-gallery-image').addClass( miapp.miefecto);
            miapp.desactivarbotones(contador, $sel.data('image-id'));
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
            actualizagaleria($(this));
        });
    },
    
    //Esta función genera el html que pinta el listado de miniaturas en la pantalla.
    mostrar: function(){
		var cajadatos = document.getElementById('cajadatos');
		
		var texto ="";
	
		cajadatos.innerHTML = "";
		//En este bucle recupero los items y los almaceno en la variable texto
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			
			//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
			var n = clave.indexOf("img_");
			if (n>-1){
				var valor = localStorage.getItem(clave);
				var datos = JSON.parse(valor);
			
				texto += '<div class="thumb"><a class="thumbnail" href="#" data-image-id="" data-title="' +  datos.titulo + '" data-caption="' +  datos.descripcion + '" data-image="' + datos.imagen  + '" data-target="#image-gallery"><img class="imglistado" src="' + datos.imagen  + '" alt="Short alt text"></a></div>';
			}
		}
		//Pinto el listado en patalla
		cajadatos.innerHTML = texto;
		
		//Inicializo el plugin masonry
		miapp.init_masonry();

		/*
		 * LLamo a la función cargargaleria que genera el id de las imagenes y gestiona el carrusel que se mostrará en la ventana modal a hacer click en las miniaturas.
		 * Le paso como parámetro el elemento al que al hacer onclick carga la imagen en la ventana modal
		 */
		miapp.cargargaleria('');
		
		//guardo en la variable miefecto el efecto actualmente aplicado
		miapp.miefecto =sessionStorage.getItem('efecto');
    	miapp.aplicarefecto(miapp.miefecto);
    	miapp.ponerchecked(miapp.miefecto);    	
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});



