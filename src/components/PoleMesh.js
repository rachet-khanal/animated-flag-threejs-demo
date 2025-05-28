import * as THREE from "three"

export function createPoleMesh() {
  const poleGeometry = new THREE.CylinderGeometry(0.009, 0.009, 0.85, 12)
  const poleMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    metalness: 0.8,
    roughness: 0.3,
  })
  const poleMesh = new THREE.Mesh(poleGeometry, poleMaterial)
  poleMesh.rotation.y = Math.PI / 2
  poleMesh.visible = true
  return poleMesh
}
