import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { checkAuth } = useAuthStore();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            checkAuth().then(() => {
                navigate("/");
            });
        } else {
            navigate("/signin");
        }
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-gray-900" />
                <p className="text-gray-600 font-medium">Completing login...</p>
            </div>
        </div>
    );
}
