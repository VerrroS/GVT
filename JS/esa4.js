
// get the form
const schema = document.getElementById("schema");
const form = document.getElementById("form");
var lines = false;
var eigene = false;

// Get the WebGL context.
var canvas = document.getElementById('webglcanvas');
var gl = canvas.getContext('experimental-webgl');


//////////////// Functions ////////////////////

function creategradient(x, step){
    if (x < 1){
        x = x + step;
    }
    else {
        x = 0;
    }
    return x;
}


function changeType(e){
    if (e.target.value == 'linien'){
        lines = true;
    }
    else if (e.target.value == 'color'){
        lines = false;
    }
    else if (e.target.value == 'eigene'){
        eigene = true;
    }
    else {
        eigene = false;
    }
    drawWebGL(lines, eigene)
}


function drawWebGL(lines){
    // Pipeline setup.
    gl.clearColor(0, 0, 0, .85);
    // Backface culling.
    //gl.frontFace(gl.CCW);
    //gl.enable(gl.CULL_FACE);
    //gl.cullFace(gl.BACK);

    // Depth(Z)-Buffer.
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // Polygon offset of rastered Fragments.
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0, 1.0);


    // Compile vertex shader. 
    var vsSource = '' + 
        'attribute vec3 pos;' + 
        'attribute vec4 col;' + 
        'varying vec4 color;' + 
        'void main(){' + 'color = col;' + 
        'gl_Position = vec4(pos *0.1, 1);' +
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


    if (!eigene){
        // Fill the data arrays.
        createVertexData_Knot();
            
        // Vertex data.
        // Positions, Index data.
        var vertices, indicesLines, indicesTris, colors;

        // Setup position vertex buffer object.
        var vboPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
        gl.bufferData(gl.ARRAY_BUFFER,
        vertices, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        var posAttrib = gl.getAttribLocation(prog, 'pos');
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
        false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);

        // Setup color vertex buffer object.

        var vboCol = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        var colAttrib = gl.getAttribLocation(prog, 'col');
        gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colAttrib);

        // Clear framebuffer and render primitives.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        


        if(!lines){

            // Setup tris index buffer object.
            var iboTris = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesTris, gl.STATIC_DRAW);
            iboTris.numberOfElements = indicesTris.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering tris.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES,
            iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }
        else {

            // Setup lines index buffer object.
            var iboLines = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesLines, gl.STATIC_DRAW);
            iboLines.numberOfElements = indicesLines.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering lines.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.drawElements(gl.LINES,
            iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }

        function createVertexData_Knot(){
            var n = 300;
            var m = 32;

            var R1 = 8;
            var R2 = 2;
            var r = 0.5;
            var p = 12;
            var q = 5;
            
            // Positions.
            vertices = new Float32Array(3*(n+1)*(m+1));
            colors_ = [];
            // Index data.
            indicesLines = new Uint16Array(2 * 2 * n * m);
            indicesTris  = new Uint16Array(3 * 2 * n * m);

            var dt = 2*Math.PI/n;
            var dr = 2*Math.PI/m;
            // Counter for entries in index array.
            var iLines = 0;
            var iTris = 0;
            var iColor = 0;
            var xColor = 0;
            

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

                    xColor = creategradient(xColor, 0.0003)

                    if (!lines){
                        colors_[iColor ] = xColor;
                        colors_[iColor + 1] = xColor;
                        colors_[iColor + 2] = xColor;
                        colors_[iColor + 3] = 1;
                        iColor = iColor+ 4;
                    }
                    else {
                        colors_[iColor ] = 0.2;
                        colors_[iColor + 1] = 0.2;
                        colors_[iColor + 2] =  0.2;
                        colors_[iColor + 3] = 1;
                        iColor = iColor+ 4;
                    } 

                    // Set index.
                    // Line on beam.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - 1;
                        indicesLines[iLines++] = iVertex;
                    }
                    // Line on ring.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - (m+1);                            
                        indicesLines[iLines++] = iVertex;
                    }

                    // Set index.
                    // Two Triangles.
                    if(j>0 && i>0){
                        indicesTris[iTris++] = iVertex;
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1);
                        //        
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1) - 1;
                        indicesTris[iTris++] = iVertex - (m+1);    
                    }

                }
            }
            colors = new Float32Array(colors_)
        }    

        ///////////////////////////Torus////////////////////////////////////

        // Fill the data arrays.
        createVertexData_Torus();

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

        // // Setup color vertex buffer object.
        var vboCol = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        var colAttrib = gl.getAttribLocation(prog, 'col');
        gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colAttrib);
        
        if(!lines){

            // Setup tris index buffer object.
            var iboTris = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesTris, gl.STATIC_DRAW);
            iboTris.numberOfElements = indicesTris.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering tris.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES,
            iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }
        else {

            // Setup lines index buffer object.
            var iboLines = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesLines, gl.STATIC_DRAW);
            iboLines.numberOfElements = indicesLines.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering lines.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.drawElements(gl.LINES,
            iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }

        function createVertexData_Torus(){
            var n = 32;
            var m = 32;

            var r = 1;
            var R = 8;
            // Positions.
            vertices = new Float32Array(3 * (n+1) * (m+1));
            colors_ = [];
            // Index data.
            indicesLines = new Uint16Array(2 * 2 * n * m);
            indicesTris  = new Uint16Array(3 * 2 * n * m);

            var dt = 2*Math.PI/n;
            var dr = 2*Math.PI/m;
            // Counter for entries in index array.
            var iLines = 0;
            var iTris = 0;
            var iColor = 0;
            // Loop angle t.
            for(var i=0, u=0; i <= n; i++, u += dt) {
                // Loop radius r.
                for(var j=0, v =0; j <= m; j++, v += dr){

                    var iVertex = i*(m+1) + j;

                    var x = (R + r * Math.cos(v)) * Math.cos(u);
                    var y = (R + r * Math.cos(v)) * Math.sin(u);
                    var z = r * Math.sin(v);

                    // Set vertex positions.
                    vertices[iVertex * 3] = x;
                    vertices[iVertex * 3 + 1] = y;
                    vertices[iVertex * 3 + 2] = z;

                    colors_[iColor ] = 1;
                    colors_[iColor + 1] = 0.3;
                    colors_[iColor + 2] = 0.5;
                    colors_[iColor + 3] = 1;
                    iColor = iColor + 4;

                    
                    // Set index.
                    // Line on beam.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - 1;
                        indicesLines[iLines++] = iVertex;
                    }
                    // Line on ring.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - (m+1);                            
                        indicesLines[iLines++] = iVertex;
                    }
                    
                    // Set index.
                    // Two Triangles.
                    if(j>0 && i>0){
                        indicesTris[iTris++] = iVertex;
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1);
                        //        
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1) - 1;
                        indicesTris[iTris++] = iVertex - (m+1);    
                    }
                }
            }
            colors = new Float32Array(colors_)

        }
    }
    else {
        createVertexData_Schleife();
            
        // Vertex data.
        // Positions, Index data.
        var vertices, indicesLines, indicesTris, colors;

        // Setup position vertex buffer object.
        var vboPos = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
        gl.bufferData(gl.ARRAY_BUFFER,
        vertices, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        var posAttrib = gl.getAttribLocation(prog, 'pos');
        gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT,
        false, 0, 0);
        gl.enableVertexAttribArray(posAttrib);

        // Setup color vertex buffer object.

        var vboCol = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCol);
        gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
        // Bind vertex buffer to attribute variable.
        var colAttrib = gl.getAttribLocation(prog, 'col');
        gl.vertexAttribPointer(colAttrib, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(colAttrib);

        // Clear framebuffer and render primitives.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        


        if(!lines){

            // Setup tris index buffer object.
            var iboTris = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesTris, gl.STATIC_DRAW);
            iboTris.numberOfElements = indicesTris.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering tris.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
            gl.drawElements(gl.TRIANGLES,
            iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }
        else {

            // Setup lines index buffer object.
            var iboLines = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            indicesLines, gl.STATIC_DRAW);
            iboLines.numberOfElements = indicesLines.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

            // Setup rendering lines.
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
            gl.drawElements(gl.LINES,
            iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
        }

        function createVertexData_Schleife(){
            var n = 64;
            var m = 32;

            var h = 10;

            // Positions.
            vertices = new Float32Array(3*(n+1)*(m+1));
            colors_ = [];
            // Index data.
            indicesLines = new Uint16Array(2 * 2 * n * m);
            indicesTris  = new Uint16Array(3 * 2 * n * m);

            var dt = 2*Math.PI/n;
            var dr = 1/m;
            // Counter for entries in index array.
            var iLines = 0;
            var iTris = 0;
            var iColor = 0;
            var xColor = 0;
        

            // Loop angle u.
            for(var i=0, u=0; i <= n; i++, u += dt) {

                // Loop radius v.
                for(var j=0, v=0; j <= m; j++, v += dr){

                    var iVertex = i*(m+1) + j;

                    var x = ((h * Math.cos(v)) * Math.cos(u)) * Math.cos(v)* Math.sin(u);
                    var y = ((h * Math.cos(v)) * Math.sin(u));
                    var z = 0;

                    // Set vertex positions.
                    vertices[iVertex * 3] = x;
                    vertices[iVertex * 3 + 1] = y;
                    vertices[iVertex * 3 + 2] = z;

                    xColor = creategradient(xColor, 0.0003)

                    if (!lines){
                        colors_[iColor ] = .5;
                        colors_[iColor + 1] = 0;
                        colors_[iColor + 2] =  xColor;
                        colors_[iColor + 3] = 1;
                        iColor = iColor+ 4;
                    }
                    else {
                        colors_[iColor ] = 0.7;
                        colors_[iColor + 1] = 0.7;
                        colors_[iColor + 2] =  0.7;
                        colors_[iColor + 3] = 1;
                        iColor = iColor+ 4;
                    } 

                    // Set index.
                    // Line on beam.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - 1;
                        indicesLines[iLines++] = iVertex;
                    }
                    // Line on ring.
                    if(j>0 && i>0){
                        indicesLines[iLines++] = iVertex - (m+1);                            
                        indicesLines[iLines++] = iVertex;
                    }

                    // Set index.
                    // Two Triangles.
                    if(j>0 && i>0){
                        indicesTris[iTris++] = iVertex;
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1);
                        //        
                        indicesTris[iTris++] = iVertex - 1;
                        indicesTris[iTris++] = iVertex - (m+1) - 1;
                        indicesTris[iTris++] = iVertex - (m+1);    
                    }

                }
            }
            colors = new Float32Array(colors_)
        }    

    }
}


drawWebGL(lines);
////////////////////////////////////

schema.addEventListener("change", changeType);
form.addEventListener("change", changeType);