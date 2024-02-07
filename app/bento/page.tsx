'use client';

import { useState } from 'react';
import Instruction from '../_components/Instruction';
import styles from './Bento.module.scss';
import GlowOnHoverBox from './GlowOnHoverBox';

export default function Bento() {
  const [className, setClassName] = useState('');

  return (
    <>
      {/* instruction */}
      <Instruction
        instructions={[
          'When the box is hovered, it is highlighted with the glow effect that follows your mouse pointer.',
          'If one of the boxes is highlighted, others are dehighlighted.',
        ]}
      />

      {/* bento box */}
      <div className="p-4 mt-4">
        <div
          className={`${styles.grid} ${className}`}
          onMouseEnter={() => setClassName(styles.select)}
          onMouseLeave={() => setClassName('')}
        >
          {new Array(5).fill('').map((_, idx) => (
            <GlowOnHoverBox key={idx}>{idx + 1}</GlowOnHoverBox>
          ))}
        </div>
      </div>
    </>
  );
}
