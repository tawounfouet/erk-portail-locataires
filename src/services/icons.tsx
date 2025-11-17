import { TFileType } from '@/types/docs.type';
import { TReportCategory } from '@/types/reports.type';
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
  Image,
  Droplets,
  Lightbulb,
  DoorOpen,
  Shield,
  Wrench,
  FolderIcon,
  UsersIcon,
  ListIcon,
  Bell,
  BarChartIcon,
  ArrowLeft
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
  
  'Reports': BarChartIcon,
  'Documents': FolderIcon,
  'Contacts': UsersIcon,
  'Suggestions': ListIcon,
  'Notifications': Bell,

  'Return': ArrowLeft
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

export const getCategoryIcon = (category: TReportCategory) => {
    switch (category) {
        case 'plomberie':
            return <Droplets size={18} className="text-blue-500" />;
        case 'electricite':
            return <Lightbulb size={18} className="text-yellow-500" />;
        case 'porte':
            return <DoorOpen size={18} className="text-gray-600" />;
        case 'chauffage':
            return <Thermometer size={18} className="text-red-500" />;
        case 'internet':
            return <Wifi size={18} className="text-indigo-500" />;
        case 'securite':
            return <Shield size={18} className="text-purple-500" />;
        default:
            return <Wrench size={18} className="text-gray-500" />;
    }
};