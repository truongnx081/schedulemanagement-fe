import React, { useEffect, useState } from "react";
import TextField from "../component/TextField";

interface BoxItem {
    id: number; // hoặc string, tùy vào dữ liệu của bạn
    name: string;
    percentage: number;
    part: number;
}

interface CheckboxComponentProps {
    selectedItem: BoxItem[];
    setSelectedItem: (item: BoxItem[]) => void;
    isTextField?: boolean;
}

const BoxComponent: React.FC<CheckboxComponentProps> = ({ selectedItem, setSelectedItem, isTextField = false }) => {
    // const [items, setItems] = useState<BoxItem[]>([
    //     { id: 1, name: "Nhập môn lập trình" },
    //     { id: 2, name: "Java 1" },
    //     { id: 3, name: "Java 2" },
    //     { id: 4, name: "Java 3" },
    //     { id: 5, name: "Java 4" },
    //     { id: 6, name: "Java 5" },
    //     { id: 11, name: "Nhập môn lập trình" },
    //     { id: 21, name: "Java 1" },
    //     { id: 31, name: "Java 2" },
    //     { id: 41, name: "Java 3" },
    //     { id: 51, name: "Java 4" },
    //     { id: 61, name: "Java 5" },
    // ]);

    const [percentage, setPercentage] = useState({});
    const [part, setPart] = useState({});

    const handleRemove = (id: number) => {
        // Cập nhật items bằng cách lọc bỏ phần tử có id tương ứng
        const updatedItems = selectedItem.filter((item) => item.id !== id);
        setSelectedItem(updatedItems);
        // setSelected(updatedItems);
    };

    // Hàm xử lý khi % thay đổi giá trị
    const handlerPercentage = (id, newValue) => {
        let values: BoxItem[] = selectedItem.map((item) => {
            return item.id === id
                ? { ...item, percentage: newValue } // Trả về object mới nếu điều kiện đúng
                : item; // Giữ nguyên item nếu điều kiện không đúng
        });
        setSelectedItem(values)
    };

    // Hàm xử lý khi part thay đổi giá trị
    const handlerPart = (id, newValue) => {
        let values: BoxItem[] = selectedItem.map((item) => {
            return item.id === id
                ? { ...item, part: newValue } // Trả về object mới nếu điều kiện đúng
                : item; // Giữ nguyên item nếu điều kiện không đúng
        });
        setSelectedItem(values)
    };

    // useEffect(() => {
    //     if (selectedItem) {
    //         setPercentage(selectedItem)
    //         setPart(selectedItem)
    //     }
    // }, [selectedItem])

    return (
        <div className="grid grid-cols-1 gap-2 p-1">
            {selectedItem.map((item) => (
                <div
                    key={item.id}
                    className="flex justify-center items-center px-2 rounded-xl bg-blue-300 text-white"
                >
                    <span key={item.id} className="break-words w-full text-center" style={{ fontSize: "0.6rem" }}>{item.name}</span>
                    {isTextField &&
                        <>
                            <TextField
                                type="number"
                                onField={true}
                                placeholder="%"
                                className="p-0 text-red-500 w-2/6"
                                className2={'w-10'}
                                value={item.percentage || ''}
                                // className1={`w-2/6 `}
                                // disabled={areSelectBoxesDisabled}
                                onChange={(e) => handlerPercentage(item.id, e.target.value)}
                            />
                            <TextField
                                type="number"
                                onField={true}
                                placeholder="Đợt"
                                className="p-0 text-red-500 w-2/6"
                                className2={'w-10'}
                                value={item.part || ''}
                                // className1={`w-2/6 `}
                                // disabled={areSelectBoxesDisabled}
                                onChange={(e) => handlerPart(item.id, e.target.value)}
                            />
                        </>
                    }

                    <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-blue-300 text-white rounded text-xl"
                    >
                        &times;
                    </button>
                </div>
            ))}
        </div>
    );
};

export default BoxComponent;
