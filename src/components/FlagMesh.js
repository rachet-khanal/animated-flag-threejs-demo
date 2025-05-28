import * as THREE from "three"

import { createFlagGeometry } from "../geometry/FlagPlane"
import flags from "../static/flags.json"
import fragmentShader from "../shaders/wave/fragment.glsl"
import vertexShader from "../shaders/wave/vertex.glsl"

export async function createFlagMesh(
  width,
  height,
  segmentsX,
  segmentsY,
  waveOptions,
  lightOptions
) {
  // Create geometry
  const geometry = createFlagGeometry(width, height, segmentsX, segmentsY)

  // Load textures and attach them to each flag entry
  const textureLoader = new THREE.TextureLoader()
  const flagsArray = await Promise.all(
    flags.map(async (flag) => {
      const texture = await textureLoader.load(flag["file"])
      let alphaTexture = null
      if (flag.alpha) {
        alphaTexture = await new Promise((resolve) => {
          textureLoader.load(flag.alpha, resolve)
        })
      }
      return { ...flag, texture, alphaTexture }
    })
  )

  // Load noise texture
  const noiseTex = await new Promise((resolve) => {
    textureLoader.load("noise.png", resolve)
  })
  noiseTex.wrapS = THREE.RepeatWrapping
  noiseTex.wrapT = THREE.RepeatWrapping
  noiseTex.repeat.set(1, 1)

  // Shader material
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uTexture: { value: flagsArray[0].texture },
      uAlpha: { value: flagsArray[0].alphaTexture || null },
      uUseAlphaMap: { value: !!flagsArray[0].alphaTexture },
      uNoise: { value: noiseTex },
      uNumBands: { value: waveOptions?.numBands || 1.0 },
      uGustMultiplier: { value: waveOptions?.gustMultiplier || 1.0 },
      uLightDir: {
        value: new THREE.Vector3(
          lightOptions?.lightX || 0.3,
          lightOptions?.lightY || 1.0,
          lightOptions?.lightZ || 1.0
        ).normalize(),
      },
      uLightStrength: { value: lightOptions?.lightStrength || 0.2 },
      uUsePole: { value: true },
    },
    side: THREE.DoubleSide,
    wireframe: false,
    blendAlpha: THREE.NormalBlending,
  })

  material.transparent = true
  material.alphaMap = flagsArray[0].alphaTexture || null

  const mesh = new THREE.Mesh(geometry, material)
  return { mesh, flagsArray }
}
