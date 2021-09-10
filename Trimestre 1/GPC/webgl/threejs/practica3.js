/*
Lab 3 GPC. Camera movement
*/ 

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

// Other global variables
var angle = 0;
var l = b = -100;
var r = t = -l;
var cameraControls;
var planta;

// Actions when the body and this script is loaded
init();
loadScene();
render();

function init() {
    // Configure the renderer and the canvas
    renderer = new THREE.WebGLRenderer();
    // Using full size of the window
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(0x6495ED));
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

    // Event capture
    window.addEventListener('resize', updateAspectRatio);
}

function loadScene() {
    // Build scene graph

    // Materials
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xF0F8FF,
                                                    wireframe: true});
    var baseMaterial = new THREE.MeshBasicMaterial({color: 0x9400D3,
                                                    wireframe: true});
    var detailMaterial = new THREE.MeshBasicMaterial({color: 0xFF7F50,
                                                    wireframe: true});
    
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
        
        new THREE.Face3(6, 9, 10),
        new THREE.Face3(6, 10, 5),
        
        new THREE.Face3(9, 10, 11),
        new THREE.Face3(9, 11, 8),
        
        new THREE.Face3(4, 11, 5),
        new THREE.Face3(5, 11, 10),
    );

    // Objects
    var plane = new THREE.Mesh(geoPlane, planeMaterial);
    var base = new THREE.Mesh(geoBase, baseMaterial);

    var axis = new THREE.Mesh(geoAxis, baseMaterial);
    var asparagus = new THREE.Mesh(geoAsparagus, detailMaterial);
    var kneecap = new THREE.Mesh(geoKneecap, baseMaterial);
    
    var disc = new THREE.Mesh(geoDisc, baseMaterial);
    var hand = new THREE.Mesh(geoHand, baseMaterial);
    var nerve1 = new THREE.Mesh(geoNerve, detailMaterial);
    var nerve2 = nerve1.clone();
    var nerve3 = nerve1.clone();
    var nerve4 = nerve1.clone();
    var clampL = new THREE.Mesh(geoClamp, detailMaterial)
    var clampR = clampL.clone()

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
    plane.rotation.x = Math.PI/2;

    scene.add(robot);
    scene.add(plane);

    // Organize scene graph
    scene.add(new THREE.AxesHelper((1000, 1000, 1000)));
}

function setCameras(aspectRatio) {
    // Construct cameras planta, alzado and pefil
    var origin = new THREE.Vector3(0, 0, 0); 

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
    var perspectiveCamera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1500);
    perspectiveCamera.position.set(200, 300, 450);    
    perspectiveCamera.lookAt(new THREE.Vector3(0, 100, 0));
    camera = perspectiveCamera.clone();

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

function update() {
    // Frame variation during each frame
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