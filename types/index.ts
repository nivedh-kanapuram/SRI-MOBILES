export interface Brand {
  id: string;
  name: string;
  logo: string;
  category: 'mobile' | 'laptop';
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  category: 'mobile' | 'laptop' | 'both';
  estimate?: string;
}

export interface WhyChooseUs {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  device?: string;
  service: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: 'shop' | 'repair' | 'service';
  caption?: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: string;
  suffix?: string;
}

export interface ContactInfo {
  address: string;
  phone: string[];
  email: string;
  hours: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  canonical: string;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: Array<{
    '@type': string;
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }>;
  priceRange: string;
  aggregateRating: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
  review: Array<{
    '@type': string;
    author: {
      '@type': string;
      name: string;
    };
    reviewRating: {
      '@type': string;
      ratingValue: number;
    };
    reviewBody: string;
  }>;
}