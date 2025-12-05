import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VoterNavbar from "../../components/navbar/VoterNavbar";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PollDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const pollRes = await api.get(`/polls/${id}`);
        setPoll(pollRes.data);

        const resultRes = await api.get(`/polls/${id}/vote/results`);
        setResults(resultRes.data || []);
      } catch (err) {
        console.error("Error loading poll details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="pt-32 text-center">Loading...</p>;
  if (!poll) return <p className="pt-32 text-center">Poll not found.</p>;

  const expiresAt = new Date(poll.expiresAt);
  const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);

  const colors = ["#4F46E5", "#EC4899", "#10B981", "#F59E0B", "#3B82F6"];

  const chartData = {
    labels: results.map((r) => r.optionText),
    datasets: [
      {
        data: results.map((r) => r.voteCount),
        backgroundColor: colors.slice(0, results.length),
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <VoterNavbar />

      <div className="pt-21 flex justify-center  pb-2">
        <div className="bg-white shadow-xl rounded-xl w-full max-w-5xl">

          <div className="w-full h-2 bg-orange-500 rounded-t-xl" />

          <div className="p-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{poll.title}</h1>
              <p className="text-gray-600">{poll.description}</p>
            </div>

            <button
              onClick={() => navigate("/polls")}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm"
            >
              ← Back to Polls
            </button>
          </div>

          <div className="border-t" />

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

            <div>
              <h3 className="text-lg font-semibold mb-3">Voting Results</h3>

              {results.map((res, index) => (
                <div key={res.optionId} className="mb-5">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{res.optionText}</span>
                    <span>
                      {res.percentage}% ({res.voteCount} votes)
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full">
                    <div
                      className="h-3 rounded-full"
                      style={{
                        width: `${res.percentage}%`,
                        backgroundColor: colors[index]
                      }}
                    />
                  </div>
                </div>
              ))}

              <p className="text-sm text-gray-500 mt-4">
                Total Votes: <b>{totalVotes}</b>
              </p>
            </div>

            <div className="flex justify-center items-center">
              <div className="w-80 h-80">
                <Pie
                  data={chartData}
                  options={{
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-4 text-gray-500 text-m font-bold">
            Expires on: {expiresAt.toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default PollDetails;
