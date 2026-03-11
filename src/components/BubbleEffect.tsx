import { useMemo } from "react";

const BubbleEffect = () => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 3 + Math.random() * 8,
        delay: Math.random() * 20,
        duration: 10 + Math.random() * 15,
        opacity: 0.08 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute rounded-full animate-bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            background: `radial-gradient(circle, hsl(var(--primary) / ${b.opacity}) 0%, transparent 70%)`,
            boxShadow: `0 0 ${b.size * 2}px hsl(var(--primary) / ${b.opacity * 0.5})`,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleEffect;
