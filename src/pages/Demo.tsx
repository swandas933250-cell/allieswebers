import SearchComponent from "../components/ui/animated-glowing-search-bar";

const DemoOne = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <h2 className="text-white text-2xl font-bold mb-12 text-center">Glowing Search Bar Demo</h2>
        <SearchComponent />
      </div>
    </div>
  );
};

export { DemoOne };
