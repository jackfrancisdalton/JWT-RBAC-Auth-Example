import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { AuthApi } from "../api/auth.api";
import { jwtDecode } from "jwt-decode";

export default function GoogleLoginButton() {

    const handleSuccess = async (response: CredentialResponse) => {
        try {
            const { credential } = response;

            // TODO: clean up this case
            if (!credential) {
                console.error("No credential found");
                return;
            }

            const user = jwtDecode(credential);
            const data = await AuthApi.googleLogin(user);

            // TEMP: replace with something smarter using auth provider 
            localStorage.setItem("token", data.token);
        } catch (error) {
            // TODO: handle error
            console.error("Google login failed:", error);
        }
    };

    const handleError = () => {
        // TODO: implement logic
        console.error("Google login error");
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
        />
    );
};
