'use client';

import styles from './Bento.module.scss';

export default function GlowOnHoverBox({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // update cursor position
  const chaseCursor = (e: React.MouseEvent) => {
    const elem = e.currentTarget as HTMLElement;
    const { x, y } = elem.getBoundingClientRect();
    elem.style.setProperty('--x', `${e.clientX - x}px`);
    elem.style.setProperty('--y', `${e.clientY - y}px`);
  };

  const computedClassName = `${styles['glow-box']} ${className} observe`;

  return (
    <div className={computedClassName} onMouseMove={chaseCursor}>
      {children}
    </div>
  );
}
