// vertex.glsl

uniform float uTime;
uniform sampler2D uNoise;
uniform float uNumBands;
uniform float uGustMultiplier;
uniform vec3 uLightDir;

uniform bool uUsePole;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vec3 pos = position;

    vec2 waveDir = normalize(vec2(1.0, 0.0));
    float phase = dot(vUv, waveDir); // 0 to 1 across wave direction

    // Interpolated band-based gust
    float bandIndex = phase * uNumBands;
    float bandIndexFloor = floor(bandIndex);
    float bandIndexFrac = fract(bandIndex);

    float bandCoordA = (bandIndexFloor + 0.5) / uNumBands;
    float bandCoordB = (bandIndexFloor + 1.5) / uNumBands;

    float gustA = texture2D(uNoise, vec2(bandCoordA, 0.5)).r * uGustMultiplier;
    float gustB = texture2D(uNoise, vec2(bandCoordB, 0.5)).r * uGustMultiplier;

    float gust = mix(gustA, gustB, bandIndexFrac);

    float waveFrequency = 1.0;
    float amplitude = mix(0.02, 0.06, gust);
    float localPhase = fract(phase * uNumBands);
    float wave = sin(localPhase * waveFrequency * 6.28318 - uTime * 2.0);

    // Base wave displacement
    float displacement = wave * amplitude;

    // pole falloff (based on UV distance from uPolePosition)
    if (uUsePole) {
        float falloff = smoothstep(0.01, 0.3, vUv.x); 
        displacement *= falloff;
    }

    pos.z += displacement;
    vPosition = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
