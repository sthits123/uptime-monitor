import { ThemeProvider } from "./components/ui/theme-provider"
import { Header } from "./custom-components/Header"
import { HeroSection } from "./custom-components/Hero-sec"
import { Stats } from "./custom-components/Stats"
import { Monitor } from "./custom-components/Monitor"
import { Features } from "./custom-components/Features"
import { CTASection } from "./custom-components/Cta-section"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Header></Header>
      <HeroSection></HeroSection>
      <Stats></Stats>
      <Monitor></Monitor>
      <Features></Features>
      <CTASection></CTASection>
    </div>
    </ThemeProvider>
  )
}

export default App
