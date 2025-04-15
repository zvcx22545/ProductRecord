import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Edit, Save, Cancel, Delete } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import dayjs from 'dayjs';
import 'dayjs/locale/th';

interface Product {
    id: number;
    product_name: string;
    user_used: string;
    product_id: string;
    price: number;
    department: string;
    image: string;
    create_date: Date;
    update_date: Date;
}

interface EditingProduct {
    id: number;
    product_name: string;
    user_used: string;
    product_id: string;
    price: number;
    department: string;
    product_type?: string;
    add_by_user?: string;
}

interface ProductTableProps {
    products: Product[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    rowsPerPage: number;
    roleUser: string;
    editingRowId: number | null;
    setEditingRowId: (id: number | null) => void;
    upd: EditingProduct[];
    setUpd: (products: EditingProduct[]) => void;
    handleDelete: (id: number) => void;
    handleSaveAllChanges: () => void;
    countProduct: number;
}

const ProductTable: React.FC<ProductTableProps> = ({
    products,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    roleUser,
    editingRowId,
    setEditingRowId,
    upd,
    setUpd,
    handleDelete,
    handleSaveAllChanges,
    countProduct
}) => {
    // Calculate pagination values
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = products.slice(indexOfFirstRow, indexOfLastRow);
    const pageCount = Math.ceil(products.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    // Start editing a row
    const handleStartEdit = (product: Product) => {
        setEditingRowId(product.id);

        // Check if the product is already in the editing array
        const existingIndex = upd.findIndex(item => item.id === product.id);

        if (existingIndex === -1) {
            // If not in editing array, add initial data
            const user_id = sessionStorage.getItem('user_id') || '';
            const newEditItem: EditingProduct = {
                id: product.id,
                product_name: product.product_name,
                user_used: product.user_used,
                product_id: product.product_id,
                price: product.price,
                department: product.department,
                product_type: 'CO',
                add_by_user: user_id
            };
            setUpd([...upd, newEditItem]);
        }
    };

    // Cancel editing
    const handleCancelEdit = (product: Product) => {
        setEditingRowId(null);
        const existingIndex = upd.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            // Remove the product from editing array
            const updatedList = upd.filter(item => item.id !== product.id);
            setUpd(updatedList);
        }
    };

    // Update field value during editing
    const handleUpdateField = (id: number, field: string, value: string | number) => {
        const existingIndex = upd.findIndex(item => item.id === id);
        
        if (existingIndex !== -1) {
            // Update existing record
            const updatedList = [...upd];
            updatedList[existingIndex] = {
                ...updatedList[existingIndex],
                [field]: value
            };
            setUpd(updatedList);
        } else {
            // Product not found in editing array, should not happen normally
            console.error("Tried to update field for product not in edit mode");
        }
    };

    // Get current value for a field (either from edit array or original product)
    const getEditingValue = (id: number, field: keyof EditingProduct, defaultValue: any) => {
        const item = upd.find(item => item.id === id);
        return item ? item[field] : defaultValue;
    };

    return (
        <div className="overflow-hidden w-full rounded-xl border mt-5 border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1102px]">
                    <Table>
                        {/* Table Header */}
                        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                            <TableRow>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ลำดับ
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    เลขสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ชื่อสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    พนักงานที่ใช้งานสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    แผนกที่ใช้งานสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ราคาสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    รูปภาพสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    วันที่เพิ่มสินทรัพย์
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    วันที่แก้ไขสินทรัพย์
                                </TableCell>
                                {roleUser === 'admin' && (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        แก้ไข
                                    </TableCell>
                                )}
                                {roleUser === 'admin' && (
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                    >
                                        ลบ
                                    </TableCell>
                                )}
                            </TableRow>
                        </TableHeader>

                        {/* Table Body */}
                        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                            {currentRows.length > 0 ? (
                                currentRows.map((product, index) => {
                                    // Find updated product data
                                    const updatedProduct = upd.find(item => item.id === product.id);

                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {indexOfFirstRow + index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {editingRowId === product.id ? (
                                                    <input
                                                        type="text"
                                                        value={getEditingValue(product.id, 'product_id', product.product_id)}
                                                        onChange={(e) => handleUpdateField(product.id, 'product_id', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    updatedProduct ? updatedProduct.product_id : product.product_id
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {editingRowId === product.id ? (
                                                    <input
                                                        type="text"
                                                        value={getEditingValue(product.id, 'product_name', product.product_name)}
                                                        onChange={(e) => handleUpdateField(product.id, 'product_name', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    updatedProduct ? updatedProduct.product_name : product.product_name
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {editingRowId === product.id ? (
                                                    <input
                                                        type="text"
                                                        value={getEditingValue(product.id, 'user_used', product.user_used)}
                                                        onChange={(e) => handleUpdateField(product.id, 'user_used', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    updatedProduct ? updatedProduct.user_used : product.user_used
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {editingRowId === product.id ? (
                                                    <input
                                                        type="text"
                                                        value={getEditingValue(product.id, 'department', product.department)}
                                                        onChange={(e) => handleUpdateField(product.id, 'department', e.target.value)}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    updatedProduct ? updatedProduct.department : product.department
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {editingRowId === product.id ? (
                                                    <input
                                                        type="number"
                                                        value={getEditingValue(product.id, 'price', product.price)}
                                                        onChange={(e) => handleUpdateField(product.id, 'price', Number(e.target.value))}
                                                        className="w-full px-2 py-1 border rounded"
                                                    />
                                                ) : (
                                                    updatedProduct ? updatedProduct.price : product.price
                                                )}
                                            </TableCell>
                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                                        <img
                                                            src={product.image}
                                                            alt="product-image"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {dayjs(product.create_date).format('D MMMM YYYY HH:mm')}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {dayjs(product.update_date).format('D MMMM YYYY HH:mm')}
                                            </TableCell>
                                            {roleUser === 'admin' && (
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    {editingRowId === product.id ? (
                                                        <div className="flex gap-2">
                                                            <Save
                                                                onClick={() => setEditingRowId(null)}
                                                                className="cursor-pointer text-green-600"
                                                            />
                                                            <Cancel
                                                                onClick={() => handleCancelEdit(product)}
                                                                className="cursor-pointer text-red-600"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <Edit
                                                            onClick={() => handleStartEdit(product)}
                                                            className="cursor-pointer"
                                                        />
                                                    )}
                                                </TableCell>
                                            )}
                                            {roleUser === 'admin' && (
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Delete
                                                        className="cursor-pointer hover:text-red-600"
                                                        onClick={() => handleDelete(product.id)}
                                                    />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="px-4 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                                        ไม่พบข้อมูลที่ค้นหา
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="mt-6 mb-3 w-full gap-4 flex items-center justify-between">
                        <Pagination
                            className='w-1/2 ml-5'
                            count={pageCount}
                            page={currentPage}
                            onChange={handlePageChange}
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "#009A3E",
                                },
                                "& .Mui-selected": {
                                    backgroundColor: "#009A3E !important",
                                    color: "#fff",
                                },
                            }}
                        />
                        <div className="flex gap-5 w-full items-center justify-end">
                            {currentRows && currentRows.length > 0 && roleUser === 'admin' && (
                                <button
                                    type='submit'
                                    onClick={handleSaveAllChanges}
                                    disabled={upd.length === 0}
                                    className={`${upd.length === 0 
                                        ? 'cursor-not-allowed opacity-50 w-full h-12 text-center mr-4 max-sm:w-[10%] max-lg:w-[15%] min-lg:w-[15%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs'
                                        : 'cursor-pointer w-full h-12 text-center mr-4 max-sm:w-[10%] max-lg:w-[15%] min-lg:w-[15%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]'} `}
                                >บันทึก
                                </button>
                            )}
                            <div className="flex gap-3 mr-4">
                                <div className="font-semiblod text-gray-500 text-start text-theme-sm dark:text-gray-400">มีสินทรัพย์ทั้งหมด</div>
                                <div className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{countProduct}</div>
                                <div className="font-semiblod text-gray-500 text-start text-theme-sm dark:text-gray-400">รายการ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductTable;