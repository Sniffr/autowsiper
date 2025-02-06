import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

export const initMobileFeatures = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: Style.Dark })
      await SplashScreen.hide()

      screen.orientation.addEventListener('change', () => {
        document.documentElement.style.setProperty(
          '--vh',
          `${window.innerHeight * 0.01}px`
        )
      })
    } catch (err) {
      console.error('Error initializing mobile features:', err)
    }
  }

  document.documentElement.style.setProperty(
    '--vh',
    `${window.innerHeight * 0.01}px`
  )
}

export const vibrateOnSwipe = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50)
  }
}
