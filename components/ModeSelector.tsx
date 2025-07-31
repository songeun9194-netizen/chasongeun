import React from 'react';
import { ComparisonMode } from '../App';
import { useLocalization } from '../hooks/useLocalization';

interface ModeSelectorProps {
  selectedMode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
  const { t } = useLocalization();

  const modes: { id: ComparisonMode; label: string }[] = [
    { id: 'slider', label: t('slider') },
    { id: 'opacity', label: t('opacity') },
    { id: 'toggle', label: t('toggle') },
  ];

  return (
    <div className="flex justify-center items-center bg-gray-200 rounded-lg p-1 space-x-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-200 ${
            selectedMode === mode.id
              ? 'bg-purple-600 text-white shadow'
              : 'text-gray-600 hover:bg-gray-300'
          }`}
          aria-pressed={selectedMode === mode.id}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;