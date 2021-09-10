/* 
Seminario 1 PGC. Paint points function
*/

// Vertices shader
var VSHADER_SOURCE =
'attribute vec4 position;                                           \n' +
'precision mediump float;                                           \n' +
'varying vec4 color;                                                \n' +
'void main() {                                                      \n' +
'   gl_Position = position;                                         \n' +
'   gl_PointSize = 10.0;                                            \n' +
'   float i = sqrt(pow(position[0], 2.0) + pow(position[1], 2.0));  \n' +
'   color = vec4(1.0-i, 1.0-i, 1.0-i, 1.0);                         \n' +
'}                                                                  \n';

// Fragments shader
var FSHADER_SOURCE =
'precision mediump float;   \n' +
'varying vec4 color;        \n' +
'void main() {              \n' +
'   gl_FragColor = color;   \n' +
'}                          \n';

function main() {
    // Get canvas where graphics are displayed
    var canvas = document.getElementById("canvas")
        
    if (!canvas) {
        console.log("Error loading canvas");
        return;
    }

    // Get render context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        conlose.log("Error loading the context render");
        return;
    }

    // Load, compile and mount shaders in a 'program'
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("Error loading shaders");
        return;
    }

    // Set clear color
    gl.clearColor(0.0, 0.2, 0.4, 1.0);
    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Localize the attribute in the vertices shader
    var coordinates = gl.getAttribLocation(gl.program, 'position');

    // Register event
    canvas.onmousedown = function(event) {click(event, gl, canvas, coordinates);};

}

// Points drawn array
// Line strips
var points = [];


// Would it be interesting to separate clicking and painting?
function click(event, gl, canvas, coordinates) {
    // Get clicked point muestre un área de dibujo donde el usuario pueda mediante clicks de ratón ir marcando puntos. La aplicación (script en webgl y   shaders) debe dibujar una polilínea y sus vértices conforme el usuario va 
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();

    // Coordinate conversion
    x = ((x - rect.left) - canvas.width / 2) * 2 / canvas.width;
    y = (canvas.height / 2 - (y - rect.top)) * 2 / canvas.height;

    // Save point
    points.push(x);
    points.push(y);
    points.push(0); // Los puntos estan en un espacio 3D

    // Clear canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Ponerlos para que se lean bien
    var vertices = new Float32Array(points)

    var buffer = gl.createBuffer()

    // Preparar buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    // Introducir los puntos a dibujar
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
    gl.vertexAttribPointer(coordinates, 3.0, gl.FLOAT, false, 0.0, 0.0)
    gl.enableVertexAttribArray(coordinates)
    // Dibujar los puntos
    gl.drawArrays(gl.POINTS, 0.0, vertices.length/3)
    // Dibujar las lineas
    gl.drawArrays(gl.LINE_STRIP, 0.0, vertices.length/3)
}