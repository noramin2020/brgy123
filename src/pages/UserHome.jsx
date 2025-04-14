import { Link } from "react-router-dom";

function UserHome() {
  return (
    <div>
      <h1>User Dashboard</h1>
      <Link to="/logout"><button>Logout</button></Link>
    </div>
  );
}

export default UserHome;
