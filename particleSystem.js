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
	
	makeGenerator(particleArray, noOfParticles, particlePosition){
		var particleGenerator = {
			particleArray : particleArray,
			noOfParticles : noOfParticles,
			position : particlePosition
		};
		return particleGenerator;
	}
}

class Smoke{
	constructor(){
		this.generator = null;
	}
	
	initialiseSmoke(noOfParticles, position){
		var tempArray = [];
		
		for(var i=0; i<noOfParticles;i++){
			var smokeMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*0.5+0.1),new THREE.MeshPhongMaterial({color: 0x1f1f1f,transparent:true, opacity: 0.75}));
			//mesh,lifetime,rotation,speed
			var particle = particleSystem.makeParticle(smokeMesh, Math.random()*5+2, new THREE.Vector3(Math.random()*0.06-0.03,Math.random()*0.06-0.03,Math.random()*0.06-0.03), new THREE.Vector3(0,Math.random()*0.1+0.01,0));
			tempArray.push(particle);
			tempArray[i].mesh.position.set(position.x+Math.random()*2-1,position.y+Math.random()*2-1,position.z+Math.random()*2-1);
			scene.add(tempArray[i].mesh);
		}
		
		var generator = particleSystem.makeGenerator(tempArray, noOfParticles, position);
		
		return generator;
	}

	particleSmoke(generator){
		for(var i=0;i<generator.noOfParticles;i++){
			if(generator.particleArray[i].lifetime<=0){
				generator.particleArray[i].mesh.position.y = generator.position.y+Math.random()*2-1;
				generator.particleArray[i].lifetime = generator.particleArray[i].maxLifetime;
			}
			generator.particleArray[i].mesh.position.x += generator.particleArray[i].velocity.x;
			generator.particleArray[i].mesh.position.y += generator.particleArray[i].velocity.y;
			generator.particleArray[i].mesh.position.z += generator.particleArray[i].velocity.z;
			
			generator.particleArray[i].mesh.rotation.x += generator.particleArray[i].rotation.x;
			generator.particleArray[i].mesh.rotation.y += generator.particleArray[i].rotation.y;
			generator.particleArray[i].mesh.rotation.z += generator.particleArray[i].rotation.z;
			
			generator.particleArray[i].lifetime -= 0.1;
		}
	}

	instanceSmoke(noOfParticles, position){
		var smokeArray = initialiseSmoke(noOfParticles, position);
		
		var generator = particleSystem.makeGenerator(smokeArray, noOfParticles, position);
		
		//return generator;
		this.generator = generator;
	}
}