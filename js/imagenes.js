//Declaro objeto global
var miapp = {
	/*Variable para almacenar los datos de la imagen*/
	miimagen:"",
	/* Variable para almacenar la referencia al elemento type file de formulario*/
	miarchivo:"",
	/* Variable para almacenar el objeto con los datos del item a almacenar o modificar*/
	miimg_datos:"",
	/*Variable para almacenar la referencia al botón de altas */
	mibotongrabar:"",
	//Variables que almacenan las referencias a los elementos título y descripción de los formularios de alta y modificación 
	mititulo:"",
	midescripcion:"",
	mitituloeditar:"",
	midescripcioneditar:"",	
	
	//variable para almacenar la referencia al elemento alerta del formulario de altas
	mialerta:"",
	
	iniciar: function(){
		
		//Almaceno las referencias al titulo y la descripción del formulario de alta
		miapp.mititulo = document.getElementById('titulo');
		miapp.midescripcion = document.getElementById('descripcion');
		
		//Almaceno las referencias al titulo y la descripción del formulario de modificación
		miapp.mitituloeditar = document.getElementById('tituloeditar');
		miapp.midescripcioneditar = document.getElementById('descripcioneditar');
		
		/* Almaceno la referencia al elemento type file de formulario y le registro un detector para el evento 'onchange'*/
		miapp.miarchivo = document.getElementById('archivoimagen');
		miapp.miarchivo.addEventListener('change', this.procesarfile);
		
		/* Almaceno la referencia al elemento type button con id grabar de formulario y le registro un detector para el evento 'onclick'*/
		miapp.mibotongrabar = document.getElementById('grabar');
		miapp.mibotongrabar.addEventListener('click', this.nuevoitem);
		
		/* Almaceno la referencia al elemento type button con id grabareditar de formularioeditar y le registro un detector para el evento 'onclick'*/
		var botoneditar = document.getElementById('grabareditar');
		botoneditar.addEventListener('click', this.modificaritem);
		
		//El evento hide.bs.modal se lanza cuando la ventana(en este caso de alta) se cierra.
		$('#altaModal').on('hidden.bs.modal',miapp.resetformalta);
		
		/* Ejecuto la función mostrar()*/
		this.mostrar();
	},
	
	/*
	* Si el archivo no es una imagen, creo una referencia al elemento alerta e inserto el texto de aviso y le asigno la clase text-danger para mostralo con el texto en rojo
	*/
	mostraralerta: function(){
		
			miapp.mialerta = document.getElementById('alerta');
			miapp.mialerta.innerHTML = "El tipo de archivo no es correcto";
			miapp.mialerta.className = "text-danger";
	},
	
	/* Función que resetea el elemento alerta*/
	resetalerta: function(){
		miapp.mialerta.innerHTML = "";
		miapp.mialerta.className = "";
	},
	
	//Esta función se ejecuta cuando se cierra la ventana modal que contiene el formulario de altas
	resetformalta: function(){
		/*
		*Limpio todos los campos del formulario de alta.
		* Por ejemplo si selecciono un fichero y cierro la ventana sin grabarlo,
		* cdo vuelvo a abrir la ventana de altas, aún tengo seleccionado el fichero, 
		* para evitar esto, es por lo que limpio los campos del formulario.
		*/ 
		miapp.mititulo.value="";
		miapp.midescripcion.value="";
		miapp.miarchivo.value="";
		
		//Reseteo el elemento alerta
		miapp.resetalerta();
		
		//Desactivo el botón de grabación del formulario de altas
		miapp.mibotongrabar.setAttribute("disabled", "disabled");
	},
	
	/* Esta función se ejecuta cuando seleccionamos un archivo desde nuestro ordenador */
	procesarfile: function(e){
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
			miapp.resetalerta();
			
			//Activo el botón del formulario de alta
			miapp.mibotongrabar.removeAttribute("disabled");
			
			//Creo el objeto lector, lo necesitamos para leer el archivo
			var lector = new FileReader();
			/*
			 * Registro un detector para el evento onload con el objetivo de detectar cuando se carga el archivo.
			 * Guardo en la variable miapp.miimagen el contenido del  archivo, que tomamos de la propiedad result del objeto lector
			 */
			lector.addEventListener('load', function(e){miapp.miimagen=e.target.result;});	
			/*
			 * El método readAsDataURL() genera una cadena del tipo dat:url codificada en base64 que representa los datos de archivo.
			 * Cuando este método finaliza la lectura del archivo, el evento load se dispara. 
			 * Le pasamos como parámetro archivo, que es un objeto File	
			 */
			lector.readAsDataURL(archivo);
		
		}else 	{
			//Si el archivo no es una imagen 
			
			//Muestro un aviso
			miapp.mostraralerta();
			
			//Desactivo el botón de grabación del formulario de altas
			miapp.mibotongrabar.setAttribute("disabled", "disabled");
		}
	},
	
	// Esta función ejecuta el código para hacer altas de nuevas imágenes
	nuevoitem: function(){

			/*
			 * El método getTime() me devuelde el número de mm desde 1970/01/01
			 * Lo voy a utilizar, junto con el string "img_" para generar una clave para el elemento que voy a almacenar
			 */ 
			var currentDate = new Date();
			var time = currentDate.getTime();
			var key = "img_" + time;
			var id= key;
			
			//Almaceno en  un objeto todos los datos del item a grabar
			miapp.miimg_datos = {
			    titulo: miapp.mititulo.value,
			    descripcion: miapp.midescripcion.value,
			    imagen: miapp.miimagen			
			};
			
			/*
			 * Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
			 * Y llamo al método setItem() para crear un item
			 */
			localStorage.setItem(id, JSON.stringify(miapp.miimg_datos));
			
			//Cierro la ventana modal donde se encuentra el formulario
			$('#altaModal').modal('hide');

			//Ejecuto mostrar() para actualizar el listado y que se muestre el nuevo item
			miapp.mostrar();
		
	},

	//Esta función se ejecuta al hacer click en el botón Modificar de formularioeditar
   modificaritem: function(){
		//Almaceno en variables el contenido de los campos id y datos de la imagen del item a modificar del formulario formularioeditar
		//En el elemento idrecord he almacenado el id del item a modificar
		var id = document.getElementById('idrecord').value;		
		var imagensrc = document.getElementById('imageneditar').src;
		
		//Almaceno en  un objeto todos los datos del item a modificar
		miapp.miimg_datos = {
		    titulo: miapp.mitituloeditar.value,
		    descripcion: miapp.midescripcioneditar.value,
		    imagen: imagensrc
		
		};
		
		/*
		* Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
		* Y llamo al método set.Item() para actualizar el item
		*/
		localStorage.setItem(id, JSON.stringify(miapp.miimg_datos));
		
		//Cierro la ventana modal donde se encuentra el formulario de modificación
		$('#modificacionModal').modal('hide');
		
		//Ejecuto mostrar() para actualizar el listado.
		miapp.mostrar();
	},
	
	/*
	 * Esta función se ejecuta al hacer click sobre el botón editar del listado.
	 * Se le pasa como parámetro el id de la imagen a modificar
	 * Muestra en el formuario los datos del item a modificar
	 */	
  	dameitem: function(clave){
		
		//Almaceno las referencias a los diferentes campos de formularioeditar
		//El elemento idrecord es un campo de tipo hidden donde almacenaré el id de la imagen, para posteriormente grabarla
		var id=document.getElementById('idrecord');
		var cajaimagen = document.getElementById('cajaimagen');
		
		/*
		 * Llamo al método get.Item() para obtener el valor del item a modificar
		* Con el método JSON.parse() analizo el string devuelto como JSON y lo almaceno en un objeto
		*/
		var valor = localStorage.getItem(clave);
		var datos = JSON.parse(valor);
		
		//Asigno estos datos a los campos del formulario para mostrarlos
		id.value = clave;
		miapp.mitituloeditar.value = datos.titulo;
		miapp.midescripcioneditar.value = datos.descripcion;
		cajaimagen.innerHTML = '<img id="imageneditar" class="img-responsive" src="' + datos.imagen + '" >';
	},

   /*
    * Esta función se ejecuta al cargar la página y cada vez que se modifica un item o se da un alta de un nuevo item.
    * Se encarga de recuperar los items y pintarlos en pantalla
    */
   mostrar: function(){
   		//Almaceno la referencia al elemento donde se va mostrar el listado y lo limpio
		var cajadatosimagenes = document.getElementById('cajadatosimagenes');
		cajadatosimagenes.innerHTML = "";
		
		 //En esta variable creo el html del listado, no lo hago directamente sobre cajadatosimagenes porque no genera bien el <ul>
		var texto='<ul class="list-group">';
		//En este bucle recupero los items y los almaceno en la variable texto
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			//Me aseguro de que el item que voy a almacenar es una imagen (las he grabado con prefijo "img_")
			var n = clave.indexOf("img_");
			
			if (n>-1){
				var valor = localStorage.getItem(clave);
				var datos = JSON.parse(valor);
				
				texto += '<li class="list-group-item"><div class="col-sm-2"><img class="" src="' + datos.imagen  + '" ></div><div class="col-sm-10"><h2 class="h4">' +  datos.titulo + '</h2>' + datos.descripcion + '</div><div class="botones col-sm-10"><button type="button" onclick="miapp.dameitem(\'' + clave + '\')" data-toggle="modal" data-target="#modificacionModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button><button type="button" onclick="miapp.eliminar(\'' + clave + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></div></li>';
			}
		}
		texto += '</ul><div><input type="button" class="btn btn-primary" onclick="miapp.eliminarTodos()" value="Eliminar todo"></div>';
		//Pinto el listado en patalla
		cajadatosimagenes.innerHTML = texto;
	},
	
	//Esta función se ejecuta al hacer click en el botón eliminar de cada item, elimina el item selecionado
   eliminar: function(clave){
	
		if (confirm('¿Va a eliminar un item, está seguro?')){
			localStorage.removeItem(clave);
		}
		miapp.mostrar();
	},
	
	//Esta función se ejecuta al hacer click en el botom 'Eliminar todos'
   eliminarTodos: function(){
   	
		if (confirm('¿Va a eliminar todos los items,Está seguro?')){
			//Guardo el total de items en esta variable porque tengo que recorrer el bucle tantas veces como items hay antes de eliminar ninguno
			var totalInicial = localStorage.length;
			
			for (var f = 0; f < totalInicial; f++){
				//En cada iteración se elimina el primer item
				var clave = localStorage.key(0);
				//Me aseguro de que el item que voy a eliminar es una imagen (las he grabado con prefijo "img_")
				var n = clave.indexOf("img_");
				if (n>-1){
					localStorage.removeItem(clave);
				}
			}
			miapp.mostrar();
		}
	}
	
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});