import React from 'react';

/**
 * ViewProps interface - Type definition for the HView component.
 * Extends all standard HTML div attributes for maximum flexibility.
 * 
 * @property {React.ReactNode} children - Child elements to be laid out horizontally/vertically.
 * @property {string} [className] - Additional Tailwind CSS classes to customize styling.
 * @property {string} [gap] - Tailwind gap class for spacing between items (e.g., "gap-2", "gap-4").
 * @property {'items-start' | 'items-center' | 'items-end' | 'items-baseline' | 'items-stretch'} [align] - 
 *   Vertical alignment of items within the container.
 * @property {'justify-start' | 'justify-center' | 'justify-end' | 'justify-between' | 'justify-around' | 'justify-evenly'} [justify] - 
 *   Horizontal distribution of items along the main axis.
 * @property {boolean} [wrap] - If true, items will wrap to the next line when space is insufficient.
 */
interface IViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gap?: string;
  align?: 'items-start' | 'items-center' | 'items-end' | 'items-baseline' | 'items-stretch';
  justify?: 'justify-start' | 'justify-center' | 'justify-end' | 'justify-between' | 'justify-around' | 'justify-evenly';
  wrap?: boolean;
}

/**
 * HView component - A horizontal flexbox layout container.
 * 
 * This component simplifies the creation of horizontal layouts using flexbox.
 * It provides a clean API for controlling spacing, alignment, and wrapping behavior
 * while maintaining full compatibility with standard HTML div attributes.
 * 
 * @param {React.ReactNode} children - Elements to be arranged horizontally.
 * @param {string} [className=''] - Additional Tailwind classes for custom styling.
 * @param {string} [gap='gap-4'] - Spacing between items (e.g., "gap-2", "gap-6").
 * @param {string} [align='items-center'] - Vertical alignment of items.
 * @param {string} [justify='justify-start'] - Horizontal distribution of items.
 * @param {boolean} [wrap=false] - Enable wrapping to multiple lines when needed.
 * @param {...props} - All other standard HTML div attributes (onClick, id, style, etc.).
 * 
 * @example
 * <HView gap="gap-3" justify="justify-between" className="bg-gray-100 p-4">
 *   <button>Cancel</button>
 *   <button>Confirm</button>
 * </HView>
 * 
 * @example
 * // Toolbar with wrapped items
 * <HView wrap gap="gap-2" align="items-center">
 *   <button>Action 1</button>
 *   <button>Action 2</button>
 *   <button>Action 3</button>
 * </HView>
 */
export function HView({ 
  children, 
  className = '', 
  gap = 'gap-4',
  align = 'items-center',
  justify = 'justify-start',
  wrap = false,
  ...props 
}: IViewProps) {
  return (
    <div 
      className={`flex flex-row ${gap} ${align} ${justify} ${wrap ? 'flex-wrap' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * VView component - A vertical flexbox layout container.
 * 
 * This component simplifies the creation of vertical layouts using flexbox.
 * It provides a clean API for controlling spacing, alignment, and justification
 * while maintaining full compatibility with standard HTML div attributes.
 * 
 * @param {React.ReactNode} children - Elements to be arranged vertically.
 * @param {string} [className=''] - Additional Tailwind classes for custom styling.
 * @param {string} [gap='gap-4'] - Spacing between items (e.g., "gap-2", "gap-6").
 * @param {string} [align='items-start'] - Horizontal alignment of items.
 * @param {string} [justify='justify-start'] - Vertical distribution of items.
 * @param {...props} - All other standard HTML div attributes (onClick, id, style, etc.).
 * 
 * @example
 * <VView gap="gap-3" align="items-center" className="bg-white p-6 rounded">
 *   <h2>Title</h2>
 *   <p>Description text</p>
 *   <button>Action</button>
 * </VView>
 * 
 * @example
 * // Card with centered content
 * <VView gap="gap-2" align="items-center" justify="justify-center" className="h-64">
 *   <img src="icon.svg" alt="Icon" />
 *   <h3>Welcome</h3>
 * </VView>
 */
export function VView({ 
  children, 
  className = '', 
  gap = 'gap-4',
  align = 'items-start',
  justify = 'justify-start',
  ...props 
}: IViewProps) {
  return (
    <div 
      className={`flex flex-col ${gap} ${align} ${justify} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};