import AuthenticationStateCard from "../components/AuthenticationStateCard";
import TestRolePermissions from "../components/TestRolePermissions";
import { useAuth } from "../providers/AuthProvider";

export default function AuthenticatedPage() {
    const { user, logout } = useAuth();

    const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
    const adminRoleCheckURL = `http://localhost:${BACKEND_PORT}/auth/adminRoleCheck`;
    const userRoleCheckURL = `http://localhost:${BACKEND_PORT}/auth/adminRoleCheck`;

    return (
        <div>
            {user && (
                <AuthenticationStateCard user={user}></AuthenticationStateCard>
            )}
            <TestRolePermissions
                title="Test if you're an admin"
                roles={["admin"]}
                targetUrl={adminRoleCheckURL}
            ></TestRolePermissions>
            <TestRolePermissions
                title="Test if you're a user"
                roles={["user"]}
                targetUrl={userRoleCheckURL}
            ></TestRolePermissions>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
}