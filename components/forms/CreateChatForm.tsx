import { useState } from 'react';
import { ApiKeyInput } from './ApiKeyInput';
import { ChatInterface } from '../ChatInterface';

export function CreateChatForm() {
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const handleApiKeySubmit = async (provider: 'openai' | 'anthropic', apiKey: string) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          apiKey,
          messages: [{
            role: 'user',
            content: `${prompt}\n\nContext:\n${context}`,
          }],
        }),
      });

      const data = await response.json();
      setAiResponse(data.response);
      setShowChat(true);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Type your prompt..."
      />
      <input
        type="text"
        placeholder="Context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Type your context..."
      />
      
      {!showChat ? (
        <ApiKeyInput onSubmit={handleApiKeySubmit} />
      ) : (
        <ChatInterface initialMessage={aiResponse} />
      )}
    </div>
  );
} 