import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Play, Pause } from 'lucide-react'
import { vibrateOnSwipe } from './mobile'

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [preferences, setPreferences] = useState({
    swipeRight: true,
    delayBetweenSwipes: 1000,
  })

  const handleCredentialsChange = (field: keyof typeof credentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }))
  }

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const touchStartRef = useRef<number | null>(null)

  const handleSwipe = (direction: 'left' | 'right') => {
    const key = direction === 'right' ? 'ArrowRight' : 'ArrowLeft'
    const event = new KeyboardEvent('keydown', { key })
    document.dispatchEvent(event)
    vibrateOnSwipe()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = touch.clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return
    
    const touch = e.changedTouches[0]
    const diff = touch.clientX - touchStartRef.current
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      handleSwipe(diff > 0 ? 'right' : 'left')
    }
    
    touchStartRef.current = null
  }

  const toggleAutoSwiper = () => {
    if (!isRunning) {
      if (!credentials.username || !credentials.password) {
        alert('Please enter your Tinder credentials')
        return
      }
      
      const interval = setInterval(() => {
        handleSwipe(preferences.swipeRight ? 'right' : 'left')
      }, preferences.delayBetweenSwipes)

      intervalRef.current = interval
      setIsRunning(true)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setIsRunning(false)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div 
      className="min-h-screen bg-gray-100 py-4 px-2 sm:py-8 sm:px-4 select-none touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div className="w-full max-w-md mx-auto pt-safe pb-safe safe-area-inset-bottom">
        <Card>
          <CardHeader>
            <CardTitle>Tinder Auto Swiper</CardTitle>
            <CardDescription>Configure your auto swiping preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username/Email</Label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={handleCredentialsChange('username')}
                  placeholder="Enter your Tinder email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleCredentialsChange('password')}
                  placeholder="Enter your Tinder password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Swipe Right</Label>
                <div className="text-sm text-gray-500">
                  Toggle to swipe left instead
                </div>
              </div>
              <Switch
                checked={preferences.swipeRight}
                onCheckedChange={(checked) =>
                  setPreferences(prev => ({ ...prev, swipeRight: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delay">Delay Between Swipes (ms)</Label>
              <Input
                id="delay"
                type="number"
                value={preferences.delayBetweenSwipes}
                onChange={(e) =>
                  setPreferences(prev => ({
                    ...prev,
                    delayBetweenSwipes: parseInt(e.target.value) || 1000
                  }))
                }
                min="500"
                max="5000"
              />
            </div>

            <Button
              className="w-full"
              onClick={toggleAutoSwiper}
              variant={isRunning ? "destructive" : "default"}
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Stop Swiping
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Start Swiping
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
