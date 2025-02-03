export const Pagination = ({page, totalPages, onPageChange}) => {
    console.log("Pagination page:", page); // Log the current page here

    return (
      <div className="flex items-center justify-between bg-gray-900 text-white p-2 rounded-lg shadow-md w-full max-w-lg mx-auto">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className={`w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md ${page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <img src="./prev.svg" alt="Previous" className="w-5 h-5" />
        </button>
  
        <p className="text-lg font-semibold">
          <span className="text-white">{page}</span>
          <span className="text-gray-400"> / {totalPages}</span>
        </p>
  
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className={`w-10 h-10 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md ${page === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
          <img src="./next.svg" alt="Next" className="w-5 h-5" />
        </button>
      </div>
    );
  };
  