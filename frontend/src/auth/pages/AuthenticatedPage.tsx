import AuthenticationStateCard from "../components/AuthenticationStateCard";
import { useAuth } from "../providers/AuthProvider";

export default function AuthenticatedPage() {
    const { user, logout } = useAuth();

    return (
        <div>
            {user && (
                <AuthenticationStateCard user={user}></AuthenticationStateCard>
            )}
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
}