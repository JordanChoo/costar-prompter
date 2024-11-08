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

// Update the SavedItem and SavedItems types
type SavedItem = {
  title: string;
  content: string;
};

type SavedItems = Record<keyof typeof steps, SavedItem[]>;

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
  const [savedItems, setSavedItems] = useState<SavedItems>({
    context: [],
    objective: [],
    style: [],
    tone: [],
    audience: [],
    response: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<SavedItem | null>(null);

  const stepKeys = Object.keys(steps) as Array<keyof typeof steps>;
  const currentIndex = stepKeys.indexOf(currentStep);

  // Load saved items from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('costarSavedItems');
    if (savedData) {
      setSavedItems(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (formData[currentStep].trim()) {
          if (currentIndex < stepKeys.length - 1) {
            setCurrentStep([stepKeys[currentIndex + 1], 1]);
          } else {
            generatePrompt();
          }
        } else {
          setError(`Please provide ${steps[currentStep].title.toLowerCase()} information`);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, currentIndex, formData]);

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

  const resetForm = () => {
    setGeneratedPrompt('');
    setCurrentStep(['context', 0]);
    setFormData({
      context: '',
      objective: '',
      style: '',
      tone: '',
      audience: '',
      response: '',
    });
    setError(null);
  };

  const saveCurrentItem = () => {
    setIsSaving(true);
  };

  const handleSaveConfirm = () => {
    const currentValue = formData[currentStep].trim();
    if (!currentValue || !saveTitle.trim()) return;

    const newItem: SavedItem = {
      title: saveTitle.trim(),
      content: currentValue,
    };

    const updatedItems = {
      ...savedItems,
      [currentStep]: [...savedItems[currentStep], newItem]
    };
    
    setSavedItems(updatedItems);
    localStorage.setItem('costarSavedItems', JSON.stringify(updatedItems));
    setShowToast(true);
    setIsSaving(false);
    setSaveTitle('');
  };

  const selectSavedItem = (content: string) => {
    const template = savedItems[currentStep].find(item => item.content === content);
    setSelectedTemplate(template || null);
    setFormData(prev => ({
      ...prev,
      [currentStep]: content
    }));
  };

  const updateTemplate = () => {
    if (!selectedTemplate) return;

    const updatedItems = {
      ...savedItems,
      [currentStep]: savedItems[currentStep].map(item => 
        item.title === selectedTemplate.title 
          ? { ...item, content: formData[currentStep] }
          : item
      )
    };

    setSavedItems(updatedItems);
    localStorage.setItem('costarSavedItems', JSON.stringify(updatedItems));
    setSelectedTemplate(null);
    setShowToast(true);
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
                  
                  {/* Saved items dropdown */}
                  {savedItems[currentStep].length > 0 && (
                    <div className="relative">
                      <select
                        className="w-full p-2 rounded-lg border bg-background 
                          border-black/[.08] dark:border-white/[.145]
                          focus:ring-2 focus:ring-foreground focus:outline-none"
                        onChange={(e) => selectSavedItem(e.target.value)}
                        value={selectedTemplate?.content || ""}
                      >
                        <option value="" disabled>
                          Select a saved {steps[currentStep].title.toLowerCase()}
                        </option>
                        {savedItems[currentStep].map((item, index) => (
                          <option key={index} value={item.content}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
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
                    <div className="flex items-center justify-between mt-2">
                      <KeyboardTip />
                      <div className="flex">
                        {selectedTemplate ? (
                          <button
                            className="button-secondary text-sm px-3 py-1 rounded-r-none border-r-0 
                              bg-yellow-500/10 hover:bg-yellow-500/20"
                            onClick={updateTemplate}
                            disabled={!formData[currentStep].trim()}
                          >
                            Update Template
                          </button>
                        ) : null}
                        <button
                          className={`
                            button-secondary text-sm px-3 py-1
                            ${selectedTemplate ? 'rounded-l-none' : 'rounded-full'}
                          `}
                          onClick={saveCurrentItem}
                          disabled={!formData[currentStep].trim()}
                        >
                          Save New Template
                        </button>
                      </div>
                    </div>
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
                    onClick={resetForm}
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
        <Toast.Title>
          {generatedPrompt 
            ? 'Copied to clipboard!' 
            : selectedTemplate 
              ? 'Template updated!' 
              : 'Template saved!'}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport />

      {/* Save Dialog */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-black rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Save {steps[currentStep].title}</h3>
            <div className="space-y-2">
              <label htmlFor="saveTitle" className="text-sm text-foreground/70">
                Give this {steps[currentStep].title.toLowerCase()} a title
              </label>
              <input
                id="saveTitle"
                type="text"
                className="w-full p-2 rounded-lg border bg-background 
                  border-black/[.08] dark:border-white/[.145]
                  focus:ring-2 focus:ring-foreground focus:outline-none"
                value={saveTitle}
                onChange={(e) => setSaveTitle(e.target.value)}
                placeholder={`e.g., "My ${steps[currentStep].title}"`}
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="button-secondary"
                onClick={() => {
                  setIsSaving(false);
                  setSaveTitle('');
                }}
              >
                Cancel
              </button>
              <button
                className="button-primary"
                onClick={handleSaveConfirm}
                disabled={!saveTitle.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Toast.Provider>
  );
}
