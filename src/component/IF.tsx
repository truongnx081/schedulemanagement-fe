import React from 'react';

// Định nghĩa props cho component IF
interface IFProps {
    condition: boolean;
    children: React.ReactNode;
}

// Component IF
const IF: React.FC<IFProps> = ({ condition, children }) => {
    return <>{condition ? children : null}</>;
};

export default IF;
