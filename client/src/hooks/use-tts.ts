import { useCallback } from "react";

export function useTTS() {
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('TW'));
      if (zhVoice) {
        utterance.voice = zhVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  return { speak };
}
