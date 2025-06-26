import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Box } from '@react-three/drei';
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

const ThreeDChart = forwardRef(({ data }, ref) => {
  const canvasRef = React.useRef();
  const [cameraAngle, setCameraAngle] = React.useState('front');
  const cameraPositions = {
    front: [8, 8, 8],
    side: [8, 8, -8],
    top: [0, 16, 0],
  };

  // Memoize the bars array to prevent unnecessary recalculations
  const bars = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    // Filter for valid numeric x, y, z
    const validData = data.filter(d =>
      d && typeof d.x === 'number' && !isNaN(d.x) &&
      typeof d.y === 'number' && !isNaN(d.y) &&
      typeof d.z === 'number' && !isNaN(d.z)
    );
    if (validData.length === 0) return [];
    const xValues = validData.map(d => d.x);
    const yValues = validData.map(d => d.y);
    const zValues = validData.map(d => d.z);
    const maxY = Math.max(...yValues);
    const scale = 5 / (maxY || 1);
    return validData.map((d, index) => {
      const height = d.y * scale;
      const x = ((d.x - Math.min(...xValues)) / ((Math.max(...xValues) - Math.min(...xValues)) || 1)) * 8 - 4;
      const z = ((d.z - Math.min(...zValues)) / ((Math.max(...zValues) - Math.min(...zValues)) || 1)) * 8 - 4;
      const color = new THREE.Color().setHSL(index / validData.length, 0.8, 0.5);
      return {
        position: [x, height / 2, z],
        height,
        color,
        label: d.label,
        value: d.y.toFixed(1)
      };
    });
  }, [data]);

  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current && canvasRef.current.gl && canvasRef.current.gl.domElement,
    setCameraAngle: (angle) => setCameraAngle(angle),
    captureImage: () => {
      const canvas = canvasRef.current && canvasRef.current.gl && canvasRef.current.gl.domElement;
      return canvas ? canvas.toDataURL('image/png') : null;
    }
  }));

  // Validate data
  if (!data || !Array.isArray(data) || bars.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No valid data for 3D Bar Chart. Please select numeric columns for X, Y, and Z axes.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        ref={canvasRef}
        camera={{ position: cameraPositions[cameraAngle] || cameraPositions.front, fov: 60 }}
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
});

export default React.memo(ThreeDChart); 