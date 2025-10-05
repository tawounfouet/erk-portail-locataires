// components/navbar/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { CalendarCheck, Home, Menu, Phone, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import logoImage from '@images/logo-eureka-97x160.png';
import { ERK_FEATURE_FLAGS } from '@site-config';
import { NavItemProps } from './types';
import NavLink from './NavLink';
import MobileNavLink from './MobileNavLink';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navItems: NavItemProps[] = [
    {
      to: '/',
      label: 'Accueil',
      icon: <Home size={18} />
    },
    {
      label: 'Logements',
      to: '/logements',
      icon: <Home size={18} />,
    },
    {
      to: '/contact',
      label: 'Contact',
      icon: <Phone size={18} />
    }
  ];

  if (ERK_FEATURE_FLAGS.eurekashop) {
    navItems.splice(navItems.length - 1, 0, {
      to: '/boutique',
      label: 'Boutique',
    });
  }

  return (
    <nav className="fixed w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="Eureka Résidences" className="h-16" /> 
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                item={item}
                isActive={isActive}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                dropdownRef={dropdownRef}
              />
            ))}
            
            {ERK_FEATURE_FLAGS.eurekanet && (
              <Link
                to='/login'
                className='rounded-lg p-2 hover:bg-gray-200 hover:dark:bg-gray-700'
              >
                <UserRound className='text-gray-600 dark:text-gray-200' />
              </Link>
            )}

            <ThemeToggle />

            {ERK_FEATURE_FLAGS.booking && (
              <Link
                to="/reservation"
                className="bg-[#F7BF57] text-white px-4 py-2 rounded-md hover:bg-[#D9BEA3] transition-colors flex items-center gap-2"
              >
                <CalendarCheck size={18} />
                <span>Réserver</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-[#D9BEA3] dark:hover:text-[#D9BEA3] ml-2 p-1"
              aria-expanded={isOpen}
              aria-label="Menu principal"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {navItems.map((item, index) => (
                <MobileNavLink
                  key={index}
                  item={item}
                  setIsOpen={setIsOpen}
                />
              ))}
              <div className="p-4">
                <Link
                  to="/reservation"
                  className="block w-full text-center bg-[#F7BF57] text-white px-4 py-3 rounded-md hover:bg-[#D9BEA3] transition-colors"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;