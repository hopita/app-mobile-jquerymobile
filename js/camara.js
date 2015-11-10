$("document").ready(function() {
	//Variable que va a almacenar los datos de la imagen
	var miDataURL,
	
	$titulocamara = $('#titulocamara');
	$descripcioncamara = $('#descripcioncamara');
	//En la variable miVideo se almacena una referencia al elemento con id media
	$miVideo = $('#media');
		
	//Al elemento con id media le asigno alto y ancho de la ventana
	$miVideo.width = window.innerWidth;
	$miVideo.height = window.innerHeight;
		
	//En la variable miFoto se almacena una referencia al elemento con id foto
	$miFoto = $('#foto');
		
	//En la variable micanvas se almacena una referencia al elemento con id canvas
	$miCanvas = $('#canvas');
		
	// Almaceno la referencia al elemento type button con id grabar del formulario y le registro un detector para el evento 'onclick'*/
	var miBoton=$('#grabar');
	miBoton.on('click',nuevoitem);
		
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
$titulocamara.val("");
$descripcioncamara.val("");
}
	
//Esta función se ejecuta si el usuario accede a que la app tenga acceso a la cámara web.
//Esta función recibe el objeto LocalMediaStream y lo almacena en la variable stream
function exito(stream){
	//El vídeo de la cámara web se asigna al elemento <video>
		
	//Usando el método createObjectURL() se obtiene la URL que representa el stream
	//La URL se asigna al atributo src de elemento <video>
	$miVideo.attr('src', URL.createObjectURL(stream));
		
	//El vídeo se reproduce
	$miVideo.play();
	
	//Se añade un detector para el evento onclick en el elemento <video>, que ejecuta el código para tomar una instatánea, cuando se hace click en el elemento con id foto
	//Se toma el fotograma de vídeo actual y se dibuja en el lienzo, tomando una instantánea
	$miFoto.bind( "click", function( $miVideo ) {
    //Se crea el contexto del lienzo
	$miContexto = $miCanvas.getContext('2d');
		
	//Se llama al método de canvas drawImage() con una referencia al vídeo a los valores correspondientes al tamaño del elemento <canvas>
	$miContexto.drawImage(this, 0, 0, 320, 240);

	//Método que devuelve los datos de la imagen
	miDataURL = $miCanvas.toDataURL();			
   });	
}
	
function mostraerror(e){
	console.log(e.code);	
}
	
function nuevoitem(){
		
	//Almaceno las referencias al titulo y la descripción del formulario de alta
	var titulo=$titulocamara.val();
	var descripcion=$descripcioncamara.val();
		
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
	$miContexto.clearRect(0,0,$miCanvas.width, $miCanvas.height);
		
	//Cierro la ventana modal donde se encuentra el formulario
	$("#altacamaraModal" ).popup( "close" );
}