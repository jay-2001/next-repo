const LoadingOverlay = () => {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex items-center space-x-2">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full"></div>
          <span className="text-gray text-xl">Loading...</span>
        </div>
      </div>
    );
  };
  
  export default LoadingOverlay;
  