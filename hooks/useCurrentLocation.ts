import * as Location from 'expo-location'
import { useState, useCallback } from 'react'

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  console.log("status");

  const requestLocation = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    setLocation(null)
    console.log("status");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Brak zgody na lokalizację')
        setLoading(false)
        return
      }
      const loc = await Location.getCurrentPositionAsync({})
      setLocation(loc)
    } catch (e) {
      setErrorMsg('Błąd pobierania lokalizacji')
    } finally {
      setLoading(false)
    }
  }, [])

  return { location, errorMsg, loading, requestLocation }
}