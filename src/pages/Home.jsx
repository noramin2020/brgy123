import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome</h1>

      <Link to="/AddName">
        <button>Go to Add Name</button>
      </Link>

      <br /><br />

      <Link to="/logout">
        <button>Logout</button>
      </Link>
    </div>
  );
}

export default Home;
