import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ImageComparer from './components/ImageComparer';
import AIGenerator from './components/AIGenerator';
import { useLocalization } from './hooks/useLocalization';
import LanguageSelector from './components/LanguageSelector';

export type ImageFile = {
  src: string;
  width: number;
  height: number;
};

export type ComparisonMode = 'slider' | 'opacity' | 'toggle';

const App: React.FC = () => {
  const [beforeImage, setBeforeImage] = useState<ImageFile | null>(null);
  const [afterImage, setAfterImage] = useState<ImageFile | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');
  const { t } = useLocalization();

  const handleAiImageGenerated = (imageFile: ImageFile) => {
    setAfterImage(imageFile);
    setActiveTab('manual');
  };

  const renderManualContent = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ImageUploader 
          label={t('beforeImageLabel')}
          onImageUpload={setBeforeImage}
          imageFile={beforeImage}
          id="before-uploader"
        />
        <ImageUploader 
          label={t('afterImageLabel')}
          onImageUpload={setAfterImage}
          imageFile={afterImage}
          id="after-uploader"
        />
      </div>

      <section aria-labelledby="comparison-title">
        <h2 id="comparison-title" className="sr-only">{t('imageComparison')}</h2>
        {beforeImage && afterImage ? (
          <ImageComparer 
            beforeImage={beforeImage} 
            afterImage={afterImage} 
          />
        ) : (
          <div 
            className="w-full bg-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 transition-all duration-300"
            style={{
              aspectRatio: beforeImage ? `${beforeImage.width} / ${beforeImage.height}` : '16 / 9'
            }}
          >
            <p className="text-gray-500 text-lg text-center p-4">
              {beforeImage ? t('uploadAfterPrompt') : t('uploadBothPrompt')}
            </p>
          </div>
        )}
      </section>
    </>
  );

  const renderAiContent = () => (
    <AIGenerator
      onImageGenerated={handleAiImageGenerated}
    />
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center my-8 md:my-12 relative">
           <div className="absolute top-0 right-0 flex items-center space-x-4">
            <LanguageSelector />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
              {t('titleAI')}
            </span>
            <span className="block sm:inline"> {t('titleComparer')}</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </header>
        
        <div className="mb-8 flex justify-center border-b border-gray-200">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'manual' ? 'border-b-2 border-pink-500 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            aria-pressed={activeTab === 'manual'}
          >
            {t('manualCompareTab')}
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'ai' ? 'border-b-2 border-pink-500 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            aria-pressed={activeTab === 'ai'}
          >
            {t('aiGenerateTab')}
          </button>
        </div>

        {activeTab === 'manual' ? renderManualContent() : renderAiContent()}

        <footer className="text-center mt-16 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {t('title')}. {t('footerRights')}</p>
        </footer>
      </main>
    </div>
  );
};

export default App;