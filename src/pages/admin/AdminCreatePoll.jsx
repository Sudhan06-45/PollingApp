
import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

const AdminCreatePoll = () => {
  const navigate = useNavigate();

  const [title,setTitle] = useState("");
  const [description,setDescription] = useState("");
  const [expiresAt,setExpiresAt] = useState("");
  const [allowMultipleVotes,setAllowMultipleVotes] = useState(false);
  const [options,setOptions] = useState(["",""]);

  const [error,setError] = useState("");
  const [successMsg,setSuccessMsg] = useState("");

  const updateOption = (i,value) => {
    const newOpts=[...options];
    newOpts[i]=value;
    setOptions(newOpts);
  };

  const addOption = () => setOptions([...options,""]);

  const removeOption = (i) => {
    if(options.length <= 2) return;
    setOptions(options.filter((_,idx)=> idx!==i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if(!title || !description || !expiresAt){
      setError("All fields are required.");
      return;
    }

    const cleaned = options.filter(o => o.trim()!=="");
    if(cleaned.length < 2){
      setError("At least 2 valid options are required.");
      return;
    }

    try{
      await api.post("/polls",{
        title,
        description,
        expiresAt,
        allowMultipleVotes,
        options: cleaned
      });

      setSuccessMsg("Poll created successfully!");

      setTimeout(()=> navigate("/admin/polls"),1200);
    }catch(err){
      console.error(err);
      setError("Failed to create poll");
    }
  };

  return(
    <div className="pt-21 min-h-screen bg-gray-100 flex items-start justify-center px-5 pb-16">
      <form onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white shadow-xl rounded-xl px-8 py-10 relative animate-fadeIn">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-green-600 rounded-t-xl"></div>

        <h2 className="text-3xl font-bold mb-2">Create New Poll</h2>
        <p className="text-gray-600 mb-6">Fill in the details to create your poll.</p>

        {error && <p className="text-red-500 mb-3 font-medium">{error}</p>}
        {successMsg && <p className="text-green-600 mb-3 font-medium">{successMsg}</p>}

        <label className="font-semibold text-gray-700">Title</label>
        <input type="text"
          className="border p-3 mt-1 mb-4 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={title}
          onChange={(e)=> setTitle(e.target.value)}
          placeholder="Enter poll title"
        />

        <label className="font-semibold text-gray-700">Description</label>
        <textarea
          className="border p-3 mt-1 mb-4 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={description}
          onChange={(e)=> setDescription(e.target.value)}
          placeholder="Enter poll description"
        ></textarea>

        <label className="font-semibold text-gray-700">Expires At</label>
        <input type="datetime-local"
          className="border p-3 mt-1 mb-4 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={expiresAt}
          onChange={(e)=> setExpiresAt(e.target.value)}
        />

        <label className="flex items-center gap-3 mt-2 mb-6 cursor-pointer">
          <input type="checkbox"
            checked={allowMultipleVotes}
            onChange={(e)=> setAllowMultipleVotes(e.target.checked)}
            className="w-5 h-5"
          />
          <span className="text-gray-700 font-medium">Allow Multiple Votes</span>
        </label>

        <h3 className="text-xl font-bold mb-3">Poll Options</h3>

        <div className="space-y-3">
          {options.map((op,index)=>(
            <div key={index}
              className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border shadow-sm">
              <input
                value={op}
                onChange={(e)=> updateOption(index,e.target.value)}
                className="border p-2 rounded w-full focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                placeholder={`Option ${index+1}`}
              />
              {options.length > 2 && (
                <button type="button"
                  onClick={()=> removeOption(index)}
                  className="bg-red-500 hover:bg-red-600 transition text-white p-2 rounded-md">
                  <XMarkIcon className="w-5 h-5"/>
                </button>
              )}
            </div>
          ))}
        </div>

        <button type="button"
          onClick={addOption}
          className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold">
          <PlusCircleIcon className="w-6 h-6"/>
          Add another option
        </button>

        <button type="submit"
          className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer py-3 rounded-lg text-lg font-semibold transition shadow">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default AdminCreatePoll;
