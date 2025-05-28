import * as THREE from "three"

export function createFlagGeometry(width, height, segmentsX, segmentsY) {
  const geometry = new THREE.BufferGeometry()
  // const geometry = new THREE.PlaneGeometry(width, height, segmentsX, segmentsY)

  const vertices = []
  const uvs = []
  const indices = []

  for (let y = 0; y <= segmentsY; y++) {
    for (let x = 0; x <= segmentsX; x++) {
      const xPos = (x / segmentsX - 0.5) * width
      const yPos = (y / segmentsY - 0.5) * height
      vertices.push(xPos, yPos, 0)
      uvs.push(x / segmentsX, y / segmentsY)
    }
  }

  for (let y = 0; y < segmentsY; y++) {
    for (let x = 0; x < segmentsX; x++) {
      const i = y * (segmentsX + 1) + x
      const a = i
      const b = i + segmentsX + 1
      const c = i + 1
      const d = i + segmentsX + 2
      indices.push(a, b, c)
      indices.push(c, b, d)
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  )
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
