import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';
import { HeroSection } from '@/components/sections/HeroSection';
import { BrandsSection } from '@/components/sections/BrandsSection';
import { TrackRepairSection } from '@/components/sections/TrackRepairSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WhyChooseUsSection } from '@/components/sections/WhyChooseUsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ContactSection } from '@/components/sections/ContactSection';
import { MapSection } from '@/components/sections/MapSection';
import { CTABanner } from '@/components/sections/CTABanner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <ScrollProgress />
      <Navbar />
      <HeroSection />
      <TrackRepairSection />
      <BrandsSection />
      <ServicesSection />
      <WhyChooseUsSection />
      <GallerySection />
      <FAQSection />
      <ContactSection />
      <MapSection />
      <CTABanner />
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </main>
  );
}
