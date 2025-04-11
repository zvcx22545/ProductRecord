import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/ui/modal';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import './style.css'
import { Edit, Save, Cancel, Delete } from '@mui/icons-material'
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useNavigate } from 'react-router-dom'

// import Stack from '@mui/material/Stack';

interface Product_Type {
    value: string | string[],
    label: string,
}

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

const Electrical = () => {
    const { isOpen, openModal, closeModal } = useModal()
    const [calendar, setCalendar] = useState<Date | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [productTypeValue, setProductTypeValue] = useState<string | string[]>('');
    const [productName, setProductName] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [employeeID, setEmployeeID] = useState('');
    const [productId, setProductId] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDepartment, setProductDepartment] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [Products, setProducts] = useState<Product[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;
    const [upd, setUpd] = useState<EditingProduct[]>([]);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [roleUser, setRoleUser] = useState<string>('');

    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.locale('th') // ตั้ง locale เป็นไทย
    // ข้อมูลประเภทสินทรัพย์
    const productType: Product_Type[] = [
        {
            value: ['ZZ', 'SV'],
            label: 'โปรแกรม'
        },
        {
            label: 'สิ่งของตกแต่งสำนักงาน',
            value: 'FF'
        },
        {
            label: 'ส่วนปรับปรุงอาคาร',
            value: 'B'
        },
        {
            label: 'อุปกรณ์สำนักงาน',
            value: ['TO', 'MC', 'EQ']
        },
        {
            label: 'อุปกรณ์คอมพิวเตอร์โน๊คบุ๊ค',
            value: 'CO'
        },
        {
            label: 'ระบบไฟฟ้า',
            value: 'EL'
        },
        {
            label: 'ระบบน้ำ',
            value: 'WA'
        },
    ]

    // รีเซ็ตฟอร์มเมื่อ Modal ปิด
    useEffect(() => {
        if (isOpen === false) {
            resetForm();
        }
    }, [isOpen])

    useEffect(() => {
        (async () => {
            try {
                const targetProduct = productType.find(item =>
                    Array.isArray(item.value)
                        ? ['EL'].some(code => item.value.includes(code)) // ✅ ตรวจว่ามี 'ZZ' หรือ 'SV'
                        : ['EL'].includes(item.value) // ✅ ตรวจแบบ string เดี่ยว
                );

                if (targetProduct) {
                    const roleUser = sessionStorage.getItem("role") || "";
                    setRoleUser(roleUser)
                    const typeValues = Array.isArray(targetProduct.value)
                        ? targetProduct.value
                        : [targetProduct.value];

                    const { data } = await axios.get(`https://product-record-backend.vercel.app/api/product/getProducts`, {
                        params: { productType: typeValues.join(',') } // ส่งเป็น query string เช่น ZZ,SV
                    });

                    setProducts(data.product);
                    setFilteredProducts(data.product);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log("Updated Products:", Products)
    }, [Products]);

    useEffect(() => {
        console.log("Updated upd array:", upd)
    }, [upd]);

    const navigate = useNavigate()

    const handleDelete = async (productId: number) => {
        try {
            // Ask for confirmation before deleting
            const result = await Swal.fire({
                title: 'แจ้งเตือน',
                text: "ต้องการลบเลขสินทรัพย์หรือไม่",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก'
            });

            // If confirmed, proceed with the deletion
            if (result.isConfirmed) {
                const response = await axios.delete(`https://product-record-backend.vercel.app/api/product/deleteProduct/${productId}`);

                if (response.data.status === 'success') {
                    Swal.fire('สำเร็จ', 'ทำการลบสินทรัพเสร็จสิ้น', 'success');
                    setEditingRowId(null);
                    const targetProduct = productType.find(item =>
                        Array.isArray(item.value)
                            ? ['EL'].some(code => item.value.includes(code))
                            : ['EL'].includes(item.value)
                    );

                    if (targetProduct) {
                        const typeValues = Array.isArray(targetProduct.value)
                            ? targetProduct.value
                            : [targetProduct.value];

                        const { data } = await axios.get(`https://product-record-backend.vercel.app/api/product/getProducts`, {
                            params: { productType: typeValues.join(',') } // ส่งเป็น query string เช่น ZZ,SV
                        });
                        setProducts(data.product);
                        setUpd([]);
                    }
                } else {
                    Swal.fire('Error', response.data.message, 'error');
                }
            } else {
                Swal.fire('สำเร็จ', 'ยกเลิกการลบสินทรัพย์สำเร็จ)', 'success');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire('Error', 'There was an error deleting the product. Please try again.', 'error');
        }
    }
    // รีเซ็ตฟอร์ม
    const resetForm = () => {
        setPreviewImage(null);
        setProductName('');
        setEmployeeName('');
        setEmployeeID('');
        setProductId('');
        setProductPrice('');
        setProductDepartment('');
        setProductTypeValue('');
        setCalendar(null);
        setSelectedFile(null);
        setFormErrors({});
    }

    // จัดการเลือกไฟล์
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    // จัดการเลือกประเภทสินทรัพย์
    const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        // หาประเภทที่เลือกจากรายการ
        const selectedType = productType.find(type => {
            const typeValue = Array.isArray(type.value) ? type.value.join(',') : type.value;
            return typeValue === selectedValue;
        });

        if (selectedType) {
            setProductTypeValue(selectedType.value);
        }
    }

    // ตรวจสอบข้อมูลก่อน submit
    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!productName.trim()) errors.productName = "กรุณาระบุชื่อสินทรัพย์";
        if (!employeeName.trim()) errors.employeeName = "กรุณาระบุชื่อผู้ใช้สินทรัพย์";
        if (!productId.trim()) errors.productId = "กรุณาระบุเลขสินทรัพย์";
        if (!productPrice.trim()) errors.productPrice = "กรุณาระบุราคาสินทรัพย์";
        if (!productDepartment.trim()) errors.productDepartment = "กรุณาระบุแผนกที่ใช้งาน";
        if (!productTypeValue) errors.productType = "กรุณาเลือกประเภทสินทรัพย์";
        if (!calendar) errors.calendar = "กรุณาเลือกวันที่";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    // จัดการ submit ฟอร์ม

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (productId && productId.length >= 2) {

            const idPrefix = productId.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
            const currentProductType = Array.isArray(productTypeValue)
                ? productTypeValue[0]
                : productTypeValue;
            let correctTypeLabel = ''

            for (const type of productType) {
                if (Array.isArray(type.value)) {
                    // Check if prefix is in the array of values
                    if (type.value.includes(idPrefix)) {
                        correctTypeLabel = type.label;
                    }
                } else if (type.value === idPrefix) {
                    correctTypeLabel = type.label;
                }

            }

            // If product type doesn't match the ID prefix
            if (currentProductType !== idPrefix) {
                return Swal.fire('แจ้งเตือน', `กรุณาเลือกประเภท ( ${correctTypeLabel} )`, 'error');
            }
        }

        if (validateForm()) {
            try {
                const formData = new FormData();
                const user_id = sessionStorage.getItem('user_id') || '';

                formData.append('product_name', productName);
                formData.append('employee_name', employeeName);
                formData.append('employee_ID', employeeID);
                formData.append('product_id', productId);
                formData.append('product_price', productPrice);
                formData.append('product_department', productDepartment);
                formData.append('product_type', Array.isArray(productTypeValue) ? productTypeValue[0] : productTypeValue);
                formData.append('calendar', calendar?.toISOString() || '');
                formData.append('add_by_user', user_id);

                if (selectedFile) {
                    formData.append('image', selectedFile);
                    console.log('File:', selectedFile);
                } else {
                    console.log('No file selected.');
                }

                const response = await axios.post('https://product-record-backend.vercel.app/api/product/createProduct', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.status === 'success') {
                    closeModal();
                    navigate('/')
                    window.location.reload();
                } else {
                    console.error('Failed to add product:', response.data.message);
                    Swal.fire('Error', response.data.message, 'error');
                }

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error submitting form:', error);
                    Swal.fire('Error', error.response?.data?.message || 'Something went wrong', 'error');
                }
            }
        }
    };

    const handleStartEdit = (product: Product) => {
        setEditingRowId(product.id);

        // ตรวจสอบว่ามีข้อมูลใน upd หรือไม่
        const existingIndex = upd.findIndex(item => item.id === product.id);

        if (existingIndex === -1) {
            // ถ้ายังไม่มีข้อมูลในการแก้ไข ให้เพิ่มข้อมูลเริ่มต้น
            const user_id = sessionStorage.getItem('user_id') || '';
            const newEditItem: EditingProduct = {
                id: product.id,
                product_name: product.product_name,
                user_used: product.user_used,
                product_id: product.product_id,
                price: product.price,
                department: product.department,
                product_type: 'EL',
                add_by_user: user_id
            };
            setUpd([...upd, newEditItem]);
        }
    };

    // ยกเลิกการแก้ไข
    const handleCancelEdit = (product: Product) => {
        setEditingRowId(null);
        const existingIndex = upd.findIndex(item => item.id === product.id);
        if (existingIndex !== -1) {
            // ถ้ามีข้อมูลในการแก้ไข ให้ลบออก
            const updatedList = upd.filter(item => item.id !== product.id);
            setUpd(updatedList);
        }

    };

    // const handleSave = () => {
    //     if (editingRowId !== null) {
    //         const updatedProduct = upd.find(item => item.id === editingRowId);
    //         if (updatedProduct) {
    //             const newProducts = Products.map(product =>
    //                 product.id === editingRowId ? { ...product, ...updatedProduct } : product
    //             );
    //             setProducts(newProducts);
    //             setEditingRowId(null);
    //         }
    //     }
    // };


    // อัพเดทข้อมูลใน upd
    const handleUpdateField = (id: number, field: string, value: string | number) => {
        console.log('Updating field:', field, 'with value:', value); // Add this for debugging

        const updatedList = upd.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        });

        setUpd(updatedList);
    };

    // บันทึกการแก้ไขทั้งหมด
    const handleSaveAllChanges = async () => {
        try {
            if (upd.length > 0) {
                for (const items of upd) {
                    const ckUpdProductId = items.product_id.substring(0, 2).toUpperCase().replace(/[^A-Z]/g, '');
                    // ใช้ reduce เช็คว่า ckUpdProductId มีอยู่ใน productType หรือไม่
                    const isValidType = productType.reduce((found, type) => {
                        if (found) return true;
                        if (Array.isArray(type.value)) {
                            return type.value.includes(ckUpdProductId);
                        } else {
                            return type.value === ckUpdProductId;
                        }
                    }, false);

                    if (!isValidType) {
                        await Swal.fire({
                            title: 'แจ้งเตือน',
                            text: `ไม่พบรหัสสินทรัพย์ "${ckUpdProductId}" ในรายการประเภทที่กำหนด`,
                            icon: 'error',
                            confirmButtonText: 'ตกลง'
                        });
                        return;
                    }
                    if (items.product_type !== ckUpdProductId) {
                        items.product_type = ckUpdProductId;
                        const result = await Swal.fire({
                            title: 'รหัสสินทรัพย์มีการเปลี่ยนแปลง',
                            text: 'คุณต้องการบันทึกการเปลี่ยนแปลงหรือไม่?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'ตกลง',
                            cancelButtonText: 'ยกเลิก'
                        });

                        if (!result.isConfirmed) {
                            return; // ถ้ากด "ยกเลิก" ให้ออกจากฟังก์ชัน
                        }

                        break;
                    }
                }


            }
            // ส่งข้อมูลที่แก้ไขไปยัง API
            const response = await axios.post('https://product-record-backend.vercel.app/api/product/update-Product', { products: upd });

            if (response.data.status === 'success') {
                Swal.fire('สำเร็จ', 'อัพเดทข้อมูลเรียบร้อยแล้ว', 'success');
                setEditingRowId(null);
                const targetProduct = productType.find(item =>
                    Array.isArray(item.value)
                        ? ['EL'].some(code => item.value.includes(code)) // ✅ ตรวจว่ามี 'CO' หรือ 'SV'
                        : ['EL'].includes(item.value) // ✅ ตรวจแบบ string เดี่ยว
                );

                if (targetProduct) {
                    const typeValues = Array.isArray(targetProduct.value)
                        ? targetProduct.value
                        : [targetProduct.value];

                    const { data } = await axios.get(`https://product-record-backend.vercel.app/api/product/getProducts`, {
                        params: { productType: typeValues.join(',') } // ส่งเป็น query string เช่น ZZ,SV
                    });
                    setProducts(data.product);
                    setUpd([]);
                }
            } else {
                Swal.fire('Error', response.data.message, 'error');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                // Now you can safely access response and message
                const errorMessage = error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง"
                Swal.fire({
                  title: "เกิดข้อผิดพลาด!",
                  text: errorMessage,
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "ตกลง",
                })
              } else {
                // Fallback if error is not an AxiosError
                Swal.fire({
                  title: "เกิดข้อผิดพลาด!",
                  text: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "ตกลง",
                })
              }
        }
    };

    // หาข้อมูลที่กำลังแก้ไข
    const getEditingValue = (id: number, field: string, defaultValue: any) => {
        const editingItem = upd.find(item => item.id === id);
        if (editingItem && editingItem[field as keyof EditingProduct] !== undefined) {
            return editingItem[field as keyof EditingProduct];
        }
        return defaultValue;
    };

    // pagination
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    }

    useEffect(() => {
        if (!searchTerm.trim()) {
            // If search term is empty, show all products
            setFilteredProducts(Products);
        } else {
            // Convert search term to lowercase for case-insensitive comparison
            const lowercasedSearch = searchTerm.toLowerCase();

            // Filter products based on search term
            const filtered = Products.filter(product =>
                (product.product_id && product.product_id.toLowerCase().includes(lowercasedSearch)) ||
                (product.product_name && product.product_name.toLowerCase().includes(lowercasedSearch)) ||
                (product.user_used && product.user_used.toLowerCase().includes(lowercasedSearch)) ||
                (product.department && product.department.toLowerCase().includes(lowercasedSearch)) ||
                // For dates, format them for searching
                (product.create_date && dayjs(product.create_date).tz('Asia/Bangkok').format('D MMMM YYYY HH:mm').toLowerCase().includes(lowercasedSearch)) ||
                (product.update_date && dayjs(product.update_date).tz('Asia/Bangkok').format('D MMMM YYYY HH:mm').toLowerCase().includes(lowercasedSearch))
            );

            setFilteredProducts(filtered);
        }
    }, [searchTerm, Products]);

    // Update your handleSearch function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    // คำนวณ index
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    // const currentRows = Products.slice(indexOfFirstRow, indexOfLastRow);
    const currentRows = filteredProducts.slice(indexOfFirstRow, indexOfLastRow);


    // จำนวนหน้าทั้งหมด
    const pageCount = Math.ceil(Products.length / rowsPerPage);


    return (
        <div>
            <PageMeta title="Computer Page"
                description="This is Page for showing and add data for machine"
            />
            <PageBreadcrumb pageTitle="อุปกรณ์คอมพิวเตอร์โน๊คบุ๊ค" />
            <div className="content">
                <div className="flex items-center justify-between">
                    <div className="hidden lg:block">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative">
                                <button className="absolute -translate-y-1/2 left-4 top-1/2">
                                    <svg
                                        className="fill-gray-500 dark:fill-gray-400"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                                            fill=""
                                        />
                                    </svg>
                                </button>
                                <input
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    type="text"
                                    placeholder="ค้นหาสินทรัพย์..."
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                />

                                {/* <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button> */}
                            </div>
                        </form>
                    </div>
                    {roleUser === 'admin' && (
                        <button
                            onClick={openModal}
                            className="ml-auto bg-[#009A3E] px-2 py-3 rounded-lg text-white hover:bg-[#7FBA20]">
                            เพิ่มสินทรัพย์
                        </button>
                    )}

                </div>
                {/* Table */}
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
                                            // หาค่าจาก upd ที่ตรงกับ product.id
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
                                                        {dayjs(product.create_date).tz('Asia/Bangkok').format('D MMMM YYYY HH:mm')}
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                        {dayjs(product.update_date).tz('Asia/Bangkok').format('D MMMM YYYY HH:mm')}
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
                                {currentRows && currentRows.length > 0 && roleUser === 'admin' && (
                                    <button
                                        type='submit'
                                        onClick={handleSaveAllChanges}
                                        disabled={upd.length === 0}
                                        className={`${upd.length === 0 ? 'cursor-not-allowed opacity-50 w-full h-12 text-center mr-4 max-sm:w-[10%] max-lg:w-[15%] min-lg:w-[15%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs'
                                            : 'cursor-pointer w-full h-12 text-center mr-4 max-sm:w-[10%] max-lg:w-[15%] min-lg:w-[15%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]'} `}

                                    >บันทึก
                                    </button>
                                )
                                }

                            </div>

                        </div>
                    </div>
                </div>
                {/* Modal Form */}
                <Modal isOpen={isOpen} onClose={closeModal} className={`lg:min-w-[720px] m-4 max-h-[640px] overflow-y-auto`}>
                    <div className="content mt-3">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <Label>
                                    ชื่อสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_name'
                                    name='product_name'
                                    placeholder='กรุณาใส่ชื่อสินทรัพย์'
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                                {formErrors.productName && <p className="text-error-500 text-sm mt-1">{formErrors.productName}</p>}
                            </div>
                            <div className='mt-2'>
                                <Label>
                                    ชื่อผู้ใช้สินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='employee_name'
                                    name='employee_name'
                                    placeholder='กรุณาใส่ชื่อผู้ใช้สินทรัพย์'
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                />
                                {formErrors.employeeName && <p className="text-error-500 text-sm mt-1">{formErrors.employeeName}</p>}
                            </div>
                            <div className='mt-2'>
                                <Label>
                                    รหัสพนักงานผู้ใช้สินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='employee_id'
                                    name='employee_id'
                                    placeholder='กรุณาใส่รหัสพนักงานผู้ใช้สินทรัพย์'
                                    value={employeeID}
                                    onChange={(e) => setEmployeeID(e.target.value)}
                                />
                                {formErrors.employeeName && <p className="text-error-500 text-sm mt-1">{formErrors.employeeName}</p>}
                            </div>
                            <div className="mt-2">
                                <Label>
                                    เลขสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_id'
                                    name='product_id'
                                    placeholder='กรุณาใส่เลขสินทรัพย์'
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                />
                                {formErrors.productId && <p className="text-error-500 text-sm mt-1">{formErrors.productId}</p>}
                            </div>
                            <div className="mt-2">
                                <Label>
                                    ราคาสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_price'
                                    name='product_price'
                                    placeholder='กรุณาใส่ราคาสินทรัพย์'
                                    value={productPrice}
                                    onChange={(e) => setProductPrice(e.target.value)}
                                />
                                {formErrors.productPrice && <p className="text-error-500 text-sm mt-1">{formErrors.productPrice}</p>}
                            </div>
                            <div className="mt-2">
                                <Label>
                                    แผนกที่ใช้งานสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_department'
                                    name='product_department'
                                    placeholder='กรุณาใส่แผนกที่ใช้งานสินทรัพย์'
                                    value={productDepartment}
                                    onChange={(e) => setProductDepartment(e.target.value)}
                                />
                                {formErrors.productDepartment && <p className="text-error-500 text-sm mt-1">{formErrors.productDepartment}</p>}
                            </div>
                            <div className="flex w-full mt-2 items-center">
                                <fieldset className="w-full">
                                    <Label>
                                        ประเภทสินทรัพย์ <span className='text-error-500'>*</span>
                                    </Label>
                                    <select
                                        name="product_type"
                                        id="product_type"
                                        className="select"
                                        value={Array.isArray(productTypeValue) ? productTypeValue.join(',') : productTypeValue}
                                        onChange={handleProductTypeChange}
                                    >
                                        <option value="">กรุณาเลือกประเภทสินทรัพย์</option>
                                        {productType.map((product) => (
                                            <option
                                                key={Array.isArray(product.value) ? product.value.join(',') : product.value}
                                                value={Array.isArray(product.value) ? product.value.join(',') : product.value}
                                            >
                                                {product.label}
                                            </option>
                                        ))}
                                    </select>
                                    {formErrors.productType && <p className="text-error-500 text-sm mt-1">{formErrors.productType}</p>}
                                </fieldset>
                                <div className="card flex flex-wrap gap-3 p-fluid w-full">
                                    <div className="flex-auto">
                                        <Label>
                                            กรุณาเลือกวันที่ <span className='text-error-500'>*</span>
                                        </Label>
                                        <Calendar
                                            className='w-full shadow-lg rounded-lg'
                                            id="buttondisplay"
                                            name="calendar"
                                            value={calendar}
                                            onChange={(e) => setCalendar(e.target.value as Date | null)}
                                            showIcon
                                        />
                                        {formErrors.calendar && <p className="text-error-500 text-sm mt-1">{formErrors.calendar}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Preview Image */}
                            <div className="flex justify-center mt-4 shadow-lg rounded-lg max-w-[500px] max-h-[500px] mx-auto">
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className="min-lg:max-w-[500px] min-lg:max-h-[500px] object-cover rounded-lg shadow-lg" />
                                )}
                            </div>

                            {/* File upload */}
                            <Label className="flex items-center cursor-pointer justify-center gap-2 mt-8 max-sm:w-[90%] max-lg:w-[50%] min-lg:w-[40%] mx-auto px-3 py-2 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]">
                                <div className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                                    <svg
                                        className="fill-current cursor-pointer"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 29 28"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                    <div className="min-lg:text-lg">Upload file</div>
                                </div>
                            </Label>

                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    type='submit'
                                    className="text-center mb-4 max-sm:w-[90%] max-lg:w-[50%] min-lg:w-[30%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]"
                                >
                                    บันทึก
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-center mb-4 max-sm:w-[90%] max-lg:w-[50%] min-lg:w-[30%] px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-red-700 shadow-theme-xs hover:bg-red-500"
                                >
                                    ยกเลิก
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Electrical;