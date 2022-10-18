// Get the WebGL context.
var canvas = document.getElementById('webglcanvas');
var gl = canvas.getContext('experimental-webgl');


// Pipeline setup.
gl.clearColor(.95, .95, .95, 1);
// Backface culling.
gl.frontFace(gl.CCW);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);


// Depth(Z)-Buffer.
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL)

// Compile vertex shader. 
var vsSource = '' + 
    'attribute vec3 pos;' + 
    'attribute vec4 col;' + 
    'varying vec4 color;' + 
    'void main(){' + 'color = col;' + 
    'gl_Position = vec4(pos*0.1, 1);' +
    '}';
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

// Compile fragment shader.
fsSouce = 'precision mediump float;' + 
    'varying vec4 color;' + 
    'void main() {' + 
    'gl_FragColor = color;' + 
    '}';
var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSouce);
gl.compileShader(fs);

// Link shader together into a program.
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.bindAttribLocation(prog, 0, "pos");
gl.linkProgram(prog);
gl.useProgram(prog);

// Vertex data.
// Positions, index data.
var vertices, indices;
// Fill the data arrays.
        var n = 150;
createVertexData_TorusKnot();

// Setup position vertex buffer object.
var vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER,
    vertices, gl.STATIC_DRAW);
// Bind vertex buffer to attribute variable.
var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3,
    gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

// Setup constant color.
var colAttrib = gl.getAttribLocation(prog, 'col');
gl.vertexAttrib4f(colAttrib, 0, 1, 0, 1);

// Setup index buffer object.
var ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    indices, gl.STATIC_DRAW);
ibo.numberOfElements = indices.length;

// Clear framebuffer and render primitives.
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawElements(gl.LINE_STRIP,
    ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);

    function createVertexData_TorusKnot(){
        var n = 150;
        var m = 32;

        var R1 = 8;
        var R2 = 2;
        var r = 0.5;
        var p = 12;
        var q = 5;
        
        // Positions.
        vertices = new Float32Array(3*(n+1)*(m+1));
        // Index data for Linestrip.
        indices = new Uint16Array(2 * 2 * n * m);

        var dt = 2*Math.PI/n;
        var dr = 2*Math.PI/m;
        // Counter for entries in index array.
        var iIndex = 0;

        // Loop angle u.
        for(var i=0, u=-2; i <= n; i++, u += dt) {

            // Loop radius v.
            for(var j=0, v=-2; j <= m; j++, v += dr){

                var iVertex = i*(m+1) + j;

                var x = (R1 + R2 * Math.cos(p* u) + r * Math.cos(v)) * Math.cos(q* u)
                var z = r * Math.sin(v) + R2 * Math.sin(p*u)
                var y =(R1 + R2 * Math.cos(p * u) + r * Math.cos(v)) * Math.sin(q * u)

                // Set vertex positions.
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

                // Set index.
                // Line on beam.
                if(j>0 && i>0){
                    indices[iIndex++] = iVertex - 1;
                    indices[iIndex++] = iVertex;
                }

                // Line on ring.
                if(j>0 && i>0){
                    indices[iIndex++] = iVertex-(m+1);
                    indices[iIndex++] = iVertex;
                }
            }
        }
    }

    ////////////////////////Draw Knot //////////////////////////

    
			// Vertex data.
			// Positions, index data.
			var indices;
			// Fill the data arrays.
			createVertexDataHelix();

			// Setup position vertex buffer object.
			var vboPos = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
			gl.bufferData(gl.ARRAY_BUFFER,
				vertices, gl.STATIC_DRAW);
			// Bind vertex buffer to attribute variable.
			var posAttrib = gl.getAttribLocation(prog, 'pos');
			gl.vertexAttribPointer(posAttrib, 3,
				gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(posAttrib);

			// Setup constant color.
			var colAttrib = gl.getAttribLocation(prog, 'col');
			gl.vertexAttrib4f(colAttrib, 1, 0, 0, 1);

			// Setup index buffer object.
			var ibo = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				indices, gl.STATIC_DRAW);
			ibo.numberOfElements = indices.length;

			// Clear framebuffer and render primitives.
			//gl.clear(gl.COLOR_BUFFER_BIT);
			gl.drawElements(gl.LINE_STRIP,
				ibo.numberOfElements, gl.UNSIGNED_SHORT, 0);
				
			function createVertexDataHelix(){
                var n = 32;
                var m = 32;
        
                var r = 1;
                var R = 8;
                // Positions.
                vertices = new Float32Array(3*(n+1)*(m+1));
                // Index data for Linestrip.
                indices = new Uint16Array(2 * 2 * n * m);
        
                var dt = 2*Math.PI/n;
                var dr = 2*Math.PI/m;
                // Counter for entries in index array.
                var iIndex = 0;
        
                // Loop angle u.
                for(var i=0, u=-2; i <= n; i++, u += dt) {
        
                    // Loop radius v.
                    for(var j=0, v=-2; j <= m; j++, v += dr){
        
                        var iVertex = i*(m+1) + j;
        
                        var x = (R + r * Math.cos(v)) * Math.cos(u);
                        var y = (R + r * Math.cos(v)) * Math.sin(u);
                        var z = r * Math.sin(v);
        
                        // Set vertex positions.
                        vertices[iVertex * 3] = x;
                        vertices[iVertex * 3 + 1] = y;
                        vertices[iVertex * 3 + 2] = z;
        
                        // Set index.
                        // Line on beam.
                        if(j>0 && i>0){
                            indices[iIndex++] = iVertex - 1;
                            indices[iIndex++] = iVertex;
                        }
        
                        // Line on ring.
                        if(j>0 && i>0){
                            indices[iIndex++] = iVertex-(m+1);
                            indices[iIndex++] = iVertex;
                        }
                    }
                }
			}						