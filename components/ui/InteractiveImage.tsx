'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

// Helpers for pinch gestures
const getDistance = (t1: Touch, t2: Touch) => {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getTouchCenter = (t1: Touch, t2: Touch) => {
  return {
    x: (t1.clientX + t2.clientX) / 2,
    y: (t1.clientY + t2.clientY) / 2,
  };
};

export default function InteractiveImage({ src, alt, className = '' }: InteractiveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Refs to maintain current values inside raw touch event handlers without closures capturing stale state
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);
  const isDraggingRef = useRef(isDragging);
  const dragStartRef = useRef(dragStart);

  // Sync refs when state changes
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { dragStartRef.current = dragStart; }, [dragStart]);

  // Touch gesture start state refs
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1);
  const touchStartCenterRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Native image dimensions for calculations
  const imgWidth = 1200;
  const imgHeight = 675;

  const resetView = () => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight || 500;

    const fitScaleX = containerWidth / imgWidth;
    const fitScaleY = containerHeight / imgHeight;
    const fitScale = Math.min(fitScaleX, fitScaleY);

    // Default view matches both desktop and mobile perfectly (fit container)
    setScale(fitScale);
    const x = (containerWidth - imgWidth * fitScale) / 2;
    const y = (containerHeight - imgHeight * fitScale) / 2;
    setPosition({ x, y });
  };

  // Run on mount and container resizing
  useEffect(() => {
    resetView();
    
    // Setup resize observer for container changes
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      resetView();
    });
    observer.observe(containerRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Zoom at center / cursor
  const handleZoom = (factor: number, clientX?: number, clientY?: number) => {
    if (!containerRef.current) return;

    let targetX = containerRef.current.clientWidth / 2;
    let targetY = containerRef.current.clientHeight / 2;

    if (clientX !== undefined && clientY !== undefined) {
      const rect = containerRef.current.getBoundingClientRect();
      targetX = clientX - rect.left;
      targetY = clientY - rect.top;
    }

    const imageX = (targetX - position.x) / scale;
    const imageY = (targetY - position.y) / scale;

    const newScale = Math.max(0.5, Math.min(5, scale * factor));
    const newX = targetX - imageX * newScale;
    const newY = targetY - imageY * newScale;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Mouse Dragging (Desktop)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Dragging (Mobile), Pinch Zoom, & Mouse Wheel Zoom via Native Event Listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStartRaw = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom starts
        const dist = getDistance(e.touches[0], e.touches[1]);
        touchStartDistRef.current = dist;
        touchStartScaleRef.current = scaleRef.current;
        touchStartCenterRef.current = getTouchCenter(e.touches[0], e.touches[1]);
        touchStartPosRef.current = positionRef.current;
        setIsDragging(false);
      } else if (e.touches.length === 1) {
        // Pan starts
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - positionRef.current.x, y: touch.clientY - positionRef.current.y });
        touchStartDistRef.current = null;
        touchStartCenterRef.current = null;
      }
    };

    const handleTouchMoveRaw = (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStartDistRef.current && touchStartCenterRef.current) {
        // Prevent default browser pinch-to-zoom on page
        e.preventDefault();

        const dist = getDistance(e.touches[0], e.touches[1]);
        const factor = dist / touchStartDistRef.current;
        const newScale = Math.max(0.5, Math.min(5, touchStartScaleRef.current * factor));

        const rect = container.getBoundingClientRect();
        const targetX = touchStartCenterRef.current.x - rect.left;
        const targetY = touchStartCenterRef.current.y - rect.top;

        const imageX = (targetX - touchStartPosRef.current.x) / touchStartScaleRef.current;
        const imageY = (targetY - touchStartPosRef.current.y) / touchStartScaleRef.current;

        const newX = targetX - imageX * newScale;
        const newY = targetY - imageY * newScale;

        setScale(newScale);
        setPosition({ x: newX, y: newY });
      } else if (e.touches.length === 1 && isDraggingRef.current) {
        // Pan continues
        const touch = e.touches[0];
        const newX = touch.clientX - dragStartRef.current.x;
        const newY = touch.clientY - dragStartRef.current.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleTouchEndRaw = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        setIsDragging(false);
        touchStartDistRef.current = null;
        touchStartCenterRef.current = null;
      } else if (e.touches.length === 1) {
        // Transition from pinch to single-touch pan
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - positionRef.current.x, y: touch.clientY - positionRef.current.y });
        touchStartDistRef.current = null;
        touchStartCenterRef.current = null;
      }
    };

    const handleWheelRaw = (e: WheelEvent) => {
      // Prevent default page scroll when using mouse wheel over the container
      e.preventDefault();
      
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      
      const rect = container.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      const targetY = e.clientY - rect.top;

      const scaleVal = scaleRef.current;
      const posVal = positionRef.current;

      const imageX = (targetX - posVal.x) / scaleVal;
      const imageY = (targetY - posVal.y) / scaleVal;

      const newScale = Math.max(0.5, Math.min(5, scaleVal * factor));
      const newX = targetX - imageX * newScale;
      const newY = targetY - imageY * newScale;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    };

    container.addEventListener('touchstart', handleTouchStartRaw, { passive: true });
    container.addEventListener('touchmove', handleTouchMoveRaw, { passive: false });
    container.addEventListener('touchend', handleTouchEndRaw, { passive: true });
    container.addEventListener('wheel', handleWheelRaw, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStartRaw);
      container.removeEventListener('touchmove', handleTouchMoveRaw);
      container.removeEventListener('touchend', handleTouchEndRaw);
      container.removeEventListener('wheel', handleWheelRaw);
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Interactive Container */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[450px] lg:h-[550px] bg-[#F8F8FA] border border-slate-150 rounded-3xl overflow-hidden relative cursor-grab select-none active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {/* Sleek Custom Light Toolbar in Bottom-Right */}
        <div className="absolute bottom-4 right-4 z-20 flex flex-row items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200/80 px-2 py-1.5 rounded-2xl shadow-md">
          {/* Zoom Percentage */}
          <span className="text-xs font-bold text-slate-700 select-none min-w-[2.75rem] text-center font-mono mr-1">
            {Math.round(scale * 100)}%
          </span>
          
          {/* Divider */}
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
          
          {/* Zoom Out Button */}
          <button
            onClick={() => handleZoom(0.8)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
            title="Perkecil"
          >
            <span className="text-lg font-semibold select-none leading-none">&#8722;</span>
          </button>
          
          {/* Zoom In Button */}
          <button
            onClick={() => handleZoom(1.25)}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
            title="Perbesar"
          >
            <span className="text-lg font-semibold select-none leading-none">+</span>
          </button>
          
          {/* Divider */}
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />

          {/* Reset Button (Rotate Counter-Clockwise Icon) */}
          <button
            onClick={resetView}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-all duration-200 active:scale-95 cursor-pointer"
            title="Reset Tampilan"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        {/* The Organization Chart Image */}
        <div
          className="absolute origin-top-left transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: `${imgWidth}px`,
            height: `${imgHeight}px`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={imgWidth}
            height={imgHeight}
            className="object-contain w-full h-full pointer-events-none select-none"
            priority
          />
        </div>
      </div>
    </div>
  );
}
