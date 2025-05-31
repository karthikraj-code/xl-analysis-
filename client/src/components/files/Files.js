  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ddd6f3] to-[#faaca8] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200 shadow-lg">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Files</h1>
            <button
              onClick={() => setShowUploadModal(true)}
              className="relative group inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-lg opacity-50"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-lg opacity-0 group-hover:opacity-100 blur transition-all duration-300"></span>
              <span className="relative flex items-center text-white">
                <FaUpload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 