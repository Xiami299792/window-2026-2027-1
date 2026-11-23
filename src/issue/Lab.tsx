import { useEffect, useRef } from 'react';

import { LAB_CSS } from './lab-css';
import { mountLab } from './lab-engine';
import styles from './Lab.module.css';

/** 实训解密：十六关，四大关对应文章里的四个面板。 */
export default function Lab({ onExit }: { onExit: () => void }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const style = document.createElement('style');
    style.setAttribute('data-nohorror', '');
    style.textContent = LAB_CSS;
    document.head.appendChild(style);

    const unmount = mountLab(root);
    return () => {
      unmount();
      style.remove();
    };
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.bar}>
        <button type="button" className={styles.back} onClick={onExit}>
          ← 回到正文
        </button>
      </div>
      <div id="f12-lab" className={styles.lab} ref={rootRef} data-major="home" />
    </div>
  );
}
