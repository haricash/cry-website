import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function App() {
  const [lastCry, setLastCry] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchStats = async () => {
    const res = await fetch('/api/stats');
    const data = await res.json();
    setLastCry(data.lastCry);
    setGraphData(data.graphData);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCry = async () => {
    setSubmitting(true);
    await fetch('/api/cry', { method: 'POST' });
    await fetchStats();
    setSubmitting(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4">Anonymous Cry Tracker</h1>
      <button
        onClick={handleCry}
        disabled={submitting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        I cried 😢
      </button>
      <div className="mt-4">
        {lastCry && <p>Last cry was: {new Date(lastCry).toLocaleString()}</p>}
      </div>
      {graphData && (
        <div className="mt-6">
          <Line
            data={{
              labels: graphData.labels,
              datasets: [{
                label: 'Cries per Day',
                data: graphData.counts,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
              }],
            }}
          />
        </div>
      )}
    </div>
  );
}