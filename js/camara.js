$("document").ready(function() {
	//Variable que va a almacenar los datos de la imagen
	var miDataURL;
	var miContexto;
	
	$titulocamara = $('#titulocamara');
	$descripcioncamara = $('#descripcioncamara');
	
	console.log($titulocamara);
		
	
		
	//En la variable miFoto se almacena una referencia al elemento con id foto
	$miFoto = $('#foto');
		
	// Almaceno la referencia al elemento type button con id grabar del formulario y le registro un detector para el evento 'onclick'*/
	$('#grabarcamara').on('click',nuevoitem);
		
	//El evento popupafterclose se lanza cuando la ventana(en este caso de alta) se cierra.
	$('#altacamaraModal').on('popupafterclose',resetformalta);
		
	//Aseguro la compatibilidad de la API en los distintos navegadores
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	//Método para tener acceso a la cámara web. En caso de éxito se ejecuta la función exito()
	navigator.getUserMedia({video:true}, exito, mostraerror);		
});

//Esta función se ejecuta cuando se cierra la ventana modal que contiene el formulario de altas
function resetformalta(){
	/*
	*Limpio todos los campos del formulario de alta.
	*/ 
	$('#titulocamara').val("");
	$('#descripcioncamara').val("");
}
	
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
		miDataURL = miCanvas.toDataURL();	
		
		$("#altacamaraModal").popup("open");		
   });	
}
	
function mostraerror(e){
	console.log(e.code);	
}
	
function nuevoitem(){
	
	console.log("estoy en nuevo item");
			
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
		titulo: $('#titulocamara').val(),
		descripcion: $('#descripcioncamara').val(),
		imagen: miDataURL		
	};
		
	/*
	* Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
	* Y llamo al método setItem() para crear un item
	*/
	localStorage.setItem(img_id, JSON.stringify(img_datos));
		
	/*
	*Limpio todos los campos del formulario de alta.
	*/ 
	resetformalta();
	var miCanvas = document.getElementById('canvas');

	miContexto.clearRect(0,0,miCanvas.width, miCanvas.height);
		
	//Cierro la ventana modal donde se encuentra el formulario
	$("#altacamaraModal" ).popup( "close" );
}