import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Sustainability from './components/Sustainability';
import GemstoneCollection from './components/GemstoneCollection';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Sustainability />
        <GemstoneCollection />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
