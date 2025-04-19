import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
// import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useState , useEffect } from "react";
import axios from "axios";
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


export default function UserProfiles() {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const user_id = sessionStorage.getItem('user_id')

  useEffect(() => {
    (async () => {
      try{
        // console.log('user_id is', user_id)
        const {data} = await axios.get(`http://localhost:8000/api/authen/getUserByid/${user_id}`)
        if (data.status === true) {
        setUserProfile(data.row)
        }
        
      } catch (error) {
        console.log("error to get profile", error)
      }
    })();
  },[])
  return (
    <>
      <PageMeta
        title="Profile"
        description="หน้านี้เป็นหน้าสำหรับแสดงข้อมูลของพนักงาน"
      />
      <PageBreadcrumb pageTitle="โปรไฟล์" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        {/* <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          โปรไฟล์
        </h3> */}
        <div className="space-y-6">
        <UserMetaCard userProfile={userProfile} />
        <UserInfoCard userProfile={userProfile} />
        </div>
      </div>
    </>
  );
}
