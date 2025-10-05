// components/navbar/MobileNavLink.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItemProps } from './types';
import MobileSubmenu from './MobileSubmenu';

interface MobileNavLinkProps {
  item: NavItemProps;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ item, setIsOpen }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      {hasChildren ? (
        <div>
          <button
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <ChevronDown 
              size={16}
              className={`transition-transform duration-200 ${isSubmenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Mobile Submenu */}
          {isSubmenuOpen && (
            <MobileSubmenu 
              item={item} 
              setIsSubmenuOpen={setIsSubmenuOpen} 
              setIsOpen={setIsOpen} 
            />
          )}
        </div>
      ) : (
        <Link
          to={item.to}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setIsOpen(false)}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      )}
    </div>
  );
};

export default MobileNavLink;