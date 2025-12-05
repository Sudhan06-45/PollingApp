import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import VoterNavbar from "../../components/navbar/VoterNavbar";

const Vote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPoll = async () => {
      try {
        const res = await api.get(`/polls/${id}`);
        setPoll(res.data);
      } catch (err) {
        console.error("Poll load error:", err);
      }
    };

    loadPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selected) {
      setError("Please select an option");
      return;
    }

    try {
      await api.post(`/polls/${id}/vote`, { optionId: selected });

      setSuccess("Your vote has been submitted!");

    } catch (err) {
      console.error("Vote error:", err);
      setError("Already voted");
    }
  };

  if (!poll) return <p className="pt-28 text-center">Loading...</p>;

  return (
    <>
      <VoterNavbar />

      <div className="pt-26 px-4 max-w-2xl mx-auto">

        <div className="relative bg-white shadow-xl rounded-lg border border-gray-200 overflow-hidden">

          <div className="h-2 bg-orange-400"></div>

          <button
            onClick={() => navigate("/polls")}
            className="absolute right-6 top-8 h-8 w-12 rounded px-2 border flex items-center justify-center
                      bg-gray-100 hover:bg-gray-300 transition cursor-pointer scale-95"
          >
            Back
          </button>

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>

            <p className="text-gray-600 mb-6">{poll.description}</p>
            <h2 className="text-lg font-semibold mb-3">Choose an option</h2>

            <div className="space-y-3">
              {poll.options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <input
                    type="radio"
                    name="vote"
                    value={opt.id}
                    onChange={() => setSelected(opt.id)}
                    className="h-4 w-4"
                  />
                  <span className="text-md">{opt.optionText}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-red-500 mt-3">{error}</p>}

            {success && (
              <p className="text-green-600 font-medium mt-3">{success}</p>
            )}
            <div className="mt-8 flex gap-4">
              <button
                onClick={handleVote}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-lg hover:bg-indigo-700 transition cursor-pointer scale-95"
              >
                Submit Vote
              </button>

              <button
                onClick={() => navigate(`/polls/${id}/results`)}
                className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Results →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vote;
