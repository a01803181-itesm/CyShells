import './App.css'
import { ThemeProvider } from './components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='cyshells-ui-theme'>
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <h1 className="text-3xl font-bold text-primary text-glow">
          CyShells Initialized
        </h1>
      </div>
    </ThemeProvider>
  )
}

export default App