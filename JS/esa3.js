
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
    'gl_Position = vec4(pos*0.1, 1);'+
'gl_PointSize = 10.0; }';
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

function joinGeometry(object1, object2){
    for (let i = 0; i < object1.indices.length; i++){
        object2.indices.push(object1.indices[i]+ object2.vertices.length/2)
        //object2.indices[i] = object2.indices[i] + (circle.vertices.length/2);
        //object2.indices.unshift(object1.indices[i])
    }
    object2.vertices = object2.vertices.concat(object1.vertices);
    object2.color = object2.color.concat(object1.color);
}

function increaseHue(color, step){
    for (let i = 0; i < 4; i++){
        if(color[i] != 0){
            color[i] = color[i]+ step;
        }
    }
    return color;
}


class Circle {
    constructor(radius, segments, origin) {
        this.radius = radius;
        this.segments = segments;
        this.origin = origin;
        this.vertices = [];
        this.indices = [];
        this.color = [];
        this.makeVerticies();
        this.makeInices();
      }
    makeVerticies(){
        var stepSize = 360/this.segments;
        let degree = stepSize;
        var iterations = this.segments*2;

        for(let i = 0; i < iterations; i= i+2){
            this.vertices[i] = this.radius*Math.cos(degreeToRadians(degree))+this.origin[0];
            this.vertices[i+1] = this.radius*Math.sin(degreeToRadians(degree))+this.origin[1];
            degree = degree+stepSize;
            
        }
        this.vertices.unshift(0+this.origin[1]);
        this.vertices.unshift(0+this.origin[0]);
        return this.vertices;
        }
    

    colorize(color1, color2){
        this.color = this.color.concat(color1);
        for(let i = 0; i < this.segments; i++){
            this.color = this.color.concat(color2);
        }
        return this.color;
    }

    makeInices(){
        for(let i = 1; i < this.vertices.length/2 -1; i++){
            this.indices.push(0);
            this.indices.push(i);
            this.indices.push(i+1);
        }
        this.indices.push(0);
        this.indices.push(this.indices[this.indices.length - 2]);
        this.indices.push(this.indices[1]);
        
        return this.indices;
    }
}

function makeGeomety(steps, startColor1, startColor2){
    let segments = 4;
    let radius = 1;
    let origin = [0,0]
    var circle = new Circle(radius, segments, origin)
    circle.colorize(startColor1, startColor2);
    for (let i = 0; i < steps; i = i+2 ){
        startColor1 = increaseHue(startColor1, 0.1);
        startColor2 = increaseHue(startColor2, 0.1);
        radius = radius + 0.7;
        origin[0] = origin[0]+1;
        origin[1] = origin[1]+1;
        segments = segments*2;
        var newCircle = new Circle(radius, segments, origin);
        newCircle.colorize(startColor1, startColor2);
        var newCircle1 = new Circle(radius, segments,[origin[0]*-1, origin[1]*-1]);
        newCircle1.colorize(startColor1, startColor2);
        var newCircle2 = new Circle(radius, segments,[origin[0], origin[1]*-1]);
        newCircle2.colorize(startColor1, startColor2);
        var newCircle3 = new Circle(radius, segments,[origin[0]*-1, origin[1]]);
        newCircle3.colorize(startColor1, startColor2);
        joinGeometry(circle,newCircle);
        joinGeometry(newCircle,newCircle1);
        joinGeometry(newCircle1, newCircle2);
        joinGeometry(newCircle2, newCircle3);
        circle = newCircle3;
    }
    return circle;
}

var geo = makeGeomety(8,[1,.1,.1,1], [.1,.1,1,1] );

// Vertex data.
var vertices = new Float32Array(geo.vertices);
// Index data.
var indices = new Uint16Array(geo.indices);
// Color data
var colors = new Float32Array(geo.color);     



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
//gl.drawElements(gl.POINTS, ibo.numerOfEmements, 
    //gl.UNSIGNED_SHORT, 0); 