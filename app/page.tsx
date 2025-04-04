'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSpeechRecognition } from 'react-speech-kit';

export default function HealthcareTranslator() {
  // App state
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [fullTranscript, setFullTranscript] = useState('');

  // Speech recognition (Fix: Use returned object correctly)
  const recognition:any = useSpeechRecognition({
    onResult: (result: string | any) => {
      if (result) {
        setFullTranscript(result);
      }
    },
  }) || {};  // Default to an empty object if undefined

  const listen = recognition.listen || (() => {}); // Fallback to empty function
  const stop = recognition.stop || (() => {}); // Fallback to empty function
  const listening = recognition.listening || false; // Default to false if undefined

  // Translation function
  const translateText = async (text: string) => {
    try {
      setIsTranslating(true);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: [{
            role: 'user',
            content: `As a medical translator, convert this to Spanish: ${text}. Return ONLY the translation.`,
          }],
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setTranslatedText(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText('Translation failed. Please check your API key.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Speak translated text
  const speakTranslation = () => {
    if (!translatedText) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(translatedText);
    utterance.lang = 'es-ES'; // Spanish language

    // Wait for voices to be loaded
    const voices = synth.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));

    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    synth.cancel(); // Stop any ongoing speech
    synth.speak(utterance); // Speak the translation
  };

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing API key");
  }
  
  // Start recording
  const startListening = () => {
    setFullTranscript('');
    listen({ continuous: true });
  };

  // Stop recording and translate
  const stopListening = async () => {
    stop();
    if (fullTranscript) {
      await translateText(fullTranscript);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Healthcare Translator</h1>
      
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={startListening}
          disabled={listening || isTranslating}
          className={`px-6 py-3 rounded-full text-lg ${
            listening ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          } text-white disabled:bg-gray-400 transition-colors`}
        >
          {listening ? '🛑 Recording...' : '🎤 Start Recording'}
        </button>
        
        <button
          onClick={stopListening}
          disabled={!listening}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg disabled:bg-gray-400 transition-colors"
        >
          ⏹️ Stop
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Live Transcription:</h3>
          <p className="mt-1 p-3 border rounded-lg bg-white min-h-12">
            {fullTranscript || (listening ? "Listening..." : "Press Start Recording")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Translation (Spanish)</h2>
            <button
              onClick={speakTranslation}
              disabled={!translatedText || isTranslating}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:bg-gray-400 transition-colors"
            >
              🔊 Play
            </button>
          </div>
          <div className="min-h-32 p-4 border rounded bg-gray-50">
            {isTranslating ? "Translating..." : translatedText || "Translation will appear here"}
          </div>
        </div>
      </div>

      {isTranslating && (
        <div className="mt-6 text-center text-blue-600">
          Translating medical terminology...
        </div>
      )}
    </main>
  );
}
