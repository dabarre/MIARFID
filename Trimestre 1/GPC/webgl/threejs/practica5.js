/*
Lab 5 GPC. Lights and textures
*/ 

//"use strict";

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

var cameraControls;
var stats;
var effectController;

var upPressed = downPressed = leftPressed = rightPressed = false;

var l = b = -100;
var r = t = -l;
var planta;

var antes = Date.now();

// Actions when the body and this script is loaded
init();
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

    // Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);

    // Camera controller
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.enableKeys = false;

    // Lights
	var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xFFFFFF,0.5);
	pointLight.position.set(-300, 200, -300);
	scene.add(pointLight);

	var spotLight = new THREE.SpotLight(0xFFFFFF,0.5);
	spotLight.position.set(300, 600, 300);
	spotLight.target.position.set(0, 0, 0);
	spotLight.angle = Math.PI/8;
    spotLight.penumbra = 0.2;
    spotLight.shadow.camera.near = 30;
    spotLight.shadow.camera.far = 8000;
    spotLight.shadow.camera.fov = 400;
    spotLight.castShadow = true;
    scene.add(spotLight.target);
	scene.add(spotLight);

    // STATS --> stats.update() en update()
	stats = new Stats();
	stats.setMode( 0 );					// Muestra FPS
	stats.domElement.style.position = 'absolute';		// Abajo izquierda
	stats.domElement.style.bottom = '100px';
	stats.domElement.style.left = '0px';
	document.getElementById( 'container' ).appendChild( stats.domElement );

    // Event capture
    window.addEventListener('resize', updateAspectRatio);
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
}

function loadScene() {
    // Build scene graph

    // Textures
    var path = "images/";
    var floorTexture = new THREE.TextureLoader().load(path+"pisometal_1024x1024.jpg");
    floorTexture.magFilter = THREE.LinearFilter;
	floorTexture.minFilter = THREE.LinearFilter;
	floorTexture.repeat.set(5, 5);
	floorTexture.wrapS = floorTexture.wrapT = THREE.MirroredRepeatWrapping;
    
    var baseTexture = new THREE.TextureLoader().load(path+"metal_128x128.jpg");
    var detailTexture = new THREE.TextureLoader().load(path+"wood512.jpg");

    var walls = [
                    path+'posx.jpg',path+'negx.jpg',
                    path+'posy.jpg',path+'negy.jpg',
                    path+'posz.jpg',path+'negz.jpg'
                ];
    var envMap = new THREE.CubeTextureLoader().load(walls);

    // Materials
    var basicMaterial = new THREE.MeshBasicMaterial({color: 'gray'});
    var floorMaterial = new THREE.MeshLambertMaterial({color: 'white',
                                                        map: floorTexture});
    var baseMaterial = new THREE.MeshLambertMaterial({color: 'white',
                                                        map: baseTexture});
    var detailMaterial = new THREE.MeshLambertMaterial({color: 'white',
                                                        map: detailTexture});
    var shinyMaterial = new THREE.MeshPhongMaterial({color: 'white',
                                                        specular: 'white',
                                                        shininess: 50,
                                                        envMap: envMap});
    
    // Geometries
    var geoPlane = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var geoBase = new THREE.CylinderGeometry(50, 50, 15, 50);
    
    var geoAxis = new THREE.CylinderGeometry(20, 20, 18, 32);
    var geoAsparagus = new THREE.BoxGeometry(18, 120, 12);
    var geoKneecap = new THREE.SphereGeometry(20, 30, 30);

    var geoDisc = new THREE.CylinderGeometry(22, 22, 6, 32);
    var geoHand = new THREE.CylinderGeometry(15, 15, 40, 32);
    var geoNerve = new THREE.BoxGeometry(4, 80, 4);
    
    var geoClamp = new THREE.Geometry();
    geoClamp.vertices.push(
        new THREE.Vector3(-10, -10, -2),
        new THREE.Vector3(-10, -10, 2),
        new THREE.Vector3(-10, 10, 2),
        new THREE.Vector3(-10, 10, -2),
        new THREE.Vector3(9, 10, -2),
        new THREE.Vector3(9, -10, -2),
        new THREE.Vector3(9, -10, 2),
        new THREE.Vector3(9, 10, 2),
        new THREE.Vector3(28, 5, 2),
        new THREE.Vector3(28, -5, 2),
        new THREE.Vector3(28, -5, 0),
        new THREE.Vector3(28, 5, 0),
    );
    geoClamp.faces.push(
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(1, 2, 3),

        new THREE.Face3(0, 6, 1),
        new THREE.Face3(1, 6, 5),
        
        new THREE.Face3(0, 7, 2),
        new THREE.Face3(0, 6, 7),
        
        new THREE.Face3(2, 7, 4),
        new THREE.Face3(2, 4, 3),

        new THREE.Face3(1, 3, 4),
        new THREE.Face3(1, 5, 4),
        
        new THREE.Face3(4, 7, 8),
        new THREE.Face3(4, 8, 11),
        
        new THREE.Face3(6, 9, 8),
        new THREE.Face3(6, 8, 7),
        
        new THREE.Face3(6, 10, 9),
        new THREE.Face3(6, 5, 10),
        
        new THREE.Face3(9, 10, 11),
        new THREE.Face3(9, 11, 8),
        
        new THREE.Face3(4, 11, 5),
        new THREE.Face3(5, 11, 10),
    );

    // Objects
    var plane = new THREE.Mesh(geoPlane, floorMaterial);
    plane.receiveShadow = true;
    var base = new THREE.Mesh(geoBase, baseMaterial);
    base.receiveShadow = true;
    base.castShadow = true;

    var axis = new THREE.Mesh(geoAxis, baseMaterial);
    axis.receiveShadow = true;
    axis.castShadow = true;
    var asparagus = new THREE.Mesh(geoAsparagus, baseMaterial);
    asparagus.receiveShadow = true;
    asparagus.castShadow = true;
    var kneecap = new THREE.Mesh(geoKneecap, shinyMaterial);
    kneecap.receiveShadow = true;
    kneecap.castShadow = true;

    var disc = new THREE.Mesh(geoDisc, detailMaterial);
    disc.receiveShadow = true;
    disc.castShadow = true;
    var hand = new THREE.Mesh(geoHand, detailMaterial);
    hand.receiveShadow = true;
    hand.castShadow = true;
    var nerve1 = new THREE.Mesh(geoNerve, detailMaterial);
    nerve1.receiveShadow = true;
    nerve1.castShadow = true;
    var nerve2 = nerve1.clone();
    nerve2.receiveShadow = true;
    nerve2.castShadow = true;
    var nerve3 = nerve1.clone();
    nerve3.receiveShadow = true;
    nerve3.castShadow = true;
    var nerve4 = nerve1.clone();
    nerve4.receiveShadow = true;
    nerve4.castShadow = true;
    clampL = new THREE.Mesh(geoClamp, basicMaterial)
    clampL.receiveShadow = true;
    clampL.castShadow = true;
    clampR = clampL.clone()
    clampR.receiveShadow = true;
    clampR.castShadow = true;

    // Container object
    robot = new THREE.Object3D();
    arm = new THREE.Object3D();
    foreArm = new THREE.Object3D();
    handContainer = new THREE.Object3D();

    // Transformations the order is not important
    // but a specific order has been stablished Trans <- Rot <- Scal

    //handContainer <- rClamp, lClamp
    clampL.position.z = -15;
    clampR.rotation.x = Math.PI;
    clampR.position.z = 15;
    hand.rotation.x = Math.PI/2;

    handContainer.add(clampL);
    handContainer.add(clampR);
    handContainer.add(hand);    
    handContainer.position.y = 80;

    // foreArm <- disc, nerves, handContainer
    nerve1.position.set(7.5, 40, 7.5);
    nerve2.position.set(-7.5, 40, 7.5);
    nerve3.position.set(-7.5, 40, -7.5);
    nerve4.position.set(7.5, 40, -7.5);

    
    foreArm.add(disc);
    foreArm.add(nerve1);
    foreArm.add(nerve2);
    foreArm.add(nerve3);
    foreArm.add(nerve4);
    foreArm.add(handContainer);
    foreArm.position.y = 120;


    // arm <- axis, asparagus, kneecap, foreArm
    kneecap.position.y = 120;
    asparagus.position.y = 60;
    axis.rotation.x = Math.PI/2;
    
    arm.add(kneecap);
    arm.add(asparagus);
    arm.add(axis);
    arm.add(foreArm);
    
    // base <- arm    
    base.add(arm);

    // robot <- base
    robot.add(base);

    // scene <- plane, base
    plane.rotation.x = -Math.PI/2;
    //plane.position.y = -0.1

    scene.add(robot);
    scene.add(plane);


    // Room
	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = envMap;

	var wallsMaterial = new THREE.ShaderMaterial({
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		uniforms: shader.uniforms,
		depthWrite: false,
		side: THREE.BackSide
	});

	var room = new THREE.Mesh(new THREE.CubeGeometry(1000, 1000, 1000), wallsMaterial);
	scene.add(room);

    // Organize scene graph
    scene.add(new THREE.AxesHelper((1000, 1000, 1000)));
}

function setupGui()
{
	// Definicion de los controles
	effectController = {
		mensaje: 'Control Robot',
		robotAngle: 0,
        armAngle: 0,
        foreArmAngleY: 0,
        foreArmAngleZ: 0,
        clampAngle: 0,
        clampSeparation: 15,
		sombras: true
	};

	// Creacion interfaz
	var gui = new dat.GUI();

	// Construccion del menu
    var h = gui.addFolder("Control Robot");
    h.add(effectController, "robotAngle", -180, 180, 1).name("Robot angle");
    h.add(effectController, "armAngle", -45, 45, 1).name("Arm angle");
    h.add(effectController, "foreArmAngleY", -180, 180, 1).name("Forearm angleY");
    h.add(effectController, "foreArmAngleZ", -90, 90, 1).name("Forearm angleZ");
    h.add(effectController, "clampAngle", -40, 220, 1).name("Clamp angle");
    h.add(effectController, "clampSeparation", 0, 15, 1).name("Clamp separation");
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
    planta.lookAt(0, 0, 0);
    planta.up = new THREE.Vector3(0, 0, -1);

    // angleVision, aspectRatio, minVisionPosition, maxVisionPosition
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1500);
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
    // Detect x-axis movement
    if (event.keyCode == 37 || event.keyCode == 65) {
        upPressed = true;
    }
    else if (event.keyCode == 39 || event.keyCode == 68) {
        downPressed = true;
    }
    // Detect z-axis movement
    if (event.keyCode == 38 || event.keyCode == 65) {
        leftPressed = true;
    }
    else if (event.keyCode == 40 || event.keyCode == 65) {
        rightPressed = true;
    }
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
}

function update() {
    // Frame variation during each frame

    var ahora = Date.now();  

    robot.rotation.y            = effectController.robotAngle * Math.PI/180;
    arm.rotation.z              = effectController.armAngle * Math.PI/180;
    foreArm.rotation.y          = effectController.foreArmAngleY * Math.PI/180;
    foreArm.rotation.z          = effectController.foreArmAngleZ * Math.PI/180;
    handContainer.rotation.z    = effectController.clampAngle * Math.PI/180;
    clampL.position.z           = -2-effectController.clampSeparation;
    clampR.position.z           = 2+effectController.clampSeparation;
    
    if (leftPressed)    robot.position.z -= 5;
    if (rightPressed)   robot.position.z += 5;
    if (upPressed)      robot.position.x -= 5;
    if (downPressed)    robot.position.x += 5;
    
    antes = ahora;  

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