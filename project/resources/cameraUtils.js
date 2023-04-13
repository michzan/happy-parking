/* 
 * In questo file sono raggruppate le funzioni che permettono il movimento della camera all'interno della scena.
 * Attraverso la funzione realign() vengono ricalcolate le giuste direzioni
 * degli assi Xe (right_versor) - Ye - Ze (forward_versor) in seguito alle rotazioni della camera, in modo 
 * da avere traslazioni sempre coerenti con l’orientamento corrente della camera.
 */

var cameraPosition;
var target;
var up;
var forward_versor, right_versor, ycam_axis;

function initCamera(){
 //Inizializzazione delle posizioni significative
 cameraPosition = [4, 3 , 8];
 target = [-2, 2, -8];
 up = [0, 1, 0];

 //calcolo gli assi della camera
 forward_versor = m4.normalize(m4.subtractVectors(target, cameraPosition, forward_versor)); 	//Asse Ze
 right_versor = m4.normalize(m4.cross(forward_versor, up));									//Asse Xe
 ycam_axis = m4.normalize(m4.cross(right_versor, forward_versor));							//Asse Ye
 
 //Inizializzazione della matrice di vista
 viewMatrix = m4.inverse(m4.lookAt(cameraPosition, target, up));
}

/* Funzione realign() che permette di ricalcolare le giuste direzioni degli assi Xe (right_versor) - Ye - Ze (forward_versor).*/
function realign(){
	forward_versor = m4.normalize(m4.subtractVectors(target, cameraPosition, forward_versor));
	right_versor = m4.normalize(m4.cross(forward_versor, up));
	ycam_axis = m4.normalize(m4.cross(right_versor, forward_versor));
	forward_versor = m4.normalize(forward_versor);
}

/*TRASLAZIONI DI CAMERAPOSITION E DI TARGET*/
function moveForwardCameraPos(dist){
	cameraPosition[0] += dist * forward_versor[0];
	cameraPosition[1] += dist * forward_versor[1];
	cameraPosition[2] += dist * forward_versor[2];
}

function moveForwardTarget(dist){
	target[0] += dist * forward_versor[0];
	target[1] += dist * forward_versor[1];
	target[2] += dist * forward_versor[2];
}

function moveUpCameraPos(dist){
	cameraPosition[1] += dist;
}

function moveUpTarget(dist){
	target[1] += dist;
}

function moveRightCameraPos(dist){
	cameraPosition[0] += dist * right_versor[0];
	cameraPosition[1] += dist * right_versor[1];
	cameraPosition[2] += dist * right_versor[2];
}

function moveRightTarget(dist){
	target[0] += dist * right_versor[0];
	target[1] += dist * right_versor[1];
	target[2] += dist * right_versor[2];
}

/*ROTAZIONI*/
function rotateTargetRight(rad){
	var rightMatrix = m4.axisRotation(ycam_axis, rad);
	forward_versor = m4.transformPoint(rightMatrix, forward_versor);	//ruoto il forward_versor, considerandolo come un punto, intorno all'asse y della camera.
	target = m4.addVectors(cameraPosition, forward_versor);				//aggiorno la posizione del target, sommando il nuovo forward_versor alla cameraPosition.
	realign();															//riallineo gli assi della camera.
}

function rotateTargetUp(rad){
	var upMatrix = m4.axisRotation(right_versor, rad);
	forward_versor = m4.transformPoint(upMatrix, forward_versor);		//ruoto il forward_versor, considerandolo come un punto, intorno all'asse x della camera.
	target = m4.addVectors(cameraPosition, forward_versor);				//aggiorno la posizione del target, sommando il nuovo forward_versor alla cameraPosition.
	realign();															//riallineo gli assi della camera.
}