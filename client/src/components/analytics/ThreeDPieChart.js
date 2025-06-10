import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

const PieSlice = React.memo(({ position, rotation, color, label, value, percentage }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <cylinderGeometry args={[1, 1, 0.2, 32, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <group position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${label}: ${percentage}%`}
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

const ThreeDPieChart = ({ data }) => {
  // Memoize the slices array to prevent unnecessary recalculations
  const slices = useMemo(() => {
    if (!data || !data.datasets || !data.labels || !Array.isArray(data.datasets[0]?.data)) {
      return [];
    }

    const values = data.datasets[0].data;
    const labels = data.labels;
    const total = values.reduce((sum, value) => sum + value, 0);

    return values.map((value, index) => {
      const percentage = ((value / total) * 100).toFixed(1);
      const startAngle = (index / values.length) * Math.PI * 2;
      const angle = (value / total) * Math.PI * 2;
      const color = new THREE.Color().setHSL(index / values.length, 0.8, 0.5);

      return {
        position: [0, 0, 0],
        rotation: [0, 0, startAngle],
        color,
        label: labels[index],
        value: value.toFixed(1),
        percentage,
        angle
      };
    });
  }, [data]);

  // Validate data
  if (!data || !data.datasets || !data.labels || !Array.isArray(data.datasets[0]?.data)) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for 3D Pie Chart</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75 }}
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

        {/* Pie Slices */}
        <group>
          {slices.map((slice, i) => (
            <PieSlice key={i} {...slice} />
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

export default React.memo(ThreeDPieChart); 