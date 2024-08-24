import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useAuthStore from "@/store/useAuthStore";

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    navigate("/");
    logout();
  }
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/">
          <h1 className="text-3xl font-bold text-gray-900">ZuAI</h1>
        </Link>
        {!isAuthenticated ? (
          <div>
            <Button variant="outline" className="mr-2">
              <Link to="/login">Login</Link>
            </Button>
            <Button>
              <Link to="/register">Join Now</Link>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mr-2">
            <Button variant="outline" onClick={() => navigate("/post/new")}>
              New Post
            </Button>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
