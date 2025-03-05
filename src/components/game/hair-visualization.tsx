import { useGameStore } from '@/store/game-store';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Define hair growth stages with thresholds
const HAIR_STAGES = [
  { threshold: 0, image: null, label: "Bald" },
  { threshold: 1000, image: "/images/arturo-hair-stage1.svg", label: "Stubble" },
  { threshold: 10000, image: "/images/arturo-hair-stage2.svg", label: "Short Hair" },
  { threshold: 100000, image: "/images/arturo-hair-stage3.svg", label: "Medium Hair" },
  { threshold: 1000000, image: "/images/arturo-hair-stage4.svg", label: "Long Hair" },
  { threshold: 10000000, image: "/images/arturo-hair-stage5.svg", label: "Luxurious Hair" },
];

interface HairVisualizationProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isClicking?: boolean;
  borderColor?: string;
  glowColor?: string;
}

export function HairVisualization({ 
  size = 'md', 
  showLabel = false,
  className,
  onClick,
  isClicking = false,
  borderColor = 'border-primary',
  glowColor = 'shadow-primary/0'
}: HairVisualizationProps) {
  const hairCount = useGameStore(state => state.hairCount);
  
  // Determine the current hair stage based on hair count
  const currentStage = HAIR_STAGES.reduce((prev, current) => {
    return (hairCount >= current.threshold) ? current : prev;
  }, HAIR_STAGES[0]);
  
  // Size classes based on the size prop
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32 md:w-40 md:h-40',
    lg: 'w-48 h-48 md:w-64 md:h-64',
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          "relative rounded-full overflow-hidden border-4 shadow-xl transition-all duration-300",
          sizeClasses[size],
          borderColor,
          glowColor,
          isClicking && "scale-95",
          onClick && "cursor-pointer hover:scale-105",
          className
        )}
        onClick={onClick}
      >
        {/* Base head image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/arturo-head.png"
            alt="Arturo's head"
            fill
            className="object-contain transition-all"
            priority
          />
        </div>
        
        {/* Hair layer (if not bald) */}
        {currentStage.image && (
          <div className="absolute inset-0 z-10 transform -translate-y-1">
            <Image
              src={currentStage.image}
              alt={`Arturo's ${currentStage.label}`}
              fill
              className="object-contain transition-all"
              style={{ 
                objectFit: 'contain',
                objectPosition: 'center top'
              }}
              priority
            />
          </div>
        )}
      </div>
      
      {showLabel && (
        <div className="mt-2 text-xs text-muted-foreground">
          {currentStage.label}
        </div>
      )}
    </div>
  );
} 