'use client';

import { Suspense, useState } from 'react';
import { GameContainer } from '@/components/game/game-container';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsModal } from '@/components/game/settings-modal';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <main className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 bg-card p-6 rounded-lg shadow-md border border-border relative">
          <div className="absolute right-4 top-4 flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSettingsOpen(true)}
              className="rounded-full"
              aria-label="Settings"
            >
              <Settings className="h-[1.2rem] w-[1.2rem]" />
            </Button>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
            Arturo&apos;s Hair Growth Simulator
          </h1>
          <p className="text-lg text-card-foreground">
            Help Arturo grow his hair by clicking on his bald head!
          </p>
        </header>
        
        <Suspense fallback={
          <div className="text-center p-8 bg-card rounded-lg shadow-md border border-border">
            <div className="text-xl text-primary font-bold">Loading game...</div>
          </div>
        }>
          <GameContainer />
        </Suspense>
        
        <footer className="mt-12 text-center p-4 bg-card rounded-lg shadow-md border border-border text-sm text-muted-foreground">
          <p>© 2025 Arturo&apos;s Hair Growth Simulator - All Rights Reserved</p>
        </footer>
      </div>
      
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
