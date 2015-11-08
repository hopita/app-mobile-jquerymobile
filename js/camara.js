// JavaScript Document
//Declaro objeto global
var miapp = {
	//variable que va a almacenar una referencia al elemento con id media
	miVideo:"",
	//Variable que va a almacenar una referencia al elemento con id foto
	miFoto:"",
	//Variable que va a almacenar los datos de la imagen
	dataURL:"",
	//Variable que va a almacenar una referencia al elemento con id canvas
	micanvas:"",
	//Variable que va a almacenar el contexto del lienzo
	micontexto:"",
	
	iniciar: function(){
		
		//En la variable miVideo se almacena una referencia al elemento con id media
		this.miVideo = document.getElementById('media');
		
		//Al elemento con id media le asigno alto y ancho de la ventana
		this.miVideo.width = window.innerWidth;
		this.miVideo.height = window.innerHeight;
		
		//En la variable miFoto se almacena una referencia al elemento con id foto
		this.miFoto = document.getElementById('foto');
		
		//En la variable micanvas se almacena una referencia al elemento con id canvas
		this.micanvas = document.getElementById('canvas');
		
		// Almaceno la referencia al elemento type button con id grabar del formulario y le registro un detector para el evento 'onclick'*/
		var boton=document.getElementById('grabar');
		boton.addEventListener('click', this.nuevoitem);
		
		//El evento hide.bs.modal se lanza cuando la ventana(en este caso de alta) se cierra.
		$('#myModal').on('hidden.bs.modal',miapp.resetformalta);
		
		//Aseguro la compatibilidad de la API en los distintos navegadores
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		//Método para tener acceso a la cámara web. En caso de éxito se ejecuta la función exito()
		navigator.getUserMedia({video:true}, miapp.exito, miapp.mostraerror);		
	},
	
	//Esta función se ejecuta cuando se cierra la ventana modal que contiene el formulario de altas
	resetformalta: function(){
		/*
		*Limpio todos los campos del formulario de alta.
		*/ 
		document.getElementById('titulo').value="";
		document.getElementById('descripcion').value="";
	},
	
	//Esta función se ejecuta si el usuario accede a que la app tenga acceso a la cámara web.
	//Esta función recibe el objeto LocalMediaStream y lo almacena en la variable stream
	exito: function(stream){
		
		//El vídeo de la cámara web se asigna al elemento <video>
		
		//Usando el método createObjectURL() se obtiene la URL que representa el stream
		//La URL se asigna al atributo src de elemento <video>
		miapp.miVideo.setAttribute('src', URL.createObjectURL(stream));
		
		//El vídeo se reproduce
		miapp.miVideo.play();
		
		//En la variable miFoto se almacena una referencia al elemento con id foto
		miapp.miFoto = document.getElementById('foto');
		//Se añade un detector para el evento onclick en el elemento <video>
		miapp.miFoto.addEventListener('click', miapp.instantanea.bind(miapp.miVideo));			
	},
	
	mostraerror: function(e){
		console.log(e.code);	
	},
	
	//Esta función ejecuta el código para tomar una instatánea, cuando se hace click en el elemento con id foto
	//Se toma el fotograma de vídeo actual y se dibuja en el lienzo, tomando una instantánea
	instantanea: function(){
		
		//Se crea el contexto del lienzo
		miapp.micontexto = miapp.micanvas.getContext('2d');
		
		//Se llama al método de canvas drawImage() con una referencia al vídeo a los valores correspondientes al tamaño del elemento <canvas>
		miapp.micontexto.drawImage(this, 0, 0, 320, 240);

		//Método que devuelve los datos de la imagen
		miapp.dataURL = miapp.micanvas.toDataURL();			
	},
	
	nuevoitem: function(){
		
		//Almaceno las referencias al titulo y la descripción del formulario de alta
		var titulo=document.getElementById('titulo').value;
		var descripcion=document.getElementById('descripcion').value;
		
		/*
			 * El método getTime() me devuelde el número de mm desde 1970/01/01
			 * Lo voy a utilizar, junto con el string "img_" para generar una clave para el elemento que voy a almacenar
			 */ 
		var currentDate = new Date();
		var time = currentDate.getTime();
		var key = "img_" + time;
		var img_id= key;
		//Almaceno en  un objeto todos los datos del item a grabar
		var img_datos = {
		    titulo: titulo,
		    descripcion: descripcion,
		    imagen: miapp.dataURL		
		};
		
		/*
			 * Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
			 * Y llamo al método setItem() para crear un item
			 */
		localStorage.setItem(img_id, JSON.stringify(img_datos));
		
		/*
		*Limpio todos los campos del formulario de alta.
		*/ 
		miapp.resetformalta();
		miapp.micontexto.clearRect(0,0,miapp.micanvas.width, miapp.micanvas.height);
		
		//Cierro la ventana modal donde se encuentra el formulario
		$('#myModal').modal('hide');
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});
