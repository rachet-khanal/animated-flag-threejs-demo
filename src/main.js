import * as THREE from "three"

import GUI from "lil-gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { createFlagMesh } from "./components/FlagMesh.js"
import { createPoleMesh } from "./components/PoleMesh.js"
import { useResponsiveSizing } from "./utils/sizes.js"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Waves
const waveOptions = {
  numBands: 1.0,
  gustMultiplier: 2.0,
}

// Directional Light
const lightOptions = {
  lightX: 0.3,
  lightY: 0.2,
  lightZ: 1.0,
  lightStrength: 0.1,
}
const directionLight = new THREE.DirectionalLight(
  0xffffff,
  lightOptions.lightStrength
)
directionLight.position
  .set(lightOptions.lightX, lightOptions.lightY, lightOptions.lightZ)
  .normalize()
scene.add(directionLight)

// Mesh
const { mesh: flagMesh, flagsArray } = await createFlagMesh(
  0.75,
  0.55,
  256,
  256,
  waveOptions,
  lightOptions
)

scene.add(flagMesh)

// Ambient Light for pole
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0)
scene.add(ambientLight)

// Pole mesh
const poleOptions = {
  showPole: true,
  x: 0.13, // UV X
  y: 0.35, // UV Y
  falloff: 10.0,
}
const poleMesh = createPoleMesh()
scene.add(poleMesh)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100)
camera.position.set(0, 0, 1.25)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})

/**
 * Sizes
 */
const sizes = useResponsiveSizing(camera, renderer, canvas)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * GUI
 */
function setupGUI() {
  const gui = new GUI()
  const flagOptions = { Flag: flagsArray[0].id }

  const idToTexture = Object.fromEntries(
    flagsArray.map((f) => [f.id, f.texture])
  )
  const idToName = Object.fromEntries(flagsArray.map((f) => [f.id, f.name]))
  const idToAlpha = Object.fromEntries(
    flagsArray.map((f) => [f.id, f.alphaTexture])
  )

  gui
    .add(flagOptions, "Flag", Object.keys(idToName))
    .name("Flag")
    .onChange((selectedId) => {
      flagMesh.material.uniforms.uTexture.value = idToTexture[selectedId]
      flagMesh.material.uniforms.uAlpha.value = idToAlpha[selectedId] || null
      flagMesh.material.alphaMap = idToAlpha[selectedId] || null
      flagMesh.material.uniforms.uUseAlphaMap.value = !!idToAlpha[selectedId]
    })
  gui
    .add(waveOptions, "numBands", 1.0, 5.0, 1.0)
    .name("Wave Bands")
    .onChange((val) => {
      flagMesh.material.uniforms.uNumBands.value = val
    })

  gui
    .add(waveOptions, "gustMultiplier", 0.0, 6.0, 0.1)
    .name("Gust Intensity")
    .onChange((val) => {
      flagMesh.material.uniforms.uGustMultiplier.value = val
    })
  gui.add(lightOptions, "lightX", -3, 3, 0.01).onChange(updateLight)
  gui.add(lightOptions, "lightY", -3, 3, 0.01).onChange(updateLight)
  gui.add(lightOptions, "lightZ", -3, 3, 0.01).onChange(updateLight)
  gui.add(lightOptions, "lightStrength", 0, 5, 0.01).onChange((val) => {
    flagMesh.material.uniforms.uLightStrength.value = val
    directionLight.intensity = val
  })

  gui
    .add(poleOptions, "showPole")
    .name("Enable Pole")
    .onChange((val) => {
      poleMesh.visible = val
      flagMesh.material.uniforms.uUsePole.value = val
    })
}

function updateLight() {
  const dir = new THREE.Vector3(
    lightOptions.lightX,
    lightOptions.lightY,
    lightOptions.lightZ
  ).normalize()
  // Shader uniform (for flag)
  flagMesh.material.uniforms.uLightDir.value.copy(dir)

  // Three.js light (for pole)
  directionLight.position.copy(dir)
  directionLight.intensity = lightOptions.lightStrength
}

setupGUI()

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  flagMesh.material.uniforms.uTime.value = elapsedTime

  if (poleMesh.visible) {
    const x = (poleOptions.x - 0.5) * flagMesh.scale.x
    const y = (poleOptions.y - 0.5) * flagMesh.scale.y
    poleMesh.position.set(x, y, 0.0)
  }

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
