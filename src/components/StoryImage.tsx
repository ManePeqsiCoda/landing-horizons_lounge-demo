import { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

interface StoryImageProps {
  src: string;
  alt?: string;
  className?: string;
  /** Start scale when entering view (grows toward 1). */
  fromScale?: number;
}

/**
 * Focal storytelling media: image gently grows as it enters the viewport.
 * One authored material idea — not a per-section identical fade.
 */
export default function StoryImage({
  src,
  alt = '',
  className = '',
  fromScale = 1.12,
}: StoryImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [fromScale, 1, 1.02]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={reduceMotion ? undefined : { scale }}
        className="h-full w-full object-cover"
        aria-hidden={alt === '' ? true : undefined}
      />
    </div>
  );
}
