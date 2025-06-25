import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Box } from '@react-three/drei';
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

const ThreeDScatterPlot = forwardRef(({ data }, ref) => {
  const canvasRef = React.useRef();
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current && canvasRef.current.gl && canvasRef.current.gl.domElement
  }));

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
        ref={canvasRef}
        camera={{ position: [8, 8, 8], fov: 60 }}
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

        {/* 3D Box for reference */}
        <Box args={[10, 5, 10]} position={[0, 2.5/2, 0]}>
          <meshStandardMaterial attach="material" color="#e5e7eb" transparent opacity={0.08} />
        </Box>

        {/* XZ Grid (bottom) */}
        <Grid
          args={[10, 10]}
          position={[0, 0, 0]}
          cellSize={0.5}
          cellThickness={0.3}
          cellColor="#6b7280"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        {/* XY Grid (front) */}
        <Grid
          args={[10, 5]}
          position={[0, 2.5/2, 5/2]}
          rotation={[Math.PI / 2, 0, 0]}
          cellSize={0.5}
          cellThickness={0.3}
          cellColor="#6b7280"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />
        {/* YZ Grid (side) */}
        <Grid
          args={[10, 5]}
          position={[5/2, 2.5/2, 0]}
          rotation={[0, 0, Math.PI / 2]}
          cellSize={0.5}
          cellThickness={0.3}
          cellColor="#6b7280"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Axis lines */}
        {/* X axis (red) */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 10, 16]} />
          <meshStandardMaterial color="#ef4444" />
          <group position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
        </mesh>
        {/* Y axis (green) */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 5, 16]} />
          <meshStandardMaterial color="#22c55e" />
          <group position={[0, 0, 0]} />
        </mesh>
        {/* Z axis (blue) */}
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 10, 16]} />
          <meshStandardMaterial color="#3b82f6" />
          <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>

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
});

export default React.memo(ThreeDScatterPlot); 