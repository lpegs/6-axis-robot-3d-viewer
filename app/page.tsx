'use client'

import { OrbitControls, Grid, ContactShadows } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { RobotArm } from './components/RobotArm'
import { ControlPanel } from './components/ControlPanel'

type AxesTuple = [number, number, number, number, number, number]

const createZeroAxes = (): AxesTuple => [0, 0, 0, 0, 0, 0]

export default function Home() {
  const [axes, setAxes] = useState<AxesTuple>(() => createZeroAxes())
  const [pendingAxes, setPendingAxes] = useState<AxesTuple>(() => createZeroAxes())

  const axesRef = useRef<AxesTuple>(createZeroAxes())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const isInitial = useRef(true)

  useEffect(() => {
    axesRef.current = axes
  }, [axes])

  const animateAxes = (target: AxesTuple) => {
    const current = [...axesRef.current] as AxesTuple

    if (!target.some((value, index) => value !== current[index])) {
      axesRef.current = target
      setAxes(target)
      return
    }

    if (tweenRef.current) {
      tweenRef.current.kill()
      tweenRef.current = null
    }

    const interpolator = { progress: 0 }

    tweenRef.current = gsap.to(interpolator, {
      progress: 1,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        const updated = current.map((startValue, index) =>
          gsap.utils.interpolate(startValue, target[index], interpolator.progress)
        ) as AxesTuple

        axesRef.current = updated
        setAxes(updated)
      },
      onComplete: () => {
        axesRef.current = target
        setAxes(target)
        tweenRef.current = null
      }
    })
  }

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    const hasDifference = pendingAxes.some((value, index) => value !== axesRef.current[index])

    if (!hasDifference) {
      debounceRef.current = null
      return
    }

    const target = [...pendingAxes] as AxesTuple

    const timeoutId = setTimeout(() => {
      animateAxes(target)
    }, 250)

    debounceRef.current = timeoutId

    return () => {
      clearTimeout(timeoutId)
      if (debounceRef.current === timeoutId) {
        debounceRef.current = null
      }
    }
  }, [pendingAxes])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [])

  const handleAxisChange = (index: number, value: number) => {
    setPendingAxes((prev) => {
      const next = [...prev] as AxesTuple
      next[index] = value
      return next
    })
  }

  const handleReset = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = null
    }

    if (tweenRef.current) {
      tweenRef.current.kill()
      tweenRef.current = null
    }

    const resetValues = createZeroAxes()
    const resetPending = [...resetValues] as AxesTuple

    axesRef.current = resetValues
    setAxes(resetValues)
    setPendingAxes(resetPending)
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <ControlPanel axes={pendingAxes} onChange={handleAxisChange} onReset={handleReset} />
      
      <Canvas
        shadows
        camera={{ position: [12, 8, 12], fov: 50 }}
        className="h-full w-full"
      >
        <color attach="background" args={['#1a1a2e']} />
        
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <pointLight position={[0, 10, 0]} intensity={0.5} />

        <RobotArm axes={axes} />
        
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.5}
          scale={20}
          blur={2}
          far={10}
        />
        
        <Grid
          position={[0, -3.01, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#3a3a5a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#4a4a7a"
          fadeDistance={25}
          fadeStrength={1}
        />
        <OrbitControls
          makeDefault
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
