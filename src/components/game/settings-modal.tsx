'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const resetGame = useGameStore(state => state.resetGame);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  
  const handleResetGame = () => {
    resetGame();
    setShowResetConfirmation(false);
    onOpenChange(false);
  };

  const handleClearStorage = () => {
    localStorage.removeItem("arturo-clicker-game");
    window.location.reload();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
          <DialogDescription>
            Configure your game experience and manage your progress.
          </DialogDescription>
        </DialogHeader>
        
        {!showResetConfirmation ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound">Sound Effects</Label>
                  <div className="text-xs text-muted-foreground">
                    Enable or disable game sound effects
                  </div>
                </div>
                <Switch id="sound" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notifications</Label>
                  <div className="text-xs text-muted-foreground">
                    Show notifications for important events
                  </div>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-2">
                <Label className="flex flex-col">
                  <span>Reset Progress</span>
                  <span className="text-xs text-muted-foreground">Reset all game progress and start over</span>
                </Label>
                <Button 
                  variant="destructive" 
                  onClick={() => setShowResetConfirmation(true)}
                >
                  Reset Progress
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex flex-col gap-2">
                <Label className="flex flex-col">
                  <span>Clear Local Storage</span>
                  <span className="text-xs text-muted-foreground">Clear all game data from local storage (for development)</span>
                </Label>
                <Button 
                  variant="outline" 
                  onClick={handleClearStorage}
                >
                  Clear Storage
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center gap-2 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Are you sure?</h3>
              <p className="text-center text-sm text-muted-foreground">
                This will permanently delete all your progress, including hair count, upgrades, and achievements. This action cannot be undone.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowResetConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={handleResetGame}
              >
                Yes, Reset Everything
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 