import AuthenticationStateCard from "../components/AuthenticationStateCard";
import { useAuth } from "../providers/AuthProvider";

export default function AuthenticatedPage() {
    const { user } = useAuth();

    return (
        <div>
            {user && (
                <AuthenticationStateCard
                    user={user}
                ></AuthenticationStateCard>
            )}
        </div>
    );
}