import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="sincere"
        description="หน้านี้ทำหน้าที่สำหรับเพิ่ม หรือ สมัครสมาชิก"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
