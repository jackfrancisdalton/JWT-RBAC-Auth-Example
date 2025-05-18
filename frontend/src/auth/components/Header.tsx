import { useAuth } from "../providers/AuthProvider";
import { APP_PATHS } from "../resources/AppPaths";

const Header = () => {
    const { user, logout } = useAuth();

    return(
        <header className="bg-secondary-900 fixed top-0 left-0 w-full text-white flex justify-between items-center border-b shadow-md  border-secondary-900">
            {user && (
              <>
                <nav>
                  <ul className="flex space-x-4 p-4">
                    <li><a href={APP_PATHS.LOGIN} className="hover:bg-primary-600 hover:text-white p-2 rounded">Login Page</a></li>
                    <li><a href={APP_PATHS.HOME} className="hover:bg-primary-600 hover:text-white p-2 rounded">Home</a></li>
                    <li><a href={APP_PATHS.ADMIN} className="hover:bg-primary-600 hover:text-white p-2 rounded">Admin</a></li>
                  </ul>
                </nav>
                <button 
                  onClick={() => logout()} 
                  className="bg-primary-500 hover:bg-primary-600 mr-2 text-white font-bold py-2 px-4 rounded"
                >
                  Logout
                </button>
              </>
            )}
        </header>
    );
}

export default Header;