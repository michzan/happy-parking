//Funzione che carica una texture
   function loadTexture(gl, path, fileName) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([255, 255, 255, 255]);  // opaque blue
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
               width, height, border, srcFormat, srcType, pixel);
      
      if(fileName){
         const image = new Image();
         image.onload = function() {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,srcFormat, srcType, image);
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) 
                gl.generateMipmap(gl.TEXTURE_2D); // Yes, it's a power of 2. Generate mips.
            else {
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
               gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
         };
         image.src = path + fileName;
      }
      return texture;
      
      function isPowerOf2(value) {
         return (value & (value - 1)) == 0;
      }
   }
/*=================== BOUNDING BOX: calcolo coordinate bounding box =================== */
function boundingBox(mesh,vet){
  
   var minX,minY,minZ;
   var maxX,maxY,maxZ;
   var w, l;
   //var cx,cy,cz;
   minX = maxX = mesh.data.vert[0].x;
   minY = maxY = mesh.data.vert[0].y;
   minZ = maxZ = mesh.data.vert[0].z;
   
   for(var i = 0; i < mesh.data.vert.length; i++){
      if(mesh.data.vert[i].x < minX)
         minX = mesh.data.vert[i].x;
      if(mesh.data.vert[i].x > maxX)
         maxX = mesh.data.vert[i].x;
      if(mesh.data.vert[i].y < minY)
         minY = mesh.data.vert[i].y;
      if(mesh.data.vert[i].y > maxY)
         maxY = mesh.data.vert[i].y;
      if(mesh.data.vert[i].z < minZ)
         minZ = mesh.data.vert[i].z;
      if(mesh.data.vert[i].z > maxZ)
         maxZ = mesh.data.vert[i].z;
   }
   if (mesh.meshName == "pianoMesh" || mesh.meshName == "carMesh"){
         maxX = maxX + vet[0];
         maxZ = maxZ + vet[1];
   }
   else{
      maxX = maxX + vet[0];
      maxZ = maxZ + vet[1];
      minX= minX + vet[2];
      minZ = minZ + vet[3];
   }
   w = maxX - minX;
   l = maxZ - minZ;
   
   cx = (maxX + minX) / 2.0;
   cy = (maxY + minY) / 2.0;
   cz = (maxZ + minZ) / 2.0;

   mesh.boundingBox = new Array()
   //mesh.boundingBox.minX = minX;
   //mesh.boundingBox.maxX = maxX;
   mesh.boundingBox.w = w;
   //mesh.boundingBox.minY = minY;
   //mesh.boundingBox.maxY = maxY;
   
   //mesh.boundingBox.minZ = minZ;
   //mesh.boundingBox.maxZ = maxZ;
   mesh.boundingBox.l = l;
   //mesh.boundingBox.cx = cx;
   //mesh.boundingBox.cy = cy;
   //mesh.boundingBox.cz = cz;
   
  
   cor0 = [maxX, minZ]
   cor1 = [minX, minZ]
   cor2 = [minX, maxZ]
   cor3 = [maxX, maxZ]
 

   mesh.boundingBox.cor0 = cor0
   mesh.boundingBox.cor1 = cor1
   mesh.boundingBox.cor2 = cor2
   mesh.boundingBox.cor3 = cor3

     
}
//Funzione che utilizza la libreria glm_utils per leggere un eventuale 
//file MTL associato alla mesh
	function readMTLFile(MTLfileName, mesh){
		return $.ajax({
			type: "GET",
			url: MTLfileName,
			dataType: "text",
			async: false,
			success: parseMTLFile,
			error: handleError,
		});
		function parseMTLFile(result, status, xhr){
			glmReadMTL(result, mesh);
		}
		function handleError(jqXhr, textStatus, errorMessage){
			console.error('Error : ' + errorMessage);
		}
	}

//Funzione che serve per recuperare i dati della mesh da un file OBJ
	function retrieveDataFromSource(mesh,name,i_matrix){
      loadMeshFromOBJ(mesh,name,i_matrix);
      if(mesh.fileMTL) {
         readMTLFile(mesh.sourceMesh.substring(0, mesh.sourceMesh.lastIndexOf("/")+1) + mesh.fileMTL, mesh.data); 
        mesh.materials = mesh.data.materials;
         delete mesh.data.materials;
      }
      mesh.positions = [];
      mesh.normals = [];
      mesh.texcoords = [];
      mesh.positionBuffer = gl.createBuffer();
      mesh.normalsBuffer = gl.createBuffer();
      mesh.texcoordBuffer = gl.createBuffer();
      var x=[], y=[], z=[];
     var xt=[], yt=[];
     var i0,i1,i2;
     var nvert=mesh.data.nvert;
     var nface=mesh.data.nface;
     var ntexcoord=mesh.data.textCoords.length;

     for (var i=0; i<nvert; i++){
        x[i]=mesh.data.vert[i+1].x;
        y[i]=mesh.data.vert[i+1].y;
        z[i]=mesh.data.vert[i+1].z;       
      }
     for (var i=0; i<ntexcoord-1; i++){
        xt[i]=mesh.data.textCoords[i+1].u;
        yt[i]=mesh.data.textCoords[i+1].v;      
     }
     for (var i=1; i<=nface; i++){
       i0=mesh.data.face[i].vert[0]-1;
       i1=mesh.data.face[i].vert[1]-1;
       i2=mesh.data.face[i].vert[2]-1;
       mesh.positions.push(x[i0],y[i0],z[i0],x[i1],y[i1],z[i1],x[i2],y[i2],z[i2]); 
       i0=mesh.data.facetnorms[i].i;
       i1=mesh.data.facetnorms[i].j;
       i2=mesh.data.facetnorms[i].k;
       mesh.normals.push(i0,i1,i2,i0,i1,i2,i0,i1,i2); 
       i0=mesh.data.face[i].textCoordsIndex[0]-1;
       i1=mesh.data.face[i].textCoordsIndex[1]-1;
       i2=mesh.data.face[i].textCoordsIndex[2]-1;
       mesh.texcoords.push(xt[i0],yt[i0],xt[i1],yt[i1],xt[i2],yt[i2]);
     }         
     mesh.data.numVertices=3*nface;
     numVertices = 3*nface
     
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER,  mesh.positionBuffer);
  // Put the positions in the buffer
  //setGeometry(gl);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( mesh.positions), gl.STATIC_DRAW);

  
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER mormalsBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER,  mesh.normalsBuffer);
  // Put the normals in the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( mesh.normals), gl.STATIC_DRAW);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER textcoordBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER,  mesh.texcoordBuffer);
  // Set Texcoords
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array( mesh.texcoords), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  
   meshes.push(mesh);
}

//Funzione che utilizza la libreria glm_utils per leggere un file OBJ 
//contenente la definizione della mesh
   function loadMeshFromOBJ(mesh,name,i_matrix) {
      return $.ajax({
         type: "GET",
         url: mesh.sourceMesh,
         dataType: "text",
         async: false,
         success: parseobjFile,
         error: handleError,
      });
      function parseobjFile(result, status, xhr){                  
           
         result = glmReadOBJ(result,new subd_mesh());
//scommentare/commentare per utilizzare o meno la LoadSubdivMesh
         
         mesh.data = LoadSubdivMesh(result.mesh);
         mesh.meshName = name;
        
         mesh.init_matrix = i_matrix
         
         mesh.fileMTL = result.fileMtl;
         
      }	
      function handleError(jqXhr, textStatus, errorMessage){
         console.error('Error : ' + errorMessage);
      }
   } 


   
/*========== Loading and storing the geometry ==========*/
function LoadMesh(gl,mesh,name,i_matrix) {

   retrieveDataFromSource(mesh,name,i_matrix);
      
   var ntri = 0; 
  //Ora che ho la mesh e il/i materiali associati, mi occupo di caricare 
  //la/le texture che tali materiali contengono          
   for( var j = 1; j <mesh.materials.length; j++){
      map = mesh.materials[j].parameter;
      ntri = mesh.materials[j].triangles.length;
      tri = mesh.materials[j].triangles;
      
     var path = mesh.sourceMesh.substring(0, mesh.sourceMesh.lastIndexOf("/")+1);
     if(map.get("map_Kd") != null)
         map.set("map_Kd", loadTexture(gl, path, map.get("map_Kd")));
      
      mesh.materials[j].numVertices=3*ntri;
   }    
}

/******* Funzioni per il drawing in base al nome della mesh per poter modificare la trasparenza *******/
function drawMeshMatA(material,index){
 
   gl.uniform1i(lightTextureProgramLoc.mode, 0);
   gl.disableVertexAttribArray(lightTextureProgramLoc.texcoordLocation);
   
   gl.uniform3fv(lightTextureProgramLoc.ambient, material.parameter.get("Ka"));
   gl.uniform3fv(lightTextureProgramLoc.diffuse, material.parameter.get("Kd"));
   gl.uniform3fv(lightTextureProgramLoc.specular, material.parameter.get("Ks"));
   gl.uniform3fv(lightTextureProgramLoc.emissive, material.parameter.get("Ke"));
   gl.uniform1f(lightTextureProgramLoc.shininess, material.parameter.get("Ns"));
   gl.uniform1f(lightTextureProgramLoc.opacity,  material.parameter.get("Ni"));
   if (!modalitaParcheggio){
      gl.uniform1f(lightTextureProgramLoc.d, material.parameter.get("d"));
   }
   else
      gl.uniform1f(lightTextureProgramLoc.d, trA);

   gl.drawArrays(gl.TRIANGLES,index , material.numVertices);
   
}

function drawMeshMatC(material,index,texcoordBuffer){
             
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer

  
   if(material.parameter.size == 9){
      // Turn on the teccord attribute
      gl.enableVertexAttribArray(lightTextureProgramLoc.texcoordLocation);
      // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
     // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
     size = 2;          // 2 components per iteration
      gl.vertexAttribPointer(lightTextureProgramLoc.texcoordLocation, size, type, normalize, stride, offset);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, material.parameter.get("map_Kd"));
      // Tell the shader to use texture unit 1 for the sampler2D "u_texture"
      gl.uniform1i(lightTextureProgramLoc.textureLocation, 1);
      gl.uniform1i(lightTextureProgramLoc.mode, 1);  
   }else{
      gl.uniform1i(lightTextureProgramLoc.mode, 0);}
      
   gl.uniform3fv(lightTextureProgramLoc.ambient, material.parameter.get("Ka"));
   gl.uniform3fv(lightTextureProgramLoc.diffuse, material.parameter.get("Kd"));
   gl.uniform3fv(lightTextureProgramLoc.specular, material.parameter.get("Ks"));
   gl.uniform3fv(lightTextureProgramLoc.emissive, material.parameter.get("Ke"));
   gl.uniform1f(lightTextureProgramLoc.shininess, material.parameter.get("Ns"));
   gl.uniform1f(lightTextureProgramLoc.opacity,  material.parameter.get("Ni"));
   if (!modalitaParcheggio){
      gl.uniform1f(lightTextureProgramLoc.d, material.parameter.get("d"));
   }
   else
      gl.uniform1f(lightTextureProgramLoc.d, trC);

   gl.drawArrays(gl.TRIANGLES,index , material.numVertices);
   
}

function drawMeshMatE(material,index){
  
   gl.uniform1i(lightTextureProgramLoc.mode, 0);
   gl.disableVertexAttribArray(lightTextureProgramLoc.texcoordLocation);

   gl.uniform3fv(lightTextureProgramLoc.ambient, material.parameter.get("Ka"));
   gl.uniform3fv(lightTextureProgramLoc.diffuse, material.parameter.get("Kd"));
   gl.uniform3fv(lightTextureProgramLoc.specular, material.parameter.get("Ks"));
   gl.uniform3fv(lightTextureProgramLoc.emissive, material.parameter.get("Ke"));
   gl.uniform1f(lightTextureProgramLoc.shininess, material.parameter.get("Ns"));
   gl.uniform1f(lightTextureProgramLoc.opacity,  material.parameter.get("Ni"));
   if (!modalitaParcheggio){
      gl.uniform1f(lightTextureProgramLoc.d, material.parameter.get("d"));
   }else
   gl.uniform1f(lightTextureProgramLoc.d, trE);

   gl.drawArrays(gl.TRIANGLES,index , material.numVertices);
   
}

function drawMeshMat(material,index,texcoordBuffer){
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer
    
   if(material.parameter.size == 9){
      // Turn on the teccord attribute
      gl.enableVertexAttribArray(lightTextureProgramLoc.texcoordLocation);
      // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      size = 2;          // 2 components per iteration
      gl.vertexAttribPointer(lightTextureProgramLoc.texcoordLocation, size, type, normalize, stride, offset);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, material.parameter.get("map_Kd"));
      // Tell the shader to use texture unit 1 for the sampler2D "u_texture"
      gl.uniform1i(lightTextureProgramLoc.textureLocation, 1);
      gl.uniform1i(lightTextureProgramLoc.mode, 1);
    }else{
      
      gl.uniform1i(lightTextureProgramLoc.mode, 0);
      gl.disableVertexAttribArray(lightTextureProgramLoc.texcoordLocation);}
    
     gl.uniform3fv(lightTextureProgramLoc.ambient, material.parameter.get("Ka"));
     gl.uniform3fv(lightTextureProgramLoc.diffuse, material.parameter.get("Kd"));
     gl.uniform3fv(lightTextureProgramLoc.specular, material.parameter.get("Ks"));
     gl.uniform3fv(lightTextureProgramLoc.emissive, material.parameter.get("Ke"));
     gl.uniform1f(lightTextureProgramLoc.shininess, material.parameter.get("Ns"));
     gl.uniform1f(lightTextureProgramLoc.opacity, material.parameter.get("Ni"));
     gl.uniform1f(lightTextureProgramLoc.d, material.parameter.get("d"));
   
     gl.drawArrays(gl.TRIANGLES,index , material.numVertices);
      
}



function drawMesh(item){
  
   mo_matrix = m4.identity(); //0.Resetto la matrix	
   
   if(modalitaParcheggio){
      switch(item.meshName){
         case "carMesh":
            mo_matrix = m4.multiply(mo_matrix, item.init_matrix);     //Posizione iniziale mesh
            mo_matrix = m4.translate(mo_matrix, px, py, pz);			 //Traslazione car
            mo_matrix = m4.yRotate(mo_matrix, degToRad(facing));      //Orientamento in base allo sterzo
            break; 
         case "routaAntDMesh":
         case "routaAntSMesh":
            mo_matrix = m4.translate(mo_matrix, px, py, pz);			//4. Traslazione delle ruote data dal movimento di car
		      mo_matrix = m4.yRotate(mo_matrix, degToRad(facing));	   //3. Rotazione attorno all'asse Y dovuta al facing, per seguire il corpo di car	
            mo_matrix = m4.multiply(mo_matrix, item.init_matrix);	   //2. Traslazione delle ruote (che sono definite con centro nell'origine) nella loro posizione corretta rispetto car
		      mo_matrix = m4.yRotate(mo_matrix,degToRad(sterzo));		//1. Rotazione attorno all'asse Y dovuta dallo sterzo	
		      mo_matrix = m4.xRotate(mo_matrix, degToRad(mozzoP));     //0. Rotazione del mozzo delle ruote attorno all'asse X
            break;
         case "ruotaPosDMesh":
         case "ruotaPosSMesh":
            mo_matrix = m4.translate(mo_matrix, px, py, pz);	      //3. Traslazione delle ruote data dal movimento di car		
		      mo_matrix = m4.yRotate(mo_matrix, degToRad(facing));     //2. Rotazione attorno all'asse Y dovuta al facing, per seguire il corpo di car	
            mo_matrix = m4.multiply(mo_matrix, item.init_matrix);	   //1. Traslazione delle ruote (che sono definite con centro nell'origine) nella loro posizione corretta rispetto car
		      mo_matrix = m4.xRotate(mo_matrix, degToRad(mozzoP));     //0. Rotazione del mozzo delle ruote attorno all'asse X
            break;  
         default:
            mo_matrix = m4.multiply(mo_matrix,item.init_matrix); 
      }

   }else
      mo_matrix = m4.multiply(mo_matrix,item.init_matrix);
      
   
   // Turn on the position attribute
   gl.enableVertexAttribArray(lightTextureProgramLoc.positionLocation);
   // Bind the position buffer.
   gl.bindBuffer(gl.ARRAY_BUFFER, item.positionBuffer);
  
   // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
   var size = 3;          // 3 components per iteration
   var type = gl.FLOAT;   // the data is 32bit floats
   var normalize = false; // don't normalize the data
   var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
   var offset = 0;        // start at the beginning of the buffer
   gl.vertexAttribPointer(lightTextureProgramLoc.positionLocation, size, type, normalize, stride, offset);
 
   // Turn on the normal attribute
   gl.enableVertexAttribArray(lightTextureProgramLoc.normalLocation);
    // Bind the normal buffer.
   gl.bindBuffer(gl.ARRAY_BUFFER, item.normalsBuffer);
   gl.vertexAttribPointer(lightTextureProgramLoc.normalLocation, size, type, normalize, stride, offset);
  




   gl.uniformMatrix4fv(lightTextureProgramLoc.matrixLocation, false, mo_matrix);

   //In base al nome della mesh viene chiamata una funzione per il disegno diversa al fine 
   //di poter modificare il fattore di opacità di una singola mesh e non quello di tutte
   var index = 0;
   for(var i = 1; i < item.materials.length; i++){
      if(item.meshName == "alberiMesh")
         drawMeshMatA(item.materials[i],index);
      else
         if(item.meshName == "colonnaMesh")
            drawMeshMatC(item.materials[i],index,item.texcoordBuffer);
         else
            if(item.meshName == "tettoiaMesh" || item.meshName == "ingressoMesh")
               drawMeshMatE(item.materials[i],index);
            else
               drawMeshMat(item.materials[i],index,item.texcoordBuffer);
  
      index = index + item.materials[i].numVertices
   }

   gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
}
