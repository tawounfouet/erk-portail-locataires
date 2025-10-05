export interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  image?: string;
  children?: {
    to: string;
    label: string;
    description?: string;
    subItems?: {
      to: string;
      label: string;
    }[];
  }[];
}