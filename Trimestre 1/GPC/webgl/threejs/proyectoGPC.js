/*
Proyecto GPC - Dice roller
*/ 

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

var world
var clock

var path = "images/";
var cameraControls;
var effectController;
var dices = [];

var jumpPressed = false;

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
var spaceSuit;

earth_radius *= scale;
moon_radius *= scale;
distance *= scale**2;

var players = [];
var extra_dist = 20;
var positions = [[moon_radius+extra_dist, 0, 0], [0, moon_radius+extra_dist, 0], [0, 0, moon_radius+extra_dist],
                [-moon_radius-extra_dist, 0, 0], [0, -moon_radius-extra_dist, 0], [0, 0, -moon_radius-extra_dist],
                [moon_radius+extra_dist, moon_radius+extra_dist, 0], [-moon_radius-extra_dist, moon_radius+extra_dist, 0], [moon_radius+extra_dist, -moon_radius-extra_dist, 0], [-moon_radius-extra_dist, -moon_radius-extra_dist, 0], 
                [moon_radius+extra_dist, 0, moon_radius+extra_dist], [-moon_radius-extra_dist, 0, moon_radius+extra_dist], [moon_radius+extra_dist, 0, -moon_radius-extra_dist], [-moon_radius-extra_dist, 0, -moon_radius-extra_dist], 
                [0, moon_radius+extra_dist, moon_radius+extra_dist], [0, -moon_radius-extra_dist, moon_radius+extra_dist], [0, moon_radius+extra_dist, -moon_radius-extra_dist], [0, -moon_radius-extra_dist, -moon_radius-extra_dist]];



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

    var cloudTexture = new THREE.TextureLoader().load(path+"earthcloudmaptrans.jpg");
    cloudTexture.magFilter = THREE.LinearFilter;
    cloudTexture.minFilter = THREE.LinearFilter;
    cloudTexture.wrapS = cloudTexture.wrapT = THREE.MirroredRepeatWrapping;

    var spaceTexture = new THREE.TextureLoader().load(path+"space2.jpg");
    spaceTexture.magFilter = THREE.LinearFilter;
    spaceTexture.minFilter = THREE.LinearFilter;
    spaceTexture.wrapS = spaceTexture.wrapT = THREE.MirroredRepeatWrapping;
    spaceTexture.repeat.set(5, 5);

    // Materials       
    var earthMaterial = new THREE.MeshPhongMaterial({color: 'white',
                                                    shininess: 25,
                                                    map: earthTexture});
    var cloudMaterial = new THREE.MeshPhongMaterial({map: cloudTexture,
                                                    side: THREE.DoubleSide,
                                                    opacity: 0.4,
                                                    transparent : true,
                                                    depthWrite: false})
    var spaceMaterial = new THREE.MeshBasicMaterial({color: 'white',
                                                    side: THREE.BackSide,
                                                    map: spaceTexture});
    var sunMaterial = new THREE.MeshPhongMaterial({color: 'white',
                                                    emissive: 0xFFF300});

    // Geometries
    var geoEarth = new THREE.SphereGeometry(earth_radius, 100, 100);
    var geoCloud   = new THREE.SphereGeometry(earth_radius+10, 32, 32)
    var geoSpace = new THREE.SphereGeometry(space_radius, 15, 15);
    var geoSun = new THREE.SphereGeometry(sun_radius, 15, 15 );
    
    // Objects
    earth = new THREE.Mesh(geoEarth, earthMaterial);
    earth.receiveShadow = true;
    earth.castShadow = true;    
    
    var cloud = new THREE.Mesh(geoCloud, cloudMaterial)
    earth.add(cloud)
    
    var space = new THREE.Mesh(geoSpace, spaceMaterial);

    sun = new THREE.Mesh(geoSun, sunMaterial);
    sun.position.set(-4000, 0, -4000);

    scene.add(earth);
    scene.add(space);
    scene.add(sun);

    moon = new create_moon();
    scene.add(moon.visual);
    world.addBody(moon.body);
    
    for (i=0; i<positions.length; i++) {
        players.push(new create_player(positions[i]))
        scene.add(players[i].visual);
        world.add(players[i].body);
    }
    
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
}

function create_player(position) {
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
    this.body.position = new CANNON.Vec3(position[0], position[1], position[2]);
    this.body.linearDamping = this.body.angularDamping = 0.1;
    this.body.addShape(playerShape);

    // Visuals
    var suitTexture = new THREE.TextureLoader().load(path+"spaceSuit.jpg");
    suitTexture.magFilter = THREE.LinearFilter;
    suitTexture.minFilter = THREE.LinearFilter;
    suitTexture.wrapS = suitTexture.wrapT = THREE.MirroredRepeatWrapping;
    suitTexture.repeat.set(2, 2);
    var suitMaterial = new THREE.MeshLambertMaterial({color: 'red',
                                                    map: suitTexture});
    var geoSuit = new THREE.SphereGeometry(10, 10, 10);

    spaceSuit = new THREE.Mesh(geoSuit, suitMaterial);
    spaceSuit.receiveShadow = true;
    spaceSuit.castShadow = true;
    
    this.visual = spaceSuit;
    this.visual.position.copy(this.body.position);
    this.visual.receiveShadow = true;
    this.visual.castShadow = true;   
}

function setupGui()
{
	// Definicion de los controles
	effectController = {
        color: "rgb(255,0,0)",
        reset: function() {
            console.log("reset");
            for (i=0; i<players.length; i++) {
                players[i].body.position.x = positions[i][0];
                players[i].body.position.y = positions[i][1];
                players[i].body.position.z = positions[i][2];
                players[i].visual.position.copy(players[i].body.position);
            }
        }
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
    var h = gui.addFolder("Controller");
    var sensorColor = h.addColor(effectController, "color").name("Color");
	sensorColor.onChange(function(color) {
                            for (i=0; i<players.length; i++) {
                                players[i].visual.material.color = new THREE.Color(color);
                            }
							/*spaceSuit.traverse(function(child) {
                                if( child instanceof THREE.Mesh ) child.material.color = new THREE.Color(color);
							})*/
                        });
    h.add(effectController, "reset").name("Reset");
}

function setCameras(aspectRatio) {
    // Construct cameras planta, alzado and pefil

    // Give planes to the orthogonal camera: left, right, top, bottom, origin
    if (aspectRatio > 1) {
        var orthoCamera = new THREE.OrthographicCamera(l, -l, -l, l, -20, 800);
    } else {
        var orthoCamera = new THREE.OrthographicCamera(l, -l, -l, l, -20, 800);
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

    if (aspectRatio < 1) {
        planta.left = -100;
        planta.right = 100;
        planta.top = 100;
        planta.bottom = -100;
    } else {
        planta.left = -100;
        planta.right = 100;
        planta.top = 100;
        planta.bottom = -100;
    }
    planta.updateProjectionMatrix()
    camera.updateProjectionMatrix();
}

function keyDown(event) {
    if (event.keyCode == 32) {
        jumpPressed = true;
    }
}

function keyUp(event) {
    if (event.keyCode == 32) {
        jumpPressed = false;
    }
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

    // Player gravitational pull
    for (i=0; i<players.length; i++) {
        var forceX = players[i].body.position.x * gravity;
        var forceY = players[i].body.position.y * gravity;
        var forceZ = players[i].body.position.z * gravity;
        players[i].body.applyForce(new CANNON.Vec3(forceX, forceY, forceZ), players[i].body.position);

        // Player jump    
        if (jumpPressed) {
            var r = Math.sqrt(Math.pow(players[i].body.position.x, 2) + Math.pow(players[i].body.position.y, 2) + Math.pow(players[i].body.position.z, 2));
            if (r < 184) {
                forceScalar = -60;
                forceX = forceX * forceScalar;
                forceY = forceY * forceScalar;
                forceZ = forceZ * forceScalar;
                players[i].body.applyForce(new CANNON.Vec3(forceX, forceY, forceZ), players[i].body.position);
            }         
        }
        players[i].visual.position.copy(players[i].body.position);
    }
    
	// Control de camra
	cameraControls.update();
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
