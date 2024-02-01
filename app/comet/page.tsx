'use client';

import { useEffect } from 'react';
import Instruction from '../components/Instruction';
import {
  initCometCanvas,
  startCometCanvas,
  stopCometCanvas,
} from './cometController';

export default function Comet() {
  useEffect(() => {
    initCometCanvas();
    startCometCanvas();
    return stopCometCanvas;
  });

  return (
    <>
      {/* instruction */}
      <Instruction
        instructions={[
          'Change viewpoint depending on the mouse position.',
          'Accelerate when you press the left mouse button.',
          'Black out the entire page when you keep pressing for 3 seconds.',
        ]}
      />

      {/* canvas to draw comet */}
      <div className="absolute top-0 left-0 w-screen h-screen">
        <canvas id="canvas_comet" />
      </div>
    </>
  );
}
