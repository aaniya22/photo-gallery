import { useReducer, useEffect, useState, useCallback, useMemo } from "react";
import useFetchPhotos from "./useFetchPhotos";
import { favouritesReducer } from "./favouritesReducer";

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    () => JSON.parse(localStorage.getItem("favourites")) || [],
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleSearch = useCallback((e) => setQuery(e.target.value), []);

  const filtered = useMemo(
    () =>
      photos.filter((p) =>
        p.author.toLowerCase().includes(query.toLowerCase()),
      ),
    [photos, query],
  );

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  if (error) return <p className="py-20 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-black p-4 text-white md:p-6">
      <h1 className="mb-6 font-serif text-4xl tracking-tight">Photo Gallery</h1>
      <div className="mb-8 flex w-full max-w-md items-center rounded-full border border-white/30 bg-white/10 p-1 shadow-lg backdrop-blur-md">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by author..."
          className="w-full bg-transparent px-5 py-2 text-white outline-none placeholder:text-white/50"
        />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </div>
      </div>
      <div className="grid grid-cols-1 items-start gap-x-4 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((photo, index) => {
          const isFav = favourites.includes(photo.id);
          return (
            <div key={photo.id} className="group flex flex-col-reverse">
              <img
                src={`https://picsum.photos/id/${photo.id}/400/${Math.round((400 * photo.height) / photo.width)}`}
                alt={photo.author}
                className="w-full transition duration-300 group-hover:opacity-80"
              />
              <div className="flex items-center justify-between py-2 text-sm">
                <span>{photo.author}</span>
                <span className="ml-auto mr-3 text-white/50">{index + 1}</span>
                <button
                  onClick={() => dispatch({ type: "TOGGLE", id: photo.id })}
                  className="text-xl transition hover:scale-125"
                  aria-label="Toggle favourite"
                >
                  {isFav ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
