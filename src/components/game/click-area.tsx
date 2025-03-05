'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/game-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/format-utils';

export default function ClickArea() {
  const clickHead = useGameStore(state => state.clickHead);
  const clickPower = useGameStore(state => state.clickPower);
  const comboMultiplier = useGameStore(state => state.comboMultiplier);
  const maxComboMultiplier = useGameStore(state => state.maxComboMultiplier);
  const getComboState = useGameStore(state => state.getComboState);
  const totalClicks = useGameStore(state => state.totalClicks);
  
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number } | null>(null);
  const [effectCounter, setEffectCounter] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [comboState, setComboState] = useState<"inactive" | "active" | "warning" | "decaying">("inactive");
  
  // Format the actual hair gain with combo applied
  const hairGain = Math.floor(clickPower * comboMultiplier);
  
  // Determine if combo is active for styling
  const isComboActive = comboMultiplier > 1;
  
  // Calculate combo intensity for visual effects (0-1 scale)
  const comboIntensity = (comboMultiplier - 1) / (maxComboMultiplier - 1);
  
  // Update combo state
  useEffect(() => {
    // Update combo state more frequently to ensure smooth transitions
    const interval = setInterval(() => {
      const newState = getComboState();
      setComboState(newState);
      
      // Debug output to help diagnose issues
      if (process.env.NODE_ENV === 'development') {
        console.log('Combo state:', newState, 'Multiplier:', comboMultiplier.toFixed(2));
      }
    }, 50); // Update more frequently (50ms instead of 100ms)
    
    return () => clearInterval(interval);
  }, [getComboState, comboMultiplier]);
  
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the target element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Trigger click effect
    setClickEffect({ x, y, id: effectCounter });
    setEffectCounter(prev => prev + 1);
    
    // Add clicking animation
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 100);
    
    // Register click in game store
    clickHead();
  };
  
  // Remove click effect after animation
  useEffect(() => {
    if (clickEffect) {
      const timer = setTimeout(() => {
        setClickEffect(null);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [clickEffect]);
  
  // Get dynamic glow color based on combo state
  const getGlowColor = () => {
    if (!isComboActive) return 'shadow-primary/0';
    
    switch (comboState) {
      case "active":
        return 'shadow-primary/50';
      case "warning":
        return 'shadow-yellow-500/50';
      case "decaying":
        return 'shadow-red-500/50';
      default:
        return 'shadow-primary/0';
    }
  };
  
  // Get dynamic border color based on combo state
  const getBorderColor = () => {
    if (!isComboActive) return 'border-primary';
    
    switch (comboState) {
      case "active":
        return 'border-primary';
      case "warning":
        return 'border-yellow-500';
      case "decaying":
        return 'border-red-500';
      default:
        return 'border-primary';
    }
  };
  
  // Get combo message based on state
  const getComboMessage = () => {
    if (!isComboActive) {
      return "Each click generates hair for Arturo! Click faster for combo bonus!";
    }
    
    switch (comboState) {
      case "active":
        return "Combo active! Keep clicking to increase your multiplier!";
      case "warning":
        return "Combo will decay soon! Click to maintain it!";
      case "decaying":
        return "Combo decaying! Click faster to save it!";
      default:
        return "Each click generates hair for Arturo! Click faster for combo bonus!";
    }
  };
  
  // Get combo icon based on state
  const getComboIcon = () => {
    switch (comboState) {
      case "active":
        return '🔥';
      case "warning":
        return '⚠️';
      case "decaying":
        return '⏳';
      default:
        return '🔥';
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-center">Click on Arturo&apos;s Head!</CardTitle>
        <div className="text-center text-sm text-muted-foreground">
          Total Clicks: <span className="font-bold text-primary">{formatNumber(totalClicks)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center py-2">
        <div 
          className="relative cursor-pointer transition-transform hover:scale-105"
          onClick={handleClick}
        >
          <div className={cn(
            "relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 shadow-xl transition-all duration-300",
            getBorderColor(),
            getGlowColor(),
            isClicking && "scale-95"
          )}>
            <Image
              src="/images/arturo-head.png"
              alt="Arturo's Bald Head"
              fill
              className="object-cover transition-all"
              priority
            />
            
            {/* Click effects - moved inside the head container */}
            {clickEffect && (
              <div 
                key={clickEffect.id}
                className={cn(
                  "absolute pointer-events-none font-bold text-xl animate-float z-10",
                  isComboActive ? "text-primary" : "text-primary-foreground"
                )}
                style={{ 
                  left: `${clickEffect.x}px`, 
                  top: `${clickEffect.y}px`,
                  fontSize: `${1 + (comboIntensity * 0.5)}rem`, // Bigger text for higher combo
                }}
              >
                +{hairGain}
              </div>
            )}
          </div>
          
          {/* Click power indicator with combo */}
          <div className={cn(
            "absolute -top-2 -right-2 rounded-full w-auto min-w-8 h-8 px-2 flex items-center justify-center font-bold shadow-md transition-all duration-300 text-sm",
            comboState === "decaying" ? "bg-red-500 text-white" : 
            comboState === "warning" ? "bg-yellow-500 text-white" : 
            "bg-primary text-primary-foreground"
          )}>
            +{hairGain}
            {isComboActive && (
              <span className="ml-1 text-xs">
                ({comboMultiplier.toFixed(1)}x)
              </span>
            )}
          </div>
          
          {/* Combo indicator - moved outside of Arturo's head */}
          {isComboActive && (
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xl animate-bounce">
              {getComboIcon()}
            </div>
          )}
          
          {/* Combo ring indicator - visual feedback without making Arturo blink */}
          {isComboActive && (
            <div className={cn(
              "absolute inset-0 rounded-full border-2 pointer-events-none z-5",
              comboState === "active" ? "animate-pulse border-primary" :
              comboState === "warning" ? "animate-pulse border-yellow-500" :
              "animate-ping border-red-500"
            )} />
          )}
        </div>
        
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {getComboMessage()}
        </p>
      </CardContent>
    </Card>
  );
} 