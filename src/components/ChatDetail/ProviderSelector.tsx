"use client";

import { ChevronsUpDown } from 'lucide-react';

const ProviderSelector: React.FC = () => {
  return (
    <div className='flex justify-between items-center outline p-0.5 rounded-md w-32 cursor-pointer hover:bg-gray-50'>
      <div className='flex justify-start items-center gap-1'>
        <img 
          src="/logo.png" 
          alt="Periskope logo" 
          className="h-4 w-4"
        />
        <p className='text-xs text-gray-700'>Periskope</p>
      </div>
      <ChevronsUpDown size={12} className="text-gray-500" />
    </div>
  );
};

export default ProviderSelector;