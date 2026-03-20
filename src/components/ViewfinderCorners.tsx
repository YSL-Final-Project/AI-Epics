import { motion, useReducedMotion } from 'framer-motion';

interface ViewfinderCornersProps {
  size?: number;
  thickness?: number;
  color?: string;
  className?: string;
  delay?: number;
  animate?: boolean;
}

/**
 * Animated corner bracket "viewfinder" decoration — inspired by the
 * makemepulse.com 2019 corner crosshair aesthetic.
 */
export default function ViewfinderCorners({
  size = 24,
  thickness = 2,
  color = 'rgba(6,182,212,0.7)',
  className = '',
  delay = 0,
  animate = true,
}: ViewfinderCornersProps) {
  const prefersReduced = useReducedMotion();

  const corners = [
    { top: 0, left: 0,  borderTop: thickness, borderLeft: thickness, borderRight: 0, borderBottom: 0 },
    { top: 0, right: 0, borderTop: thickness, borderRight: thickness, borderLeft: 0, borderBottom: 0 },
    { bottom: 0, left: 0, borderBottom: thickness, borderLeft: thickness, borderTop: 0, borderRight: 0 },
    { bottom: 0, right: 0, borderBottom: thickness, borderRight: thickness, borderTop: 0, borderLeft: 0 },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {corners.map((corner, i) => (
        <motion.div
          key={i}
          initial={prefersReduced || !animate ? false : { opacity: 0, scale: 1.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: delay + i * 0.07,
            duration: 0.55,
            ease: [0.23, 1, 0.32, 1],
          }}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderColor: color,
            borderStyle: 'solid',
            borderTopWidth:    corner.borderTop    ?? 0,
            borderLeftWidth:   corner.borderLeft   ?? 0,
            borderRightWidth:  corner.borderRight  ?? 0,
            borderBottomWidth: corner.borderBottom ?? 0,
            top:    corner.top,
            left:   corner.left,
            right:  corner.right,
            bottom: corner.bottom,
          }}
        />
      ))}
    </div>
  );
}
