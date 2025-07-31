import React from 'react';
import ResetIcon from './icons/ResetIcon';
import { useLocalization } from '../hooks/useLocalization';

interface ActionButtonsProps {
  onResetView: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onResetView }) => {
    const { t } = useLocalization();

  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button 
        onClick={onResetView}
        className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
      >
        <ResetIcon className="w-5 h-5 mr-2" />
        {t('resetView')}
      </button>
    </div>
  );
};

export default ActionButtons;