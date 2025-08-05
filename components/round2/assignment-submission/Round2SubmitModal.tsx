'use client';

import { Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Round2SubmitModalProps {
  show: boolean;
  loading: boolean;
  onCopy?: () => void;
  onClose?: () => void;
  whatsappGroupLink: string;
}

export default function Round2SubmitModal({
  show,
  loading,
  onCopy,
  onClose,
  whatsappGroupLink,
}: Round2SubmitModalProps) {
  const router = useRouter();

  if (!show) return null;

  const handleJoinWhatsApp = () => {
    window.open(whatsappGroupLink, '_blank');
    onClose?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-lg">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700">Submitting your responses...</p>
          </div>
        ) : (
          <div>
            <h2 className="flex justify-center text-lg font-bold text-gray-800 mb-[-15px]">
              Round 2 Completed!! 🥳🎯
            </h2>
            <div className="my-6 text-center space-y-2">
              <p className="text-blue-600 text-xl font-semibold">Great progress!</p>
              <p className="text-gray-700 text-sm sm:text-base">
                You're all set. Join the WhatsApp group to stay updated with the next steps.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <button
                onClick={handleJoinWhatsApp}
                className="px-5 py-2 bg-blue-600 text-white rounded-[0.5rem] font-semibold hover:bg-blue-700 transition-all text-center"
              >
                Join WhatsApp Group
              </button>
              {onCopy && (
                <button
                  onClick={onCopy}
                  className="p-2 border rounded-xl hover:bg-gray-100 transition"
                  title="Copy Link"
                >
                  <Copy className="w-[25px] h-[25px] text-gray-600" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
