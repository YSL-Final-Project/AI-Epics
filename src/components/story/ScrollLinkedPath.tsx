import { useTransform, motion, MotionValue } from 'framer-motion';

interface ScrollLinkedPathProps {
  progress: MotionValue<number>;
  /** Range within parent progress [0,1] */
  range?: [number, number];
  d: string;
  stroke?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
  viewBox?: string;
  className?: string;
}

/**
 * SVG path that draws itself as the user scrolls.
 */
export default function ScrollLinkedPath({
  progress,
  range = [0, 1],
  d,
  stroke = 'currentColor',
  strokeWidth = 2,
  width = 600,
  height = 300,
  viewBox,
  className = '',
}: ScrollLinkedPathProps) {
  const pathLength = useTransform(progress, range, [0, 1]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      {/* Ghost path */}
      <path d={d} stroke={stroke} strokeWidth={strokeWidth} opacity={0.1} />
      {/* Revealed path */}
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ pathLength }}
      />
    </svg>
  );
}
