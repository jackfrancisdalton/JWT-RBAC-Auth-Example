import { User } from "../providers/AuthProvider";

export default function AuthenticationStateCard({ user }: { user: User }) {
    return (
        <div>
            <h2>Authenticated User</h2>
            <ul>
                <li>{user.email}</li>
                <li>{user.roles.join(', ')}</li>
            </ul>
        </div>
    )
}