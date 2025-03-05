'use client';

import { useEffect } from 'react';
import { formatNumber } from '@/utils/format-utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface OfflineProgressModalProps {
  earnings: number;
  onClose: () => void;
}

export default function OfflineProgressModal({ earnings, onClose }: OfflineProgressModalProps) {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Welcome Back!</DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-6">
          <p className="text-lg mb-2">
            While you were away, Arturo&apos;s hair grew:
          </p>
          <p className="text-3xl font-bold text-primary">
            +{formatNumber(earnings)} hair
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <Button onClick={onClose} size="lg">
            Awesome!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 