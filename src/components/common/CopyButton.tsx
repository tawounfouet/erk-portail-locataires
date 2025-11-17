import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface ICopyButtonWithToastProps {
  text: string;
  successMessage?: string;
  errorMessage?: string;
}

export function CopyButtonWithToast({
    text,
    successMessage = "Copié dans le presse-papier !",
    errorMessage = "Erreur lors de la copie",
    ...props
}: ICopyButtonWithToastProps) {
    const [isCopied, setIsCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            
            toast({
                description: successMessage,
                duration: 2000,
            });

            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            toast({
                title: "Whoops...",
                description: errorMessage,
                variant: "destructive",
                duration: 3000,
            });
        }
    };

    return (
        <Button
            onClick={handleCopy}
            {...props}
        >
            {isCopied ? (
                <Check className="h-4 w-4" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </Button>
    );
}