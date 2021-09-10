/* 
Seminario 1 PGC. Paint canvas function
*/

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

        // Set clear color
        gl.clearColor(1.0, 0.0, 0.0, 1.0);
        // Clear canvas
        gl.clear(gl.COLOR_BUFFER_BIT);
}