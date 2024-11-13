'use client';

import { useState } from 'react';
import { FormControl, FormLabel, Input, Textarea, Select } from '@/components/ui/form';

interface FormData {
  context: string;
  objective: string;
  style: string;
  tone: string;
  audience: string;
  response: string;
  provider: string;
  model: string;
}

export function CreateChatForm() {
  const [formData, setFormData] = useState<FormData>({
    context: '',
    objective: '',
    style: '',
    tone: '',
    audience: '',
    response: '',
    provider: 'openai',
    model: 'gpt-3.5-turbo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className="space-y-6">
      <FormControl>
        <FormLabel htmlFor="context">Context</FormLabel>
        <Textarea
          id="context"
          name="context"
          value={formData.context}
          onChange={handleChange}
          placeholder="Provide background information..."
          helperText="Background information that helps the AI understand the scenario"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="objective">Objective</FormLabel>
        <Textarea
          id="objective"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          placeholder="What do you want the AI to do..."
          helperText="The specific task you want the AI to perform"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="style">Style</FormLabel>
        <Input
          id="style"
          name="style"
          value={formData.style}
          onChange={handleChange}
          placeholder="e.g., Professional, Casual, Technical..."
          helperText="The writing style you want the AI to use"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="tone">Tone</FormLabel>
        <Input
          id="tone"
          name="tone"
          value={formData.tone}
          onChange={handleChange}
          placeholder="e.g., Formal, Friendly, Enthusiastic..."
          helperText="The attitude of the response"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="audience">Audience</FormLabel>
        <Input
          id="audience"
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          placeholder="Who is this for..."
          helperText="Who the response is intended for"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="response">Response Format</FormLabel>
        <Input
          id="response"
          name="response"
          value={formData.response}
          onChange={handleChange}
          placeholder="e.g., Paragraph, List, JSON..."
          helperText="The desired output format"
        />
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="provider">AI Provider</FormLabel>
        <Select 
          id="provider"
          name="provider"
          value={formData.provider}
          onChange={handleChange}
          helperText="Choose your preferred AI provider. Make sure you've set up your API key in settings."
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel htmlFor="model">Model</FormLabel>
        <Select 
          id="model"
          name="model"
          value={formData.model}
          onChange={handleChange}
          helperText={
            formData.provider === 'openai' 
              ? "GPT-4 models are more capable but slower and more expensive. GPT-3.5 is faster and cheaper."
              : "Opus is the most capable, Sonnet balances capability and speed, Haiku is fastest."
          }
        >
          {formData.provider === 'openai' ? (
            <>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </>
          ) : (
            <>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </>
          )}
        </Select>
      </FormControl>

      <div className="flex justify-end">
        <button 
          type="submit"
          className="button-primary"
        >
          Generate Response
        </button>
      </div>
    </form>
  );
} 