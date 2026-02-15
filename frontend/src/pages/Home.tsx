import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button onClick={() => navigate("/game")}>Pass And Play</Button>
    </div>
  );
};

export default Home;
