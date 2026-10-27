import UpscTerminal from './components/UpscTerminal'
import Header from './components/Header'
import AnnouncementTicker from './components/AnnouncementTicker'
import Hero from './components/Hero'
import {
  BrandRunner, SiteIndex, Resources, BeginnerRoadmap, Geography, Practice, CurrentAffairs, Games, AppTour, Why, Faq, FinalCta, Footer,
} from './components/Sections'
import { useReveal } from './useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <AnnouncementTicker />
      <main id="main">
        <Hero />
        <UpscTerminal />
        <BrandRunner />
        <SiteIndex />
        <Resources />
        <BeginnerRoadmap />
        <Geography />
        <Practice />
        <CurrentAffairs />
        <Games />
        <AppTour />
        <Why />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
