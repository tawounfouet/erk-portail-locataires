// components/navbar/MobileSubmenu.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NavItemProps } from './types';

interface MobileSubmenuProps {
  item: NavItemProps;
  setIsSubmenuOpen: (isOpen: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

const MobileSubmenu: React.FC<MobileSubmenuProps> = ({ 
  item, 
  setIsSubmenuOpen, 
  setIsOpen 
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800">
      {item.children?.map((category, idx) => (
        <div key={idx} className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
          <Link 
            to={category.to}
            className="block font-medium text-gray-900 dark:text-white mb-1"
            onClick={() => {
              setIsSubmenuOpen(false);
              setIsOpen(false);
            }}
          >
            {category.label}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{category.description}</p>
          
          {category.subItems && (
            <ul className="ml-4 mt-2 space-y-1">
              {category.subItems.map((subItem, subIdx) => (
                <li key={subIdx}>
                  <Link 
                    to={subItem.to}
                    className="text-sm py-1 block text-gray-600 dark:text-gray-300 flex items-center"
                    onClick={() => {
                      setIsSubmenuOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <ChevronRight size={14} className="mr-1 text-[#F7BF57]" />
                    {subItem.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileSubmenu;