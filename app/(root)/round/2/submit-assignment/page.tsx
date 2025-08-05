'use client';
import CreateAssignment from "@/components/round2/assignment-submission/CreateDocument";
import ReadCaseStudy from "@/components/round2/assignment-submission/ReadCaseStudy";
import axios from "axios";
import LoadingSpinner from "@/components/round1/LoadingSpinner";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useToast } from "@/components/Toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Page = () => {
    const [assignmentContent, setAssignmentContent] = useState({});
    const [assignmentSummary, setAssignmentSummary] = useState("");
    const [isCaseStudyVisible, setIsCaseStudyVisible] = useState(true);
    const [caseStudyContent, setCaseStudyContent] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const attemptId = useSearchParams().get('id');

    useEffect(() => {
        const isAlreadySubmitted = localStorage.getItem('isRound2Submitted');
        if (isAlreadySubmitted) setIsSubmitted(true)

        async function getCaseStudy() {
            const response = await axios({
                url: `/api/v1/round/2/attempt?id=${attemptId}`,
                method: 'GET',
                headers: { 'Content-Type': "application/json" }
            });

            if (response.status != 200) {
                showToast('error', 'Unable to get Case Study', 3000);
            } else {
                const contentJson = JSON.parse(response.data.caseStudyContent);
                setCaseStudyContent(contentJson);
                setLoading(false);
            }
        }

        getCaseStudy();
    }, []);

    const handleSubmit = () => {
        if (!assignmentContent || !assignmentSummary) {
            showToast('error', 'Please fill the Assignment & Summary');
            return;
        }
        if (assignmentSummary.length > 200) {
            showToast('error', 'Summary must be less than 200 characters', 3000);
            return;
        }
        async function submitAssignment() {
            showToast('loading', 'Submitting Assignment', 3000);
            const response = await axios({
                url: `/api/v1/round/2/attempt?id=${attemptId}`,
                method: 'PUT',
                headers: { 'Content-Type': "application/json" },
                data: {
                    submission: JSON.stringify(assignmentContent),
                    summary: assignmentSummary,
                    isSubmitted: true
                }
            });

            if (response.status != 200) {
                showToast('error', 'Unable to submit assignment', 3000);
            } else {
                showToast('success', 'Assignment Submitted!', 3000);
                setIsSubmitted(true);
                localStorage.setItem('isRound2Submitted', JSON.stringify(true));
            }
        }

        submitAssignment();
    }

    const toggleCaseStudy = () => setIsCaseStudyVisible(prev => !prev);

    if (loading) return (
        <div className="font-sans flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-xl font-semibold text-blue-600 animate-pulse">
                Loading Case Study...
            </div>
        </div>
    )

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">

  {/* Header with Title and Toggle Button */}
  <div className="w-full flex justify-between items-center px-6 py-4">
    <span className="text-4xl tracking-tight font-bold text-blue-600 font-sans">
      Create Submission
    </span>
   <button
  onClick={toggleCaseStudy}
  className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 font-sans"
  title="Toggle Case Study"
>
  {isCaseStudyVisible ? (
    <>
      <ChevronLeft className="w-5 h-5" />
      <span>Hide Case Study</span>
    </>
  ) : (
    <>
      <ChevronRight className="w-5 h-5" />
      <span>Read Case Study</span>
      
    </>
  )}
</button>

  </div>

  {/* Content Section: Case Study + Assignment Side-by-Side */}
  <div className={`flex flex-grow w-full px-6 gap-6 ${isCaseStudyVisible ? 'justify-between' : 'justify-center'}`}>
    {/* Left Panel: Case Study */}
    {isCaseStudyVisible && (
      <div className="w-1/2 overflow-y-auto mt-2">
        <ReadCaseStudy content={caseStudyContent} />
      </div>
    )}

    {/* Right Panel: Create Assignment */}
    <div className="flex-grow flex items-center justify-center mt-2">
      <CreateAssignment
        content={assignmentContent}
        updateContent={setAssignmentContent}
        updateSummary={setAssignmentSummary}
        submitAssignment={handleSubmit}
      />
    </div>
  </div>

  {/* Submission Overlay */}
  {isSubmitted && (
    <div className="fixed inset-0 z-50 flex overflow-hidden items-center justify-center backdrop-blur-sm bg-gray-600/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🎉 Assignment Submitted!</h2>
        <p className="text-gray-700 mb-4">Your response has been successfully recorded.</p>
      </div>
    </div>
  )}
</div>

    );
}

const SubmitAssignmentPage: React.FC = () => {
    return (
        <Suspense>
            <Page />
        </Suspense>
    );
}

export default SubmitAssignmentPage;
