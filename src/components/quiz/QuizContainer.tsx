'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useQuiz } from '@/hooks/useQuiz';
import { quizSteps } from '@/config/quizSteps';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import QuizResults from './QuizResults';

export default function QuizContainer() {
    const {
        currentStep,
        totalSteps,
        answers,
        setAnswer,
        nextStep,
        prevStep,
        skipStep,
        submitQuiz,
        resetQuiz,
        isComplete,
        isLoading,
        recommendations,
        canProceed,
        dataError
    } = useQuiz();

    // Error state (BUG-07)
    if (dataError) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 text-lg">Unable to load fragrance data.</p>
                    <p className="text-gray-400 text-sm mt-2">Please refresh the page.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-2 bg-[#e53935] text-white text-sm font-medium hover:bg-[#c62828] transition"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        );
    }

    // Show results if complete
    if (isComplete && recommendations) {
        return <QuizResults recommendations={recommendations} onRetake={resetQuiz} />;
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-10 h-10 border-2 border-[#e53935] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-lg font-medium text-[#1a1a1a]">Finding your perfect scents...</p>
                    <p className="text-[#888888] text-sm mt-2">Analyzing your preferences</p>
                </motion.div>
            </div>
        );
    }

    const step = quizSteps[currentStep];
    const isLastStep = currentStep === totalSteps - 1;

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            {/* Header */}
            <header className="bg-white border-b border-[#e0e0e0]">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-semibold tracking-wide text-[#1a1a1a]">
                        <span className="font-light">n</span>spired
                    </Link>
                    <Link
                        href="/"
                        className="text-sm text-[#4a4a4a] hover:text-[#e53935] transition flex items-center gap-2"
                    >
                        <Home size={16} />
                        Home
                    </Link>
                </div>
            </header>

            <div className="py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-2xl md:text-3xl font-light text-[#1a1a1a] mb-2">
                            Find Your <span className="font-semibold">Perfect Scent</span>
                        </h2>
                        <p className="text-[#4a4a4a] text-sm">
                            Answer a few questions to discover your ideal nspired fragrance
                        </p>
                    </motion.div>

                    {/* Progress */}
                    <QuizProgress current={currentStep + 1} total={totalSteps} />

                    {/* Screen reader announcement (UX-08) */}
                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                        Step {currentStep + 1} of {quizSteps.length}: {step.question}
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border border-[#e0e0e0] p-6 md:p-8 mt-6"
                        >
                            <QuizQuestion
                                step={step}
                                value={answers[step.name]}
                                onChange={(value) => setAnswer(step.name, value)}
                                answers={answers}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <QuizNavigation
                        onBack={prevStep}
                        onNext={isLastStep ? submitQuiz : nextStep}
                        onSkip={step.skippable ? skipStep : undefined}
                        canGoBack={currentStep > 0}
                        canGoNext={canProceed}
                        isLastStep={isLastStep}
                    />
                </div>
            </div>
        </div>
    );
}
