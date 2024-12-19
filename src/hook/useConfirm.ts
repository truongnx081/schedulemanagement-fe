import { useState } from 'react';
// cách dùng 
// const { isConfirmOpen, openConfirm, closeConfirm, confirmAction } = useConfirm();
// <ModalConfirm> 
// const action = async () => {
// // các action sẽ được thục hiện khi xác nhận yes
// }
// openConfirm(action);


interface UseConfirmReturn {
  isConfirmOpen: boolean;
  openConfirm: (action: () => void, question: string) => void;
  closeConfirm: () => void;
  confirmAction: () => void;
  confirmQuestion:string;
}

const useConfirm = (): UseConfirmReturn => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [confirmQuestion, setConfirmQuestion] = useState<string>('');

  const openConfirm = (action: () => void, question: string) => {
    setPendingAction(() => action);
    setConfirmQuestion(question);
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
    setPendingAction(null);
    setConfirmQuestion('');
  };

  const confirmAction = () => {
    if (pendingAction) {
      pendingAction();
      closeConfirm();
    }
  };

  return {
    isConfirmOpen,
    openConfirm,
    closeConfirm,
    confirmAction,
    confirmQuestion
  };
};

export default useConfirm;

