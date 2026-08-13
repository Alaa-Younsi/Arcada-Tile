import { useEffect, useState } from 'react';

/**
 * The subset of the Network Information API we rely on. It is still not in
 * lib.dom, and Safari/Firefox omit it entirely — every field is optional and
 * the absence of `connection` simply means "assume a healthy connection".
 */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
}

type NavigatorWithConnection = Navigator & { connection?: NetworkInformation };

/** Anything at or below this can't pull the hero in a useful amount of time. */
const TOO_SLOW: ReadonlySet<string> = new Set(['slow-2g', '2g', '3g']);

const DESKTOP_SRC = '/background.mp4';
const MOBILE_SRC = '/background-mobile.mp4';

/**
 * Decides which hero video — if any — is worth downloading, and returns it only
 * once the page has painted so the download never competes with the poster
 * image or the first render.
 *
 * The hero poster is a still of this same footage, so a visitor who never
 * receives the video still sees the intended hero. That makes the video pure
 * enhancement, and it is dropped whenever paying 0.7–1.5 MB for it would cost
 * more than it returns: Save-Data on, or a connection that would spend tens of
 * seconds on the transfer.
 */
export function useHeroVideoSource(): string | undefined {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const connection = (navigator as NavigatorWithConnection).connection;

    if (connection?.saveData) return;
    if (connection?.effectiveType && TOO_SLOW.has(connection.effectiveType)) return;

    // Phones get a 480p/325 kbps cut (~0.7 MB against 1.5 MB). The hero sits
    // under a heavy dark gradient at phone size, where the drop doesn't read.
    const chosen = window.matchMedia('(max-width: 767px)').matches
      ? MOBILE_SRC
      : DESKTOP_SRC;

    const start = () => setSrc(chosen);

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 400);
    return () => window.clearTimeout(id);
  }, []);

  return src;
}
