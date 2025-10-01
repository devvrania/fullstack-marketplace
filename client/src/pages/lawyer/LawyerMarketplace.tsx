import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function LawyerMarketplace() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Lawyer Marketplace</h1>
        {user ? (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-lg">Welcome, <span className="font-semibold">{user.email}</span></p>
            <p className="text-gray-600 mt-2">Role: {user.role}</p>
          </div>
        ) : (
          <p className="text-gray-600">Please login to see your marketplace.</p>
        )}
      </div>
    </div>
  );
}
