import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
interface Props {
  userProfile: User | null;
}

interface User {
  id: number,
  user_id: string;
  first_name: string;
  last_name: string;
  position: string;
  role: string;
  department: string;
  password: string;
  profile_image: string;
}


interface FormData {
  id: number,
  user_id: string
  first_name: string
  last_name: string
  position: string
  department: string
  password: string
  profile_image: string
}


export default function UserInfoCard({ userProfile }: Props) {
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    id: userProfile?.id || 0,
    user_id: '',
    first_name: '',
    last_name: '',
    position: '',
    department: '',
    password: '',
    profile_image: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        id: userProfile.id,
        user_id: userProfile.user_id,
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        position: userProfile.position,
        department: userProfile.department,
        password: userProfile.password,
        profile_image: userProfile.profile_image,
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true)
      const formDataToSend = new FormData();
      // Append all user data fields to the FormData
      formDataToSend.append('id', formData.id.toString());
      formDataToSend.append('user_id', formData.user_id);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('password', formData.password);

      if (selectedFile) {
        formDataToSend.append('profile_image', selectedFile);
      } else {
        formDataToSend.append('profile_image', formData.profile_image);
      }

      const { data } = await axios.post(
        `https://product-record-backend.vercel.app/api/authen/updateUser`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log("User updated:", data);
      if (data.status === true) {
        Swal.fire({
          title: 'สำเร็จ',
          text: 'อัพเดทข้อมูลเรียบร้อยแล้ว',
          icon: 'success',
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
            closeModal();
          }
        });
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false)
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewImage(URL.createObjectURL(file))
      console.log('check file ===>', file)
    }
  }
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            ข้อมูลพนักงาน
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                ชื่อ
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile?.first_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                นามสกุล
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile?.last_name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                รหัสพนักงาน
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile?.user_id}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                ตำแหน่งพนักงาน
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile?.position}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                ระดับสิทธิ์การใช้งาน
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userProfile?.role}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              อัพเดทข้อมูลพนักงาน
            </h4>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  ข้อมูลพนักงาน
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>ชื่อ</Label>
                    <Input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>นามสกุุล</Label>
                    <Input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>รหัสพนักงาน</Label>
                    <Input type="text" name="user_id" value={formData.user_id} onChange={handleChange} />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>แผนกพนักงาน</Label>
                    <Input type="text" name="department" value={formData.department} onChange={handleChange} />
                  </div>

                  <div className="col-span-2">
                    <Label>ตำแหน่งพนักงาน</Label>
                    <Input type="text" name="position" value={formData.position} onChange={handleChange} />
                  </div>

                </div>
                {/* Preview Image */}
                <div className="flex justify-center mt-4 shadow-lg rounded-lg max-w-[300px] max-h-[300px] mx-auto">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" className="min-lg:max-w-[300px] min-lg:max-h-[300px] object-cover rounded-lg shadow-lg" />
                  ) : formData.profile_image ? (
                    <img src={formData.profile_image} alt="Current Profile" className="min-lg:max-w-[300px] min-lg:max-h-[300px] object-cover rounded-lg shadow-lg" />
                  ) : null}
                </div>

                {/* File upload */}
                <Label className="flex items-center cursor-pointer justify-center gap-2 mt-8 max-sm:w-[90%] max-lg:w-[50%] min-lg:w-full mx-auto px-3 py-2 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]">
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
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-2 justify-center">
              <Button size="sm" type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-sm mr-2"></span>
                ) : (
                  'บันทึก'
                )}
              </Button>
              {!isLoading && (
                <Button size="sm" variant="outline" onClick={closeModal}>
                  ยกเลิก
                </Button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
