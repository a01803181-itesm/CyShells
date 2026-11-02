import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'
import Dashboard from './pages/Dashboard'
import IctAnalysis from './pages/IctAnalysis'
import NetworkAnalysis from './pages/NetworkAnalysis'

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='cyshells-ui-theme'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ict" element={<IctAnalysis />} />
          <Route path="/network" element={<NetworkAnalysis />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App