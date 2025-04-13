import { Role } from "../providers/AuthProvider";

export default function ThisIsBlockedPage({ requiredRoles }: { requiredRoles: Role[] }) {
    return (
        <div>
            <h1>This is blocked</h1>
            <p>This page is only accessible to users with the 'admin' role.</p>
            <p>You required the following roles: {requiredRoles.join(',')}</p>
        </div>
    );
}