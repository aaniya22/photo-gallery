import { useState, useEffect } from 'react'

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://picsum.photos/v2/list?limit=30')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch photos')
        return res.json()
      })
      .then((data) => setPhotos(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { photos, loading, error }
}