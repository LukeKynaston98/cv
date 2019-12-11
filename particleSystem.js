/*
PARTICLE SYSTEM##########
Provides basic utilities for all particle systems
*/
class ParticleSystem{
	constructor(){
		
	}
	
	/*CREATE NEW PARTICLES
	Create a new particle object
	Mesh- the mesh the particle will use
	Lifetime- how long the particle will be active for
	Rotation- the rotation per frame of the particle
	Velocity- the velocity per frame of the particle
	
	returns the created particle
	*/
	makeParticle(mesh, lifetime, rotation, velocity){
		var particle = {
			mesh : mesh,
			maxLifetime : lifetime,
			lifetime : lifetime,
			rotation, rotation,
			velocity : velocity
		};
		return particle;
	}
	
	/*CREATE NEW PARTICLES -- OVERRIDE WITH ADDITION OF MESH TYPE
	Create a new particle object
	Mesh- the mesh the particle will use
	Lifetime- how long the particle will be active for
	Rotation- the rotation per frame of the particle
	Velocity- the velocity per frame of the particle
	MeshType- the type of mesh that has been passed
	
	returns the created particle
	*/
	makeParticle(mesh, lifetime, rotation, velocity, meshType){
		var particle = {
			mesh : mesh,
			maxLifetime : lifetime,
			lifetime : lifetime,
			rotation : rotation,
			velocity : velocity,
			meshType : meshType
		};
		return particle;
	}
	
	/*CREATE PARTICLE GENERATOR
	Create a new particle generator that can be iterated though each frame
	particleArray- the array of created particles
	noOfParticles- the number of particles in the systemLanguage
	particlePosition- the starting position of the generator
	
	returns the created generator
	*/
	makeGenerator(particleArray, noOfParticles, particlePosition){
		var particleGenerator = {
			particleArray : particleArray,
			noOfParticles : noOfParticles,
			position : particlePosition
		};
		return particleGenerator;
	}
}//end particle system

/*
SMOKE##########
Smoke particle
*/
class Smoke{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseSmoke(noOfParticles, position){
		var tempArray = [];
		//create smoke particles and add them to the generator array before adding them to the scene
		for(var i=0; i<noOfParticles;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var smokeMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*0.5+0.1),new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(smokeMesh, Math.random()*5+2, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(0,Math.random()*0.1+0.01,0));
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x+Math.random()*2-1,position.y+Math.random()*2-1,position.z+Math.random()*2-1);
			scene.add(tempArray[i].mesh);
		}
		//create a generator using the smoke initialise variables made/used
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		//set the particle system to active
		this._isActive = true;
	}

	//method should occur every frame, updates each smoke particle
	particleSmoke = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				//check if the particle is dead, if it is, reset it
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.y = this._generator.position.y+Math.random()*2-1;
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
					this._generator.particleArray[i].mesh.scale.set(1,1,1);
				}else if(this._generator.particleArray[i].lifetime<=this._generator.particleArray[i].maxLifetime-2){
					//if particle has been active for ~2 seconds start to decrease its scale
					this._generator.particleArray[i].mesh.scale.x -= 0.025;
					this._generator.particleArray[i].mesh.scale.y -= 0.025;
					this._generator.particleArray[i].mesh.scale.z -= 0.025;
				}
				//update the vertical position of the particle
				this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
				//update rotation of particles
				this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
				this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
				this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
				//decrease particle lifetime
				this._generator.particleArray[i].lifetime -= 0.1;
			}
			//ensure this runs every frame
			requestAnimationFrame(this.particleSmoke.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end smoke

/*
##############################################################################
*/

/*
SPARKS##########
Sparks dropping to floor
*/
class Sparks{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseSparks(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0;i<noOfParticles;i++){
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var sparkMesh = new THREE.Mesh(new THREE.ConeBufferGeometry(Math.random()*0.04+0.01, 0.25, 3, 1), new THREE.MeshLambertMaterial({color: 0xffd27f, emissive: 0xffa500, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(sparkMesh, Math.random()*5+6, new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random()*0.005-0.0025,Math.random()*0.04+0.01,Math.random()*0.005-0.0025));
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			//set rotation
			tempArray[i].mesh.rotation.set(Math.PI,0,0);
			scene.add(tempArray[i].mesh);
		}
		
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		//set the particle to active
		this._isActive = true;
	}
	
	//method should occur every frame, updates each spark particle
	particleSparks = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				//check if the particle is dead and reset it if it is
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.set(this._generator.position.x,this._generator.position.y,this._generator.position.z);
					this._generator.particleArray[i].velocity.y = Math.random()*0.04+0.01;
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
				}
				//adds drag to the particle
				this._generator.particleArray[i].velocity.y -= 0.001/*drag*/;
				//updates the position using the particles velocity
				this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
				this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
				this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
				//decrease the life counter of the particle
				this._generator.particleArray[i].lifetime -= 0.1;
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleSparks.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end sparks

/*
##############################################################################
*/

/*
EXPLOSION########
Traditional explosion particle
*/
class ExplosionParticle{
	constructor(){
		this._generator = null;
		this._glowMesh=null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfSmokeParticles- the total number of smoke particles that should be created
	noOfCloudParticles- the total number of cloud particles that should be created
	position- the spawn position of the generator
	*/
	initialiseExplosion(noOfSmokeParticles, noOfCloudParticles, position){
		var tempArray = [];
		
		//smoke particles that spread upwards
		for(var i=0;i<noOfSmokeParticles;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var expMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*3.4/*0.4*/+0.1), new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(expMesh, Math.random()*2+1, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(Math.random()*4-2,Math.random()*0.4+0.1,Math.random()*4-2));
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		//smoke particles that spread upwards
		for(var i=noOfSmokeParticles;i<noOfSmokeParticles+noOfCloudParticles;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var expMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*3.4/*0.4*/+0.1), new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(expMesh, Math.random()*2+1, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(Math.random()*0.5-0.25,Math.random()*2+0.1,Math.random()*0.5-0.25));
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		//explosion radius (single mesh)
		this._glowMesh=new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*3.4/*0.4*/+0.1), new THREE.MeshBasicMaterial({color: 0xFFA500,transparent:true, opacity: 0.4}));
		//set position to the given position
		this._glowMesh.position.set(position.x,position.y,position.z);
		this._glowMesh.scale.set(0,0,0)
		scene.add(this._glowMesh);
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfSmokeParticles+noOfCloudParticles, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each explosion particle
	particleExplode = function(){
		if(this._isActive){
			//check for each particle
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray == null){
					this._generator.particleArray.clear;
				}
				//if dead, delete the particle
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.geometry.dispose();
					this._generator.particleArray[i].mesh.material.dispose();
					scene.remove(this._generator.particleArray[i].mesh);
				}
				//if the particle isn't null
				if(this._generator.particleArray[i] != null){
					//update positon
					this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
					this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
					this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
					//update rotation
					this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
					this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
					this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
					//decrease lifetime
					this._generator.particleArray[i].lifetime -= 0.1;
				}
			}
			//check the size of the blast radius--delete if too big
			if(this._glowMesh.scale.x >=250){
				this._glowMesh.geometry.dispose();
				this._glowMesh.material.dispose();
				scene.remove(this._glowMesh);
			}else if(this._glowMesh!=null){
				//otherwise keep growing
				this._glowMesh.scale.set(this._glowMesh.scale.x+25,this._glowMesh.scale.y+25,this._glowMesh.scale.z+25);
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleExplode.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//no destroy method as explosions are self destructive
}//end explosion

/*
##############################################################################
*/

/*
SMALL EXPLOSION########
Traditional explosion particle but smaller
*/
class SmallExplosion{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfSmokeParticles- the total number of smoke particles that should be created
	noOfCloudParticles- the total number of cloud particles that should be created
	position- the spawn position of the generator
	*/
	initialiseExplosion(noOfSmokeParticles, noOfCloudParticles, position){
		var tempArray = [];
		
		for(var i=0;i<noOfSmokeParticles;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var expMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*1.4+0.1), new THREE.MeshBasicMaterial({color: 0xffa500,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(expMesh, Math.random()*3+1, new THREE.Vector3(Math.random()*0.02-0.01,Math.random()*0.02-0.01,Math.random()*0.02-0.01), new THREE.Vector3(Math.random()*0.2-0.1,Math.random()*0.2+0.1,Math.random()*0.2-0.1));
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		
		for(var i=noOfSmokeParticles;i<noOfSmokeParticles+noOfCloudParticles;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var expMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*1.4+0.1), new THREE.MeshBasicMaterial({color: 0xffa500,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(expMesh, Math.random()*3+1, new THREE.Vector3(Math.random()*0.02-0.01,Math.random()*0.02-0.01,Math.random()*0.02-0.01), new THREE.Vector3(Math.random()*0.2-0.1,Math.random()*0.2+0.1,Math.random()*0.2-0.1));
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfSmokeParticles+noOfCloudParticles, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each explode particle
	particleExplode = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				//clear the array if it is empty
				if(this._generator.particleArray == null){
					this._generator.particleArray.clear;
				}
				//destroy the particle if it is dead
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.geometry.dispose();
					this._generator.particleArray[i].mesh.material.dispose();
					scene.remove(this._generator.particleArray[i].mesh);
				}else if(this._generator.particleArray[i].lifetime<=this._generator.particleArray[i].maxLifetime-1){
					//update its colour if it has been alive for ~1 second
					this._generator.particleArray[i].mesh.material.color.sub(new THREE.Color(0x222222));
				}
				//if the particle is not null
				if(this._generator.particleArray[i] != null){
					//update position
					this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
					this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
					this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
					//update rotation
					this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
					this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
					this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
					//decrease particle lifetime
					this._generator.particleArray[i].lifetime -= 0.1;
				}
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleExplode.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//no destroy method as explosions are self destructive
}

/*
##############################################################################
*/

/*
INTERACTING##########
Orbs and lines
*/
class InteractingParticleA{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfCylinders- the total number of cylinder particles that should be created
	noOfSpheres- the total number of sphere particles that should be created
	position- the spawn position of the generator
	minColour- the minimum boundary of the colour range
	maxColour- the maximum boundary of the colour range
	*/
	initialiseInteracting(noOfCylinders, noOfSpheres, position, minColour, maxColour)
	{
		var tempArray=[];
		
		//create cylinders
		for(var i=0;i<noOfCylinders;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var cylinderMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.02,0.02,Math.random()*4.9+0.1,4), new THREE.MeshBasicMaterial({color:generateRandomColour(minColour, maxColour), transparent:true, opacity: 0.6}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(cylinderMesh, Math.random()*6+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0), "vertical");
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x + Math.random()*5-2.5, position.y + Math.random()*12.5, position.z + Math.random()*5-2.5);
			scene.add(tempArray[i].mesh);
		}
		
		//create spheres
		for(var i=noOfCylinders;i<noOfCylinders+noOfSpheres;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*0.04+0.025), new THREE.MeshBasicMaterial({color: generateRandomColour(minColour, maxColour),transparent:true, opacity: 0.7}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*6+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0), "vertical");
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x + Math.random()*5-2.5, position.y + Math.random()*12.5, position.z + Math.random()*5-2.5);
			scene.add(tempArray[i].mesh);
		}
		
		//buffer geo used as geo will be converted anyway
		//basic material used to save processing power
		var ringMesh = new THREE.Mesh(new THREE.TorusBufferGeometry(4,0.1,16,6), new THREE.MeshBasicMaterial({color: generateRandomColour(minColour, maxColour)}));
		//mesh,lifetime,rotation,speed,type
		var ringParticle = particleSystem.makeParticle(ringMesh, 1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), "ground");
		tempArray.push(ringParticle);
		//set position to the given position
		ringMesh.position.set(position.x, position.y, position.z);
		ringMesh.rotation.x=Math.PI/2;
		scene.add(ringParticle.mesh);
	
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfCylinders+noOfSpheres+1, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each interaction particle
	particleInteracting = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				switch(this._generator.particleArray[i].meshType){
					case "vertical":		//rising particles
						if(this._generator.particleArray[i].lifetime<=0){
							this._generator.particleArray[i].mesh.position.y = this._generator.position.y;
							this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
						}
						this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
						
						this._generator.particleArray[i].lifetime -= 0.1;
						break;
						
					case "ground":		//particles that remain on the ground
						if(this._generator.particleArray[i].mesh.scale.x<=0){
							this._generator.particleArray[i].mesh.scale.set(1,1,1);
						}
						this._generator.particleArray[i].mesh.scale.x -= 0.05;
						this._generator.particleArray[i].mesh.scale.y -= 0.05;
						this._generator.particleArray[i].mesh.scale.z -= 0.05;
						break;
						
					default:
						break;
				}
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end interactionA

/*
##############################################################################
*/

//double helix particle
class Helix{
	constructor(radius){
		this._generator = null;
		this._radius=radius;
		this._ringMeshA = null;
		this._ringMeshB = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseInteracting(noOfParticles, position)
	{
		var tempArray=[];
		var theta = 0;
		
		//create spheres
		for(var i=0;i<noOfParticles;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/noOfParticles;
			}
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*0.05+0.1), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(icoMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0));
			tempArray.push(particle);
			//apply positive or negative theta based on the value of i-- creates two helix shape particles
			if(i%2==0){
				tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+theta, position.z + this._radius*Math.sin(theta));
			}else{
				tempArray[i].mesh.position.set(position.x - this._radius*Math.cos(theta), position.y+theta, position.z - this._radius*Math.sin(theta));
			}
			scene.add(tempArray[i].mesh);
		}
		//buffer geo used as geo will be converted anyway
		//lambert material used to allow emissive texture
		this._ringMeshA = new THREE.Mesh(new THREE.TorusBufferGeometry(this._radius, 0.05, 3, noOfParticles, 2*Math.PI/6), new THREE.MeshLambertMaterial({color: 0x663A82, emissive:0x663A82, emissiveIntensity: 0.9}));
		//set position to the given position
		this._ringMeshA.position.set(position.x,position.y,position.z);
		this._ringMeshA.rotation.x=Math.PI/2;
		scene.add(this._ringMeshA);
		//buffer geo used as geo will be converted anyway
		//lambert material used to allow emissive texture
		this._ringMeshB = new THREE.Mesh(new THREE.TorusBufferGeometry(this._radius, 0.05, 3, noOfParticles, 2*Math.PI/6), new THREE.MeshLambertMaterial({color: 0x663A82, emissive:0x663A82, emissiveIntensity: 0.9}));
		//set position to the given position
		this._ringMeshB.position.set(position.x,position.y,position.z);
		this._ringMeshB.rotation.x=Math.PI/2;
		this._ringMeshB.rotation.z=Math.PI;
		scene.add(this._ringMeshB);
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	//method should occur every frame, updates each helix particle
	particleInteracting = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].mesh.position.y>=this._generator.position.y+2*Math.PI){
					this._generator.particleArray[i].mesh.position.y = this._generator.position.y;
				}
				
				this._generator.particleArray[i].mesh.position.y += 0.1;
				
			}
			this._ringMeshA.rotation.z -= 2*Math.PI/(this._generator.noOfParticles+13);
			this._ringMeshB.rotation.z -= 2*Math.PI/(this._generator.noOfParticles+13);
			//ensure this function runs every frame
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		
		//remove additional meshes outside of array
		this._ringMeshA.geometry.dispose();
		this._ringMeshA.material.dispose();
		scene.remove(this._ringMeshA);
		
		this._ringMeshB.geometry.dispose();
		this._ringMeshB.material.dispose();
		scene.remove(this._ringMeshB);
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end helix

/*
##############################################################################
*/

//cylindrical outline
class CylindricalSparkles{
	constructor(radius){
		this._generator = null;
		this._radius=radius;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseInteracting(noOfParticles, position)
	{
		var tempArray=[];
		var theta = 0;
		
		//create spheres
		for(var i=0;i<noOfParticles;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/(noOfParticles/4);
			}
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*0.1+0.04), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*2+1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0));
			tempArray.push(particle);
			//set circular position around the given position
			tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+Math.random()*3, position.z + this._radius*Math.sin(theta));
			scene.add(tempArray[i].mesh);
		}
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each interaction particle
	particleInteracting = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.y = this._generator.position.y;
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
				}
				
				this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
				
				this._generator.particleArray[i].lifetime -= 0.1;
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end cylindricalSparkles

/*
##############################################################################
*/

//beam particle
class Beam{
	constructor(radius){
		this._generator = null;
		this._radius=radius;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfBeams- the total number of beam particles that should be created
	noOfOrbs- the total number of orb particles that should be created
	noOfToruses- the total number of torus particles that should be created
	position- the spawn position of the generator
	*/
	initialiseInteracting(noOfBeams, noOfOrbs, noOfToruses, position)
	{
		var tempArray=[];
		
		//create small beams
		var theta = 0;
		for(var i=0;i<noOfBeams;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/noOfBeams;
			}
			//set thickness of this cylinder
			var thinkness = Math.random()*0.03+0.02;
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var cylinderMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(thinkness,thinkness,Math.random()*4.9+0.1,4), new THREE.MeshBasicMaterial({color:0x663A82, transparent:true, opacity: 0.6}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(cylinderMesh, Math.random()*2+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "cylinder");
			tempArray.push(particle);
			//set circular position around the given position
			tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+Math.random()*3, position.z + this._radius*Math.sin(theta));
			scene.add(tempArray[i].mesh);
		}
		
		//create orbs
		theta = 0;
		for(var i=noOfBeams;i<noOfBeams+noOfOrbs;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/(noOfOrbs/4);
			}
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*0.1+0.04), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*2+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "sphere");
			tempArray.push(particle);
			//set circular position around the given position
			tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+Math.random()*3, position.z + this._radius*Math.sin(theta));
			scene.add(tempArray[i].mesh);
		}
		
		//create toruses
		theta = 0;
		for(var i=noOfBeams+noOfOrbs;i<noOfBeams+noOfOrbs+noOfToruses;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/noOfToruses;
			}
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var torMesh = new THREE.Mesh(new THREE.TorusBufferGeometry(this._radius*1.2, 0.05, 3, 10, Math.random()*(2*Math.PI/5*2)+2*Math.PI/5), new THREE.MeshBasicMaterial({color:0x663A82, transparent:true, opacity: 0.6}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(torMesh, 1, new THREE.Vector3(0,0,Math.random()*0.49+0.01), new THREE.Vector3(0,0,0), "torus");
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x,position.y + Math.random()*4.9+0.1,position.z);
			//set random rotation
			tempArray[i].mesh.rotation.set(Math.PI/2,0,Math.random()*2*Math.PI);
			scene.add(tempArray[i].mesh);
		}
		
		//create main beam
		//set uniform thickness
		var thinkness = 0.6;
		//buffer geo used as geo will be converted anyway
		//basic material used to save processing power
		var beamMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(thinkness,thinkness,15, 6), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity: 0.6}));
		//mesh,lifetime,rotation,speed,type
		var particle = particleSystem.makeParticle(beamMesh, 2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "beam");
		tempArray.push(particle);
		//set position based on the given position
		tempArray[i].mesh.position.set(position.x, position.y-10, position.z);
		scene.add(tempArray[i].mesh);
		
		var noOfParticles = noOfBeams+noOfOrbs+noOfToruses+1;
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	//method should occur every frame, updates each beam particle
	particleInteracting = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.y = this._generator.position.y;
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
				}
				
				switch(this._generator.particleArray[i].meshType){
					case "torus":
						//do not decrement life
						this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
						break;
						
					case "beam":
						if(this._generator.particleArray[i].mesh.position.y<10)
						{
							this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
						}
						break;
					
					default:
						this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
						this._generator.particleArray[i].lifetime -= 0.1;
						break;
				}
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end beam

/*
##############################################################################
*/

class Breeze{
	constructor(radius){
		this._generator = null;
		this._radius=radius;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseInteracting(noOfParticles, position)
	{
		var tempArray=[];
		var theta = 0;
		
		//create spheres
		for(var i=0;i<noOfParticles;i++){
			if(theta>2*Math.PI){
				theta =0;
			}else{
				theta+=2*Math.PI/noOfParticles;
			}
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var icoMesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.25,6,6), new THREE.MeshBasicMaterial({color: 0xebebeb}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(icoMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(0.05,Math.random()*0.4+0.1,0),"wave");
			tempArray.push(particle);
			//set wave position based on the given position
			tempArray[i].mesh.position.set(position.x + theta, position.y+this._radius*Math.sin(theta), position.z);
			tempArray[i].mesh.scale.set(0.05,0.05,0.05);
			scene.add(tempArray[i].mesh);
		}
		
		//create 3 lines that move randomly
		for(var i=noOfParticles; i<noOfParticles+3;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var lineMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(0.02,0.02,Math.random()*1.5+1,6), new THREE.MeshBasicMaterial({color: 0xebebeb}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(lineMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random()*0.04+0.01,Math.random()*0.4+0.1,0), "line");
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x+Math.random()*2, position.y+Math.random()*2-1, position.z);
			tempArray[i].mesh.rotation.set(Math.PI/2,0,Math.PI/2);
			scene.add(tempArray[i].mesh);
		}
		
		noOfParticles+=3; //add the 3 lines to the total
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each breeze particle
	particleInteracting = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].mesh.position.x>=this._generator.position.x+(2*Math.PI)){
					switch(this._generator.particleArray[i].meshType){
						case "wave":
							this._generator.particleArray[i].mesh.position.x = this._generator.position.x;
							this._generator.particleArray[i].mesh.scale.set(0.05,0.05,0.05);
							break;
							
						case "line":
							this._generator.particleArray[i].mesh.position.x = this._generator.position.x+Math.random()*1.5;
							this._generator.particleArray[i].mesh.position.y = this._generator.position.y + Math.random()*2-1;
							this._generator.particleArray[i].mesh.scale.set(0.05,0.05,0.05);
							break;
							
						default:
							break;
					}
					
				}
				
				if(this._generator.particleArray[i].mesh.position.x<=this._generator.position.x+(2*Math.PI)/6){
					this._generator.particleArray[i].mesh.scale.x += 0.03;
					this._generator.particleArray[i].mesh.scale.y += 0.03;
					this._generator.particleArray[i].mesh.scale.z += 0.03;
				}else if(this._generator.particleArray[i].mesh.position.x>=this._generator.position.x+(((2*Math.PI)/6)*5)){
					this._generator.particleArray[i].mesh.scale.x -= 0.03;
					this._generator.particleArray[i].mesh.scale.y -= 0.03;
					this._generator.particleArray[i].mesh.scale.z -= 0.03;
				}
				
				this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
				
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end breeze

/*
##############################################################################
*/

class Sparkles{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseSparkles(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0; i<noOfParticles;i++){
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var sparkleMesh = new THREE.Mesh(new THREE.TorusBufferGeometry(Math.random()*0.05+0.05, 0.05, Math.random()*4+3,Math.random()*4+3,Math.random()*(2*Math.PI)),new THREE.MeshLambertMaterial({color: 0xffffff,transparent:true, opacity: 0.75, emissive: 0xffffff}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(sparkleMesh, Math.random()*5+2, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(0,Math.random()*0.1+0.01,0));
			tempArray.push(particle);
			//set random position around the given position
			tempArray[i].mesh.position.set(position.x+Math.random()*100-50,position.y+Math.random()*25,position.z+Math.random()*100-50); //*8(-4)
			scene.add(tempArray[i].mesh);
		}
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	//method should occur every frame, updates each sparkle particle
	particleSparkles = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
				this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
				this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleSparkles.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//function to destory particle generator and remove it from the scene
	destroy = function(){
		//loop through particle array and dispose of all individual particles
		for(var i=0;i<this._generator.noOfParticles;i++){
			this._generator.particleArray[i].mesh.geometry.dispose();
			this._generator.particleArray[i].mesh.material.dispose();
			scene.remove(this._generator.particleArray[i].mesh);
		}
		//finally, clear the array
		this._generator.particleArray.clear;
	}
}//end sparkles

/*
##############################################################################
*/

class SparkExplosion{
	constructor(){
		this._generator = null;
	}
	
	get isActive(){
		return this._isActive;
	}
	
	set isActive(active){
		this._isActive = active;
	}
	/*create a particle generator with created particles
	noOfParticles- the total number of particles that should be created
	position- the spawn position of the generator
	*/
	initialiseSparkExplosion(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0;i<noOfParticles;i++){
			//buffer geo used as geo will be converted anyway
			//lambert material used to allow emissive texture
			var sparkMesh = new THREE.Mesh(new THREE.ConeBufferGeometry(Math.random()*0.04+0.01, 0.25, 3, 1), new THREE.MeshLambertMaterial({color: 0x8A2BE2, emissive: 0x8A2BE2, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(sparkMesh, Math.random()*5+6, new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random()*0.5-0.25,Math.random()*0.4+0.1,Math.random()*0.5-0.25), "spark");
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			tempArray[i].mesh.rotation.set(Math.PI,0,0);
			scene.add(tempArray[i].mesh);
		}
		
		var noOfSmokeParts = 50; //fixed number of smoke particles
		
		for(var i=noOfParticles;i<noOfParticles+noOfSmokeParts;i++){
			//buffer geo used as geo will be converted anyway
			//basic material used to save processing power
			var expMesh = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(Math.random()*1.4+0.1), new THREE.MeshBasicMaterial({color: 0x8A2BE2,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed,type
			var particle = particleSystem.makeParticle(expMesh, Math.random()*3+1, new THREE.Vector3(Math.random()*0.02-0.01,Math.random()*0.02-0.01,Math.random()*0.02-0.01), new THREE.Vector3(Math.random()*0.2-0.1,Math.random()*0.2+0.1,Math.random()*0.2-0.1), "smoke");
			tempArray.push(particle);
			//set position to the given position
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		//create a generator
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles+noOfSmokeParts, position);
		//set the particle system to active
		this._isActive = true;
	}
	//method should occur every frame, updates each spark explosion particle
	particleSparkExplosion = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray == null){
					this._generator.particleArray.clear;
				}
				
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.geometry.dispose();
					this._generator.particleArray[i].mesh.material.dispose();
					scene.remove(this._generator.particleArray[i].mesh);
				}
				if(this._generator.particleArray[i] != null){
					switch(this._generator.particleArray[i].meshType){
						case "spark":
							this._generator.particleArray[i].velocity.y -= 0.01/*drag*/;
							this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
							this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
							this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
							break;
							
						case "smoke":
							if(this._generator.particleArray[i].lifetime<=this._generator.particleArray[i].maxLifetime-1){
								this._generator.particleArray[i].mesh.material.color.sub(new THREE.Color(0x222222));
								if(this._generator.particleArray[i].mesh.scale.x>0){
									this._generator.particleArray[i].mesh.scale.x-=0.025;
									this._generator.particleArray[i].mesh.scale.y-=0.025;
									this._generator.particleArray[i].mesh.scale.z-=0.025;
								}
							}
							
							break;
							
						default:
							//do nothing
							break;
					}
					//update position
					this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
					this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
					this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
					//decrease lifetime
					this._generator.particleArray[i].lifetime -= 0.1;
				}
			}
			//ensure this function runs every frame
			requestAnimationFrame(this.particleSparkExplosion.bind(this)); //bind the request to the object instance to allow use of 'this' keyword
		}
	}
	
	//no destroy method as explosions are self destructive
}//end spark explosion
