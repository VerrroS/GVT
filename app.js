
var canvas = document.getElementById("webglcanvas");
var gl = canvas.getContext('webgl');

if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

gl.clearColor(.7, 1, 1, 1.0);

// Compile a vertex shader
var vsSource = 'attribute vec2 pos;'+
'void main(){ gl_Position = vec4(pos, 0, 1);'+
'gl_PointSize = 10.0; }';
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile a fragment shader
fsSouce =  'void main() { gl_FragColor = vec4(0,0,0,1); }';
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link together into a program
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

// Load vertex data into a buffer
var house = [
    0,0,
    3,0,
    0,3,
    3,3,
    1.5,6,
]

var test = [
    0,0.5,
    -0.25,0,
    0.25,0,
    -0.25, -0.5,
    0.25,-0.5
]

var vertices = new Float32Array(test);
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Bind vertex buffer to attribute variable
var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Clear framebuffer and render primitives
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.PONTS, 0, 5);
