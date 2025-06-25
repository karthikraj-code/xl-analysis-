import React, { useMemo, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Grid, Box } from '@react-three/drei';
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

const ThreeDPieChart = forwardRef(({ data }, ref) => {
  const canvasRef = React.useRef();
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current && canvasRef.current.gl && canvasRef.current.gl.domElement
  }));

  // Memoize the slices array to prevent unnecessary recalculations
  const slices = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    // Filter for valid numeric y, z
    const validData = data.filter(d =>
      d && typeof d.y === 'number' && !isNaN(d.y) &&
      typeof d.z === 'number' && !isNaN(d.z)
    );
    if (validData.length === 0) return [];
    const yValues = validData.map(d => d.y);
    const zValues = validData.map(d => d.z);
    const total = yValues.reduce((sum, value) => sum + value, 0);
    return validData.map((d, index) => {
      const percentage = ((d.y / total) * 100).toFixed(1);
      const startAngle = (index / validData.length) * Math.PI * 2;
      const color = new THREE.Color().setHSL(index / validData.length, 0.8, 0.5);
      const z = ((d.z - Math.min(...zValues)) / ((Math.max(...zValues) - Math.min(...zValues)) || 1)) * 2 - 1;
      return {
        position: [0, 0, z],
        rotation: [0, 0, startAngle],
        color,
        label: d.label,
        value: d.y.toFixed(1),
        percentage,
        angle: (d.y / total) * Math.PI * 2
      };
    });
  }, [data]);

  // Validate data
  if (!data || !Array.isArray(data) || slices.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No valid data for 3D Pie Chart. Please select numeric columns for Y and Z axes.</p>
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
});

export default React.memo(ThreeDPieChart); 