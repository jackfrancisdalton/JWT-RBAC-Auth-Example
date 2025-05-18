import { UserRole } from "../types/auth.types";

export default function ThisIsBlockedPage({ requiredRoles }: { requiredRoles: UserRole[] }) {
    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl text-primary-500">You can't access this!</h1>
                <p>This page is only accessible to users with the {requiredRoles.join(',')} {requiredRoles.length > 1 ? "roles" : "role"}.</p>
            </div>
        </div>
    );
}