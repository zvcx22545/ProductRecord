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
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../../components/ui/table';

import ReactPaginate from 'react-paginate';

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
  }

const Machineform = () => {
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
    const [currentPage, setCurrentPage] = useState(0);


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
                const coProduct = productType.find(item =>
                    (Array.isArray(item.value) ? item.value.includes('CO') : item.value === 'CO')
                )
                if (coProduct) {
                    const productTypeValue = 'CO'; // หรือจะใช้ coProduct.value ก็ได้ถ้าต้องการ
                    const { data } = await axios.get(`http://localhost:8000/api/product/getProducts/${productTypeValue}`);
                    console.log('check data', data.product)
                    setProducts(data.product)
                    
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        })();
    }, []);

    useEffect(() => {
        console.log("Updated Products:", Products)
    }, [Products]);
    

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
            console.log('check file ===>', file)
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

                console.log('check correctTypeLabel ===>', correctTypeLabel)

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

                const response = await axios.post('http://localhost:8000/api/product/createProduct', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.data.status === 'success') {
                    console.log('Product added successfully!');
                    closeModal();
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

    // pagination
    const handlePageClick = (event: { selected: number }) => {
        setCurrentPage(event.selected);
      };
    
      // Pagination Logic
      const productsPerPage = 6;
      const offset = currentPage * productsPerPage;
      const currentPageData = Products.slice(offset, offset + productsPerPage);
    

    return (
        <div>
            <PageMeta title="Computer Page"
                description="This is Page for showing and add data for machine"
            />
            <PageBreadcrumb pageTitle="อุปกรณ์คอมพิวเตอร์โน๊คบุ๊ค" />
            <div className="content">
                <div className="flex">
                    <button
                        onClick={openModal}
                        className="ml-auto bg-[#009A3E] px-2 py-3 rounded-lg text-white hover:bg-[#7FBA20]">
                        เพิ่มสินทรัพย์
                    </button>
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
                                    </TableRow>
                                </TableHeader>

                                {/* Table Body */}
                                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                    {currentPageData.map((product, index) => (
                                        
                                        <TableRow key={product.id}>

                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {product.product_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {product.product_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {product.user_used}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {product.department}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {product.price}
                                            </TableCell>

                                            <TableCell className="px-5 py-4 sm:px-6 text-start">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <img
                                                            src={`http://localhost:8000/${product.image}`}
                                                            alt="product-image"
                                                            className="object-cover w-full h-full"
                                                        />



                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            
      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          breakLabel="..."
          pageCount={Math.ceil(Products.length / productsPerPage)}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
        />
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

export default Machineform;