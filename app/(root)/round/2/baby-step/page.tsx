'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Sprout, Save } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/round1/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import TimerModal from '@/components/round1/TimeModal';
import { formatEndTime } from '@/lib/utils';
import axios from 'axios';

const Page = () => {
    const { showToast } = useToast();
    const [babySteps, setBabySteps] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const attemptId = useSearchParams().get('id');
    const [roleApplied, setRoleApplied] = useState("");
    const [caseStudyChosen, setCaseStudyChosen] = useState("");
    const [timelineHours, setTimelineHours] = useState<number | null>(null);
    
    const handleSave = () => {
        if (!babySteps.trim()) {
            showToast("error", "Please write your baby steps", 3000)
            return;
        }

        showToast("loading", "Submitting Baby Steps", 3000)

        async function submitBabySteps() {
            const now = new Date();
            now.setHours(now.getHours() + (timelineHours as any));

            const response = await axios({
                url: `/api/v1/round/2/attempt?id=${attemptId}`,
                method: 'PUT',
                headers: { 'Content-Type': "application/json" },
                data: {
                    selfDefinedTimeline: now.toISOString(),
                    babySteps
                }
            });

            if(response.status != 200) {
                showToast("error", 'Unable to Submit Baby Steps', 3000);
            } else {
                showToast("success", "Baby Steps Submmitted", 3000)
                router.push(`/round/2/submit-assignment?id=${attemptId}`)
            }
        }

        submitBabySteps();
    };

    useEffect(() => {
        if(!attemptId) return;
        async function getAttemptData(id: string) {
            const response = await axios({
                url: `/api/v1/round/2/attempt?id=${id}`,
                method: 'GET',
                headers: { 'Content-Type': "application/json" }
            });


            if(response.status != 200) {
                showToast('error', "Unable to fetch user details", 3000);
            } else {
                setRoleApplied(response.data.roleTitle);
                setCaseStudyChosen(response.data.caseStudyTitle);
            }
        }

        getAttemptData(attemptId);
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 bg-gray-100">
            <div className="container mx-auto px-4 py-5 max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-blue-600 rounded-2xl py-8 px-6 shadow-lg">
                        <div className="flex items-center justify-center gap-4 mb-3">
                            <Sprout className="w-10 h-10 text-white" />
                            <h1 className="text-5xl font-bold text-white tracking-tight">Baby Steps</h1>
                        </div>
                        <p className="text-xl text-blue-100 font-medium">Small steps, big progress</p>
                    </div>
                </div>

                {/* Main Form */}
                <div className="space-y-8">
                    {/* Info Cards */}
                    {[
                        { title: 'Role Applied', value: roleApplied },
                        { title: 'Case Study Chosen', value: caseStudyChosen },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-2xl border-2 p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                            <p className="text-gray-600 text-lg">{item.value}</p>
                        </div>
                    ))}

                    {/* Timeline Selector (Replaced with Modal Trigger) */}
                    <div className="bg-white rounded-2xl border-2 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Self-defined Timeline</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {timelineHours ? `${formatEndTime(timelineHours)}` : 'Set Timeline'}
                        </button>
                    </div>


                    {/* Baby Steps Text Area */}
                    <div className="bg-white rounded-2xl border-2 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Baby Steps</h2>
                        <textarea
                            placeholder="Write your baby steps here... What small actions will you take to reach your goal?"
                            value={babySteps}
                            onChange={(e) => setBabySteps(e.target.value)}
                            className="w-full min-h-[12rem] border border-gray-300 rounded-lg p-4 text-base text-gray-700 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full mt-5 flex items-center justify-center bg-blue-600 text-white py-3 text-lg px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        >
                            <Save className="w-5 h-5 mr-3" />
                            Submit
                        </button>
                    </div>
                </div>
            </div>

            <TimerModal
                isOpen={isModalOpen}
                onTimelineSet={(hours) => {
                    setTimelineHours(hours);
                    setIsModalOpen(false);
                }}
            />

        </div>
    );
};

const BabyStepsPage: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Page />
    </Suspense>
  );
};

export default BabyStepsPage;
