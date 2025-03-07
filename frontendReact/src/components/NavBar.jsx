import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/signin");
  };

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">My App</h1>
      <ul className="flex gap-4">
        {role === "admin" ? (
          <>
            <li>
              <Link to="/admin-home" className="hover:underline">
                Admin Dashboard
              </Link>
            </li>
            <li>
              <Link to="/manage-users" className="hover:underline">
                Manage Users
              </Link>
            </li>
          </>
        ) : role === "user" ? (
          <>
            <li>
              <Link to="/user-home" className="hover:underline">
                User Dashboard
              </Link>
            </li>
            <li>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
            </li>
          </>
        ) : null}

        {token ? (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/" className="hover:underline">
              Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
