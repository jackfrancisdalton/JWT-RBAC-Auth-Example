import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

export default function UnauthenticatedPage() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen p-4">
      <div className="flex flex-row flex-wrap justify-center gap-8">
        <LoginForm />
        <RegistrationForm />
      </div>
    </div>
  )  
}