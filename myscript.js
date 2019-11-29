var scene = new THREE.Scene();

//var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 ); // Perspective projection camera
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 ); // Perspective projection camera
camera.position.x = 0;
camera.position.y = 8;
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight); // Size of the 2D projection
document.body.appendChild(renderer.domElement); // add to the canvas

//Lighting
var lightAmbient = new THREE.AmbientLight(0x222222);
lightAmbient.intensity = 5.0;

var lightPoint1 = new THREE.PointLight(0xffffff);
lightPoint1.position.set(3,20,3);
lightPoint1.rotation.set(0,-2,0);
lightPoint1.intensity = 0.8;
//visualiser
var lightPoint1Geometry = new THREE.SphereGeometry(0.5,18,18);
var lightPoint1Material = new THREE.MeshBasicMaterial({color: 0xCCCC00});
var lightPositionVisualise = new THREE.Mesh(lightPoint1Geometry,lightPoint1Material);

//Rendering shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//shadow quality
lightPoint1.castShadow = true;
lightPoint1.shadow.mapSize.width = 1024;
lightPoint1.shadow.mapSize.height = 1024;
lightPoint1.shadow.camera.near = 0.5;
lightPoint1.shadow.camera.far = 1000;
lightPoint1.shadow.radius = 5.0;

// Floor
var floorGeometry = new THREE.PlaneGeometry(160, 160);
var floorMaterial = new THREE.MeshStandardMaterial( { color: 0x7788dd, side: THREE.DoubleSide } );
var meshFloor = new THREE.Mesh(floorGeometry, floorMaterial);
meshFloor.rotation.x = Math.PI / 2;
meshFloor.position.y = -4;

//Back wall
var wallGeometry = new THREE.PlaneGeometry(160,50);
var wallMaterial = new THREE.MeshStandardMaterial({color: 0xcccccc, side:THREE.DoubleSide});
var wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
wallMesh.position.set(0,20,-80);
scene.add(wallMesh);

var particleSystem = new ParticleSystem();

/**
FUNCTIONALITY
**/
var objectsToShake = [];

function shakeObjects(range)
{
	for (var i = 0; i < objectsToShake.length; i++)
	{
		shakeData = objectsToShake[i];
		shakeData.objectInstance.position.set(
			((Math.random() * shakeData.shakeIntensity*2) - shakeData.shakeIntensity*2)/100 + shakeData.startPosition.x,
			((Math.random() * shakeData.shakeIntensity*2) - shakeData.shakeIntensity*2)/100 + shakeData.startPosition.y,
			((Math.random() * shakeData.shakeIntensity*2) - shakeData.shakeIntensity*2)/100 + shakeData.startPosition.z
			);
	}
}

function setToShake(worldObject, intensity)
{
	//setToActive(worldObject);
	objectsToShake[objectsToShake.length] = shakeData = {
		startPosition: new THREE.Vector3(worldObject.position.x, worldObject.position.y, worldObject.position.z),
		objectInstance: worldObject,
		shakeIntensity: intensity
		};
}

function setToActive(worldObject)
{
	var emissiveMaterial = new THREE.MeshLambertMaterial({
		color: 0xfcfc49,
		emissive: 0xfccd49,
		emissiveIntensity: .5,
		side: THREE.DoubleSide
	})
	
	// Set parent and children material as emissive
	worldObject.material = emissiveMaterial;
	for (var i = 0; i < worldObject.children.length; i++)
	{
		worldObject.children[i].material = emissiveMaterial;
	}
}
/**
END FUNCTIONALITY
**/

//make desk function
function makeDeskVector(position, rotation, withDrawers){
	var numberOfLegs = 2;
	
	//Desk Top
	var deskTopGeometry = new THREE.BoxGeometry(10,0.1,5);
	var deskTopMaterial = new THREE.MeshLambertMaterial({color: 0xc19a6b});
	var deskTopMesh = new THREE.Mesh(deskTopGeometry, deskTopMaterial);
	//set shadow relationship
	deskTopMesh.castShadow = true;
	deskTopMesh.receiveShadow = true;
	scene.add(deskTopMesh);

	//Desk Drawer
	if(withDrawers){
		var deskDrawerGeometry = new THREE.BoxGeometry(2,3.9,5);
		var deskDrawerMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		var deskDrawerMesh = new THREE.Mesh(deskDrawerGeometry,deskDrawerMaterial);
		deskDrawerMesh.parent = deskTopMesh;
		deskDrawerMesh.position.set(-4,-2,0);
		deskTopMesh.add(deskDrawerMesh);
		//set shadow relationship
		deskDrawerMesh.castShadow = true;
		deskDrawerMesh.receiveShadow = true;
	}else{
		numberOfLegs = 4;
	}

	//Desk Legs
	var deskLegs = [];
	for(var i=0; i<numberOfLegs;i++){
		var deskLegGeometry = new THREE.CylinderGeometry(0.2,0.2,3.9,6);
		var deskLegMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
		var deskLegMesh = new THREE.Mesh(deskLegGeometry, deskLegMaterial);
		//set shadow relationship
		deskLegMesh.castShadow = true;
		deskLegMesh.receiveShadow = true;
		
		deskLegs.push(deskLegMesh);
		
		deskLegs[i].parent = deskTopMesh;
		if(i===0){
			deskLegs[i].position.set(4,-2,-2);
		}else if(i===1){
			deskLegs[i].position.set(4,-2,2);
		}else if(i===2){
			deskLegs[i].position.set(-4,-2,-2);
		}else if(i===3){
			deskLegs[i].position.set(-4,-2,2);
		}
		deskTopMesh.add(deskLegs[i]);
	}
	
	//set global location
	deskTopMesh.position.set(position.x, position.y, position.z);
	deskTopMesh.rotation.set(rotation.x, rotation.y, rotation.z);	
	deskTopMesh.scale.set(2,2,2);
}//end of desk

//start of make plant pot function
function makePlant(position, numberOfLeaves){
	//Pot base
	var potBaseGeometry = new THREE.CylinderGeometry(2,1.5,4,6);
	var potBaseMaterial = new THREE.MeshLambertMaterial({color:0x734222});
	var potBaseMesh = new THREE.Mesh(potBaseGeometry, potBaseMaterial);
	potBaseMesh.castShadow = true;
	potBaseMesh.receiveShadow = true;
	scene.add(potBaseMesh);
	//Pot rim
	var potRimGeometry = new THREE.CylinderGeometry(2.2,2.2,1,6);
	var potRimMaterial = new THREE.MeshLambertMaterial({color:0x734222});
	var potRimMesh = new THREE.Mesh(potRimGeometry, potRimMaterial);
	potRimMesh.parent = potBaseMesh;
	potRimMesh.position.set(0,1.5,0);
	potRimMesh.castShadow = true;
	potRimMesh.receiveShadow = true;
	
	potBaseMesh.add(potRimMesh);
	
	//stem
	var stemGeometry = new THREE.CylinderGeometry(0.25,0.25,7,6);
	var stemMaterial = new THREE.MeshLambertMaterial({color:0x644117 });
	var stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
	stemMesh.parent = potBaseMesh;
	stemMesh.position.set(0,5,0);
	stemMesh.castShadow = true;
	stemMesh.receiveShadow = true;
	potBaseMesh.add(stemMesh);
	
	//leaves
	for(var i =0; i<numberOfLeaves; i++){
		var leafGeometry = new THREE.TetrahedronGeometry(Math.random()*2+0.1,0);
		var leafMaterial = new THREE.MeshLambertMaterial({color:0x4f7942});
		var leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
		leafMesh.castShadow = true;
		leafMesh.receiveShadow = false;
		leafMesh.parent = stemMesh;
		leafMesh.position.set(Math.random()*2-1,Math.random()*7-3.5,Math.random()*2-1);
		leafMesh.rotation.set(Math.random()*(Math.PI*2),Math.random()*(Math.PI*2),Math.random()*(Math.PI*2));
		stemMesh.add(leafMesh);
		
	}
	
	potBaseMesh.position.set(position.x, position.y, position.z);
}//end of plant pot

//start of filing cabinet
function makeFilingCabinet(position, rotation){
	var handles = [];
	var numberOfHandles = 4;
	//body
	var cabinetGeometry = new THREE.BoxGeometry(6,30,10);
	var cabinetMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var cabinetMesh = new THREE.Mesh(cabinetGeometry,cabinetMaterial);
	cabinetMesh.castShadow = true;
	cabinetMesh.receiveShadow = true;
	scene.add(cabinetMesh);
	
	//handles
	for(var i=0;i<numberOfHandles;i++){
		var handleGeometry = new THREE.TorusGeometry(0.75,0.1,6,6, Math.PI);
		var handleMaterial = new THREE.MeshLambertMaterial({color:0xebebeb});
		var handleMesh = new THREE.Mesh(handleGeometry,handleMaterial);
		handleMesh.castShadow = true;
		handleMesh.receiveShadow = true;
		
		handleMesh.parent = cabinetMesh;
		handleMesh.position.set(0,i*5-2.5,5.2);
		handleMesh.position.set(0,i*5-3,5.2);
		handleMesh.rotation.x = Math.PI/2;
		cabinetMesh.add(handleMesh);
	}
	
	cabinetMesh.position.set(position.x,position.y, position.z);
	cabinetMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of filing cabinet

//start of mug
function makeMug(position, rotation){
	var mugGeometry = new THREE.CylinderGeometry(0.75,0.75,1.75,6);
	var mugMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
	var mugMesh = new THREE.Mesh(mugGeometry,mugMaterial);
	mugMesh.castShadow = true;
	mugMesh.receiveShadow = true;
	scene.add(mugMesh);
	
	//handle
	var handleGeometry = new THREE.TorusGeometry(0.75,0.1,6,6, Math.PI);
	var handleMaterial = new THREE.MeshLambertMaterial({color:0xebebeb});
	var handleMesh = new THREE.Mesh(handleGeometry,handleMaterial);
	handleMesh.castShadow = true;
	handleMesh.receiveShadow = true;
	
	handleMesh.parent = mugMesh;
	handleMesh.position.set(0.5,0,0);
	handleMesh.rotation.set(0,0,-Math.PI/2);
	mugMesh.add(handleMesh);
	
	mugMesh.position.set(position.x,position.y,position.z);
	mugMesh.rotation.set(rotation.x, rotation.y,rotation.z);
}//end of mug

//start of clock
function makeClock(position, rotation){
	//clock face
	var clockFaceGeometry = new THREE.CylinderGeometry(2.5,2.5,0.1,8);
	var clockFaceMaterial = new THREE.MeshBasicMaterial({color:0xffffff});
	var clockFaceMesh = new THREE.Mesh(clockFaceGeometry,clockFaceMaterial);
	clockFaceMesh.castShadow = true;
	clockFaceMesh.receiveShadow = true;
	scene.add(clockFaceMesh);
	
	//clock edge
	var clockEdgeGeometry = new THREE.TorusGeometry(2.5,0.3,6,8);
	var clockEdgeMaterial = new THREE.MeshLambertMaterial({color:0xa1a1a1});
	var clockEdgeMesh = new THREE.Mesh(clockEdgeGeometry,clockEdgeMaterial);
	clockEdgeMesh.castShadow = true;
	clockEdgeMesh.receiveShadow = true;
	clockEdgeMesh.parent = clockFaceMesh;
	clockEdgeMesh.rotation.x=Math.PI/2;
	clockFaceMesh.add(clockEdgeMesh);
	
	clockFaceMesh.position.set(position.x,position.y,position.z);
	clockFaceMesh.rotation.set(rotation.x + Math.PI/2,rotation.y,rotation.z);
}//end of clock

//start of stapler
function makeStapler(position, rotation){
	//stapler base
	var staplerBaseGeometry = new THREE.BoxGeometry(1,0.2,3);
	var staplerBaseMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerBaseMesh = new THREE.Mesh(staplerBaseGeometry, staplerBaseMaterial);
	staplerBaseMesh.castShadow = true;
	staplerBaseMesh.receiveShadow = true;
	scene.add(staplerBaseMesh);
	
	//stapler top
	var staplerTopGeometry = new THREE.BoxGeometry(1,0.7,3);
	var staplerTopMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerTopMesh = new THREE.Mesh(staplerTopGeometry, staplerTopMaterial);
	staplerTopMesh.castShadow = true;
	staplerTopMesh.receiveShadow = true;
	staplerTopMesh.parent = staplerBaseMesh;
	staplerTopMesh.position.y = 0.75;
	
	staplerBaseMesh.add(staplerTopMesh);
	
	//stapler hinge
	var staplerHingeGeometry = new THREE.BoxGeometry(1.1,1,1);
	var staplerHingeMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var staplerHingeMesh = new THREE.Mesh(staplerHingeGeometry, staplerHingeMaterial);
	staplerHingeMesh.castShadow = true;
	staplerHingeMesh.receiveShadow = true;
	staplerHingeMesh.parent = staplerBaseMesh;
	staplerHingeMesh.position.set(0,0.3,1);
	
	staplerBaseMesh.add(staplerHingeMesh);
	
	staplerBaseMesh.position.set(position.x,position.y,position.z);
	staplerBaseMesh.rotation.set(rotation.x, rotation.y,rotation.z);
}//end of stapler

//start of computer
function makeComputer(position, rotation){
	//computer
	var computerBodyGeometry = new THREE.BoxGeometry(3,5,5);
	var computerBodyMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var computerBodyMesh = new THREE.Mesh(computerBodyGeometry,computerBodyMaterial);
	computerBodyMesh.castShadow = true;
	computerBodyMesh.receiveShadow = true;
	scene.add(computerBodyMesh);
	
	
	computerBodyMesh.position.set(position.x,position.y,position.z);
	computerBodyMesh.rotation.set(rotation.x, rotation.y,rotation.z);
}//end of computer

//start of monitor
function makeMonitor(position, rotation){
	//monitor stand base
	var monitorBaseGeometry = new THREE.BoxGeometry(5,0.25,1);
	var monitorBaseMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var monitorBaseMesh = new THREE.Mesh(monitorBaseGeometry,monitorBaseMaterial);
	monitorBaseMesh.castShadow = true;
	monitorBaseMesh.receiveShadow = true;
	scene.add(monitorBaseMesh);
	
	//monitor stands
	for(var i=0;i<2;i++){
		var monitorStandGeometry = new THREE.BoxGeometry(0.2,3,0.25);
		var monitorStandMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
		var monitorStandMesh = new THREE.Mesh(monitorStandGeometry,monitorStandMaterial);
		monitorStandMesh.castShadow = true;
		monitorStandMesh.receiveShadow = true;
		monitorStandMesh.parent = monitorBaseMesh;
		monitorStandMesh.position.set(-1.5+(i+1),1.5,-0.2);
		monitorBaseMesh.add(monitorStandMesh);
	}
	
	//monitor
	var monitorGeometry = new THREE.BoxGeometry(10,6,0.3);
	var monitorMaterial = new THREE.MeshLambertMaterial({color:0x1f1f1f});
	var monitorMesh = new THREE.Mesh(monitorGeometry,monitorMaterial);
	monitorMesh.castShadow = true;
	monitorMesh.receiveShadow = true;
	monitorMesh.parent = monitorBaseMesh;
	monitorMesh.position.set(0,3.75,0);
	monitorBaseMesh.add(monitorMesh);
	
	//screen
	var screenGeometry = new THREE.PlaneGeometry(9,5);
	var screenMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.DoubleSide});
	var screenMesh = new THREE.Mesh(screenGeometry,screenMaterial);
	screenMesh.castShadow = true;
	screenMesh.receiveShadow = true;
	screenMesh.parent = monitorBaseMesh;
	screenMesh.position.set(0,3.75,0.243);
	monitorBaseMesh.add(screenMesh);
	
	monitorBaseMesh.position.set(position.x,position.y,position.z);
	monitorBaseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of monitor

//start of keyboard
function makeKeyboard(position, rotation){
	//keyboard
	var keyboardGeometry = new THREE.BoxGeometry(6,0.25,1.25);
	var keyboardMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var keyboardMesh = new THREE.Mesh(keyboardGeometry,keyboardMaterial);
	keyboardMesh.castShadow = false;
	keyboardMesh.receiveShadow = true;
	
	scene.add(keyboardMesh);
	
	keyboardMesh.position.set(position.x,position.y,position.z);
	keyboardMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of keyboard

//start of mouse
function makeMouse(position, rotation){
	var mouseGeometry = new THREE.BoxGeometry(0.75,0.25,2);
	var mouseMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
	var mouseMesh = new THREE.Mesh(mouseGeometry,mouseMaterial);
	mouseMesh.castShadow = false;
	mouseMesh.receiveShadow = true;
	
	scene.add(mouseMesh);
	
	mouseMesh.position.set(position.x,position.y,position.z);
	mouseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of mouse

//start of shelves
function makeShelf(position, rotation){
	var numberOfShelves = 3;
	//shelf base
	var shelfBaseGeometry = new THREE.BoxGeometry(7,0.5,2);
	var shelfBaseMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var shelfBaseMesh = new THREE.Mesh(shelfBaseGeometry, shelfBaseMaterial);
	shelfBaseMesh.castShadow = true;
	shelfBaseMesh.receiveShadow = true;
	scene.add(shelfBaseMesh);
	
	//shelf top
	for(var i=0; i<numberOfShelves;i++){
		var shelfGeometry = new THREE.BoxGeometry(7,0.5,2);
		var shelfMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
		var shelfMesh = new THREE.Mesh(shelfGeometry, shelfMaterial);
		shelfMesh.castShadow = true;
		shelfMesh.receiveShadow = true;
		shelfMesh.parent = shelfBaseMesh;
		//shelfMesh.position.y = 15;
		shelfMesh.position.y = (i+1)*5;
		shelfBaseMesh.add(shelfMesh);
	}
	
	//sides
	for(var j=0;j<2;j++){
		var sideGeometry = new THREE.BoxGeometry(0.5,15,2);
		var sideMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
		var sideMesh = new THREE.Mesh(sideGeometry,sideMaterial);
		sideMesh.castShadow = true;
		sideMesh.receiveShadow = true;
		
		sideMesh.parent = shelfBaseMesh;
		sideMesh.position.set(0,7.5,0);
		if(j===0){
			sideMesh.position.x = -3.25;
		}else{
			sideMesh.position.x = 3.25;
		}
		shelfBaseMesh.add(sideMesh);
	}
	
	//back
	var shelfBackGeometry = new THREE.BoxGeometry(7,15,0.5);
	var shelfBackMaterial = new THREE.MeshLambertMaterial({color:0x3a3a3a});
	var shelfBackMesh = new THREE.Mesh(shelfBackGeometry, shelfBackMaterial);
	shelfBackMesh.castShadow = true;
	shelfBackMesh.receiveShadow = true;
	shelfBackMesh.parent = shelfBaseMesh;
	shelfBackMesh.position.set(0,7.5,-1);
	shelfBaseMesh.add(shelfBackMesh);
	
	shelfBaseMesh.position.set(position.x,position.y,position.z);
	shelfBaseMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	setToShake(shelfBaseMesh, 20);
}//end of shelves

//start of chair
function makeChair(position, rotation){
	//seat
	var seatGeometry = new THREE.BoxGeometry(4,0.5,4);
	var seatMaterial = new THREE.MeshLambertMaterial({color: 0x9a339a});
	var seatMesh = new THREE.Mesh(seatGeometry,seatMaterial);
	seatMesh.castShadow = true;
	seatMesh.receiveShadow = true;
	scene.add(seatMesh);
	
	//seat back
	var seatBackGeometry = new THREE.BoxGeometry(4,6,0.5);
	var seatBackMaterial = new THREE.MeshLambertMaterial({color: 0x9a339a});
	var seatBackMesh = new THREE.Mesh(seatBackGeometry,seatBackMaterial);
	seatBackMesh.castShadow = true;
	seatBackMesh.receiveShadow = true;
	seatBackMesh.parent = seatMesh;
	seatBackMesh.position.set(0,3,-1.75);
	seatMesh.add(seatBackMesh);
	
	//legs
	for(var i=0;i<4;i++){
		var legGeometry = new THREE.BoxGeometry(0.25,4,0.25);
		var legMaterial = new THREE.MeshLambertMaterial({color: 0x1a1a1a});
		var legMesh = new THREE.Mesh(legGeometry,legMaterial);
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
		seatMesh.add(legMesh);
	}
	
	seatMesh.position.set(position.x,position.y,position.z);
	seatMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of chair

//start of lights
function makeLights(position, rotation){
	var lightGeometry = new THREE.BoxGeometry(1,0.25,10);
	var lightMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
	var lightMesh = new THREE.Mesh(lightGeometry,lightMaterial);
	lightMesh.castShadow = true;
	lightMesh.receiveShadow = false;
	scene.add(lightMesh);
	
	//supports
	for(var i=0;i<2;i++){
		var supportGeometry = new THREE.CylinderGeometry(0.1,0.1,6,8);
		var supportMaterial = new THREE.MeshLambertMaterial({color: 0x1f1f1f});
		var supportMesh = new THREE.Mesh(supportGeometry,supportMaterial);
		supportMesh.castShadow = true;
		supportMesh.receiveShadow = false;
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
		lightMesh.add(supportMesh);
	}
	
	lightMesh.position.set(position.x,position.y,position.z);
	lightMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of lights

//start of papers
function makePaperStack(position, rotation){
	var basePaperGeometry = new THREE.BoxGeometry(1.5,0.4,2);
	var basePaperMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, side: THREE.DoubleSide});
	var basePaperMesh = new THREE.Mesh(basePaperGeometry,basePaperMaterial);
	basePaperMesh.castShadow = true;
	basePaperMesh.receiveShadow = true;
	basePaperMesh.rotation.z=Math.PI/2;
	scene.add(basePaperMesh);
	
	basePaperMesh.position.set(position.x,position.y,position.z);
	basePaperMesh.rotation.set(rotation.x,rotation.y,rotation.z);
}//end of paper stack

//start of book
function makeBook(position, rotation){
	var spineGeometry = new THREE.BoxGeometry(2,0.6,0.1);
	var spineMaterial = new THREE.MeshLambertMaterial({color:0x001acc});
	var spineMesh = new THREE.Mesh(spineGeometry,spineMaterial);
	spineMesh.castShadow = true;
	spineMesh.receiveShadow = true;
	scene.add(spineMesh);
	
	//faces
	for(var i=0;i<2;i++){
		var faceGeometry = new THREE.BoxGeometry(2,0.1,1.4);
		var faceMaterial = new THREE.MeshLambertMaterial({color: 0x001acc});
		var faceMesh = new THREE.Mesh(faceGeometry,faceMaterial);
		faceMesh.castShadow = true;
		faceMesh.receiveShadow = true;
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
		spineMesh.add(faceMesh);
	}
	
	//pages
	var pagesGeometry = new THREE.BoxGeometry(2,0.35,1.3);
	var pagesMaterial = new THREE.MeshLambertMaterial({color:0xffffff});
	var pagesMesh = new THREE.Mesh(pagesGeometry,pagesMaterial);
	pagesMesh.castShadow = true;
	pagesMesh.receiveShadow = true;
	pagesMesh.parent=spineMesh;
	pagesMesh.position.set(0,0,0.7);
	spineMesh.add(pagesMesh);
	
	spineMesh.position.set(position.x,position.y,position.z);
	spineMesh.rotation.set(rotation.x,rotation.y,rotation.z);
	setToShake(spineMesh, 5);
}

//Shadow relationships
meshFloor.castShadow = false;
meshFloor.receiveShadow = true;


// Add to scene
scene.add(lightAmbient);
scene.add(lightPoint1);
scene.add(lightPositionVisualise);
scene.add(meshFloor);

//Make Desks
makeDeskVector(new THREE.Vector3(-30,4,-25), new THREE.Vector3(0,0,0), true);
makeDeskVector(new THREE.Vector3(-15,4,-20), new THREE.Vector3(0,Math.PI/2,0), false);
makeDeskVector(new THREE.Vector3(16,4,-25), new THREE.Vector3(0,0,0), true);
makeDeskVector(new THREE.Vector3(0,4,0), new THREE.Vector3(0,0,0), false)
//make plants
makePlant(new THREE.Vector3(9,-2,-15), 16);
//make filing cabinets
makeFilingCabinet(new THREE.Vector3(30,1,-45), new THREE.Vector3(0,-1,0));
//make mugs
makeMug(new THREE.Vector3(-15,5,-15), new THREE.Vector3(0,.5,0));
//make clocks
makeClock(new THREE.Vector3(-5,25,-50), new THREE.Vector3(0,0,0));
//make staplers
makeStapler(new THREE.Vector3(-12,4.3,-20), new THREE.Vector3(0,-Math.PI/6,0));
//make computers
makeComputer(new THREE.Vector3(-34,-1.5,-23), new THREE.Vector3(0,0,0));
//make monitors
makeMonitor(new THREE.Vector3(-30,4.25,-26), new THREE.Vector3(0,0,0));
//make keyboards
makeKeyboard(new THREE.Vector3(-30,4.25,-22), new THREE.Vector3(0,0,0));
//make mice
makeMouse(new THREE.Vector3(-25,4.25,-21), new THREE.Vector3(0,0,0));
//make shelves
makeShelf(new THREE.Vector3(-10,-3.75,-40), new THREE.Vector3(0,Math.PI/4,0));
//make chairs
makeChair(new THREE.Vector3(13,2,-14), new THREE.Vector3(0,Math.PI,0));
//make lights
makeLights(new THREE.Vector3(10,12,0), new THREE.Vector3(0,0,0));
makeLights(new THREE.Vector3(-10,12,0), new THREE.Vector3(0,0,0));
//make paper
makePaperStack(new THREE.Vector3(-7,4.25,-3), new THREE.Vector3(0,0,0));
//make book
makeBook(new THREE.Vector3(4,4.5,-2), new THREE.Vector3(0,Math.PI/4,0));


/*
START OF VFX
*/

//smoke--setup
var smokeInstanceA = new Smoke();
smokeInstanceA.initialiseSmoke(15,new THREE.Vector3(-5,5,0)); //number of particles, position
smokeInstanceA.particleSmoke();

var smokeInstanceB = new Smoke();
smokeInstanceB.initialiseSmoke(15,new THREE.Vector3(10,5,-20)); //number of particles, position
smokeInstanceB.particleSmoke();

//sparks--setup
var sparksInstanceA = new Sparks();
sparksInstanceA.initialiseSparks(35,new THREE.Vector3(0,10,0)); //number of particles, position
sparksInstanceA.particleSparks();

//interacting particleA--setup
var interactingInstanceA = new InteractingParticleA();
interactingInstanceA.initialiseInteracting(15,25,new THREE.Vector3(5,0,0), 0x003DF1, 0x33C1FF);
interactingInstanceA.particleInteracting();

//interacting particleB--setup
var interactingInstanceB = new Helix(1);
interactingInstanceB.initialiseInteracting(50,new THREE.Vector3(2.5,5,0));
interactingInstanceB.particleInteracting();

//interacting particleC--setup
var interactingInstanceC = new CylindricalSparkles(1);
interactingInstanceC.initialiseInteracting(100,new THREE.Vector3(-2.5,5,0));
interactingInstanceC.particleInteracting();

//explosion--setup
var explosionInstanceA = new ExplosionParticle();
explosionInstanceA.initialiseExplosion(50, 50, new THREE.Vector3(0,5,-20)); //number of particles, position
explosionInstanceA.particleExplode();


var beamInstanceA = new Beam(1);
beamInstanceA.initialiseInteracting(7,10,3, new THREE.Vector3(0,5,0));
beamInstanceA.particleInteracting();
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

//initialiseSmoke(new THREE.Vector3(0,5,0));
//initialiseSparks(new THREE.Vector3(0,10,0));
//initialiseParticleGlow(new THREE.Vector3(0,5,0));
//initialiseExplosion(new THREE.Vector3(0,5,0));
//particleSmoke(instanceSmoke(50,new THREE.Vector3(0,5,-20)));
//particleSmoke(instanceSmoke(75,new THREE.Vector3(10,5,0)));

var iFrame = 0;

function animate() 
{
    requestAnimationFrame(animate);
	
	//move lightPoint1
	//lightPoint1.position.x = Math.sin(iFrame/100)*10;
	//lightPoint1.position.z = Math.cos(iFrame/100)*10;

	//move lightPoint1visualiser
	lightPositionVisualise.position.x = lightPoint1.position.x;
	lightPositionVisualise.position.y = lightPoint1.position.y;
	lightPositionVisualise.position.z = lightPoint1.position.z;

	//shakeObjects(5);

    iFrame ++;

    renderer.render(scene, camera);

}
animate();
