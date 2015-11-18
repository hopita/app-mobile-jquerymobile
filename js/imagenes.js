$("document").ready(function() {
	/*Variable para almacenar los datos de la imagen*/
	var miImagen,
	/* Variable para almacenar la referencia al elemento type file de formulario*/
	miArchivo,
	/* Variable para almacenar el objeto con los datos del item a almacenar o modificar*/
	miImg_datos,
	/*Variable para almacenar la referencia al botón de altas */
	miBotongrabar;

	/* Almaceno la referencia al elemento type file de formulario y le registro un detector para el evento 'onchange'*/
	$miArchivo = $('#archivoimagen');
	$miArchivo.on("change", procesarfile );
		
	/* Almaceno la referencia al elemento type button con id grabar de formulario y le registro un detector para el evento 'onclick'*/
	$miBotongrabar = $('#grabar');
	$miBotongrabar.on('click', nuevoitem);
		
	/* Almaceno la referencia al elemento type button con id grabareditar de formularioeditar y le registro un detector para el evento 'onclick'*/
	var $botoneditar = $('#grabareditar');
	$botoneditar.on('click', modificaritem);
		
	//El evento popupafterclose se lanza cuando la ventana(en este caso de alta) se cierra.
	$('#altaModal').on('popupafterclose',resetformalta);
	
	
	/* Ejecuto la función mostrar()*/
	mostrar();
});

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
		$miArchivo.val("");
		
		//Reseteo el elemento alerta
		resetalerta();
		
		//Desactivo el botón de grabación del formulario de altas
		$miBotongrabar.attr("disabled", "disabled");
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
			$miBotongrabar.removeAttr("disabled");
			
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
			$miBotongrabar.attr("disabled", "disabled");
		}
	}
	
	// Esta función ejecuta el código para hacer altas de nuevas imágenes
	function nuevoitem(){
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
			    titulo: $('#titulo').val(),
			    descripcion: $('#descripcion').val(),
			    imagen: miImagen			
			};
			
			/*
			 * Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
			 * Y llamo al método setItem() para crear un item
			 */
			localStorage.setItem(id, JSON.stringify(miImg_datos));
			
			//Cierro la ventana modal donde se encuentra el formulario
			$("#altaModal" ).popup( "close" );

			//Ejecuto mostrar() para actualizar el listado y que se muestre el nuevo item
			mostrar();
		
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
		$("#modificacionModal" ).popup( "close" );
		
		//Ejecuto mostrar() para actualizar el listado.
		mostrar();
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

   /*
    * Esta función se ejecuta al cargar la página y cada vez que se modifica un item o se da un alta de un nuevo item.
    * Se encarga de recuperar los items y pintarlos en pantalla
    */
   function mostrar(){
   		//Almaceno la referencia al elemento donde se va mostrar el listado y lo limpio
		var $cajadatosimagenes = $('#cajadatosimagenes ul');
		$cajadatosimagenes.html("");
		//cajadatosimagenes.innerHTML = "";
		//Este botón lanza la ventana modal del formulario de altas
		$cajadatosimagenes.append('<li data-role="list-divider" role="heading"><a id="alta" href="#altaModal" data-rel="popup" class="ui-btn ui-icon-plus ui-mini  ui-btn-icon-notext ui-btn-inline"></a></li>');
		 //En esta variable creo el html del listado, no lo hago directamente sobre cajadatosimagenes porque no genera bien el <ul>
		var texto='';
		//En este bucle recupero los items y los almaceno en la variable texto
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
			var n = clave.indexOf("img_");
			
			if (n>-1){
				var valor = localStorage.getItem(clave);
				var datos = JSON.parse(valor);
				
				texto += '<li><img class="" src="' + datos.imagen  + '" ><h2 class="h4">' +  datos.titulo + '</h2>' + datos.descripcion + '<div><a class="ui-btn ui-icon-edit ui-mini  ui-btn-icon-notext ui-btn-inline" href="#modificacionModal" data-rel="popup" data-position-to="window" onclick="dameitem(\'' + clave + '\')"></a><a class="ui-btn ui-icon-delete ui-mini  ui-btn-icon-notext ui-btn-inline" onclick="eliminar(\'' + clave + '\')"></a></div></li>';
			}
		}

		//Pinto el listado en patalla
		$cajadatosimagenes.append(texto);
		//Ahora tengo que refrescar para que el framework jquerymobile aplique las clases a los elemento recientemente creados
		 $cajadatosimagenes.listview().listview('refresh');
	}
	
	//Esta función se ejecuta al hacer click en el botón eliminar de cada item, elimina el item selecionado
   function eliminar(clave){
	
		if (confirm('¿Va a eliminar un item, está seguro?')){
			localStorage.removeItem(clave);
		}
		mostrar();
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
			mostrar();
		}
	}
