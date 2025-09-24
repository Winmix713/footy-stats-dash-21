import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { FeedbackForm } from './feedback-form';

export const Footer: React.FC = () => {
  // Add state for feedback form
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <Icon icon="lucide:asterisk" className="text-white" width={16} height={16} />
            </span>
            <span className="text-sm font-medium text-zinc-300">© 2025 winmix.hu</span>
          </div>
          
          {/* Add feedback button */}
          <div className="flex items-center gap-2 sm:order-3">
            <Button
              variant="flat"
              color="default"
              size="sm"
              className="text-zinc-300 border border-white/10"
              onPress={() => setIsFeedbackOpen(true)}
              startContent={<Icon icon="lucide:message-square" width={16} height={16} />}
            >
              Visszajelzés
            </Button>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <a href="#" className="hover:text-zinc-200">Adatvédelem</a>
            <a href="#" className="hover:text-zinc-200">Felhasználási feltételek</a>
            <a href="#" className="hover:text-zinc-200">Kapcsolat</a>
          </div>
        </div>
      </div>
      
      {/* Import FeedbackForm component */}
      <FeedbackForm isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </footer>
  );
};