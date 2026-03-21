import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 max-w-md w-full animate-in zoom-in-95 duration-200">
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className="px-5 py-2.5 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-icons-outlined text-[18px]">delete</span>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
