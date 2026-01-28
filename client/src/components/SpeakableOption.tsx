import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import { useTTS } from "@/hooks/use-tts";

interface SpeakableOptionProps {
  children: React.ReactNode;
  speakText: string;
  onSelect: () => void;
  className?: string;
  "data-testid"?: string;
}

export function SpeakableOption({ 
  children, 
  speakText, 
  onSelect, 
  className = "",
  "data-testid": testId
}: SpeakableOptionProps) {
  const { speak } = useTTS();
  const [isListening, setIsListening] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (!hasListened) {
      speak(speakText);
      setIsListening(true);
      setHasListened(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsListening(false);
      }, 1500);
    } else {
      onSelect();
    }
  };

  const handleDoubleClick = () => {
    onSelect();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={`relative ${className}`}
      data-testid={testId}
    >
      {/* Listen indicator */}
      <motion.div 
        className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center z-10 transition-colors ${
          isListening 
            ? 'bg-green-500 text-white' 
            : hasListened 
              ? 'bg-green-100 text-green-600' 
              : 'bg-orange-400 text-white'
        }`}
        animate={isListening ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: isListening ? Infinity : 0, duration: 0.5 }}
      >
        <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />
      </motion.div>
      
      {/* Content */}
      {children}
      
      {/* Hint text */}
      {!hasListened && (
        <div className="absolute -bottom-5 sm:-bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] sm:text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-full">
            先聽聽看
          </span>
        </div>
      )}
      {hasListened && !isListening && (
        <div className="absolute -bottom-5 sm:-bottom-6 left-0 right-0 text-center">
          <span className="text-[10px] sm:text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
            再按確定
          </span>
        </div>
      )}
    </motion.button>
  );
}
