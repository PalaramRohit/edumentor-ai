import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner"; // Assuming existing toast library usage

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { token, user } = await api.auth.login(email, password);
            login(token, user);
            toast.success("Login successful");
            navigate("/");
        } catch (error) {
            toast.error("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter your credentials to access your dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="student@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                        <p className="text-sm text-center text-gray-500">
                            Don't have an account? <a href="/signup" className="text-primary hover:underline">Sign up</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </AuthLayout>
    );
};

export default Login;
