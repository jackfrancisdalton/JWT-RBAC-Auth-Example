import { UserProfile } from "../types/auth.types";

export default function AuthenticationStateCard({ token, userProfile }: { token: string | null | undefined, userProfile: UserProfile }) {

    return (
        <div className="bg-secondary-900 border border-primary-500 rounded-lg p-8 max-w-md shadow-md grid gap-4">
            <img 
                src={userProfile?.avatarUrl || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="rounded-full w-36 h-36 mx-auto" 
            />
            <h2 className="text-xl font-semibold text-center">Authenticated User</h2>
            <div className="grid grid-cols-4 gap-4">
                <span className="font-bold col-span-1 text-right">ID:</span>
                <span className="col-span-3 text-left truncate" title={userProfile?.id}>{userProfile?.id}</span>

                <span className="font-bold col-span-1 text-right">Email:</span>
                <span className="col-span-3 text-left truncate" title={userProfile?.email}>{userProfile?.email}</span>

                <span className="font-bold col-span-1 text-right">Roles:</span>
                <span className="col-span-3 text-left truncate" title={userProfile?.roles.join(', ')}>{userProfile?.roles.join(', ')}</span>

                <span className="font-bold col-span-1 text-right">Created At:</span>
                <span className="col-span-3 text-left truncate" title={userProfile?.createdAt}>{userProfile?.createdAt}</span>

                <span className="font-bold col-span-1 text-right">Avatar URL:</span>
                <span className="col-span-3 text-left truncate" title={userProfile?.avatarUrl}>{userProfile?.avatarUrl}</span>

                <span className="font-bold col-span-1 text-right">Access Token:</span>
                <span className="col-span-3 text-left truncate" title={token}>{token}</span>
            </div>
        </div>
    )
}