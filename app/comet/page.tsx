'use client';

import { useEffect } from 'react';
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
      <div className='w-4/5 max-w-fit m-auto mt-2 px-4 py-2 border-2 border-gray-400  bg-white bg-opacity-10'>
        <h1 className='text-2xl font-bold mb-1'>Instruction</h1>
        <ol className='list-decimal pl-5'>
          <li>Change viewpoint depending on the mouse position.</li>
          <li>Accelerate when you press the left mouse button.</li>
          <li>
            Black out the entire page when you keep pressing for 3 seconds.
          </li>
        </ol>
      </div>

      {/* canvas to draw comet */}
      <div className='absolute top-0 left-0 w-screen h-screen'>
        <canvas id='canvas_comet' />
      </div>
    </>
  );
}
