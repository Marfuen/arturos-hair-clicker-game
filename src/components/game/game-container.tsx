'use client';

import { useEffect, useState } from 'react';
import { useGameStore, setupGameTick } from '@/store/game-store';
import dynamic from 'next/dynamic';

// Create a simple loading component
const LoadingComponent = ({ text }: { text: string }) => (
  <div className="bg-card p-6 rounded-lg shadow-md border border-border text-center">
    <div className="animate-pulse text-primary font-medium">{text}</div>
  </div>
);

// Dynamically import components with proper loading states
const ClickArea = dynamic(() => import('./click-area'), { 
  ssr: false,
  loading: () => <LoadingComponent text="Loading click area..." />
});

const UpgradeShop = dynamic(() => import('./upgrade-shop'), { 
  ssr: false,
  loading: () => <LoadingComponent text="Loading upgrade shop..." />
});

const StatsDisplay = dynamic(() => import('./stats-display'), { 
  ssr: false,
  loading: () => <LoadingComponent text="Loading stats..." />
});

const OfflineProgressModal = dynamic(() => import('./offline-progress-modal'), { 
  ssr: false 
});

export function GameContainer() {
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  
  useEffect(() => {
    // Setup game tick for passive income
    setupGameTick();
    
    // Calculate offline progress and handle the result
    const handleOfflineProgress = () => {
      try {
        // Get the calculateOfflineProgress function from the store
        const { calculateOfflineProgress } = useGameStore.getState();
        
        // Call the function and get the earnings
        const earnings = calculateOfflineProgress();
        
        // Check if earnings is a number and greater than 0
        if (typeof earnings === 'number' && earnings > 0) {
          setOfflineEarnings(earnings);
          setShowOfflineModal(true);
        }
      } catch (error) {
        console.error('Error calculating offline progress:', error);
      }
    };
    
    handleOfflineProgress();
  }, []);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <StatsDisplay />
        <ClickArea />
      </div>
      
      <div className="lg:col-span-1">
        <UpgradeShop />
      </div>
      
      {showOfflineModal && (
        <OfflineProgressModal 
          earnings={offlineEarnings} 
          onClose={() => setShowOfflineModal(false)} 
        />
      )}
    </div>
  );
} 