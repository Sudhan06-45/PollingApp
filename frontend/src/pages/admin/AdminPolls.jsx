
import { useEffect,useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

import {
  FilmIcon,
  TvIcon,
  FireIcon,
  MapIcon,
  HeartIcon
} from "@heroicons/react/24/solid";

const getCategoryIcon = (title)=> {
  title = title.toLowerCase();
  if(title.includes("movie") || title.includes("genre"))
    return <FilmIcon className="w-6 h-6 text-purple-600"/>;
  if(title.includes("platform") || title.includes("stream"))
    return <TvIcon className="w-6 h-6 text-blue-600"/>;
  if(title.includes("snack") || title.includes("food"))
    return <FireIcon className="w-6 h-6 text-red-500"/>;
  if(title.includes("travel"))
    return <MapIcon className="w-6 h-6 text-green-600"/>;
  return <HeartIcon className="w-6 h-6 text-pink-600"/>;
};

const getBorderColor = (title)=> {
  title = title.toLowerCase();
  if(title.includes("movie")) return "border-purple-500";
  if(title.includes("platform")) return "border-blue-500";
  if(title.includes("snack")) return "border-red-500";
  if(title.includes("travel")) return "border-green-500";
  return "border-orange-500";
};

const timeLeft = (expiresAt)=> {
  const end = new Date(expiresAt);
  const now = new Date();
  const diff = end - now;

  if(diff <= 0) return "Expired";

  const days = Math.round(diff/(1000*60*60*24));
  if(days === 1) return "1 day left";
  return `${days} days left`;
};

const ITEMS_PER_PAGE = 4;

const AdminPolls = ()=> {
  const navigate = useNavigate();
  const [polls,setPolls] = useState([]);
  const [loading,setLoading] = useState(true);

  const [search,setSearch] = useState("");
  const [filter,setFilter] = useState("active");
  const [sortType,setSortType] = useState("newest");
  const [page,setPage] = useState(1);

  useEffect(()=> {
    const load = async ()=> {
      try{
        const res = await api.get("/polls");
        setPolls(res.data);
      }catch(err){
        console.error(err);
      }finally{
        setLoading(false);
      }
    };
    load();
  },[]);

  if(loading) return <p className="pt-28 text-center">Loading...</p>;

  let filtered = polls.filter(p=> filter==="active" ? p.isActive : !p.isActive);

  filtered = filtered.filter(p=>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const sortPolls = (data)=> {
    let sorted = [...data];
    if(sortType==="newest"){
      sorted.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt));
    }
    if(sortType==="expiringSoon"){
      sorted.sort((a,b)=> new Date(a.expiresAt)-new Date(b.expiresAt));
    }
    if(sortType==="mostVotes"){
      sorted.sort((a,b)=> (b.totalVotes||0)-(a.totalVotes||0));
    }
    return sorted;
  };

  const sorted = sortPolls(filtered);

  const totalPages = Math.ceil(sorted.length/ITEMS_PER_PAGE);
  const start = (page-1)*ITEMS_PER_PAGE;
  const visible = sorted.slice(start,start+ITEMS_PER_PAGE);

  return(
    <div className="pt-28 pb-10 px-5 max-w-6xl mx-auto min-h-screen">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Manage All Polls</h1>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search polls..."
            value={search}
            onChange={(e)=> {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-lg w-60 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />

          <select
            value={sortType}
            onChange={(e)=> setSortType(e.target.value)}
            className="border px-3 py-2 rounded-lg w-40 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="mostVotes">Most Votes</option>
            <option value="expiringSoon">Expiring Soon</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={()=> {
            setFilter("active");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold ${filter==="active" ? "bg-indigo-600 text-white":"bg-gray-200"}`}
        >
          Active Polls
        </button>

        <button
          onClick={()=> {
            setFilter("completed");
            setPage(1);
          }}
          className={`px-4 py-2 rounded-lg font-semibold ${filter==="completed" ? "bg-indigo-600 text-white":"bg-gray-200"}`}
        >
          Completed Polls
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visible.map(poll=>(
          <div
            key={poll.pollId}
            className={`bg-white border-l-8 ${getBorderColor(poll.title)} rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-3">
              {getCategoryIcon(poll.title)}
              <h2 className="text-xl font-semibold">{poll.title}</h2>
            </div>

            <p className="text-gray-600 mb-3">{poll.description}</p>

            <div className="flex justify-between items-center">
              <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                {timeLeft(poll.expiresAt)}
              </span>

              <button
                onClick={()=> navigate(`/admin/polls/${poll.pollId}`)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={page===1}
          onClick={()=> setPage(page-1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
        >
          Previous
        </button>

        <span className="font-semibold">Page {page} of {totalPages}</span>

        <button
          disabled={page===totalPages}
          onClick={()=> setPage(page+1)}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminPolls;
