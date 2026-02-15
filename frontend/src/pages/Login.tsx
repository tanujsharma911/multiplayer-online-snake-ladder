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
    <div className="h-100 flex justify-center">
      <div className="py-8 lg:mx-16">
        <h3 className="scroll-m-20 text-2xl mb-10 text-center font-semibold tracking-tight">
          Login
        </h3>

        <Button onClick={handleLogin}>
          <FaGoogle />
          Login With Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
