const vertexTxt =
`#version 300 es

precision mediump float;

in vec2 aVertexPosition;
in vec2 aTextureUV;

out vec2 vTextureUV;

void main()
{
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vTextureUV = aTextureUV;
}
`
const fragmentTxt =
`#version 300 es

precision mediump float;

uniform float uFocusFactor;
uniform float uTextureSizeX;
uniform float uTextureSizeY;

uniform sampler2D uAlbedoTx;
uniform sampler2D uDepthTx;
uniform sampler2D uHighTx;

in vec2 vTextureUV;

out vec4 FragColor;
    
void main()
{
    vec2 texScale = vec2(1.0 / uTextureSizeX, 1.0 / uTextureSizeY);
    int aperture = int(abs(texture(uDepthTx, vTextureUV).r - uFocusFactor) * 10.0); // pixels

    vec3 color = vec3(0.0, 0.0, 0.0);
    
    float pxCount = 0.0;
    for (int i = -aperture; i <= aperture; i++)
    for (int j = -aperture; j <= aperture; j++)
    {
        if (float(abs(i) + abs(j)) > float(aperture) * 1.4) continue;
        vec2 tPos = vTextureUV + vec2(i, j) * texScale;
        color += texture(uAlbedoTx, tPos).rgb * (1.0 + (texture(uHighTx, tPos).r * (float(aperture) + 2.0) * 0.2));
        pxCount += 1.0;
    }
    color = color * (1.0 / pxCount);
    FragColor = vec4(color, 1.0);
}
`

// canvas
const canvas = document.querySelector('#body-background');
const gl = canvas.getContext('webgl2');
if (gl === null) {
    if (document.head.lang === 'es')
        alert("No es posible inicializar WebGL. Es posible que su navegador no lo soprte.");
    else
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
}

let focalDistance = 0.0;
let moveOnMouse = false;
let redrawRequest = true;
window.addEventListener("mousemove", (ev) => {
    redrawRequest = true;
    moveOnMouse = true;
    focalDistance = 1.0 - ev.clientY/ window.innerHeight;
});
window.addEventListener("scroll", (ev) => {
    if (moveOnMouse) return;
    redrawRequest = true;
    focalDistance = (window.scrollY / (document.body.clientHeight - window.innerHeight));
})

function __wglCreateProgram() {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexTxt);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(vertexShader)}`
        );
        gl.deleteShader(vertexShader);
        return null;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentTxt);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(fragmentShader)}`
        );
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log(
            `Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`
        );
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        gl.deleteProgram(shaderProgram);
        return null;
    }

    return shaderProgram;
}

function __loadTexture(gl, imageUrl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0, // Level
        gl.RGBA, // Internal Format
        1, // Width
        1, // Height
        0, // Border
        gl.RGBA, // Source Format
        gl.UNSIGNED_BYTE, // Source Type
        new Uint8Array([0, 0, 0, 255]) // Image Data
    );

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0, // Level
            gl.RGBA, // Internal Format
            gl.RGBA, // Source Format
            gl.UNSIGNED_BYTE, // Source Type
            image
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        redrawRequest = true;
    };

    image.src = imageUrl;
    return texture;
}

function simpleRender() {
    // render alternative background
}

function start() {
    console.log("Rendering started");
    // load textures
    const albTexture = __loadTexture(gl, "/assets/png/render_albedo.png");
    const depthTexture = __loadTexture(gl, "/assets/png/render_depth.png");
    const highTexture = __loadTexture(gl, "/assets/png/render_high.png");

    // create shader program
    const shader = __wglCreateProgram();

    // get locations from the shader
    const aVertexPosition = gl.getAttribLocation(shader, "aVertexPosition");
    const aTextureUV = gl.getAttribLocation(shader, "aTextureUV");
    const uFocusFactor = gl.getUniformLocation(shader, "uFocusFactor");
    const uTextureSizeX = gl.getUniformLocation(shader, "uTextureSizeX");
    const uTextureSizeY = gl.getUniformLocation(shader, "uTextureSizeY");
    const uAlbedoTx = gl.getUniformLocation(shader, "uAlbedoTx");
    const uDepthTx = gl.getUniformLocation(shader, "uDepthTx");
    const uHighTx = gl.getUniformLocation(shader, "uHighTx");

    // create buffers
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const rawData = [
        -1.0, 1.0, 0.0, 0.0, // Left Up
        -1.0, -1.0, 0.0, 1.0, // Left Down
        1.0, -1.0, 1.0, 1.0, // Right Down
        1.0, -1.0, 1.0, 1.0, // Right Down
        1.0, 1.0, 1.0, 0.0, // Right Up
        -1.0, 1.0, 0.0, 0.0, // Left Up
    ]

    // Push data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rawData), gl.STATIC_DRAW);

    // Bind buffer data with shader variables
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 4 * 4, 4 * 0);
    gl.vertexAttribPointer(aTextureUV, 2, gl.FLOAT, false, 4 * 4, 4 * 2);
    gl.enableVertexAttribArray(aVertexPosition);
    gl.enableVertexAttribArray(aTextureUV);

    // Parameters for clear
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.DEPTH_TEST);

    // DRAWING
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(shader);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, albTexture);
    gl.uniform1i(uAlbedoTx, 0);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, depthTexture);
    gl.uniform1i(uDepthTx, 1);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, highTexture);
    gl.uniform1i(uHighTx, 2);

    gl.uniform1f(uFocusFactor, focalDistance);

    gl.uniform1f(uTextureSizeX, 1024.0);
    gl.uniform1f(uTextureSizeY, 1024.0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    console.log("First Frame ok.");
    let drawLoop = () => {
        if (redrawRequest) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
            gl.useProgram(shader);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, albTexture);
            gl.uniform1i(uAlbedoTx, 0);
            gl.activeTexture(gl.TEXTURE1);
            gl.bindTexture(gl.TEXTURE_2D, depthTexture);
            gl.uniform1i(uDepthTx, 1);
            gl.activeTexture(gl.TEXTURE2);
            gl.bindTexture(gl.TEXTURE_2D, highTexture);
            gl.uniform1i(uHighTx, 2);

            gl.uniform1f(uFocusFactor, focalDistance);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            console.log("frame");
            redrawRequest = false;
        }
        requestAnimationFrame(drawLoop)
    };

    drawLoop()

}

if (gl !== null)
    start()
else
    simpleRender()
