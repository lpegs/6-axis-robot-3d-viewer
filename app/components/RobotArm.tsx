'use client'

import { useRef } from 'react'
import { Group } from 'three'

interface RobotArmProps {
  axes: [number, number, number, number, number, number]
}

export function RobotArm({ axes }: RobotArmProps) {
  const [axis1, axis2, axis3, axis4, axis5, axis6] = axes

  const baseRef = useRef<Group>(null)

  return (
    <group ref={baseRef} position={[0, -3, 0]}>
      {/* Base - Axis 6 (Y rotation) */}
      <group rotation={[0, axis6, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 2.5, 1, 32]} />
          <meshStandardMaterial color="#d3d3d3ff" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Lower arm joint - Axis 5 (X rotation) */}
        <group position={[0, 1, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.6, 0.6, 0.8, 32]} />
            <meshStandardMaterial color="#d3d3d3ff" metalness={0.6} roughness={0.4} />
          </mesh>

          <group rotation={[axis5, 0, 0]} position={[0, 0.4, 0]}>
            {/* Lower arm */}
            <mesh position={[0, 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.8, 4, 0.8]} />
              <meshStandardMaterial color="#d3d3d3ff" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Mid joint - Axis 4 (X rotation) */}
            <group position={[0, 4, 0]}>
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#d3d3d3ff" metalness={0.6} roughness={0.4} />
              </mesh>

              <group rotation={[axis4, 0, 0]}>
                {/* Upper arm */}
                <mesh position={[0, 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.7, 4, 0.7]} />
                  <meshStandardMaterial color="#d3d3d3ff" metalness={0.5} roughness={0.5} />
                </mesh>

                {/* Wrist joint - Axis 3 (X rotation) */}
                <group position={[0, 4, 0]}>
                  <mesh castShadow receiveShadow>
                    <sphereGeometry args={[0.4, 32, 32]} />
                    <meshStandardMaterial color="#d3d3d3ff" metalness={0.6} roughness={0.4} />
                  </mesh>

                  <group rotation={[axis3, 0, 0]}>
                    {/* Wrist section */}
                    <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
                      <cylinderGeometry args={[0.3, 0.3, 1.6, 32]} />
                      <meshStandardMaterial color="#d3d3d3ff" metalness={0.5} roughness={0.5} />
                    </mesh>

                    {/* Tool mount - Axis 2 (Z rotation) */}
                    <group position={[0, 1.6, 0]}>
                      <mesh castShadow receiveShadow>
                        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
                        <meshStandardMaterial color="#d3d3d3ff" metalness={0.6} roughness={0.4} />
                      </mesh>

                      <group rotation={[0, 0, axis2]}>
                        {/* Tool flange - Axis 1 (Y rotation) */}
                        <group position={[0, 0.2, 0]} rotation={[0, axis1, 0]}>
                          <mesh castShadow receiveShadow>
                            <cylinderGeometry args={[0.4, 0.3, 0.4, 6]} />
                            <meshStandardMaterial color="#d3d3d3ff" metalness={0.5} roughness={0.5} />
                          </mesh>

                          {/* End effector indicator */}
                          <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
                            <boxGeometry args={[0.3, 0.3, 0.3]} />
                            <meshStandardMaterial color="#d3d3d3ff" metalness={0.7} roughness={0.3} />
                          </mesh>
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
