import { TFileType } from '@/types/docs.type';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Zap,
  DoorClosed,
  Thermometer,
  Wifi,
  HelpCircle,
  FileText,
  Image
} from 'lucide-react';


export const IconMap = {
  'Clock': Clock,
  'AlertCircle': AlertCircle,
  'CheckCircle': CheckCircle,
  
  'Zap': Zap,
  'DoorClosed': DoorClosed,
  'Thermometer': Thermometer,
  'Wifi': Wifi,
  'HelpCircle': HelpCircle,
  
  //...
} as const;



export type IconName = keyof typeof IconMap;

/**
 * Utility function to obtain an icon component.
 * @param iconName the icon name
 * @returns an lucide-react icon
 */
export const getIconComponent = (iconName: string) => {
  return IconMap[iconName as IconName] || HelpCircle; // Fallback icon
};

/**
 * Utility function to parse filetype into an icon component.
 * @param fileType the file type (pdf, imaeg, excel...)
 * @returns an lucide-react icon
 */
export const getFileIcon = (fileType: TFileType) => {
  switch (fileType) {
    case 'pdf':
      return <FileText className="text-red-600" size={20} />;
    case 'image':
      return <Image className="text-blue-600" size={20} />;
    default:
      return <FileText className="text-gray-600" size={20} />;
  }
};