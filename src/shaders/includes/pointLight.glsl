vec3 pointLight(
    vec3 lightColor, 
    float lightIntensity, 
    vec3 normal, 
    vec3 lightPosition, 
    vec3 viewDirection, 
    float specularPower, 
    vec3 position, 
    float lightDecay,
    bool frontFace)
{
    float invertedLightDeltaZ = 1.0 - smoothstep(0.0, 0.6, abs(lightPosition.z - position.z));
    vec3 lightDelta = vec3(lightPosition.xy - position.xy, invertedLightDeltaZ);
    float lightDistance = length(lightDelta);
    vec3 lightDirection = normalize(lightDelta);
    vec3 lightReflection = reflect(- lightDirection, normal);

    
    // Shading
    float directionZEffect = dot(normal, lightDirection);
    float shading = directionZEffect;
    shading = max(0.0, shading);

    // Specular
    float specular = - dot(lightReflection, viewDirection);
    specular = max(0.0, specular);
    specular = pow(specular, specularPower);

    // Decay
    float decay = 1.0 - lightDistance * lightDecay;
    decay = max(0.0, decay);

    if ((frontFace && lightPosition.z < 0.0) || (!frontFace && lightPosition.z > 0.0)) {
        directionZEffect *= 0.5;
    }
    directionZEffect = max(directionZEffect, 0.0);

    return lightColor * lightIntensity * decay * (shading + specular) * directionZEffect;
}