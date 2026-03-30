import { useAuth } from "../../auth/useAuth";
import Button from "../ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-4">
      <h1 className="text-xl font-bold">Cafeteria App</h1>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-700">
          {user ? (
            <>
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500">{user.role?.name}</p>
            </>
          ) : null}
        </div>

        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
}