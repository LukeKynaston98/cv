/**
FUNCTIONALITY
**/

var objectDataList = [];			  // List of all objects in the scene
var potentialActiveObjectList = [];   // List of objects that can be set to active 

// Setup mouse interaction
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(-10000, -10000);

// Add event listener
window.addEventListener('mousemove', onMouseMove, false);

// Amount of objects destroyed by player,
// Amount of time elapsed after countdown
// Amount of objects to destroy during the game 
var objectDestroyCount = 0;
var playerTime = 0;
var objectDestroyLimit = 5;

// Object data that is currently active (ready to be looked at)
var activeObjectData;

//Particle setup
var activeParticle;
var explosionParticle;

/* 
Chooses a random object from the potentialActiveObjectList 
and sets it to be active 
*/
function setRandomActiveObject()
{
	var ranObjectData = potentialActiveObjectList[Math.floor(Math.random()*potentialActiveObjectList.length)];
	activeObjectData = ranObjectData;
	if (!activeObjectData.bCanShake)
	{
		setRandomActiveObject();
		return;
	}
	onActiveMeshSetActive(activeObjectData.objectInstance);
}

/*
Tell an object to shake during animation frames
*/
function setObjectDataToShake(objectData)
{
	objectData.bIsShaking = true;
}

/*
Dispose of an object and everything related to it
*/
function disposeObjectData(objectData)
{
	onActiveMeshDestroyed(objectData.objectInstance);
	scene.remove(objectData.objectInstance);
	objectData.objectInstance.geometry.dispose();
	objectData.objectInstance.material.dispose();
	objectData.bCanShake = false;
	objectData.bIsShaking = false;
}

/*
Shake an object during the animation frame
*/
function shakeObject(objectData)
{
	var intensity = objectData.shakeIntensity;
	
	// Set a random position based on initial position to create a shake effect
	objectData.objectInstance.position.set(
	((Math.random() * intensity) - intensity)/10 + objectData.startPosition.x,
	((Math.random() * intensity) - intensity)/10 + objectData.startPosition.y,
	((Math.random() * intensity) - intensity)/10 + objectData.startPosition.z
	);
	objectData.shakeIntensity += objectData.shakeIntensity/65;
	
	if (objectData.shakeIntensity > objectData.shakeMaximum)
	{
		// Remove the object once it has finished shaking
		disposeObjectData(objectData);
		objectDestroyCount++;
		
		if (objectDestroyCount >= objectDestroyLimit)
		{
			endGame();
		} else
		{
			setRandomActiveObject();
		}
	}
	
	objectData.startPosition.y += 0.035;
}

/*
End the game
*/
function endGame()
{
	// Game over
}

/* 
Called when the active mesh has been destroyed from shaking too much
*/
function onActiveMeshDestroyed(objectInstance)
{
	// Create a random explosion particle effect when the mesh is destroyed
	var prng = Math.floor(Math.random()*3);
	switch(prng){
		case 0:
			explosionParticle = new SparkExplosion();
			explosionParticle.initialiseSparkExplosion(60, activeObjectData.startPosition);
			explosionParticle.particleSparkExplosion();
			break;
			
		case 1:
			explosionParticle = new ExplosionParticle();
			explosionParticle.initialiseExplosion(50, 50, activeObjectData.startPosition); //number of particles, position
			explosionParticle.particleExplode();
			break;

		case 2:
		default:
			explosionParticle = new SmallExplosion();
			explosionParticle.initialiseExplosion(50, 50, activeObjectData.startPosition); //number of particles, position
			explosionParticle.particleExplode();
			break;
	}
	
	
	activeParticle.isActive = false;
	activeParticle.destroy();
	scene.remove(activeParticle);
	
	console.log("MESH DESTROYED");
}

/*
Called when the active mesh behins shaking (the player looks at it)
*/
function onActiveMeshSetActive(objectInstance)
{
	// Particle setup
	// Create a random highlight particle on the object when it becomes active
	var prng = Math.floor(Math.random()*4);
	switch(prng){
		case 0:
			activeParticle = new InteractingParticleA();
			activeParticle.initialiseInteracting(15,25,activeObjectData.startPosition, 0x003DF1, 0x33C1FF);
			activeParticle.particleInteracting();
			break;
			
		case 1:
			activeParticle = new Helix(1);
			activeParticle.initialiseInteracting(50, activeObjectData.startPosition);
			activeParticle.particleInteracting();
			break;
			
		case 2:
			activeParticle = new CylindricalSparkles(1);
			activeParticle.initialiseInteracting(75,activeObjectData.startPosition);
			activeParticle.particleInteracting();
			break;
			
		case 3:
		default:
			activeParticle = new Beam(1);
			activeParticle.initialiseInteracting(7,10,4, activeObjectData.startPosition);
			activeParticle.particleInteracting();
			break;
	}
	
	console.log("MESH SET TO ACTIVE");
}

/*
Marks a mesh when created, determining the functionality of the mesh
*/
function setupObject(_worldObject, _shakeIntensity = 0, _bCanShake = false)
{
	var objectData = {
		startPosition: new THREE.Vector3(_worldObject.position.x, _worldObject.position.y, _worldObject.position.z),
		objectInstance: _worldObject,
		shakeIntensity: _shakeIntensity,
		shakeMaximum : 8,
		bIsShaking: false,
		bCanShake: _bCanShake
	};
	objectDataList.push(objectData);
	if (_bCanShake)
		potentialActiveObjectList.push(objectData);
}

/*
Returns objectData based on worldObject passed
*/
function getObjectData(worldObject)
{
	for (var i = 0; i < objectDataList.length; i++) 
	{
		if (objectDataList[i].objectInstance == worldObject)
			return objectDataList[i];
	}
	return null;
}

/*
Triggers mouse events based on position
*/
function onMouseMove(event)
{
	mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
	mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
}

function update()
{
	// Create a ray from the camera
	raycaster.setFromCamera( new THREE.Vector2(), camera );  
	var intersects = raycaster.intersectObjects(scene.children);
	
	// Check for mouse hovering over active target via raycasting
	if (isGameReady)
	{
		for (var i = 0; i < intersects.length; i++) 
		{
			try
			{
				// Get the object data based on object interseect from raycast
				var obj = getObjectData(intersects[i].object);
				
				// Check if the object can shake
				if (obj.bCanShake && obj == activeObjectData && !obj.bIsShaking)
				{
					// Sets the object that the player is looking at to shake
					console.log("FOUND OBJECT TO SHAKE: " + obj);
					setObjectDataToShake(obj);
				}
			} catch (exception)
			{
				console.log("MISSING OBJECT DATA FOR: " + intersects[i].object + ", IS IT A PARTICLE?");
			}
		}
	}
	// Animate object that needs to shake
	for (var j = 0; j < potentialActiveObjectList.length; j++) 
	{
		if (potentialActiveObjectList[j].bIsShaking)
		{
			// Shake the object that is currently active
			shakeObject(potentialActiveObjectList[j]);
		}
	}
	
	// Check if the countdown is still going
	if (gameCountdownTimer > 0)
	{
		gameCountdownTimer -= .025;
		drawCountdown();
		
		if (gameCountdownTimer < 0 )
		{
			// Countdown timer has elapsed, game ready to play
			isGameReady = true;
			clearCountdown();
		}
	}
	
	handleTimer();
	
	// Render it
	renderer.render(scene, camera);
}

/**
END FUNCTIONALITY
**/

/**
START USER INTERFACE
**/

// Countdown timer, counting down from x
// A check to see if the countdown has finished
var gameCountdownTimer = 5;
var isGameReady = false;

var playerTimer = 0;
var playerTimerIncrement = 0.025;
/*
Draw the countdown to the screen
*/
function drawCountdown()
{
    document.getElementById("info").innerHTML = Math.floor(gameCountdownTimer+1);
}

/*
Clear the countdown from the screen
*/
function clearCountdown()
{
    document.getElementById("info").innerHTML = "";
}

function handleTimer()
{
	playerTimer += playerTimerIncrement;
	document.getElementById("timer").innerHTML = Math.floor(playerTimer);
}

/**
END USER INTERFACE
**/
