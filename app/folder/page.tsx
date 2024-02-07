'use client';

import { useEffect, useRef } from 'react';
import Instruction from '../_components/Instruction';
import Content from './Content';
import styles from './Folder.module.css';
import {
  flipBack,
  flipForward,
  induceFlip,
  initFlip,
  isLastPage,
  organizeFolder,
} from './FolderController';

export default function Folder() {
  const page = useRef(0);
  const intervalID = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const folderRef = useRef(null);

  // activate flipping
  useEffect(() => {
    organizeFolder();
    intervalID.current = window.setInterval(() => {
      induceFlip(page.current);
    }, 4000);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.at(0)?.isIntersecting) return;
        if (page.current > 0) {
          page.current = 0;
          initFlip();
          isAnimating.current = true;
        }
      },
      { threshold: 0.75 }
    );

    if (folderRef.current) observer.observe(folderRef.current);

    return () => {
      if (intervalID.current) clearInterval(intervalID.current);
    };
  });

  // event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating.current) return;
    if (e.button === 0) {
      if (flipBack(page.current)) {
        page.current++;
        isAnimating.current = true;
      }
    } else if (e.button === 2) {
      if (flipForward(page.current)) {
        page.current--;
        isAnimating.current = true;
      }
    }
  };

  const handleDoubleClick = () => {
    if (isAnimating.current) return;
    if (isLastPage(page.current)) {
      page.current = 0;
      initFlip();
      isAnimating.current = true;
    }
  };

  const handleAnimationEnd = () => {
    isAnimating.current = false;
  };

  // render
  return (
    <>
      {/* instruction */}
      <Instruction
        instructions={[
          'Left click on the folder to flip the page forward.',
          'Right click on the folder to flip the page backward.',
          'Double click on the last page to close the folder.',
          'Folder will be closed automatically if it goes out of viewport.',
        ]}
      />

      {/* folder */}
      <div
        className={styles.projectWrapper}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        onContextMenu={(e) => e.preventDefault()}
        onTransitionEnd={handleAnimationEnd}
      >
        <div className={styles.folderWrapper}>
          <div className={styles.folder} id="folder" ref={folderRef}>
            {/* front cover */}
            <div
              className={`${styles.frontCover} ${[
                page.current === 0 ? styles.induceFlip : '',
              ]}`}
            >
              <div>
                <h1>PROJECTS</h1>
                <h2>John Doe</h2>
              </div>
              <div />
            </div>

            {/* contents */}
            <Content page={1} />
            <Content page={2} />
            <Content page={3} />

            {/* back cover */}
            <div className={styles.backCover}>
              <div>
                <p>Double click to close the folder</p>
              </div>
            </div>
          </div>

          {/* decorations */}
          <div className={styles.spineFront} />
          <div className={styles.spineSide} />
          <div className={styles.spineTop} />
        </div>
      </div>
      <div className={styles.placeholder}>Placeholder</div>
    </>
  );
}
