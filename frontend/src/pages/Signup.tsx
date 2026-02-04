import { useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Signup = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        year: 3,
        branch: "Computer Science",
        target_role: "Backend Engineer"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.auth.register({
                ...formData,
                year: Number(formData.year) // Ensure number
            });
            toast.success("Account created! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error("Registration failed. Email might be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your EduMentor AI account</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Input id="year" type="number" min="1" max="4" value={formData.year} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="branch">Branch</Label>
                                <Input id="branch" value={formData.branch} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="target_role">Target Role</Label>
                            <Input id="target_role" placeholder="e.g. Data Scientist" value={formData.target_role} onChange={handleChange} required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Creating Account..." : "Sign Up"}
                        </Button>
                        <p className="text-sm text-center text-gray-500">
                            Already have an account? <a href="/login" className="text-primary hover:underline">Login</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </AuthLayout>
    );
};

export default Signup;
