/*
PARTICLE SYSTEM##########
Provides basic utilities for all particle systems
*/
class ParticleSystem{
	constructor(){
		
	}
	/*
	FUNCTION TO CREATE NEW PARTICLES
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
	//overload with an additional parameter for mesh type
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
	
	initialiseSmoke(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0; i<noOfParticles;i++){
			var smokeMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.5+0.1),new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(smokeMesh, Math.random()*5+2, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(0,Math.random()*0.1+0.01,0));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x+Math.random()*2-1,position.y+Math.random()*2-1,position.z+Math.random()*2-1);
			scene.add(tempArray[i].mesh);
		}
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}

	particleSmoke = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.y = this._generator.position.y+Math.random()*2-1;
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
				}
				this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
				
				this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
				this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
				this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
				
				this._generator.particleArray[i].lifetime -= 0.1;
			}
			
			requestAnimationFrame(this.particleSmoke.bind(this)); //bind the request to the object instance
		}
	}
}//end smoke

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
	
	initialiseSparks(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0;i<noOfParticles;i++){
			var sparkMesh = new THREE.Mesh(new THREE.ConeGeometry(Math.random()*0.04+0.01, 0.25, 3, 1), new THREE.MeshLambertMaterial({color: 0xffd27f, emissive: 0xffa500, emissiveIntensity: 0.9}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(sparkMesh, Math.random()*5+6, new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random()*0.005-0.0025,Math.random()*0.09-0.1,Math.random()*0.005-0.0025));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			tempArray[i].mesh.rotation.set(Math.PI,0,0);
			scene.add(tempArray[i].mesh);
		}
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	
	particleSparks = function(){
		if(this._isActive){
			for(var i=0;i<this._generator.noOfParticles;i++){
				if(this._generator.particleArray[i].lifetime<=0){
					this._generator.particleArray[i].mesh.position.set(this._generator.position.x,this._generator.position.y,this._generator.position.z);
					this._generator.particleArray[i].lifetime = this._generator.particleArray[i].maxLifetime;
				}
				this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
				this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
				this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
				/*
				this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
				this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
				this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
				*/
				
				this._generator.particleArray[i].lifetime -= 0.1;
			}
			
			requestAnimationFrame(this.particleSparks.bind(this)); //bind the request to the object instance
		}
	}
}//end sparks


/*
EXPLOSION########
Traditioanl explosion particle
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
	
	initialiseExplosion(noOfSmokeParticles, noOfCloudParticles, position){
		var tempArray = [];
		
		for(var i=0;i<noOfSmokeParticles;i++){
			var expMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.4+0.1), new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			var particle = particleSystem.makeParticle(expMesh, Math.random()*2+1, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(Math.random()*4-2,Math.random()*0.4+0.1,Math.random()*4-2));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		
		for(var i=noOfSmokeParticles;i<noOfSmokeParticles+noOfCloudParticles;i++){
			var expMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.4+0.1), new THREE.MeshBasicMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			var particle = particleSystem.makeParticle(expMesh, Math.random()*2+1, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(Math.random()*0.5-0.25,Math.random()*2+0.1,Math.random()*0.5-0.25));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x,position.y,position.z);
			scene.add(tempArray[i].mesh);
		}
		
		this._glowMesh=new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.4+0.1), new THREE.MeshBasicMaterial({color: 0xFFA500,transparent:true, opacity: 0.4}));
		this._glowMesh.position.set(position.x,position.y,position.z);
		this._glowMesh.scale.set(0,0,0)
		scene.add(this._glowMesh);
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfSmokeParticles+noOfCloudParticles, position);
		this._isActive = true;
	}

	particleExplode = function(){
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
					this._generator.particleArray[i].mesh.position.x += this._generator.particleArray[i].velocity.x;
					this._generator.particleArray[i].mesh.position.y += this._generator.particleArray[i].velocity.y;
					this._generator.particleArray[i].mesh.position.z += this._generator.particleArray[i].velocity.z;
					
					this._generator.particleArray[i].mesh.rotation.x += this._generator.particleArray[i].rotation.x;
					this._generator.particleArray[i].mesh.rotation.y += this._generator.particleArray[i].rotation.y;
					this._generator.particleArray[i].mesh.rotation.z += this._generator.particleArray[i].rotation.z;
					
					
					this._generator.particleArray[i].lifetime -= 0.1;
				}
			}
			
			if(this._glowMesh.scale.x >=150){
				this._glowMesh.geometry.dispose();
				this._glowMesh.material.dispose();
				scene.remove(this._glowMesh);
			}else if(this._glowMesh!=null){
				this._glowMesh.scale.set(this._glowMesh.scale.x+15,this._glowMesh.scale.y+15,this._glowMesh.scale.z+15);
			}
			
			requestAnimationFrame(this.particleExplode.bind(this)); //bind the request to the object instance
		}
	}
}//end explosion

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
	
	initialiseInteracting(noOfCylinders, noOfSpheres, position, minColour, maxColour)
	{
		var tempArray=[];
		
		//create cylinders
		for(var i=0;i<noOfCylinders;i++){
			var cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.02,Math.random()*4.9+0.1,4), new THREE.MeshBasicMaterial({color:generateRandomColour(minColour, maxColour), transparent:true, opacity: 0.6}));
			var particle = particleSystem.makeParticle(cylinderMesh, Math.random()*6+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0));
			//randomise position
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x + Math.random()*5-2.5, position.y + Math.random()*12.5, position.z + Math.random()*5-2.5);
			scene.add(tempArray[i].mesh);
		}
		
		//create spheres
		for(var i=noOfCylinders;i<noOfCylinders+noOfSpheres;i++){
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.04+0.025), new THREE.MeshBasicMaterial({color: generateRandomColour(minColour, maxColour),transparent:true, opacity: 0.7}));
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*6+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0));
			tempArray.push(particle);
			//randomise position
			tempArray[i].mesh.position.set(position.x + Math.random()*5-2.5, position.y + Math.random()*12.5, position.z + Math.random()*5-2.5);
			scene.add(tempArray[i].mesh);
		}
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfCylinders+noOfSpheres, position);
		this._isActive = true;
	}
	
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
			
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance
		}
	}
}//end interactionA

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
			
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.04+0.04), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			var particle = particleSystem.makeParticle(icoMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.4+0.1,0));
			tempArray.push(particle);
			//apply positive or negative theta based on the value of i
			if(i%2==0){
				tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+theta, position.z + this._radius*Math.sin(theta));
			}else{
				tempArray[i].mesh.position.set(position.x - this._radius*Math.cos(theta), position.y+theta, position.z - this._radius*Math.sin(theta));
			}
			scene.add(tempArray[i].mesh);
		}
		
		this._ringMeshA = new THREE.Mesh(new THREE.TorusGeometry(this._radius, 0.05, 3, noOfParticles, 2*Math.PI/6), new THREE.MeshLambertMaterial({color: 0x663A82, emissive:0x663A82, emissiveIntensity: 0.9}));
		this._ringMeshA.position.set(position.x,position.y,position.z);
		this._ringMeshA.rotation.x=Math.PI/2;
		scene.add(this._ringMeshA);
		
		this._ringMeshB = new THREE.Mesh(new THREE.TorusGeometry(this._radius, 0.05, 3, noOfParticles, 2*Math.PI/6), new THREE.MeshLambertMaterial({color: 0x663A82, emissive:0x663A82, emissiveIntensity: 0.9}));
		this._ringMeshB.position.set(position.x,position.y,position.z);
		this._ringMeshB.rotation.x=Math.PI/2;
		this._ringMeshB.rotation.z=Math.PI;
		scene.add(this._ringMeshB);
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	
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
			
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance
		}
	}
}//end helix

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
			
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.1+0.04), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*2+1, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x + this._radius*Math.cos(theta), position.y+Math.random()*3, position.z + this._radius*Math.sin(theta));
			scene.add(tempArray[i].mesh);
		}
		
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	
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
			
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance
		}
	}
}//end cylindricalSparkles

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
			var thinkness = Math.random()*0.03+0.02;
			var cylinderMesh = new THREE.Mesh(new THREE.CylinderGeometry(thinkness,thinkness,Math.random()*4.9+0.1,4), new THREE.MeshBasicMaterial({color:0x663A82, transparent:true, opacity: 0.6}));
			var particle = particleSystem.makeParticle(cylinderMesh, Math.random()*2+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "cylinder");
			tempArray.push(particle);
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
			
			var icoMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.1+0.04), new THREE.MeshLambertMaterial({color: 0x663A82,emissive:0x663A82, emissiveIntensity: 0.9}));
			var particle = particleSystem.makeParticle(icoMesh, Math.random()*2+2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "sphere");
			tempArray.push(particle);
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
			
			var torMesh = new THREE.Mesh(new THREE.TorusGeometry(this._radius*1.2, 0.05, 3, 10, Math.random()*(2*Math.PI/5*2)+2*Math.PI/5), new THREE.MeshBasicMaterial({color:0x663A82, transparent:true, opacity: 0.6}));
			var particle = particleSystem.makeParticle(torMesh, 1, new THREE.Vector3(0,0,Math.random()*0.49+0.01), new THREE.Vector3(0,0,0), "torus");
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x,position.y + Math.random()*4.9+0.1,position.z);
			tempArray[i].mesh.rotation.set(Math.PI/2,0,Math.random()*2*Math.PI);
			scene.add(tempArray[i].mesh);
		}
		
		//create main beam
		var thinkness = 0.6;
		var beamMesh = new THREE.Mesh(new THREE.CylinderGeometry(thinkness,thinkness,15, 6), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity: 0.6}));
		var particle = particleSystem.makeParticle(beamMesh, 2, new THREE.Vector3(0,0,0), new THREE.Vector3(0,Math.random()*0.2+0.1,0), "beam");
		tempArray.push(particle);
		tempArray[i].mesh.position.set(position.x, position.y-10, position.z);
		scene.add(tempArray[i].mesh);
		
		var noOfParticles = noOfBeams+noOfOrbs+noOfToruses+1;
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	
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
			
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance
		}
	}
}//end beam

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
			
			var icoMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25,6,6), new THREE.MeshBasicMaterial({color: 0xebebeb}));
			var particle = particleSystem.makeParticle(icoMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(0.05,Math.random()*0.4+0.1,0),"wave");
			tempArray.push(particle);
			//apply positive or negative theta based on the value of i
			tempArray[i].mesh.position.set(position.x + theta, position.y+this._radius*Math.sin(theta), position.z);
			tempArray[i].mesh.scale.set(0.05,0.05,0.05);
			scene.add(tempArray[i].mesh);
		}
		
		//create 3 lines that move randomly
		for(var i=noOfParticles; i<noOfParticles+3;i++){
			var lineMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.01,0.01,Math.random()*3+1,6), new THREE.MeshBasicMaterial({color: 0xebebeb}));
			var particle = particleSystem.makeParticle(lineMesh, 20, new THREE.Vector3(0,0,0), new THREE.Vector3(Math.random()*0.04+0.01,Math.random()*0.4+0.1,0), "line");
			tempArray.push(particle);
			//apply positive or negative theta based on the value of i
			tempArray[i].mesh.position.set(position.x+Math.random()*2, position.y+Math.random()*2-1, position.z);
			tempArray[i].mesh.rotation.set(Math.PI/2,0,Math.PI/2);
			scene.add(tempArray[i].mesh);
		}
		
		noOfParticles+=3;
		this._generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		this._isActive = true;
	}
	
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
			
			requestAnimationFrame(this.particleInteracting.bind(this)); //bind the request to the object instance
		}
	}
}//end breeze