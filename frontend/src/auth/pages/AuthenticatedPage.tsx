import AuthenticationStateCard from "../components/AuthenticationStateCard";
import TestRolePermissions from "../components/TestRolePermissions";
import { useAuth } from "../providers/AuthProvider";

export default function AuthenticatedPage() {
    const { token, userProfile } = useAuth();

    const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT;
    const adminRoleCheckURL = `http://localhost:${BACKEND_PORT}/role-testing/adminRoleCheck`;
    const userRoleCheckURL = `http://localhost:${BACKEND_PORT}/role-testing/userRoleCheck`;
    const userAndAdminRoleCheckURL = `http://localhost:${BACKEND_PORT}/role-testing/userAndAdminRoleCheck`;

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center">
                    {userProfile && (
                        <AuthenticationStateCard userProfile={userProfile} token={token}></AuthenticationStateCard>
                    )}
                </div>
                <div className="flex flex-row gap-4">
                    <TestRolePermissions
                        title="Admin"
                        roles={["admin"]}
                        targetUrl={adminRoleCheckURL}
                    ></TestRolePermissions>
                    <TestRolePermissions
                        title="User"
                        roles={["user"]}
                        targetUrl={userRoleCheckURL}
                    ></TestRolePermissions>
                    <TestRolePermissions
                        title="Admin & User"
                        roles={["user", "admin"]}
                        targetUrl={userAndAdminRoleCheckURL}
                    ></TestRolePermissions>
                </div>
            </div>
        </div>
    );
}