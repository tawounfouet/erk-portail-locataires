// components/ui/BackButton.tsx
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  fallbackPath?: string; // Chemin de fallback si pas d'historique
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function BackButton({
  variant = 'ghost',
  size = 'default',
  className = '',
  fallbackPath = '/',
  showIcon = true,
  children = 'Retour'
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath); // Fallback si pas d'historique
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGoBack}
      className={`flex items-center gap-2 ${className}`}
    >
      {showIcon && <ArrowLeft className="h-4 w-4" />}
      {children}
    </Button>
  );
}