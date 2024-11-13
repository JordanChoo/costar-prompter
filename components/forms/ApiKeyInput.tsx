import { useState } from 'react';

type ApiKeyInputProps = {
  onSubmit: (provider: 'openai' | 'anthropic', apiKey: string) => void;
};

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            provider === 'openai' ? 'bg-green-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setProvider('openai')}
        >
          OpenAI
        </button>
        <button
          className={`px-4 py-2 rounded ${
            provider === 'anthropic' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
          onClick={() => setProvider('anthropic')}
        >
          Anthropic
        </button>
      </div>
      <input
        type="password"
        placeholder={`Enter your ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
        className="w-full p-2 border rounded"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white py-2 rounded"
        onClick={() => onSubmit(provider, apiKey)}
      >
        Submit
      </button>
    </div>
  );
} 