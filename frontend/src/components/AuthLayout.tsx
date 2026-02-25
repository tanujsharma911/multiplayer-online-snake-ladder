import { useUser } from "@/store/user";
import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate("/login");
      toast.error("Please login to continue");
    }
  }, [user.isLoggedIn]);

  return <>{children}</>;
};

export default AuthLayout;
