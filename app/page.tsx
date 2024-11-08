'use client';

import { useState } from 'react';

type Step = {
  key: keyof typeof steps;
  title: string;
  description: string;
};

const steps = {
  context: {
    title: 'Context',
    description: 'Provide background information on the task',
  },
  objective: {
    title: 'Objective',
    description: 'Define what the task is that you want the LLM to perform',
  },
  style: {
    title: 'Style',
    description: 'Specify the writing style you want the LLM to use',
  },
  tone: {
    title: 'Tone',
    description: 'Set the attitude of the response',
  },
  audience: {
    title: 'Audience',
    description: 'Identify who the response is intended for',
  },
  response: {
    title: 'Response',
    description: 'Provide the response format',
  },
} as const;

export default function Home() {
  const [currentStep, setCurrentStep] = useState<keyof typeof steps>('context');
  const [formData, setFormData] = useState<Record<keyof typeof steps, string>>({
    context: '',
    objective: '',
    style: '',
    tone: '',
    audience: '',
    response: '',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

  const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
  const currentIndex = stepKeys.indexOf(currentStep);

  const handleInputChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentStep]: value
    }));
  };

  const goToNextStep = () => {
    if (currentIndex < stepKeys.length - 1) {
      setCurrentStep(stepKeys[currentIndex + 1]);
    } else {
      generatePrompt();
    }
  };

  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentStep(stepKeys[currentIndex - 1]);
    }
  };

  const generatePrompt = () => {
    const xmlPrompt = `
<prompt>
  <context>${formData.context}</context>
  <objective>${formData.objective}</objective>
  <style>${formData.style}</style>
  <tone>${formData.tone}</tone>
  <audience>${formData.audience}</audience>
  <response>${formData.response}</response>
</prompt>`.trim();
    
    setGeneratedPrompt(xmlPrompt);
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">CO-STAR Prompt Builder</h1>
        
        {!generatedPrompt ? (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {steps[currentStep].title}
              </h2>
              <p className="text-foreground/70">
                {steps[currentStep].description}
              </p>
              <textarea
                className="textarea-base min-h-[200px]"
                value={formData[currentStep]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={`Enter ${steps[currentStep].title.toLowerCase()}...`}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="button-secondary"
                onClick={goToPreviousStep}
                disabled={currentIndex === 0}
              >
                Previous
              </button>
              <button
                className="button-primary"
                onClick={goToNextStep}
              >
                {currentIndex === stepKeys.length - 1 ? 'Generate' : 'Next'}
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Generated Prompt</h2>
            <pre className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06] overflow-x-auto">
              <code>{generatedPrompt}</code>
            </pre>
            <button
              className="button-secondary w-full"
              onClick={() => setGeneratedPrompt('')}
            >
              Start Over
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
