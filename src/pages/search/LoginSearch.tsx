import PageMeta from '../../components/common/PageMeta';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './style.css';
import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ProductHome from '../Forms/ProductHome';
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";

interface Product_Type {
    value: string | string[];
    label: string;
}

interface Product {
    id: number;
    product_name: string;
    user_used: string;
    product_id: string;
    price: number;
    product_num: string;
    product_type: string;
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
    product_number: string;
    department: string;
    product_type?: string;
    add_by_user?: string;
}

const LoginSearch = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;
    const [upd, setUpd] = useState<EditingProduct[]>([]);
    const [editingRowId, setEditingRowId] = useState<number | null>(null);
    const [productID, setProductID] = useState<string>('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [roleUser, setRoleUser] = useState<string>('');
    const [countProduct, setCountProduct] = useState<number>(0);

    // States for search dropdown
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoading1, setIsLoading1] = useState<boolean>(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const isManualSearch = useRef(false);

    dayjs.extend(utc);
    dayjs.extend(timezone);
    dayjs.locale('th');

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
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchRef]);

    useEffect(() => {
        console.log("Updated Products:", filteredProducts);
        const roleUser = sessionStorage.getItem("role") || "";
        setRoleUser(roleUser);
    }, [filteredProducts]);

    useEffect(() => {
        console.log("Updated upd array:", upd);
    }, [upd]);

    // Fetch suggestions as user types - now works with single character
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (isManualSearch.current) {
                isManualSearch.current = false; // reset
                return;
            }

            if (productID.length <= 0) {
                setSuggestions([]);
                setShowDropdown(false);
                return;
            }

            setIsLoading1(true);
            setIsLoading(true);

            try {
                const safeInput = productID.replace(/[^\w\s\-().]/gi, ''); // ตัดอักขระนอกเหนือจากที่อนุญาต

                const { data } = await axios.post('http://localhost:8000/api/product/getSuggestions', {
                    query: safeInput
                });
                console.log('Response from API:', data);

                if (data.status === 'success' && data.suggestions) {
                    setSuggestions(data.suggestions);
                    setShowDropdown(data.suggestions.length > 0);
                } else {
                    setSuggestions([]);
                    setShowDropdown(false);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
                setShowDropdown(false);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchSuggestions();
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [productID]);

    
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
                const response = await axios.delete(`http://localhost:8000/api/product/deleteProduct/${productId}`);

                if (response.data.status === 'success') {
                    Swal.fire('สำเร็จ', 'ทำการลบสินทรัพเสร็จสิ้น', 'success');
                    setEditingRowId(null);
                    setUpd([]);
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
            const response = await axios.post('http://localhost:8000/api/product/update-Product', { products: upd });

            if (response.data.status === 'success') {
                Swal.fire('สำเร็จ', 'อัพเดทข้อมูลเรียบร้อยแล้ว', 'success');
                setEditingRowId(null);
                setUpd([]);
                setFilteredProducts([])
                setIsLoading1(false)
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
                });
            } else {
                // Fallback if error is not an AxiosError
                Swal.fire({
                    title: "เกิดข้อผิดพลาด!",
                    text: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล",
                    icon: "error",
                    confirmButtonColor: "#d33",
                    confirmButtonText: "ตกลง",
                });
            }
        }
    };

    const handleSearchProductById = async (id: string = productID) => {
        try {
            isManualSearch.current = true; // <- ตั้งตรงนี้ก่อนยิง API
            const { data } = await axios.post('http://localhost:8000/api/product/getProduct_ByProductID', {
                product_id: id
            });

            if (data.status === 'success') {
                setFilteredProducts(data.product ? data.product : []);
                setCountProduct(data.product.length);
                setShowDropdown(false);
            } else {
                setFilteredProducts([]);
                setCountProduct(0);
            }
        } catch (error) {
            Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถค้นหาสินทรัพย์ได้', 'error');
            console.error(error);
        } finally {
            setIsLoading1(false);
            setShowDropdown(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearchProductById();
    };

    const handleSuggestionClick = (suggestion: string) => {
        console.log("clicked suggestion:", suggestion)
        setProductID(suggestion);
        setShowDropdown(false);
        handleSearchProductById(suggestion);
    };

    const escapeRegExp = (string: string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };


    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
    
        const safeQuery = escapeRegExp(query);
        const regex = new RegExp(`(${safeQuery})`, 'gi');
        const parts = text.split(regex);
    
        return (
            <>
                {parts.map((part, i) =>
                    regex.test(part) ?
                        <strong key={i} className="font-bold text-brand-600 dark:text-brand-400">{part}</strong> :
                        part
                )}
            </>
        );
    };

    return (
        <div>
            <PageMeta title="Sincere"
                description="This is Page for showing and add data for main page"
            />
            <div className="content p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full max-w-md ml-4 mb-5 sm:pt-4">
                        <Link
                            to="/signin"
                            className="inline-flex items-center text-sm p-3 rounded-full bg-[#009A3E] text-white transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ChevronLeftIcon className="size-5" />
                            ไปยังหน้าเข้าสู่ระบบ
                        </Link>
                    </div>
                    <div className="relative max-sm:hidden" ref={searchRef}>
                        <form onSubmit={handleSubmit}>
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
                                    id="product-id"
                                    name="product-id"
                                    value={productID}
                                    onChange={(e) => setProductID(e.target.value)}
                                    type="text"
                                    placeholder="ค้นหาสินทรัพย์..."
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                />
                                <button
                                    className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                                    type='submit'
                                >
                                    <span> ค้นหา </span>
                                </button>
                            </div>
                        </form>

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        กำลังค้นหา...
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Dropdown suggestions */}
                        {!isLoading && showDropdown && suggestions.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                                {Array.isArray(suggestions) && suggestions.length > 0 && (

                                <ul className="max-h-60 overflow-auto rounded-md py-1 text-base leading-6">
                                    {suggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onMouseDown={() => handleSuggestionClick(suggestion)}
                                        >
                                            <div className="flex items-center">
                                                <svg
                                                    className="mr-2 fill-gray-500 dark:fill-gray-400"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363Z" />
                                                </svg>
                                                <span className="text-sm text-gray-800 dark:text-white/90">
                                                    {highlightMatch(suggestion, productID)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                )}

                            </div>
                        )}

                        {/* No results message */}
                        {!isLoading && showDropdown && suggestions.length === 0 && productID.length > 0 && (
                            <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    ไม่พบข้อมูลสินทรัพย์ "{productID}"
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="relative sm:hidden" ref={searchRef}>
                    <form onSubmit={handleSubmit}>
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
                                id="product-id"
                                name="product-id"
                                value={productID}
                                onChange={(e) => setProductID(e.target.value)}
                                type="text"
                                placeholder="ค้นหาสินทรัพย์..."
                                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                            />
                            <button
                                className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
                                type='submit'
                            >
                                <span> ค้นหา </span>
                            </button>
                        </div>
                    </form>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    กำลังค้นหา...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dropdown suggestions */}
                    {!isLoading && showDropdown && suggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                            <ul className="max-h-60 overflow-auto rounded-md py-1 text-base leading-6">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                    >
                                        <div className="flex items-center">
                                            <svg
                                                className="mr-2 fill-gray-500 dark:fill-gray-400"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363Z" />
                                            </svg>
                                            <span className="text-sm text-gray-800 dark:text-white/90">
                                                {highlightMatch(suggestion, productID)}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* No results message */}
                    {!isLoading && showDropdown && suggestions.length === 0 && productID.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800 xl:w-[430px]">
                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                ไม่พบข้อมูลสินทรัพย์ "{productID}"
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <ProductHome
                    products={filteredProducts}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    roleUser={roleUser}
                    editingRowId={editingRowId}
                    setEditingRowId={setEditingRowId}
                    upd={upd}
                    setUpd={setUpd}
                    handleDelete={handleDelete}
                    handleSaveAllChanges={handleSaveAllChanges}
                    countProduct={countProduct}
                    isLoading={isLoading1}
                />
            </div>
        </div>
    );
};

export default LoginSearch;