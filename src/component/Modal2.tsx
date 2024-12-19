import React from 'react';

interface ModalProps {
    id: string;
    title?: string;
    iconPopup?: React.ReactNode;
    content: React.ReactNode;
    positionButton?: 'center' | 'end';
    buttonConfirm?: React.ReactElement | undefined;
    buttonCancel?: React.ReactElement;
    isOpen?: boolean;
    onClose?: () => void;
    width?: string;
    type?: 'message';
}
const Modal2: React.FC<ModalProps> = ({
    id,
    title,
    iconPopup,
    content,
    positionButton = 'end',
    buttonConfirm,
    buttonCancel,
    isOpen = false,
    onClose,
    width = "max-w-2xl",
    type
}) => {
    if (!isOpen) return null;
    const buttonPositionClass = positionButton === 'center' ? 'justify-center' : 'justify-end';
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
            <div className={`bg-white rounded-lg shadow-lg p-2 relative z-50 w-10/12 ${width} d:h-auto ${isOpen ? 'animate-slide-up' : 'animate-slide-down'}`} id={id}>
                <div className="flex justify-center rounded-t ">
                    {!iconPopup ? <h3 className="p-2 text-xl font-semibold text-gray-900 mb-3">
                        {title}
                    </h3> : ""}
                    <button onClick={onClose} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center ">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
                {iconPopup ? <div className="flex flex-col items-center text-center ">
                    <div className="md:p-1 ">
                        {iconPopup}
                    </div>
                    <h3 className="text-xl p-2 font-semibold text-gray-900
              ">
                        {title}
                    </h3>
                </div>
                    : ""}
                {/* modal body */}
                {type === 'message' ?
                    <div className="px-2 space-y-6">
                        {content}
                    </div> : <>{content}</>}
                {/* modal footer */}
                <div className={`flex ${buttonPositionClass} mb-6 me-6 space-x-2 rounded-b `}>
                    {buttonCancel}
                    {buttonConfirm}
                </div>


            </div>
        </div>
    );
};

export default Modal2;