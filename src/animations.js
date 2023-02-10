import { Clock, Object3D } from 'three'

function rotate(object, clock, radiansPerSecond = Math.PI * 2) {
  const rotationAngle = clock.getElapsedTime() * radiansPerSecond
  object.rotation.y = rotationAngle
}

function bounce(
  object,
  clock,
  bounceSpeed = 1.5,
  amplitude = 0.4,
  yLowerBound = 0.5
) {
  const elapsed = clock.getElapsedTime()
  const yPos = Math.abs(Math.sin(elapsed * bounceSpeed) * amplitude)
  object.position.y = yPos + yLowerBound
}

export { rotate, bounce }
