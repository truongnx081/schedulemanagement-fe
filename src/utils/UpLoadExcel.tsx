import React, { toast } from 'react-toastify';
import { exportToExcel } from '../utils/ExcelExport.tsx'
import Button2 from '../component/Button2.tsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from 'react'
import { faFile, faFileExport } from '@fortawesome/free-solid-svg-icons';
import * as xlsx from 'xlsx';
import { useSelector } from 'react-redux';

const UploadExcelModal = ({
    onClose,
    dataExport,
    dataTemplate,
    exportFileName,
    exportFileNamePattern,
    sheetName,
    importExcelAPI,
    isReLoadTable,
    setIsReLoadTable,
}) => {

    // export excel activity
    const handleExportActivitiesToExcel = () => {
        try {
            exportToExcel({
                data: dataExport,
                fileName: exportFileName,
                sheetName: sheetName
            })

        } catch (error) {
            toast.error("Đã có lỗi xảy ra vui lòng thử lại!")
        }
    };

    const handleExportTemplateExcelClick = () => {
        try {
            exportToExcel({
                data: dataTemplate,
                fileName: exportFileNamePattern,
                sheetName: sheetName
            })

        } catch (error) {
            toast.error("Đã có lỗi xảy ra vui lòng thử lại!")
        }

    };

    const [file, setFile] = useState<File>();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        toast.info("Đã thêm file " + e.target.files[0].name + ". Bấm nhập Excel để tiến hành import")
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.warning("Vui lòng chọn file excel cần import")
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await importExcelAPI(formData);
            if (response) {
                if (response.statusCode !== 200)
                    toast.error(response.message)
                if (response.statusCode === 200) {
                    toast.success("Import excel thành công")
                    setIsReLoadTable(!isReLoadTable);
                }
            }
        } catch (error) {
            console.log("Error uploading file:", error);
            toast.error(error.data.message)
        }
        onClose();
    };

    return (
        <div className="container mx-auto mt-4 space-y-4">
            <div className=" mb-3">
                <form onSubmit={handleSubmit} onDrop={handleDrop} onDragOver={handleDragOver} className="mb-4  flex flex-col items-center justify-center w-full mb-3 ">
                    <label htmlFor="dropzone-file" className="mb-3 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click</span> hoặc kéo thả</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.xlsx, .xls </p>
                            {file && <p className="mt-2 text-md text-gray-900 dark:text-gray-400">Tệp đã chọn: {file.name}</p>}
                        </div>
                        <input onChange={handleFileChange} id="dropzone-file" type="file" accept=".xlsx, .xls" className="hidden" />
                    </label>
                    <Button2 className="flex w-full items-center px-4 py-2 border rounded-lg text-gray-800 bg-gray-100 hover:bg-gray-200"
                        variant="none"
                        type="submit">
                        <FontAwesomeIcon icon={faFile} className="mr-2 text-gray-600" />
                        <span className="mr-2 text-gray-600">Nhập Excel</span>
                    </Button2>
                </form>
            </div>

            <div className="flex flex-row space-x-4">
                <Button2 className="w-full flex items-center px-4 py-2 border rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200" variant="none" onClick={handleExportActivitiesToExcel}>
                    <FontAwesomeIcon icon={faFileExport} className="mr-2 text-gray-600" />
                    <span className="text-gray-800">Xuất file excel</span>
                </Button2>

                <Button2 className=" w-full  flex items-center px-4 py-2 border rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200" variant="none" onClick={handleExportTemplateExcelClick}>
                    <FontAwesomeIcon icon={faFileExport} className="mr-2 text-gray-600" />
                    <span className="text-gray-800">Xuất file mẫu cho import</span>
                </Button2>
            </div>
        </div>
    );
};

export default UploadExcelModal;