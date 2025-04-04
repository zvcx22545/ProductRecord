import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/ui/modal';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import fileImage from '../../icons/file.svg'
import dayjs from 'dayjs'
import './style.css'
import 'dayjs/locale/th'
interface Product_Type {
    value: string | string[],
    label: string,
}

const Machineform = () => {
    const { isOpen, openModal, closeModal } = useModal()
    console.log("Modal state in Machineform:", isOpen);
    const [calendar, setCalendar] = useState<Date | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [productTypeValue, setProductTypeValue] = useState<string | string[]>('');
    const [productName, setProductName] = useState('');


    useEffect(() => {
        let result: string[];

        if (isOpen === false) {
            setPreviewImage('')
        }
        console.log('check value', productTypeValue)
        if (typeof productTypeValue === 'string') {
            result = productTypeValue.split(',').map((x) => x.trim()); // ใช้ split เมื่อเป็น string
        } else {
            result = productTypeValue.map((x) => x.trim()); // ถ้าเป็น array ของ string ก็ใช้ map
        }

        console.log(result);
    }, [isOpen, productTypeValue])



    const productType: Product_Type[] = [
        {
            value: 'ZZ',
            label: 'เฟอร์นิเจอร์'
        },
        {
            label: 'อุปกรณ์สำนักงาน',
            value: ['TO', 'MC', 'EQ']
        }
    ]

    useEffect(() => {
        let matchedType: string[] = [];
        if (productName.length >= 2) {
            const prefix = productName.substring(0, 2).toUpperCase();
            // ตรวจสอบว่า prefix ตรงกับประเภทไหน
            const matched = productType.find((type) => {
                if (Array.isArray(type.value)) {
                    console.log("prefix", prefix)
                    console.log("type.value", prefix)
                   for(const row of type.value){
                        if (row === prefix) {
                            console.log('row ==', row)
                            return row
                        }
                   }
                }
            });

            if (matched) {
                console.log('check matched', matched)
                matchedType = Array.isArray(matched.value) ? matched.value : [matched.value];
                setProductTypeValue(matchedType);
            } else {
                setProductTypeValue('');
            }
        } else {
            setProductTypeValue('');
        }
        console.log('check value type',productTypeValue);
    }, [productName]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;

        // ตรวจสอบว่าเลือก "อุปกรณ์สำนักงาน" แล้วจะต้องเป็น array
        if (selectedValue === 'TO' || selectedValue === 'MC' || selectedValue === 'EQ') {
            setProductTypeValue(['TO', 'MC', 'EQ']);
        } else {
            setProductTypeValue(selectedValue);  // ถ้าเลือกประเภทอื่นๆ ก็ส่งค่าธรรมดา
        }
    }

    return (
        <div>
            <PageMeta title="Machine Page"
                description="This is Page for showing and add data for machine"
            />
            <PageBreadcrumb pageTitle="Machine Form" />
            <div className="content">
                <div className="flex">
                    <button
                        onClick={() => {
                            openModal();
                        }}

                        className="ml-auto bg-[#009A3E] px-2 py-3 rounded-lg text-white">เพิ่มสินทรัพย์</button>
                </div>
                <Modal isOpen={isOpen} onClose={closeModal} className={`min-w-[720px] m-4 max-h-[640px] overflow-y-auto`}>
                    <div className="content mt-3">
                        <form action="">
                            <div>
                                {/* ชื่อสินค้า */}
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
                            </div>
                            <div className='mt-2'>
                                {/* ชื่อผู้ใช้สินค้า */}
                                <Label>
                                    ชื่อผู้ใช้สินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='employee_name'
                                    name='employee_name'
                                    placeholder='กรุณาใส่ชื่อผู้ใช้สินทรัพย์'
                                />
                            </div>
                            <div className="mt-2">
                                {/* เลขสินทรัพย์ */}
                                <Label>
                                    เลขสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_id'
                                    name='product_id'
                                    placeholder='กรุณาใส่เลขสินทรัพย์'
                                />
                            </div>
                            <div className="mt-2">
                                {/* ราคาสินทรัพย์ */}
                                <Label>
                                    ราคาสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_price'
                                    name='product_price'
                                    placeholder='กรุณาใส่ราคาสินทรัพย์'
                                />
                            </div>
                            <div className="mt-2">
                                {/* แผนกที่ใช้งาน */}
                                <Label>
                                    แผนกที่ใช้งานสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                                <Input
                                    type='text'
                                    id='product_department'
                                    name='product_department'
                                    placeholder='กรุณาใส่แผนกที่ใช้งานสินทรัพย์'
                                />
                            </div>
                            <div className="flex w-full mt-2 items-center">
                                <fieldset className="w-full">
                                    {/* แผนกที่ใช้งาน */}
                                    <Label>
                                        ประเภทสินทรัพย์ <span className='text-error-500'>*</span>
                                    </Label>
                                    <select name="product_type" id="product_type" className='select' onChange={handleProductTypeChange}>
                                        {
                                            productType.map((product => (
                                                <option key={product.value} value={product.value}>{product.label}</option>
                                            )))
                                        }

                                    </select>
                                </fieldset>
                                <div className="card flex flex-wrap gap-3 p-fluid w-full">
                                    <div className="flex-auto">
                                        <Label>
                                            กรุณาเลือกวันที่ <span className='text-error-500'>*</span>
                                        </Label>
                                        <Calendar className='w-full shadow-lg rounded-lg' id="buttondisplay" value={calendar} onChange={(e) => setCalendar(e.target.value as Date | null)} showIcon />
                                    </div>
                                </div>

                            </div>
                            {/* File preview annd upload */}
                            <div className="relative w-full flex flex-col items-center cursor-pointer mt-8">

                                <Label>
                                    {!previewImage && (<img src={fileImage} alt="Upload" className="w-10 h-10 opacity-50 cursor-pointer" />)}
                                    {/* Preview Image */}
                                    {previewImage && (
                                        <img src={previewImage} alt="Preview" className="max-w-[500px] max-h-[500px] object-cover rounded-lg shadow-lg" />
                                    )}
                                    {/* <span className="text-gray-600">คลิกเพื่ออัปโหลดไฟล์</span> */}
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </Label>

                            </div>


                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Machineform;
