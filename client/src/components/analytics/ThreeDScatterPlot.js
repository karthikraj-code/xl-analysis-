import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid } from '@react-three/drei';
import * as THREE from 'three';

const Point = React.memo(({ position, color, label, value }) => {
  return (
    <group position={position}>
      <mesh castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <group position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.1}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${label}: (${value.x.toFixed(1)}, ${value.y.toFixed(1)}, ${value.z.toFixed(1)})`}
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

const ThreeDScatterPlot = ({ data }) => {
  // Memoize the data processing to prevent unnecessary recalculations
  const { points, bounds } = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { points: [], bounds: null };
    }

    // Ensure data has required properties
    const validData = data.filter(item => 
      item && 
      typeof item === 'object' && 
      'x' in item && 
      'y' in item && 
      'z' in item &&
      !isNaN(item.x) && 
      !isNaN(item.y) && 
      !isNaN(item.z)
    );

    if (validData.length === 0) {
      return { points: [], bounds: null };
    }

    const xValues = validData.map(d => d.x);
    const yValues = validData.map(d => d.y);
    const zValues = validData.map(d => d.z);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const minZ = Math.min(...zValues);
    const maxZ = Math.max(...zValues);

    // Normalize data to fit in a reasonable 3D space
    const normalize = (value, min, max) => {
      if (min === max) return 0;
      return ((value - min) / (max - min)) * 5 - 2.5;
    };

    const points = validData.map((d, i) => ({
      position: [
        normalize(d.x, minX, maxX),
        normalize(d.y, minY, maxY),
        normalize(d.z, minZ, maxZ)
      ],
      color: new THREE.Color().setHSL(i / validData.length, 0.8, 0.5),
      label: d.label || `Point ${i + 1}`,
      value: d
    }));

    return {
      points,
      bounds: {
        x: { min: minX, max: maxX },
        y: { min: minY, max: maxY },
        z: { min: minZ, max: maxZ }
      }
    };
  }, [data]);

  // Validate data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available for 3D Scatter Plot</p>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Invalid data format for 3D Scatter Plot</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [5, 5, 5], fov: 75 }}
        shadows
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
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

        <AxisLabel 
          position={[0, -0.5, 0]} 
          text={`X Axis (${bounds.x.min.toFixed(1)} - ${bounds.x.max.toFixed(1)})`} 
        />
        <AxisLabel 
          position={[-0.5, 0, 0]} 
          text={`Y Axis (${bounds.y.min.toFixed(1)} - ${bounds.y.max.toFixed(1)})`} 
          rotation={[0, 0, -Math.PI / 2]} 
        />
        <AxisLabel 
          position={[0, 0, -0.5]} 
          text={`Z Axis (${bounds.z.min.toFixed(1)} - ${bounds.z.max.toFixed(1)})`} 
          rotation={[Math.PI / 2, 0, 0]} 
        />

        <group>
          {points.map((point, i) => (
            <Point key={i} {...point} />
          ))}
        </group>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          rotateSpeed={0.5}
          zoomSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default React.memo(ThreeDScatterPlot); 