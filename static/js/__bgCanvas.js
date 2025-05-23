const background = {
    element: document.getElementById("bg-canvas"),
    context: document.getElementById("bg-canvas").getContext("webgl2"),
};

function __shader(gl, type, source) {
    console.log("Shader...");
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        );
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function __program(gl, vertex, fragment) {
    console.log("Program...")
    let _vertex = __shader(gl, gl.VERTEX_SHADER, vertex);
    let _fragment = __shader(gl, gl.FRAGMENT_SHADER, fragment);
    let program = gl.createProgram();
    gl.attachShader(program, _vertex);
    gl.attachShader(program, _fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.log(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(
                program,
            )}`,
        );
        return null;
    }
    return program;
}

function redraw() {
    background.context.clear(gl.COLOR_BUFFER_BIT);

    let DT = Date.now() - background.startTime;
    background.context.uniform1f(background.uTime, 0.003 * DT);

    background.context.drawArrays(background.context.TRIANGLE_STRIP, 0, 8);
    window.requestAnimationFrame(redraw)
}

function runBackground() {
    gl = background.context;
    let program = __program(background.context,
        `#version 300 es

        layout(location = 0) in vec2 aVertexPosition;
        layout(location = 1) in vec2 aVertexNfo;

        uniform float time;
        uniform float darkmode;
        
        out vec3 vColor;

        void main() {
            vec2 offset = vec2(sin(aVertexNfo.x * 0.01 * time), cos(aVertexNfo.x * 0.02124521 * time));
            gl_Position = vec4(aVertexPosition + offset * 0.2, 0.0, 1.0);
            vec3 base = vec3(0.5 + darkmode * -0.5);
            float tintR = sin(aVertexNfo.y * 0.1351256 * time) * 0.5 + 0.5;
            float tintG = sin(aVertexNfo.y * 0.1265884 * time) * 0.5 + 0.5;
            float tintB = sin(aVertexNfo.y * 0.1415256 * time) * 0.5 + 0.5;
            float white = sin(aVertexNfo.y * 0.2756132 * time) * 0.3 + 0.5;
            if (darkmode > 0.0) {
                vColor = base + vec3(tintR * 0.12, tintG * -0.04, tintB * 0.25) + vec3(white, white, white) * 0.14;
            }
            else {
                vColor = base - vec3(tintR * 0.16, tintG * 0.12 + 0.07, tintB * 0.06 + 0.12) + vec3(white, white, white) * 0.1;
            }
        }`,
        `#version 300 es
        precision mediump float;
        in vec3 vColor;
        out vec4 FragColor;
        void main() {
            FragColor = vec4(vColor, 1.0);
        }`
    );
    gl.useProgram(program);
    background.shaderProgram = program;
    background.startTime = Date.now() - 12564;

    // raw buffer
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1.2,  1.2, 10.16633,  1.45286,
        -1.2, -1.2, 14.82547,  1.36477,
        -0.4,  1.2, 13.59673,  1.82846,
        -0.4, -1.2, 11.98261,  1.14568,
         0.4,  1.2, 15.06385,  1.02359,
         0.4, -1.2, 12.93576,  1.62866,
         1.2,  1.2, 16.51352,  1.16456,
         1.2, -1.2, 11.21534,  1.47172,
    ]), gl.STATIC_DRAW);
    
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, "aVertexPosition"),
        2,
        gl.FLOAT,
        false,
        4 * 4,
        4 * 0,
    );
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "aVertexPosition"));
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, "aVertexNfo"),
        2,
        gl.FLOAT,
        false,
        4 * 4,
        4 * 2,
    );
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "aVertexNfo"));

    background.uDarkMode = gl.getUniformLocation(program, "darkmode");
    background.uTime = gl.getUniformLocation(program, "time");
    
    gl.uniform1f(background.uDarkMode, 1.0);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    redraw();

}

runBackground();
