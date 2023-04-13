// Implementazione dei metodi che permettono il movimento della carrera.

  // STATO DELLA MACCHINA
  // (DoStep fa evolvere queste variabili nel tempo)
  var px,py,pz,facing; // posizione e orientamento
  var mozzoA, mozzoP, sterzo; // stato interno
  var vx,vy,vz; // velocita' attuale

  // queste di solito rimangono costanti
  var velSterzo, velRitornoSterzo, accMax, attrito,
        raggioRuotaA, raggioRuotaP, grip,
        attritoX, attritoY, attritoZ; // attriti
  var key;
  var incVelocitaLancio;

/*=================== CARRERA INIT: Inizializziamo le variabili utili alla fisica e al movimento della carrera ===================*/
function initCarrera(){
  // inizializzo lo stato della macchina
  px=py=pz=facing=0; // posizione e orientamento
  mozzoA=mozzoP=sterzo=0;   // stato
  vx=vy=vz=0;      // velocita' attuale
  // inizializzo la struttura di controllo
  key=[false,false,false,false];
 

  velSterzo=3.2;         // A
  velRitornoSterzo=0.84; // B, sterzo massimo = A*B / (1-B)

  accMax = 0.003;

  // attriti: percentuale di velocita' che viene mantenuta
  // 1 = no attrito
  // <<1 = attrito grande
  attritoZ = 0.97;  // piccolo attrito sulla Z (nel senso di rotolamento delle ruote)
  attritoX = 0.8;  // grande attrito sulla X (per non fare slittare la macchina)
  attritoY = 1.0;  // attrito sulla y nullo

  // Nota: vel max = accMax*attritoZ / (1-attritoZ)

  raggioRuotaA = 0.33;
  raggioRuotaP = 0.33;

  grip = 2; // quanto il facing macchina si adegua velocemente allo sterzo
}

/*=================== CARRERA DO STEP: facciamo un passo di fisica (a delta-t costante): Indipendente dal rendering. ===================*/
function CarreraDoStep(){
  // computiamo l'evolversi della macchina

  var vxm, vym, vzm; // velocita' in spazio macchina

  // da vel frame mondo a vel frame macchina
  var cosf = Math.cos(facing*Math.PI/180.0);
  var sinf = Math.sin(facing*Math.PI/180.0);
  vxm = +cosf*vx - sinf*vz;
  vym = vy;
  vzm = +sinf*vx + cosf*vz;

  // gestione dello sterzo
  if (key[1]) sterzo+=velSterzo;
  if (key[3]) sterzo-=velSterzo;
  sterzo*=velRitornoSterzo; // ritorno a volante fermo

  
	if (key[0]) vzm-=accMax; // accelerazione in avanti
	if (key[2]) vzm+=accMax; // accelerazione indietro
  

  // attriti (semplificando)
  vxm*=attritoX;
  vym*=attritoY;
  vzm*=attritoZ;

  // l'orientamento della macchina segue quello dello sterzo
  // (a seconda della velocita' sulla z)
  facing = facing - (vzm*grip)*sterzo;
  
  // rotazione mozzo ruote (a seconda della velocita' sull'asse z della macchina):
  var da ; //delta angolo
  da=(180.0*vzm)/(Math.PI*raggioRuotaA);    //Ricavata dalla formula della velocità angolare (vedi slide 17 pacco progetto_car)
  mozzoA+=da;
  da=(180.0*vzm)/(Math.PI*raggioRuotaP);
  mozzoP+=da;

  // ritorno a vel coord mondo
  vx = +cosf*vxm + sinf*vzm;
  vy = vym;
  vz = -sinf*vxm + cosf*vzm;

  // posizione = posizione + velocita * delta t (ma e' delta t costante = 1)
  px+=vx;
  py+=vy;
  pz+=vz;

  carP = meshes[0];
  stradaP = meshes[5];
  pianoP = meshes[6]
  muretto1P = meshes[7];
  muretto2P = meshes[8];

  vetCar = [0,0];
  vetStrada = [-2,-2,2,2];
  vetPiano = [-2,-13];
  vetM1 = [-2.3,-3,0,1];
  vetM2 = [-4,-0.5,0,0.5];

  //creazione bounding box per semplificare gli oggetti e contorollare eventuali collisioni
  boundingBox(carP, vetCar);
  boundingBox(stradaP,vetStrada);
  boundingBox(pianoP, vetPiano);
  boundingBox(muretto1P,vetM1);
  boundingBox(muretto2P, vetM2);

//Controllo delle collisioni e stampa all'interno di una specifica canvas di un messaggio

if(!checkCollision(carP.boundingBox,pianoP.boundingBox,px,pz)){
    ctxCollisionCanvas.clearRect(0, 0, ctxCollisionCanvas.canvas.width, ctxCollisionCanvas.canvas.height);
    ctxCollisionCanvas.font = '20pt Arial';
    ctxCollisionCanvas.fillStyle = 'red';
    ctxCollisionCanvas.textAlign = "center";
    ctxCollisionCanvas.fillText('COLLISIONE PIANO!!', ctxCollisionCanvas.canvas.width/2, ctxCollisionCanvas.canvas.height/4);
    
    vx = -vx
    px +=vx/3

    vz = -vz
    pz += vz/3
}else
  if(!checkCollision(carP.boundingBox, muretto1P.boundingBox,px,pz)){
    ctxCollisionCanvas.clearRect(0, 0, ctxCollisionCanvas.canvas.width, ctxCollisionCanvas.canvas.height);
    ctxCollisionCanvas.font = '20pt Arial';
    ctxCollisionCanvas.fillStyle = 'red';
    ctxCollisionCanvas.textAlign = "center";
    ctxCollisionCanvas.fillText('COLLISIONE MURO LATERALE!!', ctxCollisionCanvas.canvas.width/2, ctxCollisionCanvas.canvas.height/4);
    
    vx = -vx
    px +=vx/3

    vz = -vz
    pz += vz/3
  
  }
  else
    if(!checkCollision(carP.boundingBox, muretto2P.boundingBox,px,pz)){
      ctxCollisionCanvas.clearRect(0, 0, ctxCollisionCanvas.canvas.width, ctxCollisionCanvas.canvas.height);
      ctxCollisionCanvas.font = '20pt Arial';
      ctxCollisionCanvas.fillStyle = 'red';
      ctxCollisionCanvas.textAlign = "center";
      ctxCollisionCanvas.fillText('COLLISIONE MURO FRONTALE!!', ctxCollisionCanvas.canvas.width/2, ctxCollisionCanvas.canvas.height/4);
    
      vx = -vx
      px +=vx/3

      vz = -vz
      pz += vz/3
  
    }
  else
    if(checkCollision(carP.boundingBox, stradaP.boundingBox,px,pz)){
      ctxCollisionCanvas.clearRect(0, 0, ctxCollisionCanvas.canvas.width, ctxCollisionCanvas.canvas.height);
      ctxCollisionCanvas.font = '20pt Arial';
      ctxCollisionCanvas.fillStyle = 'red';
      ctxCollisionCanvas.textAlign = "center";
      ctxCollisionCanvas.fillText('HAI PROVADO AD ABBANDONARE LA STRADA!!', ctxCollisionCanvas.canvas.width/2, ctxCollisionCanvas.canvas.height/4);
      vx = -vx
      px +=vx/2

      vz = -vz
      pz += vz/2
    }else{
      ctxCollisionCanvas.clearRect(0, 0, ctxCollisionCanvas.canvas.width, ctxCollisionCanvas.canvas.height);
      ctxCollisionCanvas.font = '20pt Arial';
      ctxCollisionCanvas.fillStyle = 'black';
      ctxCollisionCanvas.textAlign = "left";
      ctxCollisionCanvas.fillText('NESSUNA COLLISIONE', ctxCollisionCanvas.canvas.width/2, ctxCollisionCanvas.canvas.height/4);
        px+=vx;
        py+=vy;
        pz+=vz;  
      
    }
}

/*=================== CHECK COLLISION: controllo di collisione tra macchina e alcuni oggetti della scena ===================*/
function checkCollision(car, mesh ,px,pz){
  return(car.cor1[0] + px > mesh.cor1[0]+mesh.w ||
    car.cor1[0] + car.w +px< mesh.cor1[0] ||
    car.cor1[1] +pz > mesh.cor1[1] + mesh.l ||
    car.cor1[1] + car.l +pz< mesh.cor1[1]) 
  }