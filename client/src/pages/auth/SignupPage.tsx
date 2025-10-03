import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../api/axios";
import type { AxiosError } from "axios";
import { useAppSelector } from "../../store/hook";

const SignupPage = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector((s) => s.auth);

    useEffect(() => {
        // If already logged in, redirect to dashboard
        if (user) {
            if (user.role === "client") {
                navigate("/client/dashboard", { replace: true });
            } else if (user.role === "lawyer") {
                navigate("/lawyer/marketplace", { replace: true });
            }
        }
    }, [user, navigate]);


    const [role, setRole] = useState<"client" | "lawyer">("client");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "",
        jurisdiction: "",
        barNumber: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const url =
                role === "client"
                    ? `/auth/signup/client`
                    : `/auth/signup/lawyer`;

            const payload =
                role === "client"
                    ? { email: form.email, password: form.password, name: form.name }
                    : {
                        email: form.email,
                        password: form.password,
                        name: form.name,
                        jurisdiction: form.jurisdiction,
                        barNumber: form.barNumber,
                    };

            await api.post(url, payload, { withCredentials: true });
            navigate("/login");
        } catch (err: any) {
            const axiosErr = err as AxiosError<{ message: string }>;
            setError(axiosErr.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

                {/* Toggle role */}
                <div className="flex justify-center gap-4 mb-4">
                    <button
                        type="button"
                        aria-selected={role === "client"}
                        onClick={() => setRole("client")}
                        className={`px-4 py-2 rounded-md border ${role === "client"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Client
                    </button>
                    <button
                        type="button"
                        aria-selected={role === "lawyer"}
                        onClick={() => setRole("lawyer")}
                        className={`px-4 py-2 rounded-md border ${role === "lawyer"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        Lawyer
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        type="text"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    {/* Extra fields only for lawyers */}
                    {role === "lawyer" && (
                        <>
                            <Input
                                type="text"
                                placeholder="Jurisdiction"
                                value={form.jurisdiction}
                                onChange={(e) =>
                                    setForm({ ...form, jurisdiction: e.target.value })
                                }
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Bar Number"
                                value={form.barNumber}
                                onChange={(e) =>
                                    setForm({ ...form, barNumber: e.target.value })
                                }
                                required
                            />
                        </>
                    )}

                    <Button type="submit" loading={loading} disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </Button>
                </form>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
        </div>
    );
};

export default SignupPage;
