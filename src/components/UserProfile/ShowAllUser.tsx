import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import { useEffect, useState } from 'react';
import axios from 'axios'
import Swal from 'sweetalert2'
import '../../pages/Forms/style.css'
import * as React from 'react';
import dayjs from 'dayjs'
import 'dayjs/locale/th'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import UserTable from './UserTable';
// import Stack from '@mui/material/Stack';

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

const ShowAllUser = () => {
    const [users, setUser] = useState<User[]>([])
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6;
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [roleUser, setRoleUser] = useState<string>('');
    const [countUser, setCountUser] = useState<number>(0);
    const [filteredUser, setFilteredUser] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);



    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.locale('th') // ตั้ง locale เป็นไทย

    // Get data User
    useEffect(() => {
        (async () => {

            try {
                setIsLoading(true)
                const { data } = await axios.get('https://product-record-backend.vercel.app/api/authen/getAllUsers')
                if (!data.status === true) return
                setUser(data.rows)
                setCountUser(data.rows.length)

            } catch (error) {
                console.error('Error for fetching data', error)
            } finally {
                setIsLoading(false)
            }
        })();
    }, [])

    useEffect(() => {
        const role = sessionStorage.getItem('role') || ''
        setRoleUser(role)
        // console.log("Updated users:", users)
        // console.log("Updated countUser:", countUser)

    }, [users, countUser]);

    const handleDelete = async (userID: number) => {
        try {
            // Ask for confirmation before deleting
            const result = await Swal.fire({
                title: 'แจ้งเตือน',
                text: "ต้องการลบข้อมูลพนักงานหรือไม่",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก'
            });

            // If confirmed, proceed with the deletion
            if (result.isConfirmed) {
                setIsLoading(true)
                const response = await axios.delete(`https://product-record-backend.vercel.app/api/authen/deleteUser/${userID}`);

                if (response.data.status === 'success') {
                    Swal.fire('สำเร็จ', 'ทำการลบข้อมูลพนักงานสำเร็จ', 'success');

                    const { data } = await axios.get(`https://product-record-backend.vercel.app/api/authen/getAllUsers`)
                    setUser(data.rows);
                    setCountUser(data.rows.length)
                } else {
                    Swal.fire('Error', response.data.message, 'error');
                }
            } else {
                Swal.fire('สำเร็จ', 'ยกเลิกการลบข้อมูลพนักงานสำเร็จ)', 'success');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            Swal.fire('Error', 'เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน', 'error');
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        if (!searchTerm.trim()) {
            // If search term is empty, show all products
            setFilteredUser(users);
        } else {
            // Convert search term to lowercase for case-insensitive comparison
            const lowercasedSearch = searchTerm.toLowerCase();

            // Filter user based on search term
            const filtered = users.filter(user =>
                (user.user_id && user.user_id.toLowerCase().includes(lowercasedSearch)) ||
                (user.first_name && user.first_name.toLowerCase().includes(lowercasedSearch)) ||
                (user.last_name && user.last_name.toLowerCase().includes(lowercasedSearch)) ||
                (user.department && user.department.toLowerCase().includes(lowercasedSearch)) ||
                (user.position && user.position.toLowerCase().includes(lowercasedSearch)) ||
                (user.role && user.role.toLowerCase().includes(lowercasedSearch))
                // For dates, format them for searching
            )

            setFilteredUser(filtered);
        }
    }, [searchTerm, users]);

    // Update your handleSearch function
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <PageMeta title="User Information"
                description="This is Page for showing and add data for machine"
            />
            <PageBreadcrumb pageTitle="ข้อมูลพนักงาน" />
            <div className="content">
                <div className="flex items-center justify-between">
                    <div className="max-sm:w-full">
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
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 max-sm:pr-10 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                                />

                                {/* <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button> */}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Table */}
                <UserTable
                    isLoading={isLoading}
                    searchTerm={searchTerm}
                    users={filteredUser}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    roleUser={roleUser}
                    handleDelete={handleDelete}
                    countUser={countUser}
                />

            </div>
        </div>
    );
}

export default ShowAllUser;