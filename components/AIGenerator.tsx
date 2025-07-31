import React, { useState } from 'react';
import { ImageFile } from '../App';
import { generateImageFromPrompt } from '../lib/gemini';
import { useLocalization } from '../hooks/useLocalization';

interface AIGeneratorProps {
  onImageGenerated: (file: ImageFile) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onImageGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
  const { t } = useLocalization();

  const handleGenerate = async () => {
    if (!prompt) {
      setError(t('errorPromptNoPrompt'));
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const result = await generateImageFromPrompt(prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError(t(err instanceof Error ? err.message : 'errorUnknown'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseAsAfter = () => {
    if (generatedImage) {
        onImageGenerated(generatedImage);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center space-y-4">
           <h2 className="text-lg font-semibold text-gray-700">{t('promptDescriptionAI')}</h2>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('promptPlaceholderAI')}
                className="w-full h-40 p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200 resize-none"
                disabled={isLoading}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('generating')}
                    </>
                ) : t('generateButtonAI')}
            </button>
             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">{t('generatedImage')}</h2>
            <div className="w-full aspect-video bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 transition-all duration-300">
                {isLoading ? (
                     <div className="flex flex-col items-center text-gray-500">
                        <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-2">{t('generating')}</p>
                    </div>
                ) : generatedImage ? (
                    <img src={generatedImage.src} alt={t('generatedImage')} className="w-full h-auto object-contain rounded-xl" />
                ) : (
                    <p className="text-gray-500 p-4 text-center">{t('aiImagePlaceholder')}</p>
                )}
            </div>
            {generatedImage && !isLoading && (
                 <button
                    onClick={handleUseAsAfter}
                    className="mt-4 w-full px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                    {t('useAsAfter')}
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;