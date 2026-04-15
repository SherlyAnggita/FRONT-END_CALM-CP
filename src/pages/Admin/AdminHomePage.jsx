// import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../../services/authService";

export default function AdminHomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <p>120 users</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Activity</h2>
          <p>340 logs</p>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">System</h2>
          <p>Running normally</p>
        </div>
      </div>
    </div>
  );
}
