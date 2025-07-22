'use client';
import React, { useState, useEffect } from 'react';
import { Sprout, Save } from 'lucide-react';
import TimerModal from '@/components/round1/TimeModal';

const Page = () => {
    const [timeline, setTimeline] = useState('');
    const [babySteps, setBabySteps] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error' | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timelineHours, setTimelineHours] = useState<number | null>(null);


    const handleSave = () => {
        if (!babySteps.trim()) {
            setToastMessage("Please add your baby steps. Write something before saving.");
            setToastType('error');
            return;
        }

        setToastMessage("Baby steps saved! ✨ Your progress has been captured.");
        setToastType('success');
    };

    useEffect(() => {
        if (toastMessage) {
            const timeout = setTimeout(() => {
                setToastMessage('');
                setToastType(null);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [toastMessage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 bg-gray-100">
            <div className="container mx-auto px-4 py-16 max-w-3xl">
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
                        { title: 'Role Applied', value: 'Frontend Developer' },
                        { title: 'Case Study Chosen', value: 'Technical Project' },
                    ].map((item) => (
                        <div key={item.title} className="bg-white rounded-2xl border-2 p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h2>
                            <p className="text-gray-600 text-base">{item.value}</p>
                        </div>
                    ))}

                    {/* Timeline Selector */}
                    {/* <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Self-defined Timeline</h2>
                        <div className="relative">
                            <select
                                value={timeline}
                                onChange={(e) => setTimeline(e.target.value)}
                                className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 pr-10 bg-white text-gray-700 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>Choose your timeline</option>
                                <option value="1-week">1 Week</option>
                                <option value="2-weeks">2 Weeks</option>
                                <option value="1-month">1 Month</option>
                                <option value="2-months">2 Months</option>
                                <option value="3-months">3 Months</option>
                                <option value="flexible">Flexible</option>
                            </select>
                            <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div> */}
                    {/* Timeline Selector (Replaced with Modal Trigger) */}
                    <div className="bg-white rounded-2xl border-2 p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Self-defined Timeline</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {timelineHours ? `Timeline: ${timelineHours}h` : 'Set Timeline'}
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

            {/* Toast */}
            {toastMessage && (
                <div
                    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg text-lg shadow-lg z-50 transition duration-300 ${toastType === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                        }`}
                >
                    {toastMessage}
                </div>
            )}
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

export default Page;
