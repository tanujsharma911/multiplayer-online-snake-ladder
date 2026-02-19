import { useUser } from "@/store/user";
import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router";

const AuthLayout = ({ children }: { children: ReactElement }) => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isLoggedIn) {
      navigate(-1);
    }
  }, [user.isLoggedIn]);

  return <>{children}</>;
};

export default AuthLayout;
