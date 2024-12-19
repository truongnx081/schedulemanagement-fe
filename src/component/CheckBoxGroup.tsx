import React, { useEffect, useState } from "react";

interface CheckboxItem {
    id: string;
    label: string;
}

// interface SelectedItem {
//     id: string;
//     percentage: number;
//     part: number;
// }

interface CheckboxComponentProps {
    items: CheckboxItem[];
    onSubmit: (selectedItems: { id: string; name: string }[]) => void;
    selected: Set<string>;
    setSelected: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const CheckboxGroup: React.FC<CheckboxComponentProps> = ({ items, onSubmit, selected,
    setSelected }) => {
    // const [selected, setSelected] = useState<Set<string>>(new Set());

    const handleCheckboxChange = (id: string) => {
        setSelected((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(id)) {
                newSelected.delete(id); // Bỏ chọn nếu đã chọn
            } else {
                newSelected.add(id); // Chọn mới
            }
            return newSelected;
        });
    };

    const handleSubmit = () => {
        // Tạo mảng chứa { id, name }
        const selectedItems = items
            .filter((item) => selected.has(item.id))
            .map((item) => ({ id: item.id, name: item.label }));
        onSubmit(selectedItems); // Gọi hàm onSubmit với mảng
    };

    const handleCancel = () => {
        setSelected(new Set()); // Xóa toàn bộ checkbox đã chọn
    };

    return (
        <div className="flex flex-col items-end">
            {/* Danh sách checkbox */}
            <div className="grid grid-cols-4 gap-4 p-4 h-80 overflow-auto border border-gray-300 rounded w-full">
                {items.map((item) => (
                    <label
                        key={item.id}
                        className={`flex items-center space-x-2 p-2 border rounded cursor-pointer transition ${selected.has(item.id)
                            ? "border-blue-500 bg-blue-100 shadow-md"
                            : "border-gray-300 bg-white"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={selected.has(item.id)}
                            onChange={() => handleCheckboxChange(item.id)}
                            className="cursor-pointer"
                            hidden={true}
                        />
                        <span>{item.label}</span>
                    </label>
                ))}
            </div>

            {/* Nút HỦY và OK */}
            <div className="flex space-x-2 mt-4">
                <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    HỦY
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default CheckboxGroup;
