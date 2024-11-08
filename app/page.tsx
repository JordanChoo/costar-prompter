'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Toast from '@radix-ui/react-toast';

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

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const KeyboardTip = () => (
  <p className="text-sm text-foreground/60 mt-2 italic">
    Press <span className="font-medium">CMD + Enter</span> (or <span className="font-medium">CTRL + Enter</span>) to go to the next step
  </p>
);

export default function Home() {
  const [[currentStep, direction], setCurrentStep] = useState<[keyof typeof steps, number]>(['context', 0]);
  const [formData, setFormData] = useState<Record<keyof typeof steps, string>>({
    context: '',
    objective: '',
    style: '',
    tone: '',
    audience: '',
    response: '',
  });
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
  const currentIndex = stepKeys.indexOf(currentStep);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        goToNextStep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const timeoutId = setTimeout(() => {
        textarea.focus();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentStep]);

  const handleInputChange = (value: string) => {
    setError(null);
    setFormData(prev => ({
      ...prev,
      [currentStep]: value
    }));
  };

  const goToNextStep = () => {
    if (!formData[currentStep].trim()) {
      setError(`Please provide ${steps[currentStep].title.toLowerCase()} information`);
      return;
    }

    setError(null);
    if (currentIndex < stepKeys.length - 1) {
      setCurrentStep([stepKeys[currentIndex + 1], 1]);
    } else {
      generatePrompt();
    }
  };

  const goToPreviousStep = () => {
    if (currentIndex > 0) {
      setCurrentStep([stepKeys[currentIndex - 1], -1]);
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setShowToast(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <div className="min-h-screen p-8 bg-[#fafafa] dark:bg-[#111]">
        <main className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-center">CO-STAR Prompt Builder</h1>
          
          {!generatedPrompt ? (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="bg-white dark:bg-black rounded-xl border border-black/[.08] dark:border-white/[.08] p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-foreground/70">
                    {steps[currentStep].description}
                  </p>
                  <div>
                    <textarea
                      className={`textarea-base min-h-[200px] ${
                        error ? 'border-red-500 focus:ring-red-500' : ''
                      }`}
                      value={formData[currentStep]}
                      onChange={(e) => handleInputChange(e.target.value)}
                      placeholder={`Enter ${steps[currentStep].title.toLowerCase()}...`}
                      autoFocus
                    />
                    {error && (
                      <p className="text-sm text-red-500 mt-2">
                        {error}
                      </p>
                    )}
                    <KeyboardTip />
                  </div>
                </div>

                <div className="flex justify-between mt-4">
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
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="bg-white dark:bg-black rounded-xl border border-black/[.08] dark:border-white/[.08] p-6 shadow-sm">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Generated Prompt</h2>
                  <pre className="p-4 rounded-lg bg-black/[.05] dark:bg-white/[.06] overflow-x-auto">
                    <code>{generatedPrompt}</code>
                  </pre>
                </div>
                <div className="flex gap-4">
                  <button
                    className="button-secondary flex-1"
                    onClick={() => setGeneratedPrompt('')}
                  >
                    Start Over
                  </button>
                  <button
                    className="flex-1 button-base bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={copyToClipboard}
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Toast.Root
        className="bg-emerald-600 text-white rounded-lg p-4 fixed bottom-4 right-4 shadow-lg"
        open={showToast}
        onOpenChange={setShowToast}
        duration={2000}
      >
        <Toast.Title>Copied to clipboard!</Toast.Title>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  );
}
