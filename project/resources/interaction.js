//File contenete tutte le funzioni inerenti alla gestione degli eventi dei vari listener

var point1, point2, point3, point4, clicked1=false, clicked2=false;

/*FUNZIONE CHE CONVERTE LE COORDINATE BROWSER DEL MOUSE ALLE COORDINATE CANVAS*/
function mouseBrowserToCanvas(canvas, x, y) {				//x,y sono le coordinate browser del puntatore del mouse
      var bbox = canvas.getBoundingClientRect();
      return { x: Math.round(x - bbox.left * (canvas.width  / bbox.width)),
               y: Math.round(y - bbox.top  * (canvas.height / bbox.height))
			};    	  
}


/*====================== GESTIONE DEI CLICK/TOUCH SULLE DUE CANVAS "GAMEPAD" ======================*/
function doMouseUp(e){
  if(e.srcElement.id == "touchCanvas1"){
	  clicked1 = false;
	  ctxTouchCanvas1.clearRect(0, 0, ctxTouchCanvas1.canvas.width, ctxTouchCanvas1.canvas.height);
	  ctxTouchCanvas1.drawImage(cursorImg, -5, -5, 200, 200);
	  cameraInteraction.moveForward = false;
	  cameraInteraction.moveBackward = false;
	  cameraInteraction.moveRight = false;
	  cameraInteraction.moveLeft = false;
	  key[0] = false;
	  key[1] = false;
	  key[2] = false;
	  key[3] = false;
  }
  else{
	  clicked2 = false;
	  ctxTouchCanvas2.clearRect(0, 0, ctxTouchCanvas2.canvas.width, ctxTouchCanvas2.canvas.height);
	  ctxTouchCanvas2.drawImage(cursorImg, -5, -5, 200, 200);
	  cameraInteraction.rotateUp = false;
	  cameraInteraction.rotateDown = false;
	  cameraInteraction.rotateRight = false;
	  cameraInteraction.rotateLeft = false;
  }
}

function doMouseDown(e){
  if(e.srcElement.id == "touchCanvas1"){		//Il touch è stato fatto sulla canvas 1
	clicked1 = true;
    point1 = mouseBrowserToCanvas(touchCanvas1, e.clientX, e.clientY);
	ctxTouchCanvas1.beginPath();
	ctxTouchCanvas1.arc(point1.x, point1.y, 20, 0, 2*Math.PI);
	ctxTouchCanvas1.fill();
	ctxTouchCanvas1.closePath();
  } else{										//Il touch è stato fatto sulla canvas 2
	clicked2 = true;
	point3 = mouseBrowserToCanvas(touchCanvas2, e.clientX, e.clientY);
	ctxTouchCanvas2.beginPath();
	ctxTouchCanvas2.arc(point3.x, point3.y, 20, 0, 2*Math.PI);
	ctxTouchCanvas2.fill();
	ctxTouchCanvas2.closePath();
  }

  
}

function doMouseMove1(e){	
	if(clicked1){		//L'utente sta facendo drag sulla canvas 1: Movimento camera o macchinina (se modalita gara)
		point2 = mouseBrowserToCanvas(touchCanvas1, e.clientX, e.clientY);
		
		//Il puntatore del mouse è sopra l'immagine del cursore, disegno il cerchio di spostamento
		ctxTouchCanvas1.clearRect(0, 0, ctxTouchCanvas1.canvas.width, ctxTouchCanvas1.canvas.height);
		ctxTouchCanvas1.drawImage(cursorImg, -5, -5, 200, 200);
		ctxTouchCanvas1.beginPath();
		ctxTouchCanvas1.arc(point2.x, point2.y, 20, 0, 2*Math.PI);
		ctxTouchCanvas1.fill();
		ctxTouchCanvas1.closePath();
		

		switch (modalitaParcheggio){
			case false:
				if(point2.x<=85){	//Movimento a sx
					cameraInteraction.moveLeft = true;
					cameraInteraction.moveRight = false;
				} else if(point2.x>=120){	//Movimento a dx
					cameraInteraction.moveLeft = false;
					cameraInteraction.moveRight = true;
				}else{
					cameraInteraction.moveLeft = false;
					cameraInteraction.moveRight = false;
				}
				
				if(point2.y<=85){
					cameraInteraction.moveForward = true;
					cameraInteraction.moveBackward = false;
				} else if(point2.y>=120){
					cameraInteraction.moveForward = false;
					cameraInteraction.moveBackward = true;
				} else{
					cameraInteraction.moveForward = false;
					cameraInteraction.moveBackward = false;
				}
				break;
			case true:
				if(point2.x<=70){	//Movimento a sx
					key[1] = true;
					key[3] = false;
				} else if(point2.x>=135){	//Movimento a dx
					key[1] = false;
					key[3] = true;
				}else{
					key[1] = false;
					key[3] = false;
				}	
				if(point2.y<=85){	//Movimento avanti
					key[0] = true;
					key[2] = false;
				} else if(point2.y>=120){	//Movimento indietro
					key[0] = false;
					key[2] = true;
				} else{
					key[0] = false;
					key[2] = false;
				}
				break;
		}
	}
}


function doMouseMove2(e){	
	if(clicked2){		//L'utente sta facendo drag sulla canvas 2: Rotazione della camera
		point4 = mouseBrowserToCanvas(touchCanvas2, e.clientX, e.clientY);

		//Il puntatore del mouse è sopra l'immagine del cursore, disegno il cerchio di spostamento
		ctxTouchCanvas2.clearRect(0, 0, ctxTouchCanvas2.canvas.width, ctxTouchCanvas2.canvas.height);
		ctxTouchCanvas2.drawImage(cursorImg, -5, -5, 200, 200);
		ctxTouchCanvas2.beginPath();
		ctxTouchCanvas2.arc(point4.x, point4.y, 20, 0, 2*Math.PI);
		ctxTouchCanvas2.fill();
		ctxTouchCanvas2.closePath();
		

		if(point4.x<=85){	//Movimento a sx
			cameraInteraction.rotateLeft = true;
			cameraInteraction.rotateRight = false;
		} else if(point4.x>=120){	//Movimento a dx
			cameraInteraction.rotateLeft = false;
			cameraInteraction.rotateRight = true;
		}else{
			cameraInteraction.rotateLeft = false;
			cameraInteraction.rotateRight = false;
		}
		
		if(point4.y<=85){
			cameraInteraction.rotateUp = true;
			cameraInteraction.rotateDown = false;
		} else if(point4.y>=120){
			cameraInteraction.rotateUp = false;
			cameraInteraction.rotateDown = true;
		} else{
			cameraInteraction.rotateUp = false;
			cameraInteraction.rotateDown = false;
		}
	}
}
	  

/*====================== GESTIONE DELLA PRESSIONE DEI TASTI DELLA TASTIERA ======================*/
function doKeyDown(e){

		if(e.keyCode == 82){
			resetVisualPosition();
		}
         
         // THE W KEY
         if (e.keyCode == 87) {
			if(!modalitaParcheggio)
				cameraInteraction.moveForward = true;
			else
				key[0]=true;
		}
		 
         // THE S KEY
         if (e.keyCode == 83) {
			if(!modalitaParcheggio)
				cameraInteraction.moveBackward = true;
			else
				key[2]=true;
		}

         // THE A KEY
         if (e.keyCode == 65) {
			if(!modalitaParcheggio)
				cameraInteraction.moveLeft = true;
			else
				key[1]=true;
		}
       
         // THE D KEY
         if (e.keyCode == 68) {
			if(!modalitaParcheggio)
				cameraInteraction.moveRight = true;
			else
				key[3]=true;
		}

		// RIGHT ARROW
		if (e.keyCode == 39){
			if(!modalitaParcheggio)
				cameraInteraction.rotateRight = true;
		}

		// LEFT ARROW
		if (e.keyCode == 37){
			if(!modalitaParcheggio)
				cameraInteraction.rotateLeft = true;
		}

		// UP ARROW
		if (e.keyCode == 38){
			if(!modalitaParcheggio)
				cameraInteraction.moveUp = true;
		}

		// DOWN ARROW
		if (e.keyCode == 40){
			if(!modalitaParcheggio)
				cameraInteraction.moveDown = true;
		}
		
}

function doKeyUp(e){
        
         // THE W KEY
         if (e.keyCode == 87) {
			if(!modalitaParcheggio)
				cameraInteraction.moveForward = false;
			else
				key[0]=false;
		}
         
         // THE S KEY
         if (e.keyCode == 83) {
			if(!modalitaParcheggio)
				cameraInteraction.moveBackward = false;
			else
				key[2]=false;
		}
         
         // THE A KEY
         if (e.keyCode == 65) {
			if(!modalitaParcheggio)
				cameraInteraction.moveLeft = false;
			else
				key[1]=false;
		}
         
         // THE D KEY
         if (e.keyCode == 68) {
			if(!modalitaParcheggio)
				cameraInteraction.moveRight = false;
			else
				key[3]=false;
		}

		// RIGHT ARROW
		if (e.keyCode == 39){
			if(!modalitaParcheggio)
				cameraInteraction.rotateRight = false;
		}

		// LEFT ARROW
		if (e.keyCode == 37){
			if(!modalitaParcheggio)
				cameraInteraction.rotateLeft = false;
		}

		// UP ARROW
		if (e.keyCode == 38){
			if(!modalitaParcheggio)
				cameraInteraction.moveUp = false;
		}
		
		// DOWN ARROW
		if (e.keyCode == 40){
			if(!modalitaParcheggio)
				cameraInteraction.moveDown = false;
		}
}

/*====================== GESTIONE DELLE FUNZIONALITA' DEL PANNELLO UI ======================*/
//Modalita' scena/parcheggio
function changeMod(radioButton){
	if(radioButton.value == "scena"){
		modalitaParcheggio = false;
		initCamera();
		touchCanvas2.addEventListener("mousedown", doMouseDown); 
		touchCanvas2.addEventListener("mouseup", doMouseUp);
		touchCanvas2.addEventListener("mousemove", doMouseMove2);
		document.getElementById("sceltaVisuale").hidden = true;
		document.getElementById('touchCanvas2').hidden = false;
	}
	else{
		modalitaParcheggio = true;
		//nascondo e disabilito la canvas di rotazione visuale che non serve
		document.getElementById('touchCanvas2').hidden = true;
		touchCanvas2.removeEventListener("mousedown", doMouseDown); 
		touchCanvas2.removeEventListener("mouseup", doMouseUp);
		touchCanvas2.removeEventListener("mousemove", doMouseMove2);
		document.getElementById("sceltaVisuale").hidden = false;
		initCarrera();
	}
}

function changeTrA (slider){
	trA = slider.value;
}

function changeTrC (slider){
	trC = slider.value;
}

function changeTrE (slider){
	trE = slider.value;
}


function resetVisualPosition (){
	if(!modalitaParcheggio){
		initCamera();
	}
	else{
		initCarrera();
	}

}
// mostra/nascondi istruzioni
function showIns (button){
	if(button.value == "show"){
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fillStyle = 'rgba(210, 171, 247, 0.35)';
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.strokeStyle='rgb(71, 15, 117)';
		ctx.lineWidth = "5";
		ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
			
  		ctx.font = '20pt Arial';
  		ctx.fillStyle = 'rgb(71, 15, 117)';
  		ctx.textAlign = "center";
 		ctx.fillText('Benvenuti in HAPPY PARKING', ctx.canvas.width/2, 50);
		ctx.drawImage(istruzioni, 5, 80,940, 600);
		button.value = "noShow";
	}else{
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		button.value = "show";
	}
}

//Visuale prima/terza persona
var visual = "primaPer";
function changeVisual(radioButton){
	if(radioButton.value == "primaPer")
		visual = "primaPer";
	else
		visual = "terzaPer";
}

//Attiva/disattiva movimento luce
function activeLightMovement(checkbox){
	if(checkbox.checked)
		lightMoveOpt = true;
	else{
		lightMoveOpt = false;
	}
}
