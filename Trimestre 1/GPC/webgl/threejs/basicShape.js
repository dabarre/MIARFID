/*
Seminario 2 GPC. Basic Shapes
Draw basic shapes and imported models
Shows the tipical loop for initialization, scene and render  
*/ 

// Common variables to all scripts (motor, escena y camara)
var renderer, scene, camera;

// Other global variables
var cubeSphere, angle = 0;

// Actions when the body and this script is loaded
init();
loadScene();
render();

function init() {
    // Configure the renderer and the canvas
    renderer = new THREE.WebGLRenderer();
    // Using full size of the window
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( new THREE.Color(0xE64DE6));

    document.getElementById("container").appendChild(renderer.domElement);

    // Scene - data structure grafo aciclico dirigido
    scene = new THREE.Scene();

    // Camera
    var aspectRatio = window.innerWidth / window.innerHeight;
    // angleVision, aspectRatio, minVisionPosition, maxVisionPosition
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 100);

    scene.add(camera);

    camera.position.set(0.5, 2, 5);
    camera.lookAt(new THREE.Vector3(0,0,0));
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
    cubeSphere.position.y = 0.5;
    cubeSphere.rotation.y = angle;

    // Imported models
    var loader = new THREE.ObjectLoader3D();
    loader.load('models/soldado/soldado.json',
                    function(obj){
                        obj.position.set(0, 1, 0);
                        cubo.add(obj);
                    });

    // Organize scene graph
    scene.add(new THREE.AxisHelper((3, 3, 3)));
    //scene.add(cube);
    //scene.add(sphere)
    cubeSphere.add(cube);
    cubeSphere.add(sphere);
    scene.add(cubeSphere);
}

function update() {
    // Frame variation during each frame
    angle += Math.PI/100;

}

function render() {
    // Build and show each frame
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}