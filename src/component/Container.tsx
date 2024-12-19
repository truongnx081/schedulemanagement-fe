import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
    return (
        <div className="w-full h-auto p-1">
            <div className="bg-white shadow-md rounded p-6">
                {children}
            </div>
        </div>
    );
}

export default Container;