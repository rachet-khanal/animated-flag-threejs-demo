import * as THREE from "three"

export function useResponsiveSizing(camera, renderer, canvas) {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  function onResize() {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()
    }

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  window.addEventListener("resize", onResize)

  onResize()

  return sizes
}
