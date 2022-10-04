
var canvas = document.getElementById("webglcanvas");
var gl = canvas.getContext('webgl');

if (!gl) {
    console.log('WebGL not supported, falling back on experimental-webgl');
    gl = canvas.getContext('experimental-webgl');
}

if (!gl) {
    alert('Your browser does not support WebGL');
}

gl.clearColor(0, 0,0 , 0.84);

// Compile a vertex shader
var vsSource = 'attribute vec2 pos;'+
'void main(){ gl_Position = vec4(pos, 0, 1);'+
'gl_PointSize = 10.0; }';
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile a fragment shader
fsSouce =  'void main() { gl_FragColor = vec4(1,1,1,1); }';
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link together into a program
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
	circle.push(circle[0]);
	circle.push(circle[1]);
	return circle;
}

var circle1 = makeCircle(12, 0.1, -120);
var circle2 = makeCircle(12, 0.25, -120);
var circle3 = makeCircle(12, 0.5, -120);


var flower = circle1.concat(circle2, circle3);



function makeLeave (start, height, direction, length){
	var leave = [];
	if (direction == 'r'){
		length = -length
	}

	leave.push(0);
	leave.push(-start);
	leave.push(length);
	leave.push(-start+height);
	leave.push(0);
	leave.push(-start-0.2);
	return leave;
}

flower.push(0);
flower.push(-1);

var leave1 = makeLeave(0.4, 0.1, 'r', 0.2)
var leave2 = makeLeave(0.7, 0.2, 'l', 0.3);

var geo = flower.concat(leave1, leave2);
//var geo = circle1;
console.log(geo);


var vertices = new Float32Array(geo);
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Bind vertex buffer to attribute variable
var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);



// Clear framebuffer and render primitives
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.LINE_STRIP, 0, geo.length/2);
//gl.drawArrays(gl.POINTS, 0, geo.length/2);
