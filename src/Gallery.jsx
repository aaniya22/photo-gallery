import { useReducer, useEffect, useState, useCallback, useMemo } from 'react'
import useFetchPhotos from './useFetchPhotos'
import { favouritesReducer } from './favouritesReducer'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [favourites, dispatch] = useReducer(
    favouritesReducer,
    [],
    () => JSON.parse(localStorage.getItem('favourites')) || []
  )
  const [query, setQuery] = useState('')

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favourites))
  }, [favourites])

  const handleSearch = useCallback((e) => setQuery(e.target.value), [])

  const filtered = useMemo(
    () => photos.filter((p) => p.author.toLowerCase().includes(query.toLowerCase())),
    [photos, query]
  )

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    )
  if (error) return <p className="py-20 text-center text-red-600">{error}</p>

  return (
    <div className="mx-auto max-w-6xl p-4">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by author..."
        className="mb-6 w-full rounded border border-gray-300 p-2"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filtered.map((photo) => {
          const isFav = favourites.includes(photo.id)
          return (
            <div key={photo.id} className="overflow-hidden rounded shadow">
              <img
                src={`https://picsum.photos/id/${photo.id}/400/300`}
                alt={photo.author}
                className="h-48 w-full object-cover"
              />
              <div className="flex items-center justify-between p-3">
                <span>{photo.author}</span>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE', id: photo.id })}
                  className="text-2xl"
                  aria-label="Toggle favourite"
                >
                  {isFav ? '❤️' : '🤍'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}