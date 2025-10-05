// components/navbar/NavLink.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { NavItemProps } from './types';
import MegaDropdown from './MegaDropdown';

interface NavLinkProps {
  item: NavItemProps;
  isActive: (path: string) => boolean;
  activeDropdown: string | null;
  setActiveDropdown: (label: string | null) => void;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const NavLink: React.FC<NavLinkProps> = ({
  item,
  isActive,
  activeDropdown,
  setActiveDropdown,
  dropdownRef
}) => {
  const hasChildren = item.children && item.children.length > 0;
  
  return (
    <div className="relative" ref={hasChildren ? dropdownRef : undefined}>
      {hasChildren ? (
        <button
          onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
          className={`flex items-center gap-1 relative text-gray-600 dark:text-gray-300 hover:text-[#D9BEA3] dark:hover:text-[#D9BEA3] transition-colors pb-1
            ${isActive(item.to) || (item.children && item.children.some(child => isActive(child.to))) 
              ? 'text-[#D9BEA3] dark:text-[#D9BEA3]' : ''}`}
        >
          {item.label}
          <ChevronDown 
            size={16} 
            className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} 
          />
          {(isActive(item.to) || (item.children && item.children.some(child => isActive(child.to)))) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F7BF57] rounded-full" />
          )}
        </button>
      ) : (
        <Link
          to={item.to}
          className={`flex items-center gap-1 relative text-gray-600 dark:text-gray-300 hover:text-[#D9BEA3] dark:hover:text-[#D9BEA3] transition-colors pb-1
            ${isActive(item.to) ? 'text-[#D9BEA3] dark:text-[#D9BEA3]' : ''}`}
        >
          {item.label}
          {isActive(item.to) && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F7BF57] rounded-full" />
          )}
        </Link>
      )}

      {hasChildren && activeDropdown === item.label && (
        <MegaDropdown 
          item={item} 
          setActiveDropdown={setActiveDropdown} 
        />
      )}
    </div>
  );
};

export default NavLink;