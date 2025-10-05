import React from 'react';
import { Link } from 'react-router-dom';

interface IButtonLinkProps
{
    to: string;
    children?: React.ReactNode;
    removeBackground: boolean;
    noColor: boolean;
}


export default function ButtonLink({ to, removeBackground = false, noColor = false, children }: IButtonLinkProps)
{
    return noColor ?
        (<Link 
            to={to}
            className="flex justify-center items-center w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3 px-4 rounded-lg transition-colors"
        >
            {children}
        </Link>)
        :
        (<Link
            to={to}
            className={removeBackground ?
                 `text-[#D9BEA3] font-semibold hover:text-[#A5CBD9] transition-colors flex items-center gap-2 w-fit`
                : `bg-[#F7BF57] hover:bg-[#D9BEA3] text-white px-6 py-3 rounded-md text-lg font-semibold transition-colors flex justify-center items-center gap-2`}
        >
            {children}
        </Link>)
    ;
}