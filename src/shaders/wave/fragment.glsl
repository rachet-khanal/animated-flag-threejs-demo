// fragment.glsl

precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;

uniform sampler2D uTexture;
uniform sampler2D uAlpha;
uniform bool uUseAlphaMap;

uniform vec3 uLightDir;   // directional light
uniform float uLightStrength; // user-controlled light influence

void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float alpha = 1.0;

    if (uUseAlphaMap) {
        alpha = texture2D(uAlpha, vUv).r;
        if (alpha < 0.1) discard;
    }

    vec3 baseColor = texColor.rgb;

    // Compute light facing using normal from geometry
    vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    vec3 lightDir = normalize(uLightDir);

    float lightAmount = max(dot(normal, lightDir), 0.0); // 0 (shadow) to 1 (fully lit)

    // Blend toward white based on light strength and facing
    vec3 litColor = mix(baseColor, vec3(1.0), lightAmount * uLightStrength);

    gl_FragColor = vec4(litColor, alpha);
}
