'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Facebook, Linkedin, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';

export function ShareButtons() {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://arturos-hair-growth.vercel.app';
  const shareTitle = "Help Arturo grow his hair in this addictive clicker game!";
  const shareText = "I'm playing Arturo's Hair Growth Simulator! Check it out:";
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(
      () => {
        toast({
          title: "Link copied!",
          description: "Share it with your friends.",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank');
  };
  
  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };
  
  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };
  
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={handleShare}
        className="rounded-full"
        aria-label="Share"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={shareOnTwitter}
        className="rounded-full"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={shareOnFacebook}
        className="rounded-full"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={shareOnLinkedIn}
        className="rounded-full"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
    </div>
  );
} 