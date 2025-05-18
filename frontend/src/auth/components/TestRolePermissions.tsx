import { useState } from "react";
import axiosClient from "../helpers/axiosClient";

interface TestRolePermissionsParams {
    title: string;
    roles: string[];
    targetUrl: string;
}

export default function TestRolePermissions({title, roles, targetUrl}: TestRolePermissionsParams) {
    const [loading, setLoading] = useState(false);
    const [checkResult, setCheckResult] = useState<boolean>(undefined!); // initialised to unknown for when no result has been returned yet

    const makeRequest = async () => {
        setLoading(true);

        try {
            const res = await axiosClient.get(targetUrl);
            if (res.status >= 200 && res.status < 300) {
                setCheckResult(true);
            } else {
                setCheckResult(false);
            }
        } catch {
            setCheckResult(false);
        } finally {
            setLoading(false);
        }
    }
    

    const renderLoading = () => {
        if (loading)
            return <p>Loading...</p>;

        return null;
    }

    const renderResult = () => {
        if (checkResult !== undefined && !loading)
            return (
                <p className={checkResult ? "text-green-500" : "text-red-500"}>
                    {checkResult ? "Succeeded, you have the role!" : "Failed, you don't have the role!"}
                </p>
            );
        
        return null;
    };

    return (
        <div className="flex- bg-secondary-900 shadow-md rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold text-primary-500">{title}</h2>
            <p className="text-secondary-200 mb-4">Test if you have the roles: <span className="font-medium">{roles.join(", ")}</span></p>
            <button 
                onClick={() => makeRequest()} 
                className="bg-primary-500 mt-2 text-white px-4 w-full py-2 rounded hover:bg-primary-600 transition duration-200"
            >
                Test Role(s)
            </button>
            <div className="mt-4">
                {renderLoading()}
                {renderResult()}
            </div>
        </div>
    );
}
