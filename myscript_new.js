//create the scene
var scene = new THREE.Scene();

//initial camera setup
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 ); // Perspective projection camera
camera.position.set(0,8,10);

//scene renderer setup
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Size of the 2D projection
document.body.appendChild(renderer.domElement); // add to the canvas

/** 
START LIGHTING 
**/

//Ambient lighting
var lightAmbient = new THREE.AmbientLight(0x222222);
lightAmbient.intensity = 2.8;
scene.add(lightAmbient);

//point light
var lightPoint1 = new THREE.PointLight(0xffffff);
lightPoint1.position.set(-10,18,0);
lightPoint1.rotation.set(0,-2,0);
lightPoint1.intensity = 1;
//scene.add(lightPoint1);

//shadow quality
lightPoint1.castShadow = true;
lightPoint1.shadow.mapSize.width = 1024;
lightPoint1.shadow.mapSize.height = 1024;
lightPoint1.shadow.camera.near = 0.5;
//lightPoint1.shadow.camera.far = 50;
lightPoint1.shadow.radius = 0;
lightPoint1.shadowDarkness = 1;

//point light
var lightPoint2 = new THREE.PointLight(0xffffff);
lightPoint2.position.set(0,18,0);
lightPoint2.rotation.set(0,-2,0);
lightPoint2.intensity = .85;
scene.add(lightPoint2);

//shadow quality
lightPoint2.castShadow = true;
lightPoint2.shadow.mapSize.width = 1024;
lightPoint2.shadow.mapSize.height = 1024;
lightPoint2.shadow.camera.near = 0.5;
lightPoint2.shadow.camera.far = 750;
lightPoint2.shadow.radius = 9;
lightPoint2.shadowDarkness = 1;

/** 
END LIGHTING 
**/

//Rendering shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Floor mesh
var meshFloor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial( { color: 0x7788dd, side: THREE.DoubleSide}));
meshFloor.rotation.x = Math.PI / 2;
meshFloor.position.y = -4;
//Shadow relationships
meshFloor.castShadow = false;
meshFloor.receiveShadow = true;
scene.add(meshFloor);

//Ceiling mesh
var ceilingMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshLambertMaterial( { color: 0xcccccc}));
ceilingMesh.rotation.x = Math.PI / 2;
ceilingMesh.position.y = 25;
//Shadow relationships
ceilingMesh.castShadow = false;
ceilingMesh.receiveShadow = false;
scene.add(ceilingMesh);

//Wall meshes
//Back wall
var backWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,50, 16, 16), new THREE.MeshLambertMaterial({color: 0x999999, side:THREE.DoubleSide}));
backWallMesh.position.set(0,20,-50);
backWallMesh.receiveShadow = true;
scene.add(backWallMesh);
//Left wall
var leftWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,50, 16, 16), new THREE.MeshLambertMaterial({color: 0x999999, side:THREE.DoubleSide}));
leftWallMesh.position.set(-50,20,0);
leftWallMesh.rotation.set(0,Math.PI/2,0);
leftWallMesh.receiveShadow = true;
scene.add(leftWallMesh);
//front wall
var frontWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,50, 16, 16), new THREE.MeshLambertMaterial({color: 0x999999, side:THREE.DoubleSide}));
frontWallMesh.position.set(0,20,50);
frontWallMesh.receiveShadow = true;
scene.add(frontWallMesh);
//right wall
var rightWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(100,50, 16, 16), new THREE.MeshLambertMaterial({color: 0x999999, side:THREE.DoubleSide}));
rightWallMesh.position.set(50,20,0);
rightWallMesh.rotation.set(0,Math.PI/2,0);
rightWallMesh.receiveShadow = true;
scene.add(rightWallMesh);

/**
TEXTURES
**/

/* LOADS THE COMPUTER MONITOR TEXTURE */
const textureLoader = new THREE.TextureLoader();
const textureA = textureLoader.load('texture1.png');
textureA.encoding = THREE.sRGBEncoding;
textureA.anisotropy = 16;

/* LOADS THE CLOCK TEXTURE */
const textureB = textureLoader.load('texture2.png');
textureB.encoding = THREE.sRGBEncoding;
textureB.anisotropy = 16;

/* LOADS THE BOOK TEXTURE */
const textureC = textureLoader.load('texture3.png');
textureC.encoding = THREE.sRGBEncoding;
textureC.anisotropy = 16;

/**
END TEXTURES
**/

//initialise particle system
var particleSystem = new ParticleSystem();

/**
FUNCTIONALITY
**/
    /**
    START DEBUG
    **/

    //ENABLES MOUSE CONTROLS//
    //var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    //controls.screenSpacePanning = false;
	var controls = new THREE.DeviceOrientationControls(camera);

    /**
    END DEBUG
    **/

/**
END FUNCTIONALITY
**/

/**
START OF MESH CREATION FUNCTIONS
**/

//Make desk function--cant shake
function makeDeskVector(position, rotation, withDrawers){
	//default number of legs
	var numberOfLegs = 2;
	
	//Desk surface
	var deskTopGeometry = new THREE.BoxGeometry(10,0.1,5);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var deskTopMaterial = new THREE.MeshLambertMaterial({color: 0xc19a6b});
	var deskTopMesh = new THREE.Mesh(deskTopGeometry, deskTopMaterial);
	//set shadow relationships
	deskTopMesh.castShadow = true;
	deskTopMesh.receiveShadow = true;
	//add to scene
	scene.add(deskTopMesh);

	//Make drawers if selected
	if(withDrawers){
		var deskDrawerGeometry = new THREE.BoxGeometry(2,3.9,5);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var deskDrawerMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		var deskDrawerMesh = new THREE.Mesh(deskDrawerGeometry,deskDrawerMaterial);
		//set parent to top mesh
		deskDrawerMesh.parent = deskTopMesh;
		deskDrawerMesh.position.set(-4,-2,0);
		//add to parent
		deskTopMesh.add(deskDrawerMesh);
		//set shadow relationships
		deskDrawerMesh.castShadow = true;
		deskDrawerMesh.receiveShadow = true;
	}else{
		//otherwise set the number of legs to 4
		numberOfLegs = 4;
	}

	//Create desk legs
	var deskLegs = [];
	for(var i=0; i<numberOfLegs;i++){
		var deskLegGeometry = new THREE.CylinderGeometry(0.2,0.2,3.9,6);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var deskLegMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
		var deskLegMesh = new THREE.Mesh(deskLegGeometry, deskLegMaterial);
		//set shadow relationships
		deskLegMesh.castShadow = true;
		deskLegMesh.receiveShadow = true;
		
		deskLegs.push(deskLegMesh);
		//set the parent of each leg
		deskLegs[i].parent = deskTopMesh;
		//set the position of each leg
		if(i===0){
			deskLegs[i].position.set(4,-2,-2);
		}else if(i===1){
			deskLegs[i].position.set(4,-2,2);
		}else if(i===2){
			deskLegs[i].position.set(-4,-2,-2);
		}else if(i===3){
			deskLegs[i].position.set(-4,-2,2);
		}
		//add to parent
		deskTopMesh.add(deskLegs[i]);
	}
	
	//set position and rotation relative to parameters
	deskTopMesh.position.set(position.x, position.y, position.z);
	deskTopMesh.rotation.set(rotation.x, rotation.y, rotation.z);	
	deskTopMesh.scale.set(2,2,2);
	
	setupObject(deskTopMesh);
}//end of desk

//start of make plant pot function--can shake
function makePlant(position, numberOfLeaves){
	//Pot base
	var potBaseGeometry = new THREE.CylinderGeometry(2,1.5,4,6);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var potBaseMaterial = new THREE.MeshLambertMaterial({color:0x734222});
	var potBaseMesh = new THREE.Mesh(potBaseGeometry, potBaseMaterial);
	//set shadow relationships
	potBaseMesh.castShadow = true;
	potBaseMesh.receiveShadow = true;
	//add to scene
	scene.add(potBaseMesh);
	
	//Pot rim
	var potRimGeometry = new THREE.CylinderGeometry(2.2,2.2,1,6);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var potRimMaterial = new THREE.MeshLambertMaterial({color:0x734222});
	var potRimMesh = new THREE.Mesh(potRimGeometry, potRimMaterial);
	//set parent to base mesh
	potRimMesh.parent = potBaseMesh;
	potRimMesh.position.set(0,1.5,0);
	//set shadow relationships
	potRimMesh.castShadow = true;
	potRimMesh.receiveShadow = true;
	//add to parent
	potBaseMesh.add(potRimMesh);
	
	//stem
	var stemGeometry = new THREE.CylinderGeometry(0.25,0.25,7,6);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var stemMaterial = new THREE.MeshLambertMaterial({color:0x644117 });
	var stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
	//set parent to base mesh
	stemMesh.parent = potBaseMesh;
	stemMesh.position.set(0,5,0);
	//set shadow relationships
	stemMesh.castShadow = true;
	stemMesh.receiveShadow = true;
	//add to parent
	potBaseMesh.add(stemMesh);
	
	//leaves
	for(var i =0; i<numberOfLeaves; i++){
		var leafGeometry = new THREE.TetrahedronGeometry(Math.random()*2+0.1,0);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var leafMaterial = new THREE.MeshLambertMaterial({color:0x4f7942});
		var leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
		leafMesh.castShadow = true;
		leafMesh.receiveShadow = false;
		//set parent to stem mesh
		leafMesh.parent = stemMesh;
		leafMesh.position.set(Math.random()*2-1,Math.random()*7-3.5,Math.random()*2-1);
		leafMesh.rotation.set(Math.random()*(Math.PI*2),Math.random()*(Math.PI*2),Math.random()*(Math.PI*2));
		//add to parent
		stemMesh.add(leafMesh);
		
	}
	//set position relative to parameters
	potBaseMesh.position.set(position.x, position.y, position.z);
	
	setupObject(potBaseMesh, 1, true);
}//end of plant pot

//start of filing cabinet--cant shake
function makeFilingCabinet(position, rotation){
	var handles = [];
	var numberOfHandles = 4;
	//body
	var cabinetGeometry = new THREE.BoxGeometry(6,30,10);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var cabinetMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var cabinetMesh = new THREE.Mesh(cabinetGeometry,cabinetMaterial);
	//set shadow relationships
	cabinetMesh.castShadow = true;
	cabinetMesh.receiveShadow = true;
	//add to scene
	scene.add(cabinetMesh);
	
	//handles
	for(var i=0;i<numberOfHandles;i++){
		var handleGeometry = new THREE.TorusGeometry(0.75,0.1,6,6, Math.PI);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var handleMaterial = new THREE.MeshLambertMaterial({color:0xebebeb});
		var handleMesh = new THREE.Mesh(handleGeometry,handleMaterial);
		//set shadow relationships
		handleMesh.castShadow = true;
		handleMesh.receiveShadow = true;
		//set parent to cabinet mesh
		handleMesh.parent = cabinetMesh;
		handleMesh.position.set(0,i*5-2.5,5.2);
		handleMesh.position.set(0,i*5-3,5.2);
		handleMesh.rotation.x = Math.PI/2;
		//add to parent
		cabinetMesh.add(handleMesh);
	}
	//set position and rotation relative to parameters
	cabinetMesh.position.set(position.x,position.y, position.z);
	cabinetMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(cabinetMesh);
}//end of filing cabinet

//start of mug
function makeMug(position, rotation){
	var mugGeometry = new THREE.CylinderGeometry(0.75,0.75,1.75,6);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var mugMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
	var mugMesh = new THREE.Mesh(mugGeometry,mugMaterial);
	//set shadow relationships
	mugMesh.castShadow = true;
	mugMesh.receiveShadow = true;
	//add to scene
	scene.add(mugMesh);
	
	//handle
	var handleGeometry = new THREE.TorusGeometry(0.75,0.1,6,6, Math.PI);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var handleMaterial = new THREE.MeshLambertMaterial({color:0xebebeb});
	var handleMesh = new THREE.Mesh(handleGeometry,handleMaterial);
	//set shadow relationships
	handleMesh.castShadow = true;
	handleMesh.receiveShadow = true;
	//set parent to mug mesh
	handleMesh.parent = mugMesh;
	handleMesh.position.set(0.5,0,0);
	handleMesh.rotation.set(0,0,-Math.PI/2);
	//add to parent
	mugMesh.add(handleMesh);
	//set position and rotation relative to parameters
	mugMesh.position.set(position.x,position.y,position.z);
	mugMesh.rotation.set(rotation.x, rotation.y,rotation.z);
	
	setupObject(mugMesh, 1, true);
}//end of mug

/*MAKE CLOCK
Creates a clock model
Can't shake
*/
function makeClock(position, rotation){
	//clock face
	var clockFaceGeometry = new THREE.CylinderGeometry(2.5,2.5,0.1,8);
	//Use of basic material to save processing power as no shadows are needed
	//var clockFaceMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
	var clockFaceMaterial = new THREE.MeshBasicMaterial({
	map: textureB,
	});
	var clockFaceMesh = new THREE.Mesh(clockFaceGeometry,clockFaceMaterial);
	//set shadow relationships
	clockFaceMesh.castShadow = false;
	clockFaceMesh.receiveShadow = true;
	//add to scene
	scene.add(clockFaceMesh);
	
	//clock edge
	var clockEdgeGeometry = new THREE.TorusGeometry(2.5,0.3,6,8);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var clockEdgeMaterial = new THREE.MeshLambertMaterial({color:0xa1a1a1});
	var clockEdgeMesh = new THREE.Mesh(clockEdgeGeometry,clockEdgeMaterial);
	//set shadow relationships
	clockEdgeMesh.castShadow = false;
	clockEdgeMesh.receiveShadow = true;
	//set parent to clock mesh
	clockEdgeMesh.parent = clockFaceMesh;
	clockEdgeMesh.rotation.x=Math.PI/2;
	clockFaceMesh.add(clockEdgeMesh);
	//set position and rotation relative to parameters
	clockFaceMesh.position.set(position.x,position.y,position.z);
	clockFaceMesh.rotation.set(rotation.x + Math.PI/2,rotation.y,rotation.z);
	
	setupObject(clockFaceMesh);
}//end of clock

/*MAKE STAPLER
Creates a stapler model
Can shake
*/
function makeStapler(position, rotation){
	//stapler base
	var staplerBaseGeometry = new THREE.BoxGeometry(1,0.2,3);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var staplerBaseMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerBaseMesh = new THREE.Mesh(staplerBaseGeometry, staplerBaseMaterial);
	//set shadow relationships
	staplerBaseMesh.castShadow = true;
	staplerBaseMesh.receiveShadow = true;
	//add to scene
	scene.add(staplerBaseMesh);
	
	//stapler top
	var staplerTopGeometry = new THREE.BoxGeometry(1,0.7,3);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var staplerTopMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerTopMesh = new THREE.Mesh(staplerTopGeometry, staplerTopMaterial);
	//set shadow relationships
	staplerTopMesh.castShadow = true;
	staplerTopMesh.receiveShadow = true;
	//set parent to base mesh
	staplerTopMesh.parent = staplerBaseMesh;
	staplerTopMesh.position.y = 0.75;
	//add to parent
	staplerBaseMesh.add(staplerTopMesh);
	
	//stapler hinge
	var staplerHingeGeometry = new THREE.BoxGeometry(1.1,1,1);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var staplerHingeMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerHingeMesh = new THREE.Mesh(staplerHingeGeometry, staplerHingeMaterial);
	//set shadow relationships
	staplerHingeMesh.castShadow = true;
	staplerHingeMesh.receiveShadow = true;
	//set parent to base mesh
	staplerHingeMesh.parent = staplerBaseMesh;
	staplerHingeMesh.position.set(0,0.3,1);
	//add to parent
	staplerBaseMesh.add(staplerHingeMesh);
	//set position and rotation relative to parameters
	staplerBaseMesh.position.set(position.x,position.y,position.z);
	staplerBaseMesh.rotation.set(rotation.x, rotation.y,rotation.z);
	
	setupObject(staplerBaseMesh, 1, true);
}//end of stapler

/*MAKE COMPUTER
Creates a computer model
Can't shake
*/
function makeComputer(position, rotation){
	//computer
	var computerBodyGeometry = new THREE.BoxGeometry(3,5,5);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var computerBodyMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var computerBodyMesh = new THREE.Mesh(computerBodyGeometry,computerBodyMaterial);
	//set shadow relationships
	computerBodyMesh.castShadow = true;
	computerBodyMesh.receiveShadow = true;
	//add to scene
	scene.add(computerBodyMesh);
	
	
	computerBodyMesh.position.set(position.x,position.y,position.z);
	computerBodyMesh.rotation.set(rotation.x, rotation.y,rotation.z);
	
	setupObject(computerBodyMesh);
}//end of computer

/*MAKE MONITOR
Creates a monitor model
Can shake
*/
function makeMonitor(position, rotation){
	//monitor stand base
	var monitorBaseGeometry = new THREE.BoxGeometry(5,0.25,1);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var monitorBaseMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var monitorBaseMesh = new THREE.Mesh(monitorBaseGeometry,monitorBaseMaterial);
	//set shadow relationships
	monitorBaseMesh.castShadow = true;
	monitorBaseMesh.receiveShadow = true;
	//add to scene
	scene.add(monitorBaseMesh);
	
	//monitor stands
	for(var i=0;i<2;i++){
		var monitorStandGeometry = new THREE.BoxGeometry(0.2,3,0.25);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var monitorStandMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
		var monitorStandMesh = new THREE.Mesh(monitorStandGeometry,monitorStandMaterial);
		//set shadow relationships
		monitorStandMesh.castShadow = true;
		monitorStandMesh.receiveShadow = true;
		//set parent to base mesh
		monitorStandMesh.parent = monitorBaseMesh;
		monitorStandMesh.position.set(-1.5+(i+1),1.5,-0.2);
		//add to parent
		monitorBaseMesh.add(monitorStandMesh);
	}
	
	//monitor
	var monitorGeometry = new THREE.BoxGeometry(10,6,0.3);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var monitorMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var monitorMesh = new THREE.Mesh(monitorGeometry,monitorMaterial);
	//set shadow relationships
	monitorMesh.castShadow = true;
	monitorMesh.receiveShadow = true;
	//set parent to base mesh
	monitorMesh.parent = monitorBaseMesh;
	monitorMesh.position.set(0,3.75,0);
	//add to parent
	monitorBaseMesh.add(monitorMesh);
	
	//screen
	var screenGeometry = new THREE.PlaneGeometry(9,5);
	//Use of basic material to save processing power as no shadows are needed
	// var screenMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
	var screenMaterial = new THREE.MeshBasicMaterial({
		map: textureA,
	});
	var screenMesh = new THREE.Mesh(screenGeometry,screenMaterial);
	//set shadow relationships
	screenMesh.castShadow = true;
	screenMesh.receiveShadow = true;
	//set parent to base mesh
	screenMesh.parent = monitorBaseMesh;
	screenMesh.position.set(0,3.75,0.243);
	//add to parent
	monitorBaseMesh.add(screenMesh);
	//set position and rotation relative to parameters
	monitorBaseMesh.position.set(position.x,position.y,position.z);
	monitorBaseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(monitorBaseMesh, 1, true);
}//end of monitor

/*MAKE KEYBOARD
Creates a keyboard model
Can shake
*/
function makeKeyboard(position, rotation){
	//keyboard
	var keyboardGeometry = new THREE.BoxGeometry(6,0.25,1.25);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var keyboardMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var keyboardMesh = new THREE.Mesh(keyboardGeometry,keyboardMaterial);
	//set shadow relationships
	keyboardMesh.castShadow = false;
	keyboardMesh.receiveShadow = true;
	//add to scene
	scene.add(keyboardMesh);
	//set position and rotation relative to parameters
	keyboardMesh.position.set(position.x,position.y,position.z);
	keyboardMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(keyboardMesh, 1, true);
}//end of keyboard

/*MAKE MOUSE
Creates a computer mouse model
Can shake
*/
function makeMouse(position, rotation){
	var mouseGeometry = new THREE.BoxGeometry(0.75,0.25,2);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var mouseMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var mouseMesh = new THREE.Mesh(mouseGeometry,mouseMaterial);
	//set shadow relationships
	mouseMesh.castShadow = false;
	mouseMesh.receiveShadow = true;
	//add to scene
	scene.add(mouseMesh);
	//set position and rotation relative to parameters
	mouseMesh.position.set(position.x,position.y,position.z);
	mouseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(mouseMesh, 1, true);
}//end of mouse

/*MAKE SHELVES
Creates a shelving unit model
Can't shake
*/
function makeShelf(position, rotation){
	var numberOfShelves = 3;
	//shelf base
	var shelfBaseGeometry = new THREE.BoxGeometry(7,0.5,2);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var shelfBaseMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var shelfBaseMesh = new THREE.Mesh(shelfBaseGeometry, shelfBaseMaterial);
	//set shadow relationships
	shelfBaseMesh.castShadow = true;
	shelfBaseMesh.receiveShadow = true;
	//add to scene
	scene.add(shelfBaseMesh);
	
	//shelf top
	for(var i=0; i<numberOfShelves;i++){
		var shelfGeometry = new THREE.BoxGeometry(7,0.5,2);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var shelfMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
		var shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial);
		//set shadow relationships
		shelfMesh.castShadow = true;
		shelfMesh.receiveShadow = true;
		//set parent to base mesh
		shelfMesh.parent = shelfBaseMesh;
		shelfMesh.position.y = (i+1)*5;
		//add to parent
		shelfBaseMesh.add(shelfMesh);
	}
	
	//sides
	for(var j=0;j<2;j++){
		var sideGeometry = new THREE.BoxGeometry(0.5,15,2);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var sideMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
		var sideMesh = new THREE.Mesh(sideGeometry,sideMaterial);
		//set shadow relationships
		sideMesh.castShadow = true;
		sideMesh.receiveShadow = true;
		
		sideMesh.parent = shelfBaseMesh;
		sideMesh.position.set(0,7.5,0);
		if(j===0){
			sideMesh.position.x = -3.25;
		}else{
			sideMesh.position.x = 3.25;
		}
		//add to parent
		shelfBaseMesh.add(sideMesh);
	}
	
	//back
	var shelfBackGeometry = new THREE.BoxGeometry(7,15,0.5);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var shelfBackMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var shelfBackMesh = new THREE.Mesh(shelfBackGeometry, shelfBackMaterial);
	//set shadow relationships
	shelfBackMesh.castShadow = true;
	shelfBackMesh.receiveShadow = true;
	//set parent to base mesh
	shelfBackMesh.parent = shelfBaseMesh;
	shelfBackMesh.position.set(0,7.5,-1);
	//add to parent
	shelfBaseMesh.add(shelfBackMesh);
	//set position and rotation relative to parameters
	shelfBaseMesh.position.set(position.x,position.y,position.z);
	shelfBaseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(shelfBaseMesh);
}//end of shelves

/*MAKE CHAIR
Creates a chair model
Can shake
*/
function makeChair(position, rotation){
	//seat
	var seatGeometry = new THREE.BoxGeometry(4,0.5,4);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var seatMaterial = new THREE.MeshLambertMaterial({color: 0x9a339a});
	var seatMesh = new THREE.Mesh(seatGeometry,seatMaterial);
	//set shadow relationships
	seatMesh.castShadow = true;
	seatMesh.receiveShadow = true;
	//add to scene
	scene.add(seatMesh);
	
	//seat back
	var seatBackGeometry = new THREE.BoxGeometry(4,6,0.5);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var seatBackMaterial = new THREE.MeshLambertMaterial({color: 0x9a339a});
	var seatBackMesh = new THREE.Mesh(seatBackGeometry,seatBackMaterial);
	//set shadow relationships
	seatBackMesh.castShadow = true;
	seatBackMesh.receiveShadow = true;
	//set parent to seat mesh
	seatBackMesh.parent = seatMesh;
	seatBackMesh.position.set(0,3,-1.75);
	//add to parent
	seatMesh.add(seatBackMesh);
	
	//legs
	for(var i=0;i<4;i++){
		var legGeometry = new THREE.BoxGeometry(0.25,4,0.25);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var legMaterial = new THREE.MeshLambertMaterial({color: 0x1a1a1a});
		var legMesh = new THREE.Mesh(legGeometry,legMaterial);
		//set shadow relationships
		legMesh.castShadow = true;
		legMesh.receiveShadow = true;
		legMesh.parent = seatMesh;
		switch(i){
			case 0:
				legMesh.position.set(1.75,-2,1.75);
				break;
			case 1:
				legMesh.position.set(-1.75,-2,1.75);
				break;
			case 2:
				legMesh.position.set(1.75,-2,-1.75);
				break;
			case 3:
				legMesh.position.set(-1.75,-2,-1.75);
				break;
			default:
				break;
		}
		//add to parent
		seatMesh.add(legMesh);
	}
	//set position and rotation relative to parameters
	seatMesh.position.set(position.x,position.y,position.z);
	seatMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(seatMesh, 1, true);
}//end of chair

/*MAKE LIGHTS
Creates a ceiling light model
Can't shake
*/
function makeLights(position, rotation){
	var lightGeometry = new THREE.BoxGeometry(1,0.25,10);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var lightMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
	var lightMesh = new THREE.Mesh(lightGeometry,lightMaterial);
	//set shadow relationships
	lightMesh.castShadow = false;
	lightMesh.receiveShadow = false;
	//add to scene
	scene.add(lightMesh);
	
	var lightGeometry2 = new THREE.BoxGeometry(.75,0.125,9.5);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var lightMaterial2 = new THREE.MeshLambertMaterial({color: 0xffffff, emissive: 0xf5ed82});
	var lightMesh2 = new THREE.Mesh(lightGeometry2,lightMaterial2);
	lightMesh2.position.set(0, -.25, 0);
	//set shadow relationships
	lightMesh2.castShadow = false;
	lightMesh2.receiveShadow = false;
	lightMesh.add(lightMesh2);
	
	//supports
	for(var i=0;i<2;i++){
		var supportGeometry = new THREE.CylinderGeometry(0.1,0.1,6,8);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		var supportMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
		var supportMesh = new THREE.Mesh(supportGeometry,supportMaterial);
		//set shadow relationships
		supportMesh.castShadow = false;
		supportMesh.receiveShadow = false;
		//set parent to light mesh
		supportMesh.parent=lightMesh;
		switch(i){
			case 0:
				supportMesh.position.set(0,3,-4);
				break;
			case 1:
				supportMesh.position.set(0,3,4);
				break;
			default:
				break;
		}
		//add to parent
		lightMesh.add(supportMesh);
	}
	//set position and rotation relative to parameters
	lightMesh.position.set(position.x,position.y,position.z);
	lightMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(lightMesh);
}//end of lights

/*MAKE PAPER STACK
Creates a paper stack model
Can shake
*/
function makePaperStack(position, rotation){
	var basePaperGeometry = new THREE.BoxGeometry(1.5,0.4,2);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var basePaperMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	var basePaperMesh = new THREE.Mesh(basePaperGeometry,basePaperMaterial);
	//set shadow relationships
	basePaperMesh.castShadow = true;
	basePaperMesh.receiveShadow = true;
	basePaperMesh.rotation.z=Math.PI/2;
	//add to scene
	scene.add(basePaperMesh);
	//set position and rotation relative to parameters
	basePaperMesh.position.set(position.x,position.y,position.z);
	basePaperMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(basePaperMesh, 1, true);
}//end of paper stack

/*MAKE BOOK
Creates a book model
Can shake
*/
function makeBook(position, rotation){
	var spineGeometry = new THREE.BoxGeometry(2,0.6,0.1);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var spineMaterial = new THREE.MeshLambertMaterial({color:0x001acc});
	var spineMesh = new THREE.Mesh(spineGeometry,spineMaterial);
	//set shadow relationships
	spineMesh.castShadow = true;
	spineMesh.receiveShadow = true;
	//add to scene
	scene.add(spineMesh);
	
	//faces
	for(var i=0;i<2;i++){
		var faceGeometry = new THREE.BoxGeometry(2,0.1,1.4);
		//Use of lambert material to generate shadows/reflections while retaining some processing power
		//var faceMaterial = new THREE.MeshLambertMaterial({color: 0x001acc});
		var faceMaterial = new THREE.MeshBasicMaterial({
		map: textureC,
		});
		var faceMesh = new THREE.Mesh(faceGeometry,faceMaterial);
		//set shadow relationships
		faceMesh.castShadow = true;
		faceMesh.receiveShadow = true;
		//set parent to spine mesh
		faceMesh.parent=spineMesh;
		switch(i){
			case 0:
				faceMesh.position.set(0,0.22,0.75);
				break;
			case 1:
				faceMesh.position.set(0,-0.22,0.75);
				break;
			default:
				break;
		}
		//add to parent
		spineMesh.add(faceMesh);
	}
	
	//pages
	var pagesGeometry = new THREE.BoxGeometry(2,0.35,1.3);
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var pagesMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
	var pagesMesh = new THREE.Mesh(pagesGeometry,pagesMaterial);
	//set shadow relationships
	pagesMesh.castShadow = true;
	pagesMesh.receiveShadow = true;
	//set parent to spine mesh
	pagesMesh.parent=spineMesh;
	pagesMesh.position.set(0,0,0.7);
	//add to parent
	spineMesh.add(pagesMesh);
	//set position and rotation relative to parameters
	spineMesh.position.set(position.x,position.y,position.z);
	spineMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	setupObject(spineMesh, 1, true);
}//end book

/*MAKE DESK FAN
Creates a desk fan model
Can't shake
*/
function makeDeskFan(position, rotation){
	//base
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var fanBaseMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2,0.25,2), new THREE.MeshLambertMaterial({color: 0xebebeb}));
	//set shadow relationships
	fanBaseMesh.castShadow = true;
	fanBaseMesh.receiveShadow = true;
	//add to scene
	scene.add(fanBaseMesh);
	
	//stand-cyl
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var standMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,2), new THREE.MeshLambertMaterial({color: 0xebebeb}));
	//set shadow relationships
	standMesh.castShadow = true;
	standMesh.receiveShadow = true;
	//set parent to base mesh
	standMesh.parent=fanBaseMesh;
	standMesh.position.set(0,1,-0.5);
	//add to parent
	fanBaseMesh.add(standMesh);
	
	//centre-cyl
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var bladeSocketMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.5,1), new THREE.MeshLambertMaterial({color: 0xebebeb}));
	//set shadow relationships
	bladeSocketMesh.castShadow = true;
	bladeSocketMesh.receiveShadow = true;
	//set parent to base mesh
	bladeSocketMesh.parent=fanBaseMesh;
	bladeSocketMesh.position.set(0,2,-0.25);
	bladeSocketMesh.rotation.set(Math.PI/2,0,0);
	//add to parent
	fanBaseMesh.add(bladeSocketMesh);
	
	//fan blade-box
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var bladeMesh = new THREE.Mesh(new THREE.BoxGeometry(3,0.5,0.2), new THREE.MeshLambertMaterial({color: 0xaaaaaa}));
	//set shadow relationships
	bladeMesh.castShadow = true;
	bladeMesh.receiveShadow = true;
	//set parent to base mesh
	bladeMesh.parent=fanBaseMesh;
	bladeMesh.position.set(0,2,0);
	//add to parent
	fanBaseMesh.add(bladeMesh);
	
	
	
	//cage-torus
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var cageMesh = new THREE.Mesh(new THREE.TorusGeometry(1.5,0.05,6,12), new THREE.MeshLambertMaterial({color: 0xffffff}));
	//set shadow relationships
	cageMesh.castShadow = true;
	cageMesh.receiveShadow = true;
	//set parent to base mesh
	cageMesh.parent=fanBaseMesh;
	cageMesh.position.set(0,2,0);
	//add to parent
	fanBaseMesh.add(cageMesh);
	//set position and rotation relative to parameters
	fanBaseMesh.position.set(position.x,position.y,position.z);
	fanBaseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	
	function spin(){
		requestAnimationFrame(spin);
		
		bladeMesh.rotation.z +=3;
	}
	spin();
	
	setupObject(fanBaseMesh);
}//end desk fan

/*MAKE VENT
Creates a vent model
Can't shake
*/
function makeVent(position, rotation){
	//Use of lambert material to generate shadows/reflections while retaining some processing power
	var grateMesh = new THREE.Mesh(new THREE.BoxGeometry(3,0.25,5), new THREE.MeshLambertMaterial({color: 0x444444}));
	//set shadow relationships
	grateMesh.castShadow = true;
	grateMesh.receiveShadow = true;
	//add to scene
	scene.add(grateMesh);
	//set position and rotation relative to parameters
	grateMesh.position.set(position.x,position.y,position.z);
	grateMesh.rotation.set(rotation.x,rotation.y,rotation.z);

	setupObject(grateMesh);
}//end vent

/**
END OF MESH CREATION FUNCTIONS
**/

//Make Desks
makeDeskVector(new THREE.Vector3(-30,4,-25), new THREE.Vector3(0,0,0), true);
makeDeskVector(new THREE.Vector3(-15,4,-20), new THREE.Vector3(0,Math.PI/2,0), false);
makeDeskVector(new THREE.Vector3(16,4,-45), new THREE.Vector3(0,0,0), true);
makeDeskVector(new THREE.Vector3(0,4,0), new THREE.Vector3(0,0,0), false);
makeDeskVector(new THREE.Vector3(45,4,-30), new THREE.Vector3(0,Math.PI/2,0), false);
makeDeskVector(new THREE.Vector3(45,4,-10), new THREE.Vector3(0,Math.PI/2,0), false);

makeDeskVector(new THREE.Vector3(0,4,43), new THREE.Vector3(0,0,0), false);
makeDeskVector(new THREE.Vector3(20,4,43), new THREE.Vector3(0,0,0), false);
makeDeskVector(new THREE.Vector3(-20,4,43), new THREE.Vector3(0,0,0), false);

makeDeskVector(new THREE.Vector3(-40,4,20), new THREE.Vector3(0,Math.PI/2,0), false);

//make plants
makePlant(new THREE.Vector3(7,-2,-35), 16);
makePlant(new THREE.Vector3(25,-2,20), 16);

//make filing cabinets
makeFilingCabinet(new THREE.Vector3(45,1,-45), new THREE.Vector3(0,-Math.PI/2,0));
makeFilingCabinet(new THREE.Vector3(35,1,43), new THREE.Vector3(0,-Math.PI,0));

//make mugs
makeMug(new THREE.Vector3(-15,5,-15), new THREE.Vector3(0,.5,0));
makeMug(new THREE.Vector3(5,5,40), new THREE.Vector3(0,Math.PI/4,0));
makeMug(new THREE.Vector3(-40,5,16), new THREE.Vector3(0,Math.PI/4,0));
makeMug(new THREE.Vector3(-43,5,20), new THREE.Vector3(0,Math.PI/5*4,0));
makeMug(new THREE.Vector3(-42,5,13), new THREE.Vector3(0,Math.PI/15*8,0));

//make clocks
makeClock(new THREE.Vector3(-5,17,-49.75), new THREE.Vector3(0,0,0));

//make staplers
makeStapler(new THREE.Vector3(-12,4.3,-20), new THREE.Vector3(0,-Math.PI/6,0));

//make computers
makeComputer(new THREE.Vector3(-34,-1.5,-23), new THREE.Vector3(0,0,0));
makeComputer(new THREE.Vector3(45,-1.5,-24), new THREE.Vector3(0,Math.PI/2,0));

//computer sparks
var sparksComp = new Sparks();
sparksComp.initialiseSparks(35,new THREE.Vector3(-33,0.5,-20.5)); //number of particles, position
sparksComp.particleSparks();

//make monitors
makeMonitor(new THREE.Vector3(-30,4.25,-26), new THREE.Vector3(0,0,0));
makeMonitor(new THREE.Vector3(47,4.25,-29), new THREE.Vector3(0,-Math.PI/2,0));

makeMonitor(new THREE.Vector3(0,4.25,45), new THREE.Vector3(0,Math.PI,0));
makeMonitor(new THREE.Vector3(-11,4.25,43), new THREE.Vector3(0,Math.PI - 0.4,0));
makeMonitor(new THREE.Vector3(11,4.25,43), new THREE.Vector3(0,Math.PI + 0.4,0));

//make keyboards
makeKeyboard(new THREE.Vector3(-30,4.25,-22), new THREE.Vector3(0,0,0));
makeKeyboard(new THREE.Vector3(44,4.25,-29), new THREE.Vector3(0,Math.PI/2,0));
makeKeyboard(new THREE.Vector3(0,4.25,40), new THREE.Vector3(0,0,0));

//make mice
makeMouse(new THREE.Vector3(-25,4.25,-21), new THREE.Vector3(0,0,0));
makeMouse(new THREE.Vector3(44,4.25,-24), new THREE.Vector3(0,Math.PI/2,0));
makeMouse(new THREE.Vector3(-5,4.25,40), new THREE.Vector3(0,0,0));

//make shelves
makeShelf(new THREE.Vector3(-10,-3.75,-49), new THREE.Vector3(0,0,0));
makeShelf(new THREE.Vector3(-20,-3.75,-49), new THREE.Vector3(0,0,0));
makeShelf(new THREE.Vector3(-30,-3.75,-49), new THREE.Vector3(0,0,0));
makeShelf(new THREE.Vector3(-40,-3.75,-49), new THREE.Vector3(0,0,0));

//make chairs
makeChair(new THREE.Vector3(16,0,-35), new THREE.Vector3(0,Math.PI,0));
makeChair(new THREE.Vector3(-29,0,-12), new THREE.Vector3(0,Math.PI,0));
makeChair(new THREE.Vector3(37,0,-28), new THREE.Vector3(0,Math.PI/2,0));

//make lights
makeLights(new THREE.Vector3(10,19,0), new THREE.Vector3(0,0,0));
makeLights(new THREE.Vector3(-10,19,0), new THREE.Vector3(0,0,0));
//sparking light particle
var sparksLight = new Sparks();
sparksLight.initialiseSparks(35,new THREE.Vector3(-10.1,19,-3)); //number of particles, position
sparksLight.particleSparks();

//make paper
makePaperStack(new THREE.Vector3(-7,4.25,-3), new THREE.Vector3(0,0,0));
makePaperStack(new THREE.Vector3(47,4.25,-13), new THREE.Vector3(0,Math.PI/5,0));
makePaperStack(new THREE.Vector3(48,4.25,-8), new THREE.Vector3(0,Math.PI/3,0));

//make book
makeBook(new THREE.Vector3(4,4.35,-2), new THREE.Vector3(0,Math.PI/4,0));
makeBook(new THREE.Vector3(-20,4.35,41), new THREE.Vector3(0,Math.PI/8,0));
makeBook(new THREE.Vector3(-25,4.35,43), new THREE.Vector3(0,Math.PI/7,0));
makeBook(new THREE.Vector3(43,4.35,-20), new THREE.Vector3(0,Math.PI/4,0));

//desk fan
makeDeskFan(new THREE.Vector3(16,4.25,-45), new THREE.Vector3(0,Math.PI/2,0));
//fan breeze particle
var breezeInstanceA = new Breeze(0.75);
breezeInstanceA.initialiseInteracting(60,new THREE.Vector3(17,6,-45));
breezeInstanceA.particleInteracting();

//desk fan
makeDeskFan(new THREE.Vector3(-40,4.25,23), new THREE.Vector3(0,Math.PI/2,0));
//fan breeze particle
var breezeInstanceB = new Breeze(0.5);
breezeInstanceB.initialiseInteracting(60,new THREE.Vector3(-39,6,23));
breezeInstanceB.particleInteracting();

//make vent
makeVent(new THREE.Vector3(0,-3.8,-49), new THREE.Vector3(0,Math.PI/2,0));
//vent smoke
var smokeVent = new Smoke();
smokeVent.initialiseSmoke(9,new THREE.Vector3(0,-3.5,-49)); //number of particles, position
smokeVent.particleSmoke();
//make vent
makeVent(new THREE.Vector3(47,-3.8,30), new THREE.Vector3(0,0,0));
//vent smoke particle
var smokeVent = new Smoke();
smokeVent.initialiseSmoke(9,new THREE.Vector3(47,-3.5,30)); //number of particles, position
smokeVent.particleSmoke();

/*
START OF VFX
*/

//ambient particles
var sparkleInst = new Sparkles();
sparkleInst.initialiseSparkles(60,new THREE.Vector3(0,0,0));
sparkleInst.particleSparkles();

/*
END OF VFX
*/

/*
UTILITIES
*/
//generate a colour within a given range
function generateRandomColour(difference, minValue){
	return Math.random()*difference + minValue;
}
/*
END OF UTILITIES
*/

/**
Add setup to all 'make' fucntions
**/
// Setup floor and wall meshes for functionality
setupObject(meshFloor);
setupObject(backWallMesh);
setupObject(leftWallMesh);
setupObject(frontWallMesh);
setupObject(rightWallMesh);

// Load random active item at start of the game 
setRandomActiveObject();

var iFrame = 0;

function animate() 
{
    requestAnimationFrame(animate);
	
	//move lightPoint1
	//lightPoint1.position.x = Math.sin(iFrame/100)*10;
	//lightPoint1.position.z = Math.cos(iFrame/100)*10;

	//move lightPoint1visualiser
	//lightPositionVisualise.position.x = lightPoint1.position.x;
	//lightPositionVisualise.position.y = lightPoint1.position.y;
	//lightPositionVisualise.position.z = lightPoint1.position.z;

	controls.update();
	
    iFrame ++;

    //renderer.render(scene, camera);
	update();
}
animate();
