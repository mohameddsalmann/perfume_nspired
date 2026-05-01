'use client';

import { useState, useCallback, useMemo } from 'react';
import { QuizAnswers, RecommendationResult } from '@/types';
import { quizSteps } from '@/config/quizSteps';
import { perfumes } from '@/data/perfumes';
import { calculateRecommendations } from '@/lib/recommendationEngine';

const initialAnswers: QuizAnswers = {
    gender: null,
    favoriteNotes: [],
    avoidedNotes: [],
    season: null,
    intensity: null
};

export function useQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<RecommendationResult[] | null>(null);
    const [engineError, setEngineError] = useState(false);

    const catalogEmpty = !perfumes || perfumes.length === 0;
    const dataError = catalogEmpty || engineError;

    const setAnswer = useCallback((name: keyof QuizAnswers, value: unknown) => {
        setAnswers(prev => ({ ...prev, [name]: value }));
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < quizSteps.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const skipStep = useCallback(() => {
        nextStep();
    }, [nextStep]);

    const submitQuiz = useCallback(async () => {
        setIsLoading(true);

        // Simulate API delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1500));

        try {
            const results = calculateRecommendations(answers, perfumes);
            setRecommendations(results);
            setIsComplete(true);
        } catch {
            setEngineError(true);
        }
        setIsLoading(false);
    }, [answers]);

    const resetQuiz = useCallback(() => {
        setCurrentStep(0);
        setAnswers(initialAnswers);
        setIsComplete(false);
        setRecommendations(null);
        setEngineError(false);
    }, []);

    // Fix BUG-06: use useMemo instead of useCallback for derived state
    const canProceed = useMemo(() => {
        const step = quizSteps[currentStep];
        const answer = answers[step.name];

        if (!step.required) return true;
        if (Array.isArray(answer)) return answer.length > 0;
        return answer !== null && answer !== undefined;
    }, [currentStep, answers]);

    return {
        currentStep,
        totalSteps: quizSteps.length,
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
    };
}
