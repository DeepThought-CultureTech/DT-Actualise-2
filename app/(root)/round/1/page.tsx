"use client"

import React, { useState, useEffect, Suspense } from 'react';
import QuestionCard, { QuestionData } from '@/components/round1/QuestionCard';
import TimerModal from '@/components/round1/TimeModal';
import CTAModal from '@/components/round1/FeedbackModal';
import LoadingSpinner from '@/components/round1/LoadingSpinner';
import ProgressBar from '@/components/round1/ProgressBar';
import NavigationButtons from '@/components/round1/NavigationButtons';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';
import { useStorage } from '@/lib/hooks/useStorage';
import axios from 'axios';
import { updateUserStatus } from '@/lib/apiUtil';

// Separate component that uses useSearchParams
const Round1Content: React.FC = () => {
  const MIN_CHARS = 150;
  const { showToast } = useToast();
  const { data: session, status, update } = useSession();
  const { getStorageItem, setStorageItem, removeStorageItem } = useStorage();
  const attemptId = useSearchParams().get('id'); // This is now inside Suspense boundary
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [questionsData, setQuestionsData] = useState<QuestionData[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isCurrentQuestionValid, setIsCurrentQuestionValid] = useState(false);

  const cleanUp = () => {
    removeStorageItem('selfDefinedTimeline');
    removeStorageItem('aifeedback');
    removeStorageItem(`answers_${attemptId}`);
    removeStorageItem(`currentQuestion_${attemptId}`);
    removeStorageItem('isSubmitted');
  };

  const formatDeadline = (date: Date) => date.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Check timeline and submission status
  useEffect(() => {
    if (getStorageItem('isSubmitted', false)) return;

    const savedTimeline = getStorageItem('selfDefinedTimeline');
    if (savedTimeline) {
      const savedDeadline = new Date(savedTimeline);
      if (savedDeadline > new Date()) {
        setDeadline(savedDeadline);
        setIsModalOpen(false);
      } else {
        removeStorageItem('selfDefinedTimeline');
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  }, [getStorageItem, removeStorageItem]);

  // Fetch questions
  useEffect(() => {
    if (!attemptId) return;
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`/api/v1/round/1/attempt?id=${attemptId}`, 
          { 
            validateStatus: (status) => { return status < 500 }
          }
        );

        if(response.status == 409) {
          setRoleTitle(response.data.roleTitle);
          showToast('info', 'Round 1 already attempted for this role', 3000);
          setIsModalOpen(false);
          setIsSubmitted(true);
          return
        }

        let totalQuestions = 0;
        response.data.scenarios.forEach((scenario: any) =>{
          totalQuestions += scenario.questions.length;
        });
        setTotalQuestions(totalQuestions);
        setQuestionsData(response.data.scenarios || []);
        setRoleTitle(response.data.roleTitle);

      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [attemptId]);

  // Load saved data
  useEffect(() => {
    if (!attemptId) return;

    const savedAnswers = getStorageItem(`answers_${attemptId}`, {});
    const savedQuestionIndex = parseInt(localStorage.getItem(`currentQuestion_${attemptId}`) || '0', 10);

    setAnswers(savedAnswers);
    if (!isNaN(savedQuestionIndex) && savedQuestionIndex >= 0) {
      setCurrentQuestionIndex(savedQuestionIndex);
    }
  }, [attemptId, getStorageItem]);

  // Save current question index
  useEffect(() => {
    if (attemptId && currentQuestionIndex >= 0) {
      try {
        localStorage.setItem(`currentQuestion_${attemptId}`, currentQuestionIndex.toString());
      } catch (error) {
        console.error('LocalStorage unavailable');
      }
    }
  }, [currentQuestionIndex, attemptId]);

  // Load post-submission state
  useEffect(() => {
    if (getStorageItem('isSubmitted', false)) {
      setIsSubmitted(true);
    }
  }, [getStorageItem]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);
    if (attemptId) setStorageItem(`answers_${attemptId}`, newAnswers);
  };

  const handleTimelineSet = async (hours: number) => {
    const endTime = new Date(Date.now() + hours * 60 * 60 * 1000);
    const endTimelineDate = endTime.toISOString();

    setStorageItem('selfDefinedTimeline', endTimelineDate);
    setDeadline(endTime);

    try {
      if (attemptId) {
        const response = await axios.put(`/api/v1/round/1/attempt?id=${attemptId}`,
          { selfDefinedTimeline: endTimelineDate },
          { headers: { 'Content-Type': "application/json" } }
        );

        response.status === 200 ? setIsModalOpen(false) : showToast("error", "Unable to Set Timeline", 3000);
      }
    } catch (error) {
      console.error('Error saving timeline:', error);
    }
  };

  const handleNext = () => {
    currentQuestionIndex < questionsData.length - 1
      ? setCurrentQuestionIndex(prev => prev + 1)
      : handleSubmit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {

    const totalAnswers = Object.keys(answers).length;
    
    if (totalAnswers < totalQuestions) {
      showToast('error', `Please answer all ${totalQuestions} questions`, 3000);
      return;
    }

    const shortAnswers = Object.values(answers).filter(answer =>
      (answer?.toString().trim() || '').length < MIN_CHARS
    );

    if (shortAnswers.length > 0) {
      showToast('error', `All answers must be at least ${MIN_CHARS} characters each`, 3000);
      return;
    }

    const userId = status === 'authenticated' && session ? session.user.uid : undefined;
    showToast('loading', "Submitting Answers...", 3000);

    try {
      const response = await axios.post(`/api/v1/round/1/answers?id=${attemptId}`,
        { userId, answers },
        { headers: { 'Content-Type': "application/json" } }
      );

      if (response.status !== 200) {
        showToast('error', "Failed to submit answer", 3000);
      } else {
        showToast('success', "Answers Submitted!", 3000);
        setIsSubmitted(true);
        removeStorageItem('selfDefinedTimeline');
      }
    } catch (err) {
      console.error('Unable to submit answers', err);
      showToast('error', "Error while submitting answers", 3000);
    }
  };

  if (isLoadingQuestions) return <LoadingSpinner />;


  if(isSubmitted) return <div className='h-screen'>
    <CTAModal
        isOpen={isSubmitted}
        roleTitle={roleTitle}
        onExploreMore={() => {
          cleanUp();
          router.push('/round/1/role-gallery')
        }}
        onLockIn={async () => {
          if (!session) {
            showToast('error', 'Session Not Found', 3000);
            return
          }
          cleanUp();
          updateUserStatus(session?.user.uid, 'MANIFESTO', update);
          router.push(`/round/1/manifesto`)
        }}
      />
  </div>



  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
      <TimerModal isOpen={isModalOpen} onTimelineSet={handleTimelineSet} />

      <div className="bg-white p-8 rounded-2xl shadow-md max-w-4xl w-full space-y-6 relative">
        {!isModalOpen && questionsData.length > 0 && (
          <>
            <strong className='flex justify-center text-2xl text-blue-600'>
              {roleTitle}
            </strong>
            <ProgressBar
              questionsData={questionsData}
              currentQuestionIndex={currentQuestionIndex}
              deadline={deadline}
              formatDeadline={formatDeadline}
            />
            <QuestionCard
              questionData={questionsData[currentQuestionIndex]}
              currentQuestionIndex={currentQuestionIndex}
              answers={answers}
              onAnswerChange={handleAnswerChange}
              setIsCurrentQuestionValid={setIsCurrentQuestionValid}
            />
            <NavigationButtons
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={questionsData.length}
              isSubmitted={isSubmitted}
              setIsSubmitted={setIsSubmitted}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onNext={handleNext}
              isCurrentQuestionValid={isCurrentQuestionValid}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const Round1Page: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Round1Content />
    </Suspense>
  );
};

export default Round1Page;