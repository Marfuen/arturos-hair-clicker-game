'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useGameStore } from '@/store/game-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function ClickArea() {
  const clickHead = useGameStore(state => state.clickHead);
  const clickPower = useGameStore(state => state.clickPower);
  const comboMultiplier = useGameStore(state => state.comboMultiplier);
  const maxComboMultiplier = useGameStore(state => state.maxComboMultiplier);
  const lastClickTime = useGameStore(state => state.lastClickTime);
  const comboDecayDelay = useGameStore(state => state.comboDecayDelay);
  
  const [clickEffect, setClickEffect] = useState<{ x: number; y: number; id: number } | null>(null);
  const [effectCounter, setEffectCounter] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const [timeSinceClick, setTimeSinceClick] = useState(0);
  
  // Format the actual hair gain with combo applied
  const hairGain = Math.floor(clickPower * comboMultiplier);
  
  // Determine if combo is active for styling
  const isComboActive = comboMultiplier > 1;
  
  // Calculate combo intensity for visual effects (0-1 scale)
  const comboIntensity = (comboMultiplier - 1) / (maxComboMultiplier - 1);
  
  // Update time since last click
  useEffect(() => {
    if (!isComboActive) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastClickTime;
      setTimeSinceClick(elapsed);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isComboActive, lastClickTime]);
  
  // Determine if combo is about to decay
  const isComboDecaying = timeSinceClick >= comboDecayDelay;
  
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
  
  // Get dynamic glow color based on combo intensity
  const getGlowColor = () => {
    if (!isComboActive) return 'shadow-primary/0';
    if (isComboDecaying) return 'shadow-red-500/50';
    
    // Interpolate between yellow and orange as combo increases
    const intensity = Math.min(1, comboIntensity);
    return `shadow-primary/50`;
  };
  
  // Get dynamic border color based on combo state
  const getBorderColor = () => {
    if (!isComboActive) return 'border-primary';
    if (isComboDecaying) return 'border-red-500';
    return 'border-primary';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Click on Arturo&apos;s Head!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div 
          className="relative cursor-pointer transition-transform hover:scale-105"
          onClick={handleClick}
        >
          <div className={cn(
            "relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 shadow-xl transition-all duration-300",
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
            "absolute -top-2 -right-2 rounded-full w-auto min-w-10 h-10 px-2 flex items-center justify-center font-bold shadow-md transition-all duration-300",
            isComboDecaying ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
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
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
              {isComboDecaying ? '⚠️' : '🔥'}
            </div>
          )}
          
          {/* Combo ring indicator - visual feedback without making Arturo blink */}
          {isComboActive && (
            <div className={cn(
              "absolute inset-0 rounded-full border-2 pointer-events-none z-5 animate-pulse",
              isComboDecaying ? "border-red-500" : "border-primary"
            )} />
          )}
        </div>
        
        <p className="mt-6 text-center text-muted-foreground">
          {isComboActive 
            ? isComboDecaying
              ? "Combo decaying! Click faster to maintain it!"
              : "Combo active! Keep clicking to increase your multiplier!" 
            : "Each click generates hair for Arturo! Click faster for combo bonus!"}
        </p>
      </CardContent>
    </Card>
  );
} 