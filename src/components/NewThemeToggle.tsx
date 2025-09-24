import React from 'react';
import { Button } from '@heroui/react';
import { useTheme } from '@/hooks/useTheme';

export const NewThemeToggle: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="group flex flex-col gap-1 w-12 p-1.5 bg-content2 rounded-full cursor-pointer transition-all hover:shadow-lg">
      <Button
        isIconOnly
        variant={resolvedTheme === 'dark' ? 'solid' : 'flat'}
        color={resolvedTheme === 'dark' ? 'primary' : 'default'}
        size="sm"
        className="w-9 h-9 rounded-full transition-colors"
        onPress={() => setTheme('dark')}
        aria-label="Dark mode"
      >
        <svg 
          className="size-4 fill-current" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <path d="M11.16 2.004c.937-.079 1.544.967 1.01 1.741a5.78 5.78 0 0 0-1.023 3.294c0 3.21 2.602 5.813 5.813 5.813a5.78 5.78 0 0 0 3.294-1.023c.774-.534 1.82.074 1.741 1.01A10.02 10.02 0 0 1 2 11.984a10.02 10.02 0 0 1 9.16-9.98zm-1.89 2.687l-.144.056c-2.882 1.151-4.9 3.971-4.9 7.237a7.79 7.79 0 0 0 7.79 7.79c3.266 0 6.086-2.018 7.237-4.9l.055-.145-.335.096c-.52.134-1.056.216-1.601.244l-.411.01a8.04 8.04 0 0 1-8.039-8.039c0-.687.087-1.362.254-2.012l.095-.336z"></path>
        </svg>
      </Button>
      
      <Button
        isIconOnly
        variant={resolvedTheme === 'light' ? 'solid' : 'flat'}
        color={resolvedTheme === 'light' ? 'primary' : 'default'}
        size="sm"
        className="w-9 h-9 rounded-full transition-colors"
        onPress={() => setTheme('light')}
        aria-label="Light mode"
      >
        <svg 
          className="size-4 fill-current" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24"
        >
          <path d="M12 19.679a1.14 1.14 0 0 1 1.139 1.139v1.542A1.14 1.14 0 0 1 12 23.5a1.14 1.14 0 0 1-1.139-1.139v-1.542A1.14 1.14 0 0 1 12 19.679zM4.959 17.43a1.14 1.14 0 0 1 1.611 0 1.14 1.14 0 0 1 0 1.611l-1.091 1.091a1.14 1.14 0 0 1-1.611 0 1.14 1.14 0 0 1 0-1.611l1.091-1.091zm12.471 0a1.14 1.14 0 0 1 1.611 0l1.091 1.091a1.14 1.14 0 0 1 0 1.611 1.14 1.14 0 0 1-1.611 0l-1.091-1.091a1.14 1.14 0 0 1 0-1.611zM7.436 7.436c2.521-2.521 6.608-2.521 9.129 0s2.521 6.608 0 9.129-6.608 2.521-9.129 0-2.521-6.608 0-9.129zm1.611 1.611a4.18 4.18 0 0 0 0 5.907 4.18 4.18 0 0 0 5.907 0 4.18 4.18 0 0 0 0-5.907 4.18 4.18 0 0 0-5.907 0zm13.314 1.814A1.14 1.14 0 0 1 23.5 12a1.14 1.14 0 0 1-1.139 1.139h-1.542A1.14 1.14 0 0 1 19.679 12a1.14 1.14 0 0 1 1.139-1.139h1.542zm-19.179 0A1.14 1.14 0 0 1 4.321 12a1.14 1.14 0 0 1-1.139 1.139H1.639A1.14 1.14 0 0 1 .5 12a1.14 1.14 0 0 1 1.139-1.139h1.542zm15.339-6.993a1.14 1.14 0 0 1 1.611 0 1.14 1.14 0 0 1 0 1.611L19.041 6.57a1.14 1.14 0 0 1-1.611 0 1.14 1.14 0 0 1 0-1.611l1.091-1.091zm-14.652 0a1.14 1.14 0 0 1 1.611 0L6.57 4.959a1.14 1.14 0 0 1 0 1.611 1.14 1.14 0 0 1-1.611 0L3.868 5.479a1.14 1.14 0 0 1 0-1.611zM12 .5a1.14 1.14 0 0 1 1.139 1.139v1.542A1.14 1.14 0 0 1 12 4.321a1.14 1.14 0 0 1-1.139-1.139V1.639A1.14 1.14 0 0 1 12 .5z"></path>
        </svg>
      </Button>
    </div>
  );
};