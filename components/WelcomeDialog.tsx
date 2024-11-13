'use client';

import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';

export function WelcomeDialog() {
  // Initialize with undefined to avoid hydration mismatch
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Check localStorage only after component mounts on client
    const hasVisited = window.localStorage.getItem('hasVisitedBefore');
    setIsOpen(hasVisited ? false : true);
  }, []);

  // Don't render anything until we have determined the initial state
  if (isOpen === undefined) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
    window.localStorage.setItem('hasVisitedBefore', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog.Root open={isOpen} onOpenChange={handleClose}>
          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg max-w-md w-full"
              >
                <Dialog.Title className="text-xl font-bold mb-4">
                  Welcome to CO-STAR Prompt Builder
                </Dialog.Title>
                <Dialog.Description className="mb-4">
                  Build better prompts using the CO-STAR framework:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Context</li>
                    <li>Objective</li>
                    <li>Style</li>
                    <li>Tone</li>
                    <li>Audience</li>
                    <li>Response Format</li>
                  </ul>
                </Dialog.Description>
                <button
                  onClick={handleClose}
                  className="button-primary w-full"
                >
                  Get Started
                </button>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      )}
    </AnimatePresence>
  );
} 