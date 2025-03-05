import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

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

// Purchase amount options
export type PurchaseAmount = 1 | 10 | 100 | "max";

// Game state interface
export interface GameState {
  // Core resources
  hairCount: number;
  clickPower: number;
  passiveIncome: number;
  lastUpdated: number;
  totalClicks: number; // New: Track total number of clicks

  // Click combo system
  comboMultiplier: number;
  maxComboMultiplier: number;
  comboRampUpRate: number;
  comboDecayRate: number;
  lastClickTime: number;
  comboTimeWindow: number;
  comboDecayDelay: number;
  comboWarningTime: number; // New: Time before decay when warning appears

  // Special multipliers
  offlineGainMultiplier: number;

  // Upgrades
  upgrades: Upgrade[];
  selectedPurchaseAmount: PurchaseAmount;

  // Actions
  clickHead: () => void;
  buyUpgrade: (upgradeId: string) => void;
  buyMultipleUpgrades: (upgradeId: string, amount: PurchaseAmount) => void;
  calculateUpgradeCost: (upgradeId: string, amount: PurchaseAmount) => number;
  setSelectedPurchaseAmount: (amount: PurchaseAmount) => void;
  resetGame: () => void;
  calculateOfflineProgress: () => number;
  increaseCombo: () => void;
  decayCombo: () => void;
  getComboState: () => "inactive" | "active" | "warning" | "decaying"; // New: Get current combo state
}

// Initial upgrades
const initialUpgrades: Upgrade[] = [
  {
    id: "comb",
    name: "Magic Comb",
    description: "Increases click power by 1",
    cost: 10,
    multiplier: 1.15,
    owned: 0,
    image: "/images/comb.svg",
  },
  {
    id: "shampoo",
    name: "Growth Shampoo",
    description: "Generates 1 hair per second",
    cost: 50,
    multiplier: 1.18,
    owned: 0,
    image: "/images/shampoo.svg",
  },
  {
    id: "hat",
    name: "Lucky Hat",
    description: "Increases click power by 5",
    cost: 200,
    multiplier: 1.2,
    owned: 0,
    image: "/images/hat.svg",
  },
  {
    id: "wig",
    name: "Arturo's Wig",
    description: "Generates 5 hair per second",
    cost: 500,
    multiplier: 1.25,
    owned: 0,
    image: "/images/wig.svg",
  },
  {
    id: "salon",
    name: "Hair Salon",
    description: "Generates 20 hair per second",
    cost: 2000,
    multiplier: 1.3,
    owned: 0,
    image: "/images/salon.svg",
  },
  {
    id: "hairTonic",
    name: "Hair Tonic",
    description: "Increases click power by 10",
    cost: 5000,
    multiplier: 1.35,
    owned: 0,
    image: "/images/tonic.svg",
  },
  {
    id: "hairClinic",
    name: "Hair Clinic",
    description: "Generates 50 hair per second",
    cost: 10000,
    multiplier: 1.4,
    owned: 0,
    image: "/images/clinic.svg",
  },
  {
    id: "comboBooster",
    name: "Combo Booster",
    description: "Increases max combo multiplier by 0.5",
    cost: 25000,
    multiplier: 1.5,
    owned: 0,
    image: "/images/combo.svg",
  },
  {
    id: "comboExtender",
    name: "Combo Extender",
    description: "Slows down combo decay by 10%",
    cost: 50000,
    multiplier: 1.6,
    owned: 0,
    image: "/images/timer.svg",
  },
  {
    id: "hairFactory",
    name: "Hair Factory",
    description: "Generates 200 hair per second",
    cost: 100000,
    multiplier: 1.7,
    owned: 0,
    image: "/images/factory.svg",
  },
  {
    id: "hairResearch",
    name: "Hair Research Lab",
    description: "Increases click power by 50",
    cost: 250000,
    multiplier: 1.8,
    owned: 0,
    image: "/images/lab.svg",
  },
  {
    id: "hairCloner",
    name: "Hair Cloning Tech",
    description: "Generates 500 hair per second",
    cost: 500000,
    multiplier: 1.9,
    owned: 0,
    image: "/images/clone.svg",
  },
  // New upgrades
  {
    id: "hairGalaxy",
    name: "Hair Galaxy",
    description: "Generates 2,000 hair per second",
    cost: 2000000,
    multiplier: 2.0,
    owned: 0,
    image: "/images/galaxy.svg",
  },
  {
    id: "quantumScissors",
    name: "Quantum Scissors",
    description: "Increases click power by 200",
    cost: 5000000,
    multiplier: 2.1,
    owned: 0,
    image: "/images/scissors.svg",
  },
  {
    id: "timeWarp",
    name: "Time Warp Conditioner",
    description: "Increases offline gains by 20%",
    cost: 10000000,
    multiplier: 2.2,
    owned: 0,
    image: "/images/time.svg",
  },
  {
    id: "hairDimension",
    name: "Hair Dimension",
    description: "Generates 10,000 hair per second",
    cost: 50000000,
    multiplier: 2.3,
    owned: 0,
    image: "/images/dimension.svg",
  },
  {
    id: "comboMaster",
    name: "Combo Master",
    description: "Increases combo ramp-up speed by 20%",
    cost: 100000000,
    multiplier: 2.4,
    owned: 0,
    image: "/images/master.svg",
  },
  {
    id: "hairUniverse",
    name: "Hair Universe",
    description: "Generates 50,000 hair per second",
    cost: 500000000,
    multiplier: 2.5,
    owned: 0,
    image: "/images/universe.svg",
  },
  {
    id: "clickNova",
    name: "Click Nova",
    description: "Increases click power by 1,000",
    cost: 1000000000,
    multiplier: 2.6,
    owned: 0,
    image: "/images/nova.svg",
  },
  {
    id: "infiniteStrand",
    name: "Infinite Strand",
    description: "Generates 200,000 hair per second",
    cost: 5000000000,
    multiplier: 2.7,
    owned: 0,
    image: "/images/infinite.svg",
  },
  {
    id: "hairGod",
    name: "Hair God",
    description: "Increases all production by 50%",
    cost: 10000000000,
    multiplier: 3.0,
    owned: 0,
    image: "/images/god.svg",
  },
];

type GamePersistOptions = PersistOptions<GameState, GameState>;

const persistOptions: GamePersistOptions = {
  name: "arturo-clicker-game",
};

// Helper function to calculate cost with a more balanced scaling
function calculateUpgradeCostWithScaling(
  baseCost: number,
  multiplier: number,
  owned: number,
  amount: number
): number {
  if (amount <= 0) return 0;

  const firstTermCost = baseCost * Math.pow(multiplier, owned);

  if (amount === 1) return firstTermCost;

  return (
    (firstTermCost * (1 - Math.pow(multiplier, amount))) / (1 - multiplier)
  );
}

// Create the game store
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      hairCount: 0,
      clickPower: 1,
      passiveIncome: 0,
      lastUpdated: Date.now(),
      totalClicks: 0,
      upgrades: initialUpgrades,
      selectedPurchaseAmount: 1,

      // Special multipliers
      offlineGainMultiplier: 1.0,

      // Combo system initial state
      comboMultiplier: 1,
      maxComboMultiplier: 5, // Maximum multiplier (5x)
      comboRampUpRate: 0.05, // How fast the combo increases per click (slower ramp up)
      comboDecayRate: 0.3, // Increased from 0.2 to 0.3 for more noticeable decay
      lastClickTime: 0,
      comboTimeWindow: 1000, // Time window in ms to consider clicks as combo (1 second)
      comboDecayDelay: 2500, // Reduced from 3000 to 2500 ms for quicker decay start
      comboWarningTime: 1200, // Reduced from 1500 to 1200 ms for earlier warning

      // Click action
      clickHead: () => {
        set((state: GameState) => ({
          hairCount: state.hairCount + state.clickPower * state.comboMultiplier,
          lastClickTime: Date.now(),
          totalClicks: state.totalClicks + 1, // Increment total clicks
        }));

        // Increase combo after click
        get().increaseCombo();
      },

      // Increase combo multiplier
      increaseCombo: () => {
        const now = Date.now();
        const { lastClickTime, comboTimeWindow } = get();

        // Check if click is within combo window
        if (now - lastClickTime <= comboTimeWindow) {
          set((state: GameState) => {
            // Calculate new combo multiplier, capped at max
            const newCombo = Math.min(
              state.comboMultiplier + state.comboRampUpRate,
              state.maxComboMultiplier
            );
            return { comboMultiplier: newCombo };
          });
        }
      },

      // Decay combo over time
      decayCombo: () => {
        const now = Date.now();
        const { lastClickTime, comboDecayDelay, comboMultiplier } = get();
        const timeSinceLastClick = now - lastClickTime;

        // Only decay if we haven't clicked for a while and combo is active
        if (timeSinceLastClick > comboDecayDelay && comboMultiplier > 1) {
          // Calculate how long we've been in decay state
          const decayTime = timeSinceLastClick - comboDecayDelay;

          // Calculate decay amount based on how long we've been decaying
          // The longer we've been decaying, the faster it drops
          // Reduced the ramp-up time from 5000ms to 3000ms for faster decay
          const decayFactor = Math.min(2, decayTime / 3000); // Ramp up decay over 3 seconds, max 2x multiplier
          const decayAmount =
            get().comboDecayRate * (1 / 60) * (1 + decayFactor);

          // Reduce combo multiplier, but not below 1
          const newCombo = Math.max(comboMultiplier - decayAmount, 1);

          // Update the state with the new combo value
          set({ comboMultiplier: newCombo });
        }
      },

      // Set selected purchase amount
      setSelectedPurchaseAmount: (amount: PurchaseAmount) => {
        set({ selectedPurchaseAmount: amount });
      },

      // Calculate upgrade cost
      calculateUpgradeCost: (upgradeId, amount) => {
        const { upgrades, hairCount } = get();
        const upgrade = upgrades.find((u) => u.id === upgradeId);

        if (!upgrade) return 0;

        // If "max", calculate how many we can afford
        if (amount === "max") {
          const remainingHair = hairCount;
          const currentLevel = upgrade.owned;
          let purchaseCount = 0;
          // totalCost is used in the binary search below
          let cost = 0;

          // Use a more efficient algorithm for max calculation
          // This is a binary search approach to find the maximum affordable amount
          let low = 0;
          let high = 1000; // Cap at 1000 to prevent excessive calculations

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            cost = calculateUpgradeCostWithScaling(
              upgrade.cost,
              upgrade.multiplier,
              currentLevel,
              mid
            );

            if (cost <= remainingHair) {
              purchaseCount = mid;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }

          // Return the cost for the maximum affordable amount
          return calculateUpgradeCostWithScaling(
            upgrade.cost,
            upgrade.multiplier,
            currentLevel,
            purchaseCount
          );
        }

        // Otherwise calculate cost for the specified amount
        return calculateUpgradeCostWithScaling(
          upgrade.cost,
          upgrade.multiplier,
          upgrade.owned,
          Number(amount)
        );
      },

      // Buy multiple upgrades at once
      buyMultipleUpgrades: (upgradeId, amount) => {
        const { upgrades, hairCount } = get();
        const upgradeIndex = upgrades.findIndex((u) => u.id === upgradeId);

        if (upgradeIndex === -1) return;

        const upgrade = upgrades[upgradeIndex];
        let purchaseCount = 0;
        let totalCost = 0;

        // If "max", calculate how many we can afford
        if (amount === "max") {
          const remainingHair = hairCount;
          const currentLevel = upgrade.owned;

          // Use binary search to find maximum affordable amount
          let low = 0;
          let high = 1000; // Cap at 1000 to prevent excessive calculations

          while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const cost = calculateUpgradeCostWithScaling(
              upgrade.cost,
              upgrade.multiplier,
              currentLevel,
              mid
            );

            if (cost <= remainingHair) {
              purchaseCount = mid;
              totalCost = cost;
              low = mid + 1;
            } else {
              high = mid - 1;
            }
          }
        } else {
          // Otherwise try to buy the specified amount
          const targetAmount = Number(amount);
          const cost = calculateUpgradeCostWithScaling(
            upgrade.cost,
            upgrade.multiplier,
            upgrade.owned,
            targetAmount
          );

          if (hairCount >= cost) {
            purchaseCount = targetAmount;
            totalCost = cost;
          }
        }

        // If we couldn't afford any, return
        if (purchaseCount === 0) return;

        const newUpgrades = [...upgrades];
        newUpgrades[upgradeIndex] = {
          ...upgrade,
          owned: upgrade.owned + purchaseCount,
        };

        let newPassiveIncome = 0;
        let newClickPower = 1;
        let newMaxComboMultiplier = get().maxComboMultiplier;
        let newComboDecayRate = get().comboDecayRate;

        // Calculate new passive income and click power
        newUpgrades.forEach((u: Upgrade) => {
          // Click power upgrades
          if (u.id === "comb") {
            newClickPower += u.owned * 1;
          } else if (u.id === "hat") {
            newClickPower += u.owned * 5;
          } else if (u.id === "hairTonic") {
            newClickPower += u.owned * 10;
          } else if (u.id === "hairResearch") {
            newClickPower += u.owned * 50;
          } else if (u.id === "quantumScissors") {
            newClickPower += u.owned * 200;
          } else if (u.id === "clickNova") {
            newClickPower += u.owned * 1000;
          }
          // Passive income upgrades
          else if (u.id === "shampoo") {
            newPassiveIncome += u.owned * 1;
          } else if (u.id === "wig") {
            newPassiveIncome += u.owned * 5;
          } else if (u.id === "salon") {
            newPassiveIncome += u.owned * 20;
          } else if (u.id === "hairClinic") {
            newPassiveIncome += u.owned * 50;
          } else if (u.id === "hairFactory") {
            newPassiveIncome += u.owned * 200;
          } else if (u.id === "hairCloner") {
            newPassiveIncome += u.owned * 500;
          } else if (u.id === "hairGalaxy") {
            newPassiveIncome += u.owned * 2000;
          } else if (u.id === "hairDimension") {
            newPassiveIncome += u.owned * 10000;
          } else if (u.id === "hairUniverse") {
            newPassiveIncome += u.owned * 50000;
          } else if (u.id === "infiniteStrand") {
            newPassiveIncome += u.owned * 200000;
          }
          // Combo upgrades
          else if (u.id === "comboBooster") {
            newMaxComboMultiplier = 5 + u.owned * 0.5;
          } else if (u.id === "comboExtender") {
            // Reduce decay rate by 10% per upgrade (multiplicative)
            newComboDecayRate = 0.5 * Math.pow(0.9, u.owned);
          } else if (u.id === "comboMaster") {
            // This is handled separately below
          }
        });

        // Apply special effects for certain upgrades
        let offlineGainMultiplier = 1.0;
        let comboRampUpMultiplier = 1.0;
        let productionMultiplier = 1.0;

        // Check for special upgrades
        newUpgrades.forEach((u: Upgrade) => {
          if (u.id === "timeWarp" && u.owned > 0) {
            // Each Time Warp Conditioner adds 20% to offline gains
            offlineGainMultiplier += u.owned * 0.2;
          }

          if (u.id === "comboMaster" && u.owned > 0) {
            // Each Combo Master increases combo ramp-up speed by 20%
            comboRampUpMultiplier += u.owned * 0.2;
          }

          if (u.id === "hairGod" && u.owned > 0) {
            // Each Hair God increases all production by 50%
            productionMultiplier += u.owned * 0.5;
          }
        });

        // Apply production multiplier to passive income and click power
        newPassiveIncome = Math.floor(newPassiveIncome * productionMultiplier);
        newClickPower = Math.floor(newClickPower * productionMultiplier);

        // Calculate new combo ramp up rate with the multiplier
        const newComboRampUpRate = 0.05 * comboRampUpMultiplier;

        set({
          hairCount: hairCount - totalCost,
          upgrades: newUpgrades,
          passiveIncome: newPassiveIncome,
          clickPower: newClickPower,
          maxComboMultiplier: newMaxComboMultiplier,
          comboDecayRate: newComboDecayRate,
          comboRampUpRate: newComboRampUpRate,
          // Store the offline gain multiplier in the state
          offlineGainMultiplier: offlineGainMultiplier,
        });
      },

      // Buy upgrade (single) - now uses buyMultipleUpgrades
      buyUpgrade: (upgradeId: string) => {
        const { selectedPurchaseAmount } = get();
        get().buyMultipleUpgrades(upgradeId, selectedPurchaseAmount);
      },

      // Reset game
      resetGame: () => {
        set({
          hairCount: 0,
          clickPower: 1,
          passiveIncome: 0,
          lastUpdated: Date.now(),
          totalClicks: 0,
          upgrades: initialUpgrades,
          comboMultiplier: 1,
          lastClickTime: 0,
          selectedPurchaseAmount: 1,
          offlineGainMultiplier: 1.0,
          comboRampUpRate: 0.05,
          maxComboMultiplier: 5,
          comboDecayRate: 0.3,
        });
      },

      // Calculate offline progress
      calculateOfflineProgress: () => {
        const { lastUpdated, passiveIncome, offlineGainMultiplier } = get();
        const now = Date.now();
        const timeDiff = (now - lastUpdated) / 1000; // in seconds

        if (timeDiff > 0 && passiveIncome > 0) {
          // Apply the offline gain multiplier
          const offlineEarnings = Math.floor(
            passiveIncome * timeDiff * offlineGainMultiplier
          );

          set((state: GameState) => ({
            hairCount: state.hairCount + offlineEarnings,
            lastUpdated: now,
            comboMultiplier: 1, // Reset combo after offline progress
          }));

          return offlineEarnings;
        }

        set({ lastUpdated: now });
        return 0;
      },

      // Get current combo state
      getComboState: () => {
        const {
          comboMultiplier,
          lastClickTime,
          comboWarningTime,
          comboDecayDelay,
        } = get();
        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        // If combo is not active, return inactive
        if (comboMultiplier <= 1) {
          return "inactive";
        }

        // Check time thresholds
        if (timeSinceLastClick < comboWarningTime) {
          return "active";
        } else if (timeSinceLastClick < comboDecayDelay) {
          return "warning";
        } else {
          return "decaying";
        }
      },
    }),
    {
      ...persistOptions,
      onRehydrateStorage: () => (state) => {
        // This function runs when the persisted state is loaded
        if (state) {
          // Check if we need to add new upgrades that weren't in the persisted state
          const currentUpgrades = state.upgrades;
          const missingUpgrades = initialUpgrades.filter(
            (initialUpgrade) =>
              !currentUpgrades.some(
                (currentUpgrade) => currentUpgrade.id === initialUpgrade.id
              )
          );

          // If there are missing upgrades, add them to the state
          if (missingUpgrades.length > 0) {
            state.upgrades = [...currentUpgrades, ...missingUpgrades];

            // Recalculate passive income and click power with the new upgrades
            let newPassiveIncome = 0;
            let newClickPower = 1;
            let newMaxComboMultiplier = 5;
            let newComboDecayRate = 0.3;

            state.upgrades.forEach((u: Upgrade) => {
              // Click power upgrades
              if (u.id === "comb") {
                newClickPower += u.owned * 1;
              } else if (u.id === "hat") {
                newClickPower += u.owned * 5;
              } else if (u.id === "hairTonic") {
                newClickPower += u.owned * 10;
              } else if (u.id === "hairResearch") {
                newClickPower += u.owned * 50;
              }
              // Passive income upgrades
              else if (u.id === "shampoo") {
                newPassiveIncome += u.owned * 1;
              } else if (u.id === "wig") {
                newPassiveIncome += u.owned * 5;
              } else if (u.id === "salon") {
                newPassiveIncome += u.owned * 20;
              } else if (u.id === "hairClinic") {
                newPassiveIncome += u.owned * 50;
              } else if (u.id === "hairFactory") {
                newPassiveIncome += u.owned * 200;
              } else if (u.id === "hairCloner") {
                newPassiveIncome += u.owned * 500;
              }
              // Combo upgrades
              else if (u.id === "comboBooster") {
                newMaxComboMultiplier = 5 + u.owned * 0.5;
              } else if (u.id === "comboExtender") {
                // Reduce decay rate by 10% per upgrade (multiplicative)
                newComboDecayRate = 0.3 * Math.pow(0.9, u.owned);
              }
            });

            state.passiveIncome = newPassiveIncome;
            state.clickPower = newClickPower;
            state.maxComboMultiplier = newMaxComboMultiplier;
            state.comboDecayRate = newComboDecayRate;
          }
        }
      },
    }
  )
);

// Game tick function to update passive income and decay combo
export function setupGameTick(): void {
  let lastTick = Date.now();

  const gameTick = () => {
    const now = Date.now();
    const delta = (now - lastTick) / 1000; // in seconds
    lastTick = now;

    // Update passive income
    const { passiveIncome } = useGameStore.getState();
    if (passiveIncome > 0) {
      useGameStore.setState((state: GameState) => ({
        hairCount: state.hairCount + state.passiveIncome * delta,
        lastUpdated: now,
      }));
    }

    // Decay combo multiplier - ensure this is called every frame
    try {
      useGameStore.getState().decayCombo();
    } catch (error) {
      console.error("Error decaying combo:", error);
    }

    // Continue the game loop
    requestAnimationFrame(gameTick);
  };

  // Start the game loop
  requestAnimationFrame(gameTick);
}
