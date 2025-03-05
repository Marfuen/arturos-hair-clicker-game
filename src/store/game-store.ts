import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Game upgrade types
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  owned: number;
  image?: string;
}

// Game state interface
export interface GameState {
  // Core resources
  hairCount: number;
  clickPower: number;
  passiveIncome: number;
  lastUpdated: number;
  
  // Upgrades
  upgrades: Upgrade[];
  
  // Actions
  clickHead: () => void;
  buyUpgrade: (upgradeId: string) => void;
  resetGame: () => void;
  calculateOfflineProgress: () => void;
}

// Initial upgrades
const initialUpgrades: Upgrade[] = [
  {
    id: 'comb',
    name: 'Magic Comb',
    description: 'Increases click power by 1',
    cost: 10,
    multiplier: 1.5,
    owned: 0,
    image: '/images/comb.png'
  },
  {
    id: 'shampoo',
    name: 'Growth Shampoo',
    description: 'Generates 1 hair per second',
    cost: 50,
    multiplier: 1.7,
    owned: 0,
    image: '/images/shampoo.png'
  },
  {
    id: 'hat',
    name: 'Lucky Hat',
    description: 'Increases click power by 5',
    cost: 200,
    multiplier: 1.8,
    owned: 0,
    image: '/images/hat.png'
  },
  {
    id: 'wig',
    name: 'Arturo\'s Wig',
    description: 'Generates 5 hair per second',
    cost: 500,
    multiplier: 2,
    owned: 0,
    image: '/images/wig.png'
  },
  {
    id: 'salon',
    name: 'Hair Salon',
    description: 'Generates 20 hair per second',
    cost: 2000,
    multiplier: 2.2,
    owned: 0,
    image: '/images/salon.png'
  }
];

// Create the game store
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      hairCount: 0,
      clickPower: 1,
      passiveIncome: 0,
      lastUpdated: Date.now(),
      upgrades: initialUpgrades,
      
      // Click action
      clickHead: () => {
        set((state) => ({
          hairCount: state.hairCount + state.clickPower
        }));
      },
      
      // Buy upgrade
      buyUpgrade: (upgradeId: string) => {
        const { upgrades, hairCount } = get();
        const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
        
        if (upgradeIndex === -1) return;
        
        const upgrade = upgrades[upgradeIndex];
        const cost = upgrade.cost * Math.pow(upgrade.multiplier, upgrade.owned);
        
        if (hairCount < cost) return;
        
        const newUpgrades = [...upgrades];
        newUpgrades[upgradeIndex] = {
          ...upgrade,
          owned: upgrade.owned + 1
        };
        
        let newPassiveIncome = 0;
        let newClickPower = 1;
        
        // Calculate new passive income and click power
        newUpgrades.forEach(u => {
          if (u.id === 'comb') {
            newClickPower += u.owned * 1;
          } else if (u.id === 'hat') {
            newClickPower += u.owned * 5;
          } else if (u.id === 'shampoo') {
            newPassiveIncome += u.owned * 1;
          } else if (u.id === 'wig') {
            newPassiveIncome += u.owned * 5;
          } else if (u.id === 'salon') {
            newPassiveIncome += u.owned * 20;
          }
        });
        
        set({
          hairCount: hairCount - cost,
          upgrades: newUpgrades,
          passiveIncome: newPassiveIncome,
          clickPower: newClickPower
        });
      },
      
      // Reset game
      resetGame: () => {
        set({
          hairCount: 0,
          clickPower: 1,
          passiveIncome: 0,
          lastUpdated: Date.now(),
          upgrades: initialUpgrades
        });
      },
      
      // Calculate offline progress
      calculateOfflineProgress: () => {
        const { lastUpdated, passiveIncome } = get();
        const now = Date.now();
        const timeDiff = (now - lastUpdated) / 1000; // in seconds
        
        if (timeDiff > 0 && passiveIncome > 0) {
          const offlineEarnings = Math.floor(passiveIncome * timeDiff);
          
          set((state) => ({
            hairCount: state.hairCount + offlineEarnings,
            lastUpdated: now
          }));
          
          return offlineEarnings;
        }
        
        set({ lastUpdated: now });
        return 0;
      }
    }),
    {
      name: 'arturo-clicker-game',
    }
  )
);

// Game tick function to update passive income
export function setupGameTick() {
  let lastTick = Date.now();
  
  const gameTick = () => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000; // in seconds
    lastTick = now;
    
    const { passiveIncome } = useGameStore.getState();
    
    if (passiveIncome > 0) {
      useGameStore.setState((state) => ({
        hairCount: state.hairCount + state.passiveIncome * delta,
        lastUpdated: now
      }));
    }
    
    requestAnimationFrame(gameTick);
  };
  
  requestAnimationFrame(gameTick);
} 