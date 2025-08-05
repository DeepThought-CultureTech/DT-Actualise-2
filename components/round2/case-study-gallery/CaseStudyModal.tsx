import { useEffect, useMemo } from "react";
import { X, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import TiptapEditor from "@/components/tiptap/TiptapEditor";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";
import axios from "axios";

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  role: string;
  tags: string[];
  content: string;
  readCount: number;
}

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

const CaseStudyModal = ({ caseStudy, isOpen, onClose }: CaseStudyModalProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { data: session, status } = useSession();

  const caseStudyContent = useMemo(() => {
    if (!caseStudy?.content) return null;
    try {
      return JSON.parse(caseStudy.content);
    } catch (error) {
      console.error("Failed to parse caseStudy content:", error);
      return null;
    }
  }, [caseStudy]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !caseStudy) return null;

  const handleLockInRole = () => {
    async function createRound2Attempt() {
      const response = await axios({
        url: '/api/v1/round/2/attempt',
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        data: {
          userId: session?.user.uid,
          caseStudyId: caseStudy?.id
        }
      })

      if(response.status != 200) {
        showToast('error', 'Unable to Lock in Case Study', 3000);
      } else {
        const attemptId = response.data.attemptId;
        router.push(`/round/2/baby-step?id=${attemptId}`);
      }
    }
    
    createRound2Attempt();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-[1100px] bg-white max-h-[90vh] rounded-lg shadow-xl flex flex-col overflow-hidden mx-4">
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
                  <span key={index} className="text-xs px-2 py-0.5 border border-gray-300 rounded text-gray-600" >
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
        <div className="overflow-y-auto flex flex-col items-center px-4 sm:px-6 py-4 flex-1">
          <p className="text-gray-500 mb-6">{caseStudy.description}</p>
          {caseStudyContent ? (
            <TiptapEditor editable={false} content={caseStudyContent} />
          ) : (
            <p className="text-sm text-gray-500 italic">No content available or failed to load.</p>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t bg-gray-50">
          <div className="flex justify-center gap-3">
            <button
              onClick={handleLockInRole}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center w-full sm:w-auto hover:bg-blue-700 transition"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyModal;