// components/FadeContent.tsx
import { useRef, useEffect, useState } from 'react';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  easing?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
  slideFrom?: 'left' | 'right' | 'top' | 'bottom'; // New prop to define slide direction
}
const FadeContent = ({
    children,
    blur = false,
    duration = 1000,
    easing = 'ease-out',
    delay = 0,
    threshold = 0.1,
    initialOpacity = 0,
    className = '',
    slideFrom = 'left', // Default to left
  }: FadeContentProps) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
  
    useEffect(() => {
      if (!ref.current) return;
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.unobserve(ref.current!);
            setTimeout(() => {
              setInView(true);
            }, delay);
          }
        },
        { threshold }
      );
  
      observer.observe(ref.current);
  
      return () => observer.disconnect();
    }, [threshold, delay]);
  
    return (
      <div
        ref={ref}
        className={`${className} transition-all`}
        style={{
          opacity: inView ? 1 : initialOpacity,
          transition: `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`,
          transform: inView
            ? 'translateY(0)' // default transformation
            : slideFrom === 'left'
            ? 'translateX(-100px)' // Slide from left
            : slideFrom === 'right'
            ? 'translateX(100px)' // Slide from right
            : slideFrom === 'top'
            ? 'translateY(-100px)' // Slide from top
            : slideFrom === 'bottom'
            ? 'translateY(100px)' // Slide from bottom
            : 'translateY(0)', // Default to no transformation
          filter: blur ? (inView ? 'blur(0px)' : 'blur(50px)') : 'none',
        }}
      >
        {children}
      </div>
    );
  };
  
  export default FadeContent;
  