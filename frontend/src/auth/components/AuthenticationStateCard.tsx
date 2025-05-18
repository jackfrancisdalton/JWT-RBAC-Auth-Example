import { UserProfile } from "../types/auth.types";

export default function AuthenticationStateCard({ token, userProfile }: { token: string | null | undefined, userProfile: UserProfile }) {

    return (
        <div className="bg-secondary-900 border border-primary-500 rounded-lg p-4 max-w-md shadow-md grid gap-4">
            <img 
                src={userProfile?.avatarUrl || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="rounded-full w-36 h-36 mx-auto" 
            />
            <h2 className="text-xl font-semibold text-center">Authenticated User</h2>
            <div className="grid grid-cols-2 gap-4">
                <span className="font-bold text-right">ID:</span>
                <span className="text-left">{userProfile?.id}</span>

                <span className="font-bold text-right">Email:</span>
                <span className="text-left">{userProfile?.email}</span>

                <span className="font-bold text-right">Roles:</span>
                <span className="text-left">{userProfile?.roles.join(', ')}</span>

                <span className="font-bold text-right">Created At:</span>
                <span className="text-left">{userProfile?.createdAt}</span>

                <span className="font-bold text-right">Avatar URL:</span>
                <span className="text-left">{userProfile?.avatarUrl}</span>

                <span className="font-bold text-right">Access Token:</span>
                <span className="text-left">{token}</span>
            </div>
        </div>
    )
}