import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const handleLogin = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/auth/login/google`,
      "_self",
    );
  };

  return (
    <div className="h-100 flex justify-center items-center">
      <div className="py-8 lg:mx-16">
        <h1 className="mb-10 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Login
        </h1>

        <Button onClick={handleLogin}>
          <FaGoogle />
          Login With Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
