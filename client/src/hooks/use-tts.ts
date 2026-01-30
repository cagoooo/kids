import { useCallback } from "react";

let cachedVoice: SpeechSynthesisVoice | null = null;

function findBestChineseVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();

  const preferredVoices = [
    (v: SpeechSynthesisVoice) => v.lang === 'zh-TW' && v.name.includes('Mei-Jia'),
    (v: SpeechSynthesisVoice) => v.lang === 'zh-TW' && v.name.includes('Ting-Ting'),
    (v: SpeechSynthesisVoice) => v.lang === 'zh-TW',
    (v: SpeechSynthesisVoice) => v.lang === 'zh_TW',
    (v: SpeechSynthesisVoice) => v.lang.startsWith('zh-TW'),
    (v: SpeechSynthesisVoice) => v.lang.includes('TW'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('zh-'),
    (v: SpeechSynthesisVoice) => v.lang.startsWith('zh_'),
    (v: SpeechSynthesisVoice) => v.lang.includes('zh'),
  ];

  for (const matcher of preferredVoices) {
    const voice = voices.find(matcher);
    if (voice) return voice;
  }

  return null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    cachedVoice = findBestChineseVoice();
  });
  cachedVoice = findBestChineseVoice();
}

export function useTTS() {
  const speak = useCallback((text: string) => {
    // Safety check just to be sure
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    try {
      // Some browsers might throw on cancel
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (!cachedVoice) {
        cachedVoice = findBestChineseVoice();
      }

      if (cachedVoice) {
        utterance.voice = cachedVoice;
      }

      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis failed:', err);
    }
  }, []);

  return { speak };
}
