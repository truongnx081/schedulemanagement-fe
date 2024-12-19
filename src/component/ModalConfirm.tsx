import React from 'react';
import Modal2 from './Modal2.tsx';
import Button2 from "./Button2.tsx"

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  question: string;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  isOpen,
  onClose,
  onConfirm,
  question
}) => {
  return (
    <Modal2
      id="confirm-modal"
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận"
      content={<p className='text-center pt-3 text-xl'>{question}</p>}
      positionButton='center'
      buttonConfirm={
        <Button2 onClick={onConfirm} variant="btn-primary">
          Xác nhận
        </Button2>
      }
      buttonCancel={
        <Button2 onClick={onClose} variant="btn-secondary">
          Hủy
        </Button2>
      }
    />
  );
};

export default ModalConfirm;
