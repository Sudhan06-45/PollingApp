import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";

import AdminRoute from "./components/AdminRoute";
import AdminPolls from "./pages/admin/AdminPolls";
import AdminCreatePoll from "./pages/admin/AdminCreatePoll";
import AdminPollDetails from "./pages/admin/AdminPollDetails";
import AdminNavbar from "./components/navbar/AdminNavbar";
import NotFound from "./pages/common/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import PollList from "./pages/voter/PollList";
import Vote from "./pages/voter/Vote";
import PollDetails from "./pages/voter/PollDetails";

const App = () => {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <>
              <AdminNavbar />
              <Routes>
                <Route path="polls" element={<AdminPolls />} />
                <Route path="polls/create" element={<AdminCreatePoll />} />
                <Route path="polls/:id" element={<AdminPollDetails />} />
              </Routes>
            </>
          </AdminRoute>
        }
        />


      <Route
        path="/polls"
        element={
          <ProtectedRoute>
            <PollList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/polls/:id/vote"
        element={
          <ProtectedRoute>
            <Vote />
          </ProtectedRoute>
        }
      />

      <Route
        path="/polls/:id/results"
        element={
          <ProtectedRoute>
            <PollDetails />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default App;
