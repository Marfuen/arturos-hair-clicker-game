import { useToast as useToastUI } from "@/components/ui/use-toast";

export function useToast() {
  const { toast } = useToastUI();

  const showVersionUpdateToast = (message: string) => {
    toast({
      title: "New Version Available",
      description: message,
      variant: "default",
      duration: 5000,
    });
  };

  const showSuccessToast = (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: "default",
      duration: 3000,
    });
  };

  const showErrorToast = (title: string, message: string) => {
    toast({
      title,
      description: message,
      variant: "destructive",
      duration: 5000,
    });
  };

  return {
    showVersionUpdateToast,
    showSuccessToast,
    showErrorToast,
    toast,
  };
}
