/*
Proyecto GPC - Dice roller
*/ 

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

var world
var clock

var path = "images/";
var cameraControls;
var stats;
var effectController;
var dices = [];

var upPressed = downPressed = leftPressed = rightPressed = jumpPressed = false;

var l = b = -100;
var r = t = -l;
var planta;

var antes = Date.now();

var scale = 0.1;

var AXIAL_TILT = 54.74 / 180 * Math.PI;

var space_radius = 6000;
var sun_radius = 2000;
var earth;
var earth_radius = 6370;
var earth_angle = 0;
var moon;
var moon_radius = 1737;
var distance = 384000;
var player;
var spaceSuit;
var human_height = 0.0018;

earth_radius *= scale;
moon_radius *= scale;
distance *= scale**2;

// Variables gravity sphere
var gravity = -1.625;
var moveSpeed = 15;
var moveX = moveY = 0;
var moveDir;


// Actions when the body and this script is loaded
init();
initPhysics();
loadScene();
setupGui();
render();

function init() {
    // Configure the renderer and the canvas
    renderer = new THREE.WebGLRenderer();
    // Using full size of the window
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0xFFFFFF));
    renderer.shadowMap.enabled = true;
    renderer.autoClear = false;

    document.getElementById("container").appendChild(renderer.domElement);

    // Scene - data structure grafo aciclico dirigido
    scene = new THREE.Scene();

    // Reloj
	clock = new THREE.Clock();
	clock.start();

    // Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);

    // Camera controller
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.enableKeys = false;

    // STATS --> stats.update() en update()
	stats = new Stats();
	stats.setMode(0);					// Muestra FPS
	stats.domElement.style.position = 'absolute';		// Abajo izquierda
	stats.domElement.style.bottom = '100px';
	stats.domElement.style.left = '0px';
	document.getElementById('container').appendChild( stats.domElement );

    // Event capture
    window.addEventListener('resize', updateAspectRatio);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // Clock
	//clock = new THREE.Clock();
	//clock.start();
}

function initPhysics() {
    world = new CANNON.World();
    world.gravity.set(0, 0, 0);
    world.solver.iterations = 10;

    var planetMaterial = new CANNON.Material("planetMaterial");
    world.addMaterial(planetMaterial);
    var astronautMaterial = new CANNON.Material("astronautMaterial");
    world.addMaterial(astronautMaterial);

    var planetAstronautContactMaterial = new CANNON.ContactMaterial(planetMaterial, astronautMaterial, 
        {friction: 1.0, restitution: 0});
    world.addContactMaterial(planetAstronautContactMaterial);
}

function loadScene() {
    // Build scene graph

    create_lights()
	
    // Textures
    var earthTexture = new THREE.TextureLoader().load(path+"earth.jpg");
    earthTexture.magFilter = THREE.LinearFilter;
    earthTexture.minFilter = THREE.LinearFilter;
    earthTexture.wrapS = earthTexture.wrapT = THREE.MirroredRepeatWrapping;

    var spaceTexture = new THREE.TextureLoader().load(path+"space2.jpg");
    spaceTexture.magFilter = THREE.LinearFilter;
    spaceTexture.minFilter = THREE.LinearFilter;
    spaceTexture.wrapS = spaceTexture.wrapT = THREE.MirroredRepeatWrapping;
    spaceTexture.repeat.set(5, 5);

    // Materials       
    var earthMaterial = new THREE.MeshPhongMaterial({color: 'white',
                                                    shininess: 25,
                                                    map: earthTexture});
    var spaceMaterial = new THREE.MeshBasicMaterial({color: 'white',
                                                    side: THREE.BackSide,
                                                    map: spaceTexture});
    var sunMaterial = new THREE.MeshPhongMaterial({color: 'yellow',
                                                    emissive: 0xFFF300});
    
    

    // Geometries
    var geoEarth = new THREE.SphereGeometry(earth_radius, 100, 100);
    var geoSpace = new THREE.SphereGeometry(space_radius, 15, 15);
    var geoSun = new THREE.SphereGeometry(sun_radius, 15, 15 );
    
    // Objects
    earth = new THREE.Mesh(geoEarth, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;
    
    var space = new THREE.Mesh(geoSpace, spaceMaterial);

    sun = new THREE.Mesh(geoSun, sunMaterial);
    sun.position.set(-4000, 0, -4000);

    scene.add(earth);
    scene.add(space);
    scene.add(sun);

    moon = new create_moon();
    scene.add(moon.visual);
    world.addBody(moon.body);

    player = new create_player();
    scene.add(player.visual);
    world.add(player.body);
    
    // Organize scene graph
    scene.add(new THREE.AxesHelper((4000, 4000, 4000)));
}

function create_lights() {
    var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.2);
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF, 1.0);
    pointLight.position.set(-4000, 0, -4000);    
    pointLight.shadow.camera.near = 500;
    pointLight.shadow.camera.far = 10000;
    pointLight.penumbra = 1;
    pointLight.castShadow = true;
	scene.add(pointLight);
}

function create_moon() {
    // Visuals
    var moonTexture = new THREE.TextureLoader().load(path+"moon.jpg");
    moonTexture.magFilter = THREE.LinearFilter;
    moonTexture.minFilter = THREE.LinearFilter;
    moonTexture.wrapS = moonTexture.wrapT = THREE.MirroredRepeatWrapping;

    var moonMaterial = new THREE.MeshPhongMaterial({color: 'white',
                                                    shininess: 25,
                                                    map: moonTexture});

    var geoMoon = new THREE.SphereGeometry(moon_radius, 300, 300);

    this.visual = new THREE.Mesh(geoMoon, moonMaterial);
    this.visual.receiveShadow = true;
    this.visual.castShadow = true;
    this.visual.rotation.x = AXIAL_TILT;
    

    // Physics
    var planetMaterial;
    for (var i=0; i<world.materials.length; i++) {
        if (world.materials[i].name==="planetMaterial") planetMaterial = world.materials[i];
    }
    var moonShape = new CANNON.Sphere(moon_radius);
    this.body = new CANNON.Body({
        mass: 0,
        material: planetMaterial
    });
    this.body.addShape(moonShape);
}

function create_player() {
    /*
    var baseMaterial = new THREE.MeshLambertMaterial({color: 'white',
                                                        map: baseTexture});
    
   var geoPlayer = new THREE.CylinderGeometry(3, 3, 10, 16);

   player = new THREE.Object3D();
   spaceSuit = new THREE.Object3D();
   var lens;
   var body;
   */
    // Physics
   var astronautMaterial;
   for (var i=0; i<world.materials.length; i++) {
       if (world.materials[i].name==="astronautMaterial") astronautMaterial = world.materials[i];
   }
   var playerShape = new CANNON.Sphere(10);
   this.body = new CANNON.Body({
       mass: 80,
       material: astronautMaterial
   });
   this.body.position = new CANNON.Vec3(0,  moon_radius+50, 0);
   this.body.addShape(playerShape);

   // Visuals
   var suitMaterial = new THREE.MeshLambertMaterial({color: 'white'});
   var glassMaterial = new THREE.MeshPhongMaterial({color: 0x77cbff,
                                                   shininess: 25});

   var geoPlayer = new THREE.SphereGeometry(10, 10, 10);

   this.visual = new THREE.Mesh(geoPlayer, suitMaterial);
   this.visual.position.copy(this.body.position);
   this.visual.receiveShadow = true;
   this.visual.castShadow = true;   
}

function setupGui()
{
	// Definicion de los controles
	effectController = {
		color: "rgb(255,0,0)"
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
    var h = gui.addFolder("Select Space-Suit Color");
    var sensorColor = h.addColor(effectController, "color").name("Color");
	sensorColor.onChange(function(color) {
							spaceSuit.traverse(function(child) {
                                if( child instanceof THREE.Mesh ) child.material.color = new THREE.Color(color);
							})
						});    
}

function setCameras(aspectRatio) {
    // Construct cameras planta, alzado and pefil

    // Give planes to the orthogonal camera: left, right, top, bottom, origin
    if (aspectRatio > 1) {
        orthoCamera = new THREE.OrthographicCamera(l*aspectRatio, r*aspectRatio, t, b, -20, 800);
    } else {
        orthoCamera = new THREE.OrthographicCamera(l, r, t*aspectRatio, b*aspectRatio, -20, 800);
    }
    planta = orthoCamera.clone()
    planta.position.set(0, 300, 0);
    planta.lookAt(new THREE.Vector3(0, 0, 0));
    planta.up = new THREE.Vector3(0, 1, 0);

    // angleVision, aspectRatio, minVisionPosition, maxVisionPosition
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 10000);
    camera.position.set(200, 300, 450);    
    camera.lookAt(new THREE.Vector3(0, 100, 0));

    scene.add(planta);
    scene.add(camera);
}

function updateAspectRatio() {
    // Update camera's aspectRatio

    // Adjust canvas size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Aspect ratio
    var aspectRatio = window.innerWidth / window.innerHeight;
    
    // Perspective camera
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

function keyDown(event) {
    // Detect x-axis movement
    if (event.keyCode == 37 || event.keyCode == 65) {
        upPressed = true;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        downPressed = true;
    }
    // Detect z-axis movement
    if (event.keyCode == 38 || event.keyCode == 65) {
        leftPressed = true;
    }
    if (event.keyCode == 40 || event.keyCode == 65) {
        rightPressed = true;
    }
    if (event.keyCode == 32) {
        jumpPressed = true;
    }

    if (upPressed ^ downPressed)    {moveY = (upPressed ? 1 : -1);}
    if (rightPressed ^ leftPressed) {moveX = (rightPressed ? 1 : -1);}
    if (upPressed && downPressed)   {moveY = 0;}
    if (rightPressed && leftPressed){moveX = 0;}
}

function keyUp(event) {
    // Detect x-axis movement
    if (event.keyCode == 37 || event.keyCode == 65) {
        upPressed = false;
    }
    if (event.keyCode == 39 || event.keyCode == 68) {
        downPressed = false;
    }
    // Detect z-axis movement
    if (event.keyCode == 38 || event.keyCode == 65) {
        leftPressed = false;
    }
    if (event.keyCode == 40 || event.keyCode == 65) {
        rightPressed = false;
    }
    if (event.keyCode == 32) {
        jumpPressed = false;
    }

    if (!upPressed && !downPressed)         {moveY = 0;} 
    else if (upPressed && !downPressed)     {moveY = 1;}
    else                                    {moveY = -1;}
    if (!rightPressed && !leftPressed)      {moveX = 0;}
    else if (rightPressed && !leftPressed)  {moveX = 1;}
    else                                    {moveX = -1;}
}

function update() {
    var seconds = clock.getDelta();	// tiempo en segundos que ha pasado
	world.step(seconds);

    // Frame variation during each frame
    var ahora = Date.now();
	earth_angle += 0.1 * 2*Math.PI * (ahora-antes)/1000;	// Incrementar el angulo en 360Âº / sg
    antes = ahora;

    // Earth rotation
    earth.position.x = distance*Math.sin(-earth_angle/28);
    earth.position.z = -distance*Math.cos(earth_angle/28);
    earth.rotation.x = 0;
    earth.rotation.y = earth_angle;
    earth.rotation.x = AXIAL_TILT;

    // Player rotation
    //var bodyUp = (moon.body.position-player.body.position).normalize();  // Vec3
    var bodyUp = new CANNON.Vec3(player.body.position.x, player.body.position.y, player.body.position.z).normalize()
    var gravityUp = new CANNON.Quaternion();
    gravityUp.setFromEuler(bodyUp, 'XYZ');
    //gravityUp.normalize();

    player.body.rotation = gravityUp;    
    player.visual.rotation.copy(player.body.rotation);

    // Player gravitational pull
    var forceX = player.body.position.x * gravity;
    var forceY = player.body.position.y * gravity;
    var forceZ = player.body.position.z * gravity;
    player.body.applyForce(new CANNON.Vec3(forceX, forceY, forceZ), player.body.position);

    // Player
    moveDir = new CANNON.Vec3(moveX, 0, moveY).normalize();
    //player.body.position += moveDir * moveSpeed;
    moveDir.x *= moveDir.x * moveSpeed * 100;
    moveDir.z *= moveDir.z * moveSpeed * 100;
    //console.log(moveDir.x, moveDir.y, moveDir.z);
    //player.body.applyLocalForce(new CANNON.Vec3(moveDirX, 0, moveDirZ), player.body.position);
    //newPosition = new CANNON.Vec3(0, 0, 0);
    player.body.pointToLocalFrame(moveDir, moveDir);
    console.log(moveDir)
    //player.body.position.set(moveDir.x, moveDir.y, moveDir.z);
    //console.log(moveDir.x, moveDir.z);
    //player.body.position
    player.visual.position.copy(player.body.position);

    // Player jump    
    if (jumpPressed) {
        var r = Math.pow(player.body.position.x, 2);
        r += Math.pow(player.body.position.y, 2);
        r += Math.pow(player.body.position.z, 2);
        r = Math.sqrt(r);
        console.log(r);
        if (r < 184) {
            forceX = forceX * -30;
            forceY = forceY * -30;
            forceZ = forceZ * -30;
            player.body.applyForce(new CANNON.Vec3(forceX, forceY, forceZ), player.body.position);
        }         
    }
    
	// Control de camra
	cameraControls.update();
	// Actualiza los FPS
	stats.update();
}

function render() {
    // Build and show each frame
    requestAnimationFrame(render);
    update();
    renderer.clear();


    var aspectRatio = window.innerWidth / window.innerHeight;
    var side;
    if (aspectRatio > 1) {
        side = window.innerHeight / 4;
    } else {
        side = window.innerWidth / 4;
    }
    renderer.setViewport(0, 0, side, side);
    renderer.render(scene, planta);

	renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}
