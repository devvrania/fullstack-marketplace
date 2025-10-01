import { useEffect, useState } from "react";
import { getMyCases, createCase } from "../../api/client";

const ClientDashboard = () => {
  const [cases, setCases] = useState<{ items: any[]; page?: number; pageSize?: number; total?: number }>({ items: [] });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getMyCases();
      setCases(res.data);
    })();
  }, []);

  const handleCreateCase = async () => {
    const res = await createCase({ title, description, category });
    setCases((prev) => ({
      ...prev,
      items: [...(prev.items || []), res.data],
    }));
    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Cases</h1>

      {/* Create Case */}
      <div className="mb-4">
        <input
          className="border p-2 mr-2"
          placeholder="Case Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Case Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          placeholder="Case Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreateCase} className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Case
        </button>
      </div>

      {/* List Cases */}
      <ul className="space-y-2">
        {(cases.items || []).map((c) => (
          <li key={c.id} className="p-3 border rounded bg-gray-50">
            <strong>{c.title}</strong> - {c.description} ({c.status})
          </li>
        ))}
      </ul>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-600">
        Page: {cases.page} | Page Size: {cases.pageSize} | Total: {cases.total}
      </div>
    </div>
  );
};

export default ClientDashboard;
