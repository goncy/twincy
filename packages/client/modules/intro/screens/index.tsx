import type {NextPage} from "next";
import type {Socket} from "socket.io-client";
import type {Mesh} from "three";

import {Suspense, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {Flex} from "@chakra-ui/react";
import {useFrame, useThree, Canvas} from "@react-three/fiber";
import {Environment} from "@react-three/drei";
import {
  EffectComposer,
  DepthOfField,
  Bloom,
  Noise,
  Vignette,
  ToneMapping,
  ChromaticAberration,
  Scanline,
} from "@react-three/postprocessing/dist/index";
import {BlendFunction} from "postprocessing";

interface Options {
  count: number;
  depth: number;
  acceleration: number;
}

interface Props {
  socket: Socket;
  options?: Options;
}

interface PyramidProps {
  z: number;
  options: Options;
}

interface EffectsProps {
  options: Options;
}

const Pyramid: React.VFC<PyramidProps> = ({z, options}) => {
  const ref = useRef<Mesh>(null);
  const {viewport, camera} = useThree();
  const {width, height} = viewport.getCurrentViewport(camera, new THREE.Vector3(0, 0, z));
  const [data] = useState(() => ({
    x: THREE.MathUtils.randFloatSpread(5),
    y: THREE.MathUtils.randFloatSpread(height * 10),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  }));

  useFrame(() => {
    data.y += 0.0075 + 0.005 * (options.acceleration * 2);
    data.rX += 0.00075;
    data.rY += 0.00075;
    data.rZ += 0.00075;

    ref.current!.rotation.set(data.rX, data.rY, data.rZ);
    ref.current!.position.set(width * data.x, data.y, z);

    if (data.y > height) {
      data.y = -height;
    }
  });

  return (
    <mesh ref={ref} rotation={[10, 0, 0]} scale={2}>
      <coneGeometry args={[1, 1, 3]} />
      <meshStandardMaterial color="whitesmoke" />
    </mesh>
  );
};

const Effects: React.VFC<EffectsProps> = ({options}) => {
  // Investigate events types
  const noise = useRef<any>(null);
  const bloom = useRef<any>(null);
  const aberration = useRef<any>(null);
  const scanline = useRef<any>(null);

  useFrame(() => {
    noise.current!.blendMode.setOpacity(0.05 + 0.005 * options.acceleration);
    aberration.current!.offset.set(0.0005 * options.acceleration, 0.001 * options.acceleration);
    bloom.current!.setIntensity(0.2 + 0.2 * options.acceleration);
    scanline.current!.blendMode.setOpacity(0.05 + 0.05 * options.acceleration);
  });

  return (
    <EffectComposer>
      <DepthOfField
        bokehScale={2}
        focalLength={0.5}
        height={options.depth * 20}
        target={[0, 0, options.depth / 2]}
      />
      <Bloom ref={bloom} height={500} luminanceSmoothing={0.5} luminanceThreshold={0.2} />
      <Noise ref={noise} opacity={0.05} />
      <Vignette darkness={1} eskil={false} offset={0.1} />
      <ToneMapping maxLuminance={5} middleGrey={1} />
      <ChromaticAberration
        ref={aberration}
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.01, 0.02)}
      />
      <Scanline ref={scanline} blendFunction={BlendFunction.OVERLAY} density={1.25} />
    </EffectComposer>
  );
};

const IntroScreen: NextPage<Props> = ({
  socket,
  options = {count: 100, depth: 30, acceleration: 0},
}) => {
  const timeouts = useRef<Set<NodeJS.Timeout>>(new Set<NodeJS.Timeout>());

  useEffect(() => {
    function handleMesage() {
      options.acceleration++;

      const timeout = setTimeout(() => {
        options.acceleration--;

        timeouts.current.delete(timeout);
      }, 5000);

      timeouts.current.add(timeout);
    }

    socket.on("message", handleMesage);

    return () => {
      socket.off("message", handleMesage);
    };
  }, [socket, options.acceleration]);

  return (
    <Flex
      alignItems="center"
      backgroundColor="white"
      color="black"
      flexDirection="column"
      fontFamily="sans-serif"
      height="100vh"
      justifyContent="center"
      width="100vw"
    >
      <Canvas
        camera={{near: 0.01, far: 110, fov: 30}}
        gl={{
          powerPreference: "high-performance",
          alpha: false,
          antialias: false,
          stencil: false,
          depth: false,
        }}
      >
        <color args={["#050505"]} attach="background" />
        <fog attach="fog" color="#161616" far={options.count} near={10} />
        <spotLight intensity={0.2} position={[0, options.depth, options.depth]} />
        <Suspense fallback={null}>
          <Environment preset="city" />
          {Array.from({length: options.count}, (_, i) => (
            <Pyramid key={i} options={options} z={-10 - i} />
          ))}
          <Effects options={options} />
        </Suspense>
      </Canvas>
    </Flex>
  );
};

export default IntroScreen;
