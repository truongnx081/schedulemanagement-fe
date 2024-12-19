import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type?: 'button' | 'submit' | 'reset';
    variant: string,
    onClick?: (React.MouseEventHandler<HTMLButtonElement>);
    size?: string;
    className?: string;
    icon?: React.ReactNode;
    hiddenParent?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
    ref?: React.RefObject<HTMLButtonElement>;
    disabled?: boolean;
}

const Button2: React.FC<ButtonProps> = ({
    children, ...props
}) => {
    const variantClass = props.variant === 'btn-primary' ? 'bg-blue-500 hover:bg-blue-700' :
        props.variant === 'btn-secondary' ? 'bg-gray-400 hover:bg-gray-500' :
            props.variant === 'btn-danger' ? 'bg-red-500 hover:bg-red-700' :
                props.variant === 'btn-none' ? 'bg-none' : props.variant;
    return (
        <button
            disabled={props.disabled}
            data-modal-hide={props.hiddenParent}
            type={`${props.type ? props.type : "button"}`}
            className={`hover:opacity-75 ${props.variant = variantClass} 
      ${props.size ? props.size : "text-xs py-1.5 px-4   sm:py-2 sm:px-4 sm:text-xs     md:py-2 md:px-6 md:text-base    lg:py-2 lg:px-8"} 
      text-white text-nowrap  relative inline-flex items-center justify-center text-center no-underline  align-middle ${props.disabled ? 'cursor-not-allowed bg-gray-400' : 'cursor-pointer'} select-none rounded-md  ${props.className}`}
            onClick={props.onClick}
            onMouseLeave={props.onMouseLeave}
            onMouseEnter={props.onMouseEnter}
        >
            <div className="flex justify-center space-x-2 items-center">
                {props.icon && <span>{props.icon}</span>}
                <span>{children}</span>
            </div>
        </button>
    )
};

export default Button2;
