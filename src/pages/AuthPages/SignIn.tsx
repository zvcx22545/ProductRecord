import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Sign in for SC company"
        description="Sign in for company this my project"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
