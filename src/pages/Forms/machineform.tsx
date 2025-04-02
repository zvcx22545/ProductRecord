import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useModal } from '../../hooks/useModal';
import { Modal } from '../../components/ui/modal';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import Select from '../../components/form/Select';
interface Product_Type {
    value: string,
    label: string,
}

const Machineform = () => {
    const { isOpen, openModal, closeModal } = useModal()
    console.log("Modal state in Machineform:", isOpen);

    const productType: Product_Type[] = [
        {
            value: 'ZZ',
            label: 'เฟอร์นิเจอร์'
        },
        {
            value: 'TO',
            label: 'เครื่องมือ'
        },
        {
            value: 'MC',
            label: 'เครื่องจักร'
        },
    ]
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
                            console.log("Button clicked"); // Debugging
                            openModal();
                        }}

                        className="ml-auto bg-[#009A3E] px-2 py-3 rounded-lg text-white">เพิ่มสินทรัพย์</button>
                </div>
                <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1024px] m-4">
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
                            <fieldset className="mt-2">
                                {/* แผนกที่ใช้งาน */}
                                <Label>
                                    ประเภทสินทรัพย์ <span className='text-error-500'>*</span>
                                </Label>
                               <select name="product_type" id="product_type" className='select'>
                                {
                                    productType.map((product => (
                                        <option key={product.value} value={product.value}>{product.label}</option>
                                    )))
                                }
                               </select>
                            </fieldset>
                            
                        </form>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Machineform;
