// fragment.glsl

precision mediump float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D uTexture;
uniform sampler2D uAlpha;
uniform bool uUseAlphaMap;

uniform vec3 uLightDir;   // directional light
uniform float uLightStrength; // user-controlled light influence

#include ../includes/ambientLight.glsl
#include ../includes/pointLight.glsl

void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    float alpha = 1.0;
    vec3 normal = normalize(vNormal);
    vec3 viewDirection = normalize(vPosition - cameraPosition);

    if (uUseAlphaMap) {
        alpha = texture2D(uAlpha, vUv).r;
        if (alpha < 0.1) discard;
    }

    // Lights
    vec3 light = vec3(0.0);
    light += ambientLight(vec3(1.0), 0.19);

    light += pointLight(
        vec3(1.0),           // Light color
        uLightStrength,      // Light intensity,
        normal,              // Normal
        uLightDir,           // Light position
        viewDirection,       // View direction
        20.0,                // Specular power
        vPosition,           // Position
        0.15,                 // Light decay,
        gl_FrontFacing      // Normal faces side
    );

    vec3 baseColor = texColor.rgb;
    baseColor *= light;

    // Compute light facing using normal from geometry
    // vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    vec3 lightDir = normalize(uLightDir);

    float diffuse = dot(vNormal, lightDir);
    float lightAmount = smoothstep(0.0, 1.0, diffuse);

    // Blend toward white based on light strength and facing
    vec3 litColor = mix(baseColor, vec3(1.0), lightAmount * uLightStrength);

    gl_FragColor = vec4(vec3(baseColor), alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>

}
