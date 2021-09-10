/*
Seminario 3 GPC Camera
Manage different cameras, marcos and picking
*/

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

// Other global variables
var cubeSphere, angle = 0;
var l = b = -4;
var r = t = -l;
var cameraControls;
var alzado, planta, perfil; // Orthogonal camera

// Actions when the body and this script is loaded
init();
loadScene();
render();

function init() {
    // Configure the renderer and the canvas
    renderer = new THREE.WebGLRenderer();
    // Using full size of the window
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0x0000AA));
    renderer.autoClear = false;

    document.getElementById("container").appendChild(renderer.domElement);

    // Scene - data structure grafo aciclico dirigido
    scene = new THREE.Scene();

    // Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    setCameras(aspectRatio);
    
    scene.add(camera);

    camera.position.set(0.5, 3, 9);
    camera.lookAt(new THREE.Vector3(0,0,0));

    // Camera controller
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
    cameraControls.target.set(0, 0, 0);
    cameraControls.noKeys = true;

    // Event capture
    window.addEventListener('resize', updateAspectRatio);
    render.domElement.addEventListener('dbclick', rotate);
}

function loadScene() {
    // Build scene graph

    // Materials
    var material = new THREE.MeshBasicMaterial({color: 'lightblue',
                                                wireframe: true});
    // Geometries
    var geoCube = new THREE.BoxGeometry(2, 2, 2);
    var geoSphere = new THREE.SphereGeometry(1, 30, 30);
    // Objects
    var cube = new THREE.Mesh(geoCube, material);
    var sphere = new THREE.Mesh(geoSphere, material);

    // PlaneGeometry

    // Transformations the order is not important
    // but a specific order has been stablished Trans <- Rot <- Scal
    cube.position.x = -1;
    cube.rotation.y = Math.PI/4;

    sphere.position.x = 1;

    // Container object
    cubeSphere = new THREE.Object3D();
    cubeSphere.position.y = 1;
    //cubeSphere.rotation.y = angle;

    // Imported models
    var loader = new THREE.ObjectLoader();
    loader.load('models/soldado/soldado.json',
                    function(obj){
                        obj.position.y = 1;
                        cube.add(obj);
                    });

    // Organize scene graph
    cube.add(new THREE.AxisHelper(1));
    cubeSphere.add(cube);
    cubeSphere.add(sphere);
    scene.add(cubeSphere);    
    scene.add(new THREE.AxisHelper(3));
}

function setCameras(aspectRatio) {
    // Construct cameras planta, alzado and pefil
    var origin = new THREE.Vector3(0, 0, 0); 

    // Give planes to the orthogonal camera: left, right, top, bottom, origin
    if (ar > 1) {
        var orthoCamera = new THREE.OrthographicCamera(l*aspectRatio, r*aspectRatio, t, b, -20, 20);
    } else {
        var orthoCamera = new THREE.OrthographicCamera(l, r, t*aspectRatio, b*aspectRatio, -20, 20);
    }
    alzado = orthoCamera.clone()
    alzado.position.set(0, 0, 4);
    alzado.lookAt(origin);
    
    perfil = orthoCamera.clone()
    perfil.position.set(4, 0, 0);
    perfil.lookAt(origin);

    planta = orthoCamera.clone()
    planta.position.set(0, 4, 0);
    planta.lookAt(origin);
    planta .up = new THREE.Vector3(0, 0, -1);

    // angleVision, aspectRatio, minVisionPosition, maxVisionPosition
    var perspectiveCamera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 50);
    perspectiveCamera.position.set(1, 2, 10);
    perspectiveCamera.lookAt(origin);

    camera = perspectiveCamera.clone();

    scene.add(alzado);
    scene.add(perfil);
    scene.add(planta);
    scene.add(camera);

}

function updateAspectRatio() {
    // Update camera's aspectRatio

    // Adjust canvas size
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Aspect ratio
    var aspectRatio = window.innerWidth / window.innerHeight;

    /* Orthogonal camera
    if (aspectRatio > 1) {
        camera.left = -4 * aspectRatio;
        camera.right = 4 * aspectRatio;
        camera.top = 4;
        camera.bottom = -4;
    } else {
        camera.left = -4;
        camera.right = 4;
        camera.top = 4 / aspectRatio;
        camera.bottom = -4 / aspectRatio;
    }
    */
    // Perspective camera
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
}

function rotate(event) {
    // Rotate object by 45º    
    var x = event.clientX;
    var y = eventClientY;

    var right = false, down = false;
    var cam = null;
    
    // Check quadrant
    if (x > window.innerWidth/2) {
        x -= window.innerWidth/2;
        right = True;
    }
    if (y > window.innerHeight/2) {
        y -= window.innerHeight/2;
        down = True;
    }

    if (right) {
        if (down) cam = camera;
        else cam = perfil;
    } else {
        if (down) cam = planta;
        else cam = alzado;
    }

    // Transformation to 2x2 square
    x = (2 * x / window.innerWidth)*2 - 1;
    y = -(2 * y / window.innerHeight)*2 + 1;

    var ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(x, y), cam);

    var intersection = ray.intersectObjects(scene.children);

    if (intersection.length > 0) {
        intersection[0].object.rotation.y += Math.PI / 4;
    }
}

function update() {
    // Frame variation during each frame
}

function render() {
    // Build and show each frame
    requestAnimationFrame(render);
    update();

    // Set a view port for each view
    renderer.setViewport(window.innerHeight/2, 0,
                        window.innerWidth/2, window.innerHeight/2);
    renderer.render(scene, alzado);

    renderer.setViewport(0, window.innerWidth/2,
                        window.innerWidth/2, window.innerHeight/2); 
    renderer.render(scene, perfil);

    renderer.setViewport(0, window.innerWidth/2,
                        window.innerWidth/2, window.innerHeight/2);  
    renderer.render(scene, planta);
        
    renderer.setViewport(window.innerWidth/2, window.innerHeight/2,
                        window.innerWidth/2, window.innerHeight/2); 
    renderer.render(scene, camera);
}