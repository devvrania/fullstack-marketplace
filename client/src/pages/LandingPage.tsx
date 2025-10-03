import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hook";

export default function LandingPage() {
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

    return (
        <div className="relative min-h-screen w-full overflow-x-hidden">
            {/* Fixed background image */}
            <div
                className="fixed inset-0 w-full h-full bg-cover bg-center -z-10"
                style={{
                    backgroundImage: "url('/client-lawyer.avif')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
            />
            {/* Overlay */}
            <div className="fixed inset-0 bg-black bg-opacity-40 -z-10" />
            {/* Content */}
            <div className="flex items-center justify-center min-h-screen w-full">
                <div className="max-w-2xl w-full mx-auto px-6 py-16 md:py-24 rounded-xl shadow-xl backdrop-blur-md flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 text-center drop-shadow-lg">
                        Welcome to Legal Marketplace
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 mb-8 text-center max-w-xl">
                        Find the right legal expert for your needs, or offer your expertise to clients seeking help. Secure, fast, and trusted by professionals.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-200"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started
                        </button>
                        <button
                            className="bg-white hover:bg-gray-100 text-blue-700 font-semibold py-3 px-8 rounded-lg shadow-md border border-blue-600 transition duration-200"
                            onClick={() => navigate('/login')}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
            <footer className="absolute bottom-6 left-0 right-0 text-center text-gray-300 text-sm z-10">
                &copy; {new Date().getFullYear()} Legal Marketplace. All rights reserved.
            </footer>
        </div>
    );
}
