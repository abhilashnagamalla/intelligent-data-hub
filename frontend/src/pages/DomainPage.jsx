import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DomainPage() {

  const { name } = useParams();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDatasets = async () => {

      try {

        const res = await fetch(`http://127.0.0.1:8000/datasets/${name}`);
        const data = await res.json();

        setDatasets(data);

      } catch (error) {
        console.error("Error loading datasets:", error);
      }

      setLoading(false);
    };

    fetchDatasets();

  }, [name]);

  if (loading) {
    return <div className="p-6">Loading datasets...</div>;
  }

  return (
    <div className="p-6 w-full">

      {/* Domain Title */}

      <h1 className="text-3xl font-bold mb-6 capitalize">
        {name} Domain
      </h1>

      {/* Overview Cards */}

      <div className="grid grid-cols-3 gap-4 mb-8">

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Datasets</h2>
          <p className="text-3xl font-bold">{datasets.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Catalogs</h2>
          <p className="text-3xl font-bold">{datasets.length}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Views</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

      </div>

      {/* Dataset List */}

      <h2 className="text-xl font-semibold mb-4">
        Available Datasets
      </h2>

      <div className="bg-white shadow rounded">

        {datasets.map((dataset) => (

          <div
            key={dataset.id}
            className="border-b p-4 hover:bg-gray-50"
          >

            <h3 className="font-semibold">
              {dataset.title || dataset.id}
            </h3>

            <p className="text-sm text-gray-500">
              Dataset ID: {dataset.id}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}