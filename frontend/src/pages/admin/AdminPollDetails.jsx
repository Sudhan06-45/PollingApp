
import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../../api/axios";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend} from "chart.js";
import { Pie } from "react-chartjs-2";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,Tooltip,Legend);

const AdminPollDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();

  const [poll,setPoll] = useState(null);
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=> {
    const load = async ()=> {
      try{
        const pollRes = await api.get(`/polls/${id}`);
        setPoll(pollRes.data);

        const resultRes = await api.get(`/polls/${id}/vote/results`);
        setResults(resultRes.data);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    };
    load();
  },[id]);

  if(loading) return <p className="p-10">Loading...</p>;
  if(!poll) return <p className="p-10">Poll not found.</p>;

  const labels = results.map(r=> r.optionText);
  const voteCounts = results.map(r=> r.voteCount);
  const totalVotes = voteCounts.reduce((a,b)=> a+b,0);


  const pieData = {
    labels,
    datasets:[
      {
        data:voteCounts,
        backgroundColor:["#4A6CF7","#E25788","#24B47E","#F5A623","#9B59B6"]
      }
    ]
  };

  const deactivatePoll = async ()=> {
    if(!window.confirm("Are you sure you want to deactivate this poll?")) return;

    try{
      await api.patch(`/polls/${id}/status`,{isActive:false});
      alert("Poll has been deactivated.");
      navigate("/admin/polls");
    }catch(err){
      alert("Failed to deactivate poll.");
    }
  };

  return(
    <div className="pt-28 px-6 md:px-20 min-h-screen flex justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-5xl border-t-8 border-orange-500">

        <button
          onClick={()=> navigate("/admin/polls")}
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition mb-4">
          <ArrowLeftIcon className="w-5 h-5"/>
          Back to Polls
        </button>

        <h1 className="text-3xl font-bold">{poll.title}</h1>
        <p className="text-gray-600 mt-1">{poll.description}</p>

        <p className="text-sm text-gray-500 mt-2">
          Expires on: <b>{new Date(poll.expiresAt).toLocaleString()}</b>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8">

          <div>
            <h2 className="text-xl font-semibold mb-4">Voting Results</h2>

            {results.map(r=>(
              <div key={r.optionId} className="mb-5">
                <div className="flex justify-between text-sm font-medium">
                  <span>{r.optionText}</span>
                  <span>{r.percentage}% ({r.voteCount} votes)</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width:`${r.percentage}%`,
                      backgroundColor:["#4A6CF7","#E25788","#24B47E","#F5A623","#9B59B6"][results.indexOf(r)]
                    }}
                  />
                </div>
              </div>
            ))}

            <p className="text-sm font-semibold mt-4">
              Total Votes: <span className="text-indigo-600">{totalVotes}</span>
            </p>
          </div>

          <div className="flex justify-center items-center">
            <Pie data={pieData} width={260} height={260}/>
          </div>
        </div>

        <div className="mt-10 mb-10 flex justify-center">
          <button
            onClick={deactivatePoll}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 w-full md:w-1/2 shadow">
            Deactivate Poll
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPollDetails;
