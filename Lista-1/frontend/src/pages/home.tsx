export const Home: React.FC = () => (
  <div className="flex justify-center items-center flex-col h-full">
    <div className="w-64">
      <img alt="logo" src="../images/logo.png" />
    </div>
    <h1 className="text-6xl font-medium py-10">Tic Tac Toe</h1>
    <form className="w-full max-w-sm py-10">
      <div className="flex items-center border-b border-purple-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Your nickname"
          aria-label="Full name"
        />
        <a href="/games-list">
          <button
            className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white py-1 px-2 rounded focus:outline-none	"
            type="button"
          >
            Start
          </button>
        </a>
      </div>
    </form>
  </div>
);
