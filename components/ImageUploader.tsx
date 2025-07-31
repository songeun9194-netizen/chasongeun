import React, { useRef } from 'react';
import UploadIcon from './icons/UploadIcon';
import { ImageFile } from '../App';
import { useLocalization } from '../hooks/useLocalization';

interface ImageUploaderProps {
  label: string;
  onImageUpload: (file: ImageFile | null) => void;
  imageFile: ImageFile | null;
  id: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, onImageUpload, imageFile, id }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLocalization();

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const img = new Image();
      img.onload = () => {
        onImageUpload({
          src: dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageUpload(null);
    if(inputRef.current) {
      inputRef.current.value = "";
    }
  }


  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">{label}</h2>
      <div className="relative bg-gray-100 rounded-xl overflow-hidden group">
        <input
          type="file"
          id={id}
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
          ref={inputRef}
        />
        <label
          htmlFor={id}
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-gray-200/50 transition-colors duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {imageFile ? (
            <img src={imageFile.src} alt={label} className="w-full h-auto object-cover block" />
          ) : (
            <div className="w-full aspect-video flex flex-col items-center justify-center text-center text-gray-500 p-4">
              <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">{t('uploadCTA')}</p>
              <p className="text-xs mt-1">{t('supportedFormats')}</p>
            </div>
          )}
        </label>
         {imageFile && (
            <button 
              onClick={handleClearImage}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-label={`${t('clear')} ${label}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
      </div>
    </div>
  );
};

export default ImageUploader;