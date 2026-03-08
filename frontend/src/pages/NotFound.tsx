const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="bg-zinc-100 aspect-square p-4 flex items-center justify-center rounded-full mb-5">
        <img src="/not_found.svg" alt="Not Found" />
      </div>
      <p className="font-bold">Page not found</p>
    </div>
  );
};

export default NotFound;
