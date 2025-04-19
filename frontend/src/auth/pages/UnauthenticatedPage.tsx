import GoogleLoginButton from "../components/GoogleLoginButton";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

export default function UnauthenticatedPage() {
  return (
    <div>
        <LoginForm></LoginForm>
        <br />
        <RegistrationForm></RegistrationForm>
        <br />
        <GoogleLoginButton></GoogleLoginButton>
    </div>
  )  
}