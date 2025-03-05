'use client';

import Image from 'next/image';
import { useGameStore, Upgrade, PurchaseAmount } from '@/store/game-store';
import { formatNumber } from '@/utils/format-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function UpgradeShop() {
  const upgrades = useGameStore(state => state.upgrades);
  const hairCount = useGameStore(state => state.hairCount);
  const buyUpgrade = useGameStore(state => state.buyUpgrade);
  const calculateUpgradeCost = useGameStore(state => state.calculateUpgradeCost);
  const selectedPurchaseAmount = useGameStore(state => state.selectedPurchaseAmount);
  const setSelectedPurchaseAmount = useGameStore(state => state.setSelectedPurchaseAmount);
  
  const handleBuyUpgrade = (upgradeId: string) => {
    buyUpgrade(upgradeId);
  };
  
  const handlePurchaseAmountChange = (value: string) => {
    if (value) {
      setSelectedPurchaseAmount(value as PurchaseAmount);
    }
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-center md:text-left">Hair Growth Shop</CardTitle>
        <div className="flex flex-col items-center mt-1">
          <p className="text-sm text-muted-foreground mb-1">Purchase Amount</p>
          <ToggleGroup 
            type="single" 
            value={selectedPurchaseAmount.toString()} 
            onValueChange={handlePurchaseAmountChange}
            className="justify-center"
          >
            <ToggleGroupItem value="1" aria-label="Buy 1">1</ToggleGroupItem>
            <ToggleGroupItem value="10" aria-label="Buy 10">10</ToggleGroupItem>
            <ToggleGroupItem value="100" aria-label="Buy 100">100</ToggleGroupItem>
            <ToggleGroupItem value="max" aria-label="Buy Max">Max</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-3 pt-2">
        <div className="space-y-2 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary">
          {upgrades.map(upgrade => (
            <UpgradeCard 
              key={upgrade.id}
              upgrade={upgrade}
              hairCount={hairCount}
              onBuy={handleBuyUpgrade}
              purchaseAmount={selectedPurchaseAmount}
              calculateCost={calculateUpgradeCost}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  hairCount: number;
  onBuy: (id: string) => void;
  purchaseAmount: PurchaseAmount;
  calculateCost: (upgradeId: string, amount: PurchaseAmount) => number;
}

function UpgradeCard({ upgrade, hairCount, onBuy, purchaseAmount, calculateCost }: UpgradeCardProps) {
  const cost = calculateCost(upgrade.id, purchaseAmount);
  const isAffordable = hairCount >= cost && cost > 0;
  
  // Calculate next level cost for single purchase
  const nextLevelCost = upgrade.cost * Math.pow(upgrade.multiplier, upgrade.owned);
  
  // Calculate how many upgrades can be purchased
  const calculatePurchaseCount = (upgrade: Upgrade, purchaseAmount: PurchaseAmount): number => {
    if (purchaseAmount === 'max') {
      let count = 0;
      let currentLevel = upgrade.owned;
      let remainingHair = hairCount;
      
      while (true) {
        const nextCost = upgrade.cost * Math.pow(upgrade.multiplier, currentLevel);
        if (remainingHair < nextCost) break;
        
        remainingHair -= nextCost;
        currentLevel++;
        count++;
        
        // Safety check to prevent infinite loops
        if (count > 1000) break;
      }
      
      return count;
    }
    
    return Number(purchaseAmount);
  };
  
  const purchaseCount = calculatePurchaseCount(upgrade, purchaseAmount);
  
  // Get button text based on purchase count
  const getButtonText = () => {
    if (purchaseCount <= 0) return "Can't Afford";
    return `Buy ${purchaseCount}`;
  };
  
  return (
    <Card className={cn(
      "border transition-all overflow-hidden",
      isAffordable 
        ? "border-primary bg-primary/5 hover:bg-primary/10 cursor-pointer" 
        : "border-muted bg-muted/10 opacity-80"
    )}
    onClick={() => isAffordable && onBuy(upgrade.id)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          {upgrade.image && (
            <div className="relative w-10 h-10 flex-shrink-0 rounded-md overflow-hidden">
              <Image
                src={upgrade.image}
                alt={upgrade.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base">{upgrade.name}</h3>
              <span className="text-xs bg-primary/20 px-2 py-0.5 rounded-full">
                Owned: {upgrade.owned}
              </span>
            </div>
            
            <p className="text-muted-foreground text-xs">{upgrade.description}</p>
            
            <div className="mt-1 flex flex-col gap-1">
              {/* Show next level cost for reference */}
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Next level: {formatNumber(nextLevelCost)} hair</span>
                <span>×{upgrade.multiplier.toFixed(2)} per level</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={cn(
                  "font-semibold text-xs",
                  isAffordable ? "text-green-600" : "text-destructive"
                )}>
                  {purchaseAmount === 1 
                    ? `Cost: ${formatNumber(cost)} hair` 
                    : `Total: ${formatNumber(cost)} hair`}
                </span>
                
                <Button 
                  variant={isAffordable ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  disabled={!isAffordable}
                >
                  {isAffordable ? getButtonText() : "Can't Afford"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 