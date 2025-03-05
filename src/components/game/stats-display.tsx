'use client';

import { useGameStore } from '@/store/game-store';
import { formatNumber } from '@/utils/format-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';

export default function StatsDisplay() {
  const hairCount = useGameStore(state => state.hairCount);
  const clickPower = useGameStore(state => state.clickPower);
  const passiveIncome = useGameStore(state => state.passiveIncome);
  const comboMultiplier = useGameStore(state => state.comboMultiplier);
  const maxComboMultiplier = useGameStore(state => state.maxComboMultiplier);
  const lastClickTime = useGameStore(state => state.lastClickTime);
  const comboDecayDelay = useGameStore(state => state.comboDecayDelay);
  
  // Format the combo multiplier to 1 decimal place
  const formattedCombo = comboMultiplier.toFixed(1);
  
  // Determine if combo is active for styling
  const isComboActive = comboMultiplier > 1;
  
  // Calculate combo percentage for progress indicator
  const comboPercentage = ((comboMultiplier - 1) / (maxComboMultiplier - 1)) * 100;
  
  // Track time since last click for decay indicator
  const [timeSinceClick, setTimeSinceClick] = useState(0);
  
  useEffect(() => {
    if (!isComboActive) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastClickTime;
      setTimeSinceClick(elapsed);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isComboActive, lastClickTime]);
  
  // Calculate decay timer percentage
  const decayTimerPercentage = Math.max(0, Math.min(100, 100 - ((timeSinceClick / comboDecayDelay) * 100)));
  
  // Get combo status message
  const getComboStatus = () => {
    if (!isComboActive) return "Click faster to build combo!";
    if (timeSinceClick < comboDecayDelay) {
      return "Keep clicking to increase your combo!";
    }
    return "Combo decaying! Click to maintain!";
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center md:text-left">Arturo&apos;s Hair Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Hair Count" 
            value={formatNumber(Math.floor(hairCount))}
            icon="💇‍♂️"
          />
          
          <StatCard 
            title="Click Power" 
            value={formatNumber(clickPower)}
            icon="👆"
          />
          
          <StatCard 
            title="Hair Per Second" 
            value={formatNumber(passiveIncome)}
            icon="⏱️"
          />
        </div>
        
        {/* Combo Multiplier Display */}
        <div className={`mt-4 p-3 rounded-lg border ${isComboActive ? 'bg-primary/10 border-primary' : 'bg-card border-border'} transition-all duration-300`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`text-xl ${isComboActive ? 'animate-pulse' : ''}`}>🔥</span>
              <span className="font-semibold">Combo Multiplier</span>
            </div>
            <span className={`text-xl font-bold ${isComboActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {formattedCombo}x
            </span>
          </div>
          
          {/* Combo strength indicator */}
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${comboPercentage}%` }}
            />
          </div>
          
          {/* Decay timer indicator (only show when combo is active) */}
          {isComboActive && (
            <div className="mt-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Decay timer</span>
                <span>{Math.max(0, Math.ceil((comboDecayDelay - timeSinceClick) / 1000))}s</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${timeSinceClick < comboDecayDelay ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${decayTimerPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-1">
            {getComboStatus()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex flex-col items-center justify-center shadow-md">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
} 