import React, { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from "react-router";
interface formData {
  user_id: string,
  password: string
}
export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState<formData>({
    user_id: '',
    password: '',
  })

  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log(name, value)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // if (!/^\d{5}$/.test(formData.user_id.toString())) {
    //   Swal.fire({
    //     title: "รหัสพนักงานไม่ถูกต้อง",
    //     text: "กรุณากรอกรหัสพนักงาน 5 หลัก",
    //     icon: "error",
    //     confirmButtonColor: "#d33", 
    //     confirmButtonText: "ตกลง",
    //   })
    //   return;
    // } 
    try {

      const response = await axios.post("http://localhost:8000/api/authen/login", formData);
      console.log("Success:", response.data);
      if (response.data && response.data.status === true && response.data.token) {
        
        Swal.fire({
          title: " สำเร็จ!",
          text: "เข้าสู่ระบบสำเร็จ",
          icon: "success",
          confirmButtonColor: "#009A3E",
          confirmButtonText: "ตกลง",
        }).then((result) => {
          if (result.isConfirmed) {
            // If OK is clicked, navigate to /signin
            navigate('/');
          }
        });
      }
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Now you can safely access response and message
        const errorMessage = error.response?.data?.message || "กรุณาลองใหม่อีกครั้ง";
        Swal.fire({
          title: "เข้าสู่ระบบไม่สำเร็จ!",
          text: errorMessage,
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "ตกลง",
        });
      } else {
        // Fallback if error is not an AxiosError
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "กรุณาลองใหม่อีกครั้ง",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "ตกลง",
        });
      }
    }
  };

  return (
    <div className="flex flex-col flex-1">
     <div className="w-full max-w-md ml-4 mb-5 sm:pt-4">
        <Link
          to="/"
          className="inline-flex items-center text-sm p-3 rounded-full bg-[#009A3E] text-white transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to Home
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
        <div className="mb-2 w-full mx-auto sm:mb-6">

<p className=" mx-auto text-center font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-sm">
  Sign In
</p>
</div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                    {/* <!-- Exployee ID --> */}
                    <div>
                      <Label>
                        Employee ID<span className="text-error-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="user_id"
                        name="user_id"
                        placeholder="Enter your Employyee ID"
                        onChange={handleChange}
                      />
                    </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                  <Input
                          placeholder="Enter your password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          onChange={handleChange}
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
