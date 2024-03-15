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
        alert(
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
        alert(
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

    background.context.drawArrays(background.context.TRIANGLE_STRIP, 0, 6);
    window.requestAnimationFrame(redraw)
}

function runBackground() {
    gl = background.context;
    let program = __program(background.context,
        `#version 300 es
        layout(location = 0) in vec2 aVertexPosition;
        layout(location = 1) in vec3 aVertexNfo;
        uniform float time;
        uniform float darkmode;
        out vec3 vColor;
        void main() {
            vec2 offset = vec2(sin(aVertexNfo.x * 0.01 * time), cos(aVertexNfo.x * 0.02124521 * time));
            gl_Position = vec4(aVertexPosition + offset, 0.0, 1.0);
            vec3 base = vec3(0.5 + darkmode * -0.48);
            float tint = sin(aVertexNfo.y * 0.1351256 * time) * 0.5 + 0.5;
            float white = sin(aVertexNfo.y * 0.2756132 * time) * 0.5 + 0.5;
            if (darkmode > 0.0) {
                vColor = base + vec3(tint * 0.12, tint * -0.04, (1.0 - tint) * 0.25) + vec3(white, white, white) * 0.08;
            }
            else {
                vColor = base + vec3(tint * -0.12, tint * 0.04, (1.0 - tint) * 0.1) - vec3(white, white, white) * 0.19;
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
        -2.0,  2.0, 10.16633,  1.45286,  0.0, // A       A----C----E  +1
        -2.0, -2.0, 14.82547,  1.36477,  0.0, // B       |   /|   /|
         0.0,  2.0, 13.59673,  1.82846,  0.0, // C       |  / |  / |
         0.0, -2.0, 11.98261,  1.14568,  0.0, // D       | /  | /  |
         2.0,  2.0, 15.06385,  1.02359,  0.0, // E       |/   |/   |
         2.0, -2.0, 12.93576,  1.62866,  0.0, // F   -1  B----D----F
    ]), gl.STATIC_DRAW);
    
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, "aVertexPosition"),
        2,
        gl.FLOAT,
        false,
        4 * 5,
        4 * 0,
    );
    gl.enableVertexAttribArray(gl.getAttribLocation(program, "aVertexPosition"));
    gl.vertexAttribPointer(
        gl.getAttribLocation(program, "aVertexNfo"),
        3,
        gl.FLOAT,
        false,
        4 * 5,
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
