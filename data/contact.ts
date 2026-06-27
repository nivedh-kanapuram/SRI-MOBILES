import type { ContactInfo, SocialLink, NavLink, FooterLink, FooterSection } from '@/types';

export const contactInfo: ContactInfo = {
  address: 'Metro Pillar No.1563, Rajnigandha Complex, F209, 2nd Floor, Dilsukh Nagar Main Rd, Chaitanyapuri, Hyderabad, Telangana 500060',
  phone: ['9948299426'],
  email: 'srimobiles.dsnr@gmail.com',
  hours: '10 AM – 8 PM (All Days)',
};

export const socialLinks: SocialLink[] = [
  { name: 'WhatsApp', url: 'https://wa.me/919948299426', icon: 'message-circle' },
  { name: 'Facebook', url: 'https://facebook.com/srimobileshyd', icon: 'facebook' },
  { name: 'Instagram', url: 'https://www.instagram.com/srimobilesfix?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', icon: 'instagram' },
  { name: 'Google Maps', url: 'https://maps.google.com/?q=Sri+Mobiles+Hyderabad', icon: 'map-pin' },
];

export const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/#services' },
  { label: 'Brands', href: '/#brands' },
  { label: 'Why Us', href: '/#why-choose-us' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Contact', href: '/#contact' },
];

export const footerSections: FooterSection[] = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/#about' },
      { label: 'Services', href: '/#services' },
      { label: 'Brands', href: '/#brands' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Mobile Screen Replacement', href: '/#services' },
      { label: 'Battery Replacement', href: '/#services' },
      { label: 'Charging Port Repair', href: '/#services' },
      { label: 'Laptop Motherboard Repair', href: '/#services' },
      { label: 'Laptop Screen Replacement', href: '/#services' },
      { label: 'Data Recovery', href: '/#services' },
      { label: 'Liquid Damage Repair', href: '/#services' },
      { label: 'RAM & Storage Upgrades', href: '/#services' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { label: 'Apple', href: '/#brands' },
      { label: 'Samsung', href: '/#brands' },
      { label: 'OnePlus', href: '/#brands' },
      { label: 'Vivo/Oppo/Realme', href: '/#brands' },
      { label: 'Lenovo/HP/Dell', href: '/#brands' },
      { label: 'ASUS/Acer/MSI', href: '/#brands' },
      { label: 'Microsoft Surface', href: '/#brands' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Warranty Policy', href: '/warranty' },
      { label: 'Refund Policy', href: '/refund' },
    ],
  },
];