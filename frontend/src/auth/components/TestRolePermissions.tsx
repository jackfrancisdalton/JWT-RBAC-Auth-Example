import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";

interface TestRolePermissionsParams {
    title: string;
    roles: string[];
    targetUrl: string;
}

export default function TestRolePermissions({title, roles, targetUrl}: TestRolePermissionsParams) {
    const [loading, setLoading] = useState(false);
    const [checkResult, setCheckResult] = useState<boolean>(undefined!); // initialised to unknown for when no result has been returned yet

    const { token } = useAuth();

    const makeRequest = async () => {
        setLoading(true);

        const response = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // TODO: introduce middleware or effect to auto attach bearer instead of assigning
            },
        });

        if (response.ok) {
            setCheckResult(true);
        } else {
            setCheckResult(false);
        }
        setLoading(false);
    }
    

    const renderLoading = () => {
        if (loading)
            return <p>Loading...</p>;

        return null;
    }

    const renderResult = () => {
        if (checkResult !== undefined && !loading)
            return <p>Result: {checkResult ? "Succeeded, you have the role!" : "Failed, you don't have the role!"}</p>;
        
        return null;
    };

    return (
        <div>
            <h2>{title}</h2>
            <p>Test if your current user has the roles: {roles.join(",")}</p>
            <button onClick={() => makeRequest()}>Test Action</button>
            <div>
                {renderLoading()}
                {renderResult()}
            </div>
        </div>
    );
}
