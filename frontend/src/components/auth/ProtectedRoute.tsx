import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
