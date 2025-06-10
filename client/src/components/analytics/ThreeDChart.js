import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

const Bar3D = React.memo(({ position, height, color, label, value }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, height / 2 + 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <group position={[0, height / 2 + 0.3, 0]} rotation={[-Math.PI /2, 0, 0]}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${label}: ${value}`}
        </Text>
      </group>
    </group>
  );
});

const AxisLabel = ({ position, text, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      <Text
        position={[0, 0, 0]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {text}
      </Text>
    </group>
  );
};

const ThreeDChart = ({ data }) => {
  // Memoize the bars array to prevent unnecessary recalculations
  const bars = useMemo(() => {
    if (!data || !data.datasets || !data.labels || !Array.isArray(data.datasets[0]?.data)) {
      return [];
    }

    const values = data.datasets[0].data;
    const labels = data.labels;
    const maxValue = Math.max(...values);
    const scale = 5 / maxValue;

    return values.map((value, index) => {
      const height = value * scale;
      const x = (index - values.length / 2) * 0.8;
      const color = new THREE.Color().setHSL(index / values.length, 0.8, 0.5);

      return {
        position: [x, height / 2, 0],
        height,
        color,
        label: labels[index],
        value: value.toFixed(1)
      };
    });
  }, [data]);

  // Validate data
  if (!data || !data.datasets || !data.labels || !Array.isArray(data.datasets[0]?.data)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for 3D Chart</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
        dpr={[1, 2]} // Optimize for different screen densities
        performance={{ min: 0.5 }} // Allow frame rate to drop to maintain performance
      >
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Grid and Axes */}
        <Grid
          args={[10, 10]}
          position={[0, -0.1, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={true}
        />

        {/* Axis Labels */}
        <AxisLabel position={[0, -0.5, 0]} text="X Axis" />
        <AxisLabel position={[-0.5, 0, 0]} text="Y Axis" rotation={[0, 0, -Math.PI / 2]} />
        <AxisLabel position={[0, 0, -0.5]} text="Z Axis" rotation={[Math.PI / 2, 0, 0]} />

        {/* Bars */}
        <group>
          {bars.map((bar, i) => (
            <Bar3D key={i} {...bar} />
          ))}
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          rotateSpeed={0.5} // Reduce rotation speed for better control
          zoomSpeed={0.5} // Reduce zoom speed for better control
        />
      </Canvas>
    </div>
  );
};

export default React.memo(ThreeDChart); 