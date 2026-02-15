import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/store/user";

const Profile = () => {
  const { user } = useUser();

  return (
    <div className="bg-zinc-100 p-2 border rounded-lg flex gap-4 max-w-4xl mx-3 md:mx-auto">
      <div className="flex flex-col justify-center">
        <Avatar className="outline-1">
          <AvatarImage src={user.avatar} alt={user.displayName} />
          <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-md">{user.displayName}</p>
        <p className="text-xs">{user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
