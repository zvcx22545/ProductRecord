import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField"
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import './style.css'
// import Checkbox from "../form/input/Checkbox";

interface FormData {
  user_id: number
  first_name: string
  last_name: string
  position: string
  role: string
  department: string
  password: string
  profile_image: string
}

interface Role {
  id: string;
  label: string;
}

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showCFPassword, setShowCFPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userRole, setuserRole] = useState<string | null>(null)
  const [isLoading, setLoading] = useState(false);

  const [formData, setFormdata] = useState<FormData>({
    user_id: 0,
    first_name: "",
    last_name: "",
    position: "",
    role: "user",
    department: "",
    password: "",
    profile_image: "",
  })
  const profile = "https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small_2x/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg";
  const roles: Role[] = [
    { id: 'user', label: 'User' },
    { id: 'admin', label: 'Admin' },
  ]
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const checkPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== confirmPassword) {
      Swal.fire({
        title: "รหัสผ่านไม่ตรงกัน",
        text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      })
      return
    }

    if (!/^\d{5}$/.test(formData.user_id.toString())) {
      Swal.fire({
        title: "รหัสพนักงานไม่ถูกต้อง",
        text: "กรุณากรอกรหัสพนักงาน 5 หลักเท่านั้น",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      })
      return
    } else if (!formData.first_name && formData.last_name) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกขื่อและนามสกุล",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      })
      return
    } else if (!formData.position && formData) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกตำแหน่งพนักงาน",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      })
      return
    } else if (!formData.department && formData) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "กรุณากรอกแผนกของพนักงาน",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
      })
      return
    }
    try {
      setLoading(true)
      const userData = {
        ...formData,
        profile_image: profile// ใช้รูปโปรไฟล์เริ่มต้นถ้าไม่มีอัปโหลด
      }

      const response = await axios.post("https://product-record-backend.vercel.app/api/authen/register", userData)
      console.log("Success:", response.data)
      if (response.data && response.data.newUser) {
        // If newUser exists, show success message
        Swal.fire({
          title: "สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้ทันที",
          icon: "success",
          confirmButtonColor: "#009A3E",
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            // If OK is clicked, navigate to /signin
            navigate('/signin')
          }
        })
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
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "ตกลง",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const roleUser = sessionStorage.getItem("role") || "";
        setuserRole(roleUser)

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">

      <div className="w-full max-w-md ml-4 mb-5 sm:pt-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm p-3 rounded-full bg-[#009A3E] text-white transition-colors hover:text-white dark:hover:text-gray-300 hover:bg-[#7FBA20]"
        >
          <ChevronLeftIcon className="size-5" />
          {userRole === "admin" ? "ไปยังหน้าหลัก" : "ไปยังหน้าเข้าสู่ระบบ"}
        </Link>
      </div>

      <div className="flex justify-center items-center max-w-xs mx-auto w-full">
        <Link to="/" className="block mb-4">
          <img
            width={170}
            height={48}
            src="/images/logo/company.png"
            alt="Logo"
          />
        </Link>
      </div>

      <div className="w-full">

        <div className="mb-2 w-full mx-auto sm:mb-6">

          <p className=" mx-auto text-center font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-sm">
            {userRole === "admin" ? "เพิ่มพนักงาน" : "สมัครสมาชิก"}
          </p>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full">

          <div>
            <form onSubmit={handleSubmit}>
              <div className="containers">
                <div className="grid grid-cols-1 w-1/2 max-sm:w-full max-lg:w-full mx-auto p-4 bg-white dark:bg-gray-900">
                  <div className="left space-y-5 w-3/4 mx-auto">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      {/* <!-- First Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          ชื่อ<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="first_name"
                          name="first_name"
                          onChange={handleChange}
                          placeholder="กรุณาระบุชื่อ"
                        />
                      </div>
                      {/* <!-- Last Name --> */}
                      <div className="sm:col-span-1">
                        <Label>
                          นามสกุล<span className="text-error-500">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="last_name"
                          name="last_name"
                          onChange={handleChange}
                          placeholder="กรุณาระบุนามสกุล"
                        />
                      </div>
                    </div>
                    {/* <!-- Exployee ID --> */}
                    <div>
                      <Label>
                        รหัสพนักงาน<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="user_id"
                        name="user_id"
                        onChange={handleChange}
                        placeholder="กรุณาระบุรหัสพนักงาน"
                      />
                    </div>
                    {/* <!-- Password --> */}
                    <div>
                      <Label>
                        รหัสผ่าน<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="กรุณาระบุรหัสผ่าน"
                          name="password"
                          onChange={handleChange}
                          type={showPassword ? "text" : "password"}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    {/* <!-- Confirm Password --> */}
                    <div>
                      <Label>
                        ยืนยันรหัสผ่าน<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          onChange={checkPassword}
                          placeholder="กรุณาระบุรหัสผ่าน"
                          name="confirm_password"
                          type={showCFPassword ? "text" : "password"}
                        />
                        <span
                          onClick={() => setShowCFPassword(!showCFPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showCFPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                          )}
                        </span>
                      </div>
                    </div>
                    {/* <!-- Expolyee position--> */}
                    <div>
                      <Label>
                        ตำแหน่งพนักงาน<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="position"
                        name="position"
                        onChange={handleChange}
                        placeholder="กรุณาระบุตำแหน่งพนักงาน"
                      />
                    </div>

                    {/* <!-- Department --> */}
                    <div className="sm:col-span-1">
                      <Label>
                        แผนกพนักงาน<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="department"
                        name="department"
                        onChange={handleChange}
                        placeholder="กรุณาระบุแผนกของคุณ"
                      />
                    </div>

                    <fieldset className={`fieldset ${userRole === 'admin' ? '' : 'hidden'}`}>
                      <Label>
                        ระดับผู้ใช้งาน<span className="text-error-500">*</span>
                      </Label>
                      <select defaultValue="กำหนดสิทธิ์ให้ผู้ใช้งาน" name="role" onChange={handleChange} className="select ">
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>{role.label}</option>
                        ))}

                      </select>
                    </fieldset>
                  </div>

                </div>

                {/* <!-- Button --> */}

                <button className="flex items-center justify-center mb-4 max-sm:w-[90%] max-lg:w-[50%] min-lg:w-[20%]  mx-auto px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#009A3E] shadow-theme-xs hover:bg-[#7FBA20]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-dots loading-sm mr-2"></span>
                  ) : (
                    'สมัครสมาชิก'
                  )}

                </button>
              </div>
            </form>

          </div>

        </div>
      </div>

    </div>
  )
}
