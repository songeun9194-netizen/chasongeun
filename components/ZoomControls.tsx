
import React from 'react';
import ZoomInIcon from './icons/ZoomInIcon';
import ZoomOutIcon from './icons/ZoomOutIcon';
import { useLocalization } from '../hooks/useLocalization';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({ onZoomIn, onZoomOut }) => {
    const { t } = useLocalization();
  return (
    <div className="absolute bottom-3 right-3 flex items-center space-x-2">
      <button
        onClick={onZoomOut}
        aria-label={t('zoomOut')}
        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
      >
        <ZoomOutIcon className="w-5 h-5" />
      </button>
      <button
        onClick={onZoomIn}
        aria-label={t('zoomIn')}
        className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
      >
        <ZoomInIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ZoomControls;
