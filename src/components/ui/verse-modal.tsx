import React from 'react';

interface VerseModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseText: string;
}

const VerseModal: React.FC<VerseModalProps> = ({ isOpen, onClose, verseText }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        <div className="overflow-y-auto flex-grow mt-4">
          <p>{verseText}</p>
        </div>
      </div>
    </div>
  );
};

export default VerseModal;