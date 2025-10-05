// components/navbar/MegaDropdown.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { NavItemProps } from './types';

interface MegaDropdownProps {
  item: NavItemProps;
  setActiveDropdown: (label: string | null) => void;
}

const MegaDropdown: React.FC<MegaDropdownProps> = ({ item, setActiveDropdown }) => {
  return (
    <div className="absolute z-10 left-0 mt-2 w-screen transform -translate-x-1/2 left-1/2">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex">
            {/* Left side - Categories */}
            <div className="w-2/3 bg-white dark:bg-gray-800 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {item.children?.map((category, idx) => (
                  <div key={idx} className="space-y-1">
                    <Link 
                      to={category.to} 
                      className="block text-lg font-medium text-gray-900 dark:text-white hover:text-[#F7BF57] dark:hover:text-[#F7BF57] mb-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTimeout(() => setActiveDropdown(null), 100);
                      }}
                    >
                      {category.label}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{category.description}</p>
                    
                    {category.subItems && (
                      <ul className="space-y-2 border-l-2 border-gray-100 dark:border-gray-700 pl-3">
                        {category.subItems.map((subItem, subIdx) => (
                          <li key={subIdx}>
                            <Link 
                              to={subItem.to}
                              className="text-sm text-gray-600 dark:text-gray-300 hover:text-[#F7BF57] dark:hover:text-[#F7BF57] flex items-center transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTimeout(() => setActiveDropdown(null), 100);
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
            </div>
            
            {/* Right side - Image */}
            <div className="w-1/3 relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-gray-800 to-transparent z-10"></div>
              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.label} 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-700 shadow-lg mb-4">
                    {item.icon && React.cloneElement(item.icon as React.ReactElement, { 
                      size: 24,
                      className: "text-[#F7BF57]"
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {item.label}
                  </h3>
                  <Link
                    to={item.to}
                    className="mt-4 inline-flex items-center text-sm font-medium text-white hover:text-[#F7BF57] drop-shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveDropdown(null);
                      setTimeout(() => {
                        window.location.href = item.to;
                      }, 100);
                    }}
                  >
                    Tout découvrir
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {item.label === 'Résidences' && "Nos résidences sont idéalement situées pour vos études."}
              {item.label === 'Services' && "De nombreux services disponibles pour votre confort."}
              {item.label === 'Réserver' && "Réservez dès maintenant pour la prochaine rentrée."}
            </p>
            
            <Link
              to={item.label === 'Réserver' ? '/reservation' : item.to}
              className="bg-[#F7BF57] hover:bg-[#e6af4a] text-white text-sm rounded px-4 py-2 transition-colors flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setTimeout(() => setActiveDropdown(null), 100);
              }}
            >
              {item.label === 'Réserver' ? 'Réserver maintenant' : `Découvrir tous nos ${item.label.toLowerCase()}`}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaDropdown;