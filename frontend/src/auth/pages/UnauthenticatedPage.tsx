import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";

export default function UnauthenticatedPage() {
  return (
    <div>
        <LoginForm></LoginForm>
        <br />
        <RegistrationForm></RegistrationForm>

        {/* TODO replace with auto navigation on login */}
        <Link to={"/home"}>go to authenticated page</Link>
    </div>
  )  
}