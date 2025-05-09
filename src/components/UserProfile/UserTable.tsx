import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from '../../components/ui/table';
import { Delete } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
// import dayjs from 'dayjs';
import 'dayjs/locale/th';
// import { useModal } from '../../hooks/useModal';
// import { Modal } from '../../components/ui/modal';

interface User {
    id: number,
    user_id: string
    first_name: string
    last_name: string
    position: string
    role: string
    department: string
    password: string
    profile_image: string
}
interface UserTableProps {
    users: User[];
    currentPage: number;
    setCurrentPage: (page: number) => void;
    rowsPerPage: number;
    roleUser: string;
    handleDelete: (id: number, user_id: string) => void;
    countUser: number;
    searchTerm: string;
    isLoading: boolean;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    roleUser,
    handleDelete,
    countUser,
    searchTerm,
    isLoading,
}) => {
    // Calculate pagination values
    // const [zoomImage, setZoomImage] = useState<string | null>(null);
    // const { isOpen, closeModal } = useModal()
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = users.slice(indexOfFirstRow, indexOfLastRow);
    const pageCount = Math.ceil(users.length / rowsPerPage);

    // Handle page change
    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
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
                                    รหัสพนักงาน
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ขื่อ-นามสกุล
                                </TableCell>

                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ตำแหน่ง
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    แผนก
                                </TableCell>
                                <TableCell
                                    isHeader
                                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                                >
                                    ระดับการใช้งาน
                                </TableCell>
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
                            {isLoading ? (
                                // แสดง Rainbow Loading Animation เมื่อกำลังโหลดข้อมูล
                                <TableRow>
                                    <TableCell colSpan={12} className="px-4 py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex space-x-2">
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-red-500 delay-0"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-orange-500 delay-150"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-yellow-500 delay-300"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500 delay-450"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500 delay-600"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-indigo-500 delay-750"></div>
                                                <div className="h-3 w-3 animate-pulse rounded-full bg-purple-500 delay-900"></div>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">กำลังโหลดข้อมูลพนักงาน...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : currentRows.length > 0 ? (
                                currentRows.map((user, index) => {
                                    return (
                                        <TableRow key={user.id}>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {indexOfFirstRow + index + 1}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.user_id}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.first_name + ' ' + user.last_name}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.position}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.department}
                                            </TableCell>
                                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {user.role}
                                            </TableCell>

                                            {roleUser === 'admin' && (
                                                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                    <Delete
                                                        className="cursor-pointer hover:text-red-600"
                                                        onClick={() => handleDelete(user.id, user.user_id)}
                                                    />
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="px-4 py-8 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                                        {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูลพนักงานในระบบ'}
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
                            <div className="flex gap-3 mr-4">
                                <div className="font-semiblod text-gray-500 text-start text-theme-sm dark:text-gray-400">มีพนักงานอยู่ในระบบทั้งหมด</div>
                                <div className="text-gray-500 text-start text-theme-sm dark:text-gray-400">{countUser}</div>
                                <div className="font-semiblod text-gray-500 text-start text-theme-sm dark:text-gray-400">คน</div>
                            </div>
                        </div>
                    </div>
                    {/* {zoomImage && (
                        <Modal isOpen={isOpen} onClose={closeModal} className="lg:min-w-[720px] m-4 max-h-[90vh] overflow-y-auto">
                            <div className="relative flex justify-center items-center">

                                {zoomImage && (
                                    <img
                                        src={zoomImage}
                                        alt="zoomed"
                                        className="w-full h-auto max-h-[75vh] rounded-md shadow-lg object-contain"
                                        loading="eager"
                                    />
                                )}
                            </div>
                        </Modal>
                    )} */}

                </div>
            </div>
        </div>
    );
};

export default UserTable;