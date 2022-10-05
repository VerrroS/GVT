
var canvas = document.getElementById("webglcanvas");
var gl = canvas.getContext('webgl');

if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

// Pipeline setup.
gl.clearColor(0, 0,0 , 0.84);
// Backface culling.
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
//gl.cullFace(gl.FRONT);

// Compile vertex shader.
var vsSource = ''+
'attribute vec3 pos;'+
'attribute vec4 col;'+
'varying vec4 color;'+
'void main(){'+
    'color = col;'+                 
    'gl_Position = vec4(pos, 1);'+
'}';
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile fragment shader.
fsSouce =  'precision mediump float;'+ 
'varying vec4 color;'+
'void main() {'+
    'gl_FragColor = color;'+
'}';
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link shader together into a program.
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

function degreeToRadians($degree)
{
    return $degree * Math.PI / 180;
}

function makeCircle (parts, radius, offset){
	vertecies = parts*2;
	var steps= 360/parts;
	if(!offset){
		offset = 0;
	}
	var degree = steps + offset;
	var circle = [];
	for(let i = 0; i < vertecies; i= i+2){
		circle[i] = radius*Math.cos(degreeToRadians(degree));
		circle[i+1] = radius*Math.sin(degreeToRadians(degree))+0.4;
		degree = degree+steps;
		
	}
    circle.unshift(0+0.4),
    circle.unshift(0)
	return circle;
}

function colorCircle(color1, color2, length){
    var color = [];
    color = color.concat(color1);
    for(let i = 0; i < length; i++){
        color = color.concat(color2);
    }
    return color;
}

function drawCircle(circle){
    var indices = [];
    for(let i = 1; i < circle.length/2; i++){
        indices.push(0);
        indices.push(i);
        indices.push(i+1);
    }
    indices.push(0);
    indices.push(indices[-1]);
    indices.push(indices[1]);
    return indices;
}

var circle = makeCircle(24, 0.5);

// Vertex data.
var vertices = new Float32Array(circle);
// Index data.
var indices = new Uint16Array(drawCircle(circle));


var colors = new Float32Array(colorCircle([1,0,0,1], [0,1,0,1],24));       



// Setup position vertex buffer object.
var vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
// Bind vertex buffer to attribute variable.
var posAttrib = gl.getAttribLocation(prog, 'pos');

gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Setup color vertex buffer object.
var vboCol = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
// Bind vertex buffer to attribute variable.
var colAttrib = gl.getAttribLocation(prog, 'col');
gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colAttrib);

// Setup index buffer object.
var ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, 
    gl.STATIC_DRAW);
ibo.numerOfEmements = indices.length;

// Clear framebuffer and render primitives.
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, ibo.numerOfEmements, 
    gl.UNSIGNED_SHORT, 0);  