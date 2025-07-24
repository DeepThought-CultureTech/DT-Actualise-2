'use client';
import CreateAssignment from "@/components/round2/assignment-submission/CreateDocument";
import ReadCaseStudy from "@/components/round2/assignment-submission/ReadCaseStudy";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/components/Toast";

export default function page() {
    const [assignmentContent, setAssignmentContent] = useState({});
    const [assignmentSummary, setAssignmentSummary] = useState("");
    const [isCreatingDocument, setisCreatingDocument] = useState(false);
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
                const contentJson = JSON.parse(response.data.caseStudyContent)
                setCaseStudyContent(contentJson)
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

    const toggleView = () => { setisCreatingDocument((prev) => !prev) }

    if (loading) return (
        <div className="font-sans flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-xl font-semibold text-blue-600 animate-pulse">
                Loading Case Study...
            </div>
        </div>
    )

    if (isSubmitted) return (
        <div className="fixed inset-0 z-50 h-screen flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">🎉 Assignment Submitted!</h2>
                <p className="text-gray-700 mb-4">Your response has been successfully recorded.</p>
            </div>
        </div>
    )

    return (
        <div className='flex justify-center h-screen'>
            {isCreatingDocument ?
                <CreateAssignment content={assignmentContent} toggle={toggleView} updateContent={setAssignmentContent} updateSummary={setAssignmentSummary} submitAssignment={handleSubmit} /> :
                <ReadCaseStudy content={caseStudyContent} toggle={toggleView} />
            }
        </div>
    )
}