import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line, Ring, Html } from '@react-three/drei';
import { useData } from '../context/DataContext';
import { Mesh, Vector3 } from 'three';
import * as THREE from 'three';


const createFallbackTexture = () => {
  try {
    const size = 512;
    const data = new Uint8Array(size * size * 3);
    for (let i = 0; i < data.length; i += 3) {
      const noise = Math.random() * 255;
      data[i] = noise; 
      data[i + 1] = noise * 0.8; 
      data[i + 2] = noise * 0.6; 
    }
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBFormat);
    texture.needsUpdate = true;
    return texture;
  } catch (error) {
    console.error('Failed to create fallback texture:', error);
    return null;
  }
};


const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  uniform float intensity;
  void main() {
    float glow = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0) * intensity;
    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

const OrbitalView: React.FC = () => {
  const { statistics, exoplanets } = useData();
  const controlsRef = useRef<any>(null);
  const barColors = [
    '#3B82F6', // Vibrant Blue
    '#22D3EE', // Cyan
    '#F97316', // Orange
    '#EF4444', // Red
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#4ADE80', // Green
    '#F87171', // Coral
    '#60A5FA', // Light Blue
    '#FBBF24', // Amber
  ];


  const fallbackTexture = createFallbackTexture();
  if (!fallbackTexture) {
    console.error('Fallback texture creation failed');
    return <div className="h-[40vh] bg-gray-800 text-white flex items-center justify-center">Texture creation failed</div>;
  }


  useEffect(() => {
    console.log('Statistics:', JSON.stringify(statistics, null, 2));
    console.log('Exoplanets:', JSON.stringify(exoplanets, null, 2));
    console.log('Anomaly count:', statistics?.anomalies?.length ?? 0);
  }, [statistics, exoplanets]);


  const anomalyCount = statistics?.anomalies?.length ?? 0;


  const Planet: React.FC<{
    anomaly: { name: string; radius: number; deviation: string };
    index: number;
    orbitalPeriod?: number;
  }> = ({ anomaly, index, orbitalPeriod = 1 }) => {
    const meshRef = useRef<Mesh>(null);
    const atmosphereRef = useRef<Mesh>(null);
    const ringRef = useRef<Mesh>(null);
    const htmlRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const angle = (index / anomalyCount) * Math.PI * 2;
    const orbitRadiusX = 6 + Math.log1p(anomaly.radius) * 3;
    const orbitRadiusZ = orbitRadiusX * 0.7;
    const yOffset = (index % 2 === 0 ? 1 : -1) * (index * 0.4);
    const tilt = (index % 3) * 0.15 - 0.15;
    const planetColor = barColors[index % barColors.length];
    const hasRing = useMemo(() => Math.random() < 0.3, []); 

    useEffect(() => {
      console.log(
        `Planet ${anomaly.name} assigned color: ${planetColor}, ring: ${
          hasRing ? '#A0AEC0' : 'none'
        }, tooltip: hidden until hover`
      );
      console.log(`Planet ${anomaly.name} orbital speed factor: 0.025, self-rotation speed: 0.01`);
    }, [anomaly.name, planetColor, hasRing]);

    const orbitPoints: Vector3[] = [];
    try {
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2;
        const x = Math.cos(theta) * orbitRadiusX;
        const y = yOffset + Math.sin(theta) * tilt;
        const z = Math.sin(theta) * orbitRadiusZ;
        orbitPoints.push(new Vector3(x, y, z));
      }
    } catch (error) {
      console.error(`Failed to create orbit points for ${anomaly.name}:`, error);
      return null;
    }

    useFrame(({ clock }) => {
      try {
        if (meshRef.current && atmosphereRef.current) {
          const time = clock.getElapsedTime();
          const speed = 0.025 / Math.sqrt(orbitRadiusX * orbitRadiusZ);
          const orbitAngle = angle + time * speed;
          const x = Math.cos(orbitAngle) * orbitRadiusX;
          const y = yOffset + Math.sin(orbitAngle) * tilt;
          const z = Math.sin(orbitAngle) * orbitRadiusZ;
          meshRef.current.position.set(x, y, z);
          atmosphereRef.current.position.copy(meshRef.current.position);
          if (hasRing && ringRef.current) {
            ringRef.current.position.copy(meshRef.current.position);
            ringRef.current.rotation.y += 0.01;
            ringRef.current.visible = true; 
          }
          if (htmlRef.current && meshRef.current) {
            const { x, y, z } = meshRef.current.position;
            htmlRef.current.style.transform = `translate3d(${x * 10}px, ${(y + sphereSize + 0.45) * 10}px, ${z * 10}px)`;
          }
          meshRef.current.rotation.y += 0.01;
        }
      } catch (error) {
        console.error(`Animation error for ${anomaly.name}:`, error);
      }
    });

    const sphereSize = Math.min(Math.max(anomaly.radius / 8, 0.4), 1.0);
    const exoplanet = exoplanets?.find((exo) => exo.name === anomaly.name);

    return (
      <group>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setIsHovered(true);
            console.log(`Hovering ${anomaly.name}, ring visible: ${hasRing && ringRef.current ? ringRef.current.visible : 'no ring'}`);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setIsHovered(false);
            console.log(`Hover out ${anomaly.name}, ring visible: ${hasRing && ringRef.current ? ringRef.current.visible : 'no ring'}`);
            document.body.style.cursor = 'default';
          }}
        >
          <sphereGeometry args={[sphereSize, 32, 32]} />
          <meshStandardMaterial
            map={fallbackTexture}
            color={planetColor}
            emissive={planetColor}
            emissiveIntensity={0.3}
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[sphereSize * 1.1, 32, 32]} />
          <shaderMaterial
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            uniforms={{
              glowColor: { value: new THREE.Color(planetColor) },
              intensity: { value: 0.5 },
            }}
            blending={THREE.AdditiveBlending}
            transparent
          />
        </mesh>
        {hasRing && (
          <mesh ref={ringRef} visible={true}>
            <Ring args={[sphereSize * 1.5, sphereSize * 2.5, 64]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial
                color="#A0AEC0"
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
              />
            </Ring>
          </mesh>
        )}
        <Line
          points={orbitPoints}
          color="#4B5563"
          lineWidth={0.8}
          transparent
          opacity={0.2}
        />
        <Html>
          <div
            ref={htmlRef}
            style={{
              background: isHovered ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: isHovered ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
              display: isHovered ? 'block' : 'none',
              position: 'absolute',
            }}
          >
            <strong>{anomaly.name}</strong><br />
            Radius: {anomaly.radius.toFixed(2)} R⊕<br />
            Deviation: {anomaly.deviation}<br />
            Orbital Period: {exoplanet?.orbitalPeriod ? `${exoplanet.orbitalPeriod.toFixed(2)} days` : 'N/A'}<br />
            Star Type: {exoplanet?.starType || 'N/A'}
          </div>
        </Html>
      </group>
    );
  };

  // Error boundary
  if (!statistics || !exoplanets) {
    console.error('Data missing:', { statistics, exoplanets });
    return <div className="h-[40vh] bg-gray-800 text-white flex items-center justify-center">Data not loaded</div>;
  }

  return (
    <div className="h-[40vh] bg-gray-800 rounded-lg" aria-label="3D visualization of exoplanet anomalies">
      <Canvas camera={{ position: [0, 7, 15], fov: 50 }} onCreated={({ gl }) => {
        console.log('Canvas created:', gl);
        console.log('WebGL capabilities:', gl.capabilities);
      }}>
        <color attach="background" args={['#1f2937']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.8} color="#FDB813" />
        <Stars radius={25} depth={10} count={500} factor={1.2} saturation={0.2} fade speed={0.2} />
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshBasicMaterial color="#FDB813" />
          <pointLight color="#FDB813" intensity={0.7} distance={12} />
        </mesh>
        {statistics.anomalies && anomalyCount > 0 ? (
          statistics.anomalies.map((anomaly, index) => {
            try {
              const exoplanet = exoplanets.find((exo) => exo.name === anomaly.name);
              console.log(`Rendering planet: ${anomaly.name} with color: ${barColors[index % barColors.length]}`);
              return (
                <Planet
                  key={anomaly.name}
                  anomaly={anomaly}
                  index={index}
                  orbitalPeriod={exoplanet?.orbitalPeriod}
                />
              );
            } catch (error) {
              console.error(`Error rendering planet ${anomaly.name}:`, error);
              return null;
            }
          })
        ) : (
          <Html center>
            <div className="text-white text-lg">No anomalies available</div>
          </Html>
        )}
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={6}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={0.15}
          dampingFactor={0.1}
        />
      </Canvas>
    </div>
  );
};

export default OrbitalView;