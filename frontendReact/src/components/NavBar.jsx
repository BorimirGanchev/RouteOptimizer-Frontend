import { Link, useNavigate } from "react-router-dom";
import { useRef } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navLinksRef = useRef(null); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const onThoggleMenue = (element) => {
    element.name = element.name === "menu" ? "close" : "menu";
    if (navLinksRef.current) {
      navLinksRef.current.classList.toggle("top-[9%]"); // Use the ref to access the element
    }
  };


  return (
    <nav className="md:h-[8vh] h-[10vh] flex justify-between shadow-xl items-center w-full z-100 mx-auto p-8">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-black to-red-700 bg-clip-text text-transparent">
        Forza FERRARI
      </h1>
      <div
        ref={navLinksRef} // Attach the ref to the nav-links element
        className="nav-links duration-700 md:static absolute bg-white md:min-h-fit min-h-[20vh] left-0 top-[-100%] md:w-auto w-full z-[10] flex items-center px-5"
      >
        <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8">
          {role === "admin" ? (
            <>
              <li>
                <Link to="/admin-home" className="hover:text-gray-500 font-bold text-lg ">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-gray-500 font-bold text-lg">
                  Create a User
                </Link>
              </li>
              <li>
                <Link to="/manage-users" className="hover:text-gray-500 font-bold text-lg">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/create-order" className="hover:text-gray-500 font-bold text-lg">
                  Create Order
                </Link>
              </li>
            </>
          ) : role === "user" ? (
            <>
              <li>
                <Link to="/user-home" className="hover:text-gray-500 font-bold text-lg ">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-gray-500 font-bold text-lg">
                  Orders for distribution
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-gray-500 font-bold text-lg">
                  Profile
                </Link>
              </li>
            </>
          ) : null}
        </ul>
      </div>
      {token ? (
        <div className="flex items-center gap-6">
          <button
            onClick={handleLogout}
            className="mb-4 px-6 py-3 text-white font-bold rounded-md hover:opacity-90 bg-gradient-to-r from-black to-red-500"
          >
            Logout
          </button>
          <ion-icon
            onClick={(event) => onThoggleMenue(event.target)}
            name="menu"
            className="text-3xl cursor-pointer md:hidden"
          ></ion-icon>
        </div>
      ) : (
        <div>
          <Link
            to="/"
            className="mb-4 px-10 py-4 text-white font-bold rounded-full hover:opacity-80 bg-gradient-to-r from-black to-red-500"
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
