import AuthenticationStateCard from "../components/AuthenticationStateCard";
import TestRolePermissions from "../components/TestRolePermissions";
import { useAuth } from "../providers/AuthProvider";

export default function AuthenticatedPage() {
    const { user, logout } = useAuth();

    return (
        <div>
            {user && (
                <AuthenticationStateCard user={user}></AuthenticationStateCard>
            )}
            {/* TODO: update to pass only the sub path, not the base URL */}
            <TestRolePermissions
                title="Test if you're an admin"
                roles={["admin"]}
                targetUrl="http://localhost:3000/auth/adminRoleCheck"
            ></TestRolePermissions>
            <TestRolePermissions
                title="Test if you're a user"
                roles={["user"]}
                targetUrl="http://localhost:3000/auth/userRoleCheck"
            ></TestRolePermissions>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
}