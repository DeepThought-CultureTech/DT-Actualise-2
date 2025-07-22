import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  role: string;
  tags: string[];
  content?: string;
  readCount: number;
}

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyModal = ({ caseStudy, isOpen, onClose }: CaseStudyModalProps) => {
  const router = useRouter();
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !caseStudy) return null;

  const handleLockInRole = () => {
    // alert(`Locked in as ${caseStudy.role}! Redirecting...`);
    router.push('/round/2/baby-step');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[95vw] sm:w-[600px] lg:w-[900px] max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden mx-4">
        {/* Header */}
        <div className="flex justify-between items-start p-4 sm:p-6 border-b">
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{caseStudy.title}</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="inline-block text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">
                {caseStudy.role}
              </span>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {caseStudy.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 border border-gray-300 rounded text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 sm:px-6 py-4 flex-1">
          <p className="text-gray-500 mb-6">{caseStudy.description}</p>
          {caseStudy.content ? (
            <div className="prose prose-sm max-w-none">
              {caseStudy.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No content available.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
              Read by {caseStudy.readCount}+ professionals
            </p>
            <button
              onClick={handleLockInRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full sm:w-auto hover:bg-blue-700 transition"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Lock in this role
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;
