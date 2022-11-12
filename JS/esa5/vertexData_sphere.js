// code from https://observablehq.com/@mourner/fast-icosphere-mesh

var icosphere = (function() {
    function createVertexData() {

        let order = document.getElementById("subdivision").value;
        const f = (1 + 5 ** 0.5) / 2;
        const T = 4 ** order;

        var vertices = new Float32Array((10 * T + 2) * 3);
        vertices.set(Float32Array.of(
            -1, f, 0, 
            1, f, 0, 
            -1, -f, 0, 
            1, -f, 0, 
            0, -1, f, 
            0, 1, f, 
            0, -1, -f, 
            0, 1, -f, 
            f, 0, -1, 
            f, 0, 1, 
            -f, 0, -1, 
            -f, 0, 1));

        this.indicesTris = new Uint16Array(60);
        this.indicesTris.set(Uint16Array.of(
            0, 11, 5, 
            0, 5, 1, 
            0, 1, 7, 
            0, 7, 10, 
            0, 10, 11, 
            11, 10, 2, 
            5, 11, 4, 
            1, 5, 9, 
            7, 1, 8, 
            10, 7, 6, 
            3, 9, 4, 
            3, 4, 2, 
            3, 2, 6, 
            3, 6, 8, 
            3, 8, 9, 
            9, 8, 1, 
            4, 9, 5, 
            2, 4, 11, 
            6, 2, 10, 
            8, 6, 7));

        this.indicesLines = new Uint16Array(60);
        this.indicesLines.set(Uint16Array.of(
            0, 1,
            0, 5,
            0, 7,
            0, 10,
            0, 11,
            1, 5,
            1, 7,
            1, 8,
            1, 9,
            2, 3,     
            2, 4, 
            2, 6,
            2, 10, 
            2, 11,
            3, 9,
            3, 4,
            3, 6, 
            3, 8,
            4, 5,
            4, 9, 
            4, 11, 
            5, 9,
            5, 11,
            6, 10,
            6,7,
            6,8,
            7,10,
            7,8,
            8,9,
            10, 11,
            )); 

        function calculateNormals(vertices){
            const normals = []
            for (let i = 0; i < vertices.length/3; i++){
                verteciesLength = Math.sqrt(vertices[i] ** 2 + vertices[i+1] ** 2 + vertices[i+2] ** 2);
                const normX = vertices[i] / verteciesLength;
                const normY = vertices[i+1] / verteciesLength;
                const normZ = vertices[i+2] / verteciesLength;
                normals.push(normX, normY, normZ);
            }
            return normals;
        }

        var v = 12
        const midCache = order ? new Map() : null; // midpoint vertices cache to avoid duplicating shared vertices

        function addMidPoint(a, b) {
        const key = Math.floor((a + b) * (a + b + 1) / 2) + Math.min(a, b); // Cantor's pairing function
        let i = midCache.get(key);
        if (i !== undefined) { midCache.delete(key); return i; }
        midCache.set(key, v);
            for (let k = 0; k < 3; k++) {
                vertices[3*v + k] = (vertices[a*3 + k] + vertices[b*3 + k])/2;
                }
            i = v++;
            return i;
          }

 

        for (let i = 0; i < order; i++) {
          // subdivide each triangle into 4 indicesTris
          newIndicesTris = [];
          newIndicesLines = [];
          for (let k = 0; k < this.indicesTris.length; k += 3) {
            const v1 = this.indicesTris[k + 0];
            const v2 = this.indicesTris[k + 1];
            const v3 = this.indicesTris[k + 2];
            const a = addMidPoint(v1, v2);
            const b = addMidPoint(v2, v3);
            const c = addMidPoint(v3, v1);

            newIndicesTris.push(v1); newIndicesTris.push(a); newIndicesTris.push(c);
            newIndicesTris.push(v2); newIndicesTris.push(b); newIndicesTris.push(a);
            newIndicesTris.push(v3); newIndicesTris.push(c); newIndicesTris.push(b);
            newIndicesTris.push(a);  newIndicesTris.push(b); newIndicesTris.push(c);

            newIndicesLines.push(v1);newIndicesLines.push(a);
            newIndicesLines.push(a);newIndicesLines.push(v2);
            newIndicesLines.push(v2);newIndicesLines.push(b);
            newIndicesLines.push(b);newIndicesLines.push(v3);
            newIndicesLines.push(v3);newIndicesLines.push(c);
            newIndicesLines.push(c);newIndicesLines.push(v1);
            newIndicesLines.push(a);newIndicesLines.push(b);
            newIndicesLines.push(b);newIndicesLines.push(c);
            newIndicesLines.push(c);newIndicesLines.push(a);

          }

          this.indicesTris = new Uint16Array(newIndicesTris);
          this.indicesLines = new Uint16Array(newIndicesLines);
        }

        
        //normalize vertices
        for (let i = 0; i < vertices.length; i += 3) {
            const m = 1 / Math.hypot(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
            vertices[i + 0] *= m;
            vertices[i + 1] *= m;
            vertices[i + 2] *= m;
          }

        this.normals = new Float32Array(vertices);
        this.vertices = new Float32Array(vertices)   
    }
    return {
        createVertexData: createVertexData
    }

}());