import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ImageFile, ComparisonMode } from '../App';
import ModeSelector from './ModeSelector';
import ActionButtons from './ActionButtons';
import ZoomControls from './ZoomControls';
import { useLocalization } from '../hooks/useLocalization';

interface ImageComparerProps {
  beforeImage: ImageFile;
  afterImage: ImageFile;
}

const ImageComparer: React.FC<ImageComparerProps> = ({ beforeImage, afterImage }) => {
  const { t } = useLocalization();
  const [mode, setMode] = useState<ComparisonMode>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [opacity, setOpacity] = useState(50);
  const [showAfterToggle, setShowAfterToggle] = useState(false);
  
  const [transform, setTransform] = useState({ scale: 1, offsetX: 0, offsetY: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSliderRef = useRef(false);
  const isPanningRef = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  const { width, height } = beforeImage;

  const handleMoveSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let newPosition = (x / rect.width) * 100;
    if (newPosition < 0) newPosition = 0;
    if (newPosition > 100) newPosition = 100;
    setSliderPosition(newPosition);
  }, []);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.slider-handle')) {
        e.preventDefault();
        isDraggingSliderRef.current = true;
    } else {
        isPanningRef.current = true;
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.slider-handle')) {
        isDraggingSliderRef.current = true;
    } else {
        isPanningRef.current = true;
        lastPanPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const resetView = () => {
    setTransform({ scale: 1, offsetX: 0, offsetY: 0 });
  };
  
  const zoomIn = () => setTransform(t => ({ ...t, scale: Math.min(t.scale + 0.2, 5) }));
  const zoomOut = () => setTransform(t => ({ ...t, scale: Math.max(t.scale - 0.2, 0.5) }));

  useEffect(() => {
    const handleMouseUp = () => {
      isDraggingSliderRef.current = false;
      isPanningRef.current = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSliderRef.current) {
        handleMoveSlider(e.clientX);
      }
      if (isPanningRef.current) {
        const dx = e.clientX - lastPanPoint.current.x;
        const dy = e.clientY - lastPanPoint.current.y;
        setTransform(t => ({ ...t, offsetX: t.offsetX + dx, offsetY: t.offsetY + dy }));
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleTouchEnd = () => {
      isDraggingSliderRef.current = false;
      isPanningRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSliderRef.current) {
        handleMoveSlider(e.touches[0].clientX);
      }
      if (isPanningRef.current) {
        const dx = e.touches[0].clientX - lastPanPoint.current.x;
        const dy = e.touches[0].clientY - lastPanPoint.current.y;
        setTransform(t => ({ ...t, offsetX: t.offsetX + dx, offsetY: t.offsetY + dy }));
        lastPanPoint.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleMoveSlider]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(e.key === 'ArrowLeft') {
            setSliderPosition(p => Math.max(0, p-1));
        } else if (e.key === 'ArrowRight') {
            setSliderPosition(p => Math.min(100, p+1));
        } else if (e.key === ' ') {
            if(mode === 'toggle') {
                e.preventDefault();
                setShowAfterToggle(s => !s);
            }
        } else if (e.key === 'Escape') {
            resetView();
        } else if (e.key === '+') {
            zoomIn();
        } else if (e.key === '-') {
            zoomOut();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const imageStyle = {
    transform: `translate(${transform.offsetX}px, ${transform.offsetY}px) scale(${transform.scale})`,
  };

  return (
    <div className="space-y-4">
       <ModeSelector selectedMode={mode} onModeChange={setMode} />
       <div 
        ref={containerRef} 
        className="relative w-full select-none overflow-hidden rounded-2xl shadow-2xl bg-gray-200 cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: `${width} / ${height}` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={() => mode === 'toggle' && setShowAfterToggle(s => !s)}
      >
        <div className="absolute inset-0 w-full h-full">
            <img 
                src={beforeImage.src} 
                alt={t('before')}
                className="absolute w-full h-full object-contain pointer-events-none transition-transform duration-200 ease-out"
                style={imageStyle}
            />
            {mode === 'slider' && (
                <div 
                    className="absolute w-full h-full pointer-events-none" 
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                    <img src={afterImage.src} alt={t('after')} className="absolute w-full h-full object-contain pointer-events-none transition-transform duration-200 ease-out" style={imageStyle}/>
                </div>
            )}
             {mode === 'opacity' && (
                <img 
                    src={afterImage.src} 
                    alt={t('after')}
                    className="absolute w-full h-full object-contain pointer-events-none transition-transform duration-200 ease-out" 
                    style={{...imageStyle, opacity: opacity / 100}}
                />
            )}
            {mode === 'toggle' && (
                <img 
                    src={afterImage.src} 
                    alt={t('after')}
                    className={`absolute w-full h-full object-contain pointer-events-none transition-opacity duration-300 ${showAfterToggle ? 'opacity-100' : 'opacity-0'}`}
                    style={imageStyle}
                />
            )}
        </div>

        {mode === 'slider' && (
            <div
                className="absolute top-0 bottom-0 w-1 bg-white/70 cursor-ew-resize slider-handle"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
                <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-white/90 shadow-lg backdrop-blur-sm flex items-center justify-center cursor-ew-resize ring-2 ring-white/30"
                >
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
                </div>
            </div>
        )}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full pointer-events-none">
          {t('before')}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs sm:text-sm px-3 py-1 rounded-full pointer-events-none">
          {t('after')}
        </div>
        <ZoomControls onZoomIn={zoomIn} onZoomOut={zoomOut} />
      </div>
      {mode === 'opacity' && (
        <div className="flex items-center gap-4">
            <label htmlFor="opacity-slider" className="text-sm text-gray-500">{t('opacity')}</label>
            <input 
                id="opacity-slider"
                type="range" 
                min="0" 
                max="100" 
                value={opacity} 
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer custom-range"
            />
        </div>
      )}
      <ActionButtons 
        onResetView={resetView}
      />
    </div>
  );
};

export default ImageComparer;