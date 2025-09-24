import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ isOpen, onClose }) => {
  const [feedbackType, setFeedbackType] = React.useState<'bug' | 'feature' | 'general'>('general');
  const [feedbackText, setFeedbackText] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const handleSubmit = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setFeedbackText('');
    setEmail('');
    setFeedbackType('general');
    setIsSubmitting(false);
    
    // Close modal
    onClose();
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      backdrop="blur"
      size="md"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:message-square" className="text-violet-400" width={20} height={20} />
                <h3 className="text-xl font-semibold">Visszajelzés küldése</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Visszajelzés típusa</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={feedbackType === 'bug' ? 'solid' : 'flat'} 
                      color={feedbackType === 'bug' ? 'danger' : 'default'}
                      className="flex-1"
                      onPress={() => setFeedbackType('bug')}
                    >
                      <Icon icon="lucide:bug" className="mr-1" width={16} height={16} />
                      Hiba
                    </Button>
                    <Button 
                      variant={feedbackType === 'feature' ? 'solid' : 'flat'} 
                      color={feedbackType === 'feature' ? 'primary' : 'default'}
                      className="flex-1"
                      onPress={() => setFeedbackType('feature')}
                    >
                      <Icon icon="lucide:lightbulb" className="mr-1" width={16} height={16} />
                      Javaslat
                    </Button>
                    <Button 
                      variant={feedbackType === 'general' ? 'solid' : 'flat'} 
                      color={feedbackType === 'general' ? 'secondary' : 'default'}
                      className="flex-1"
                      onPress={() => setFeedbackType('general')}
                    >
                      <Icon icon="lucide:message-circle" className="mr-1" width={16} height={16} />
                      Egyéb
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Visszajelzés szövege</label>
                  <Textarea
                    placeholder="Írd le részletesen a visszajelzésed..."
                    value={feedbackText}
                    onValueChange={setFeedbackText}
                    minRows={4}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">E-mail cím (opcionális)</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onValueChange={setEmail}
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Csak akkor adjuk meg, ha szeretnénk választ kapni a visszajelzésünkre.
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button 
                variant="flat" 
                color="default" 
                onPress={onClose}
              >
                Mégsem
              </Button>
              <Button 
                color="primary" 
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!feedbackText.trim()}
              >
                Küldés
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};