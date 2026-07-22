import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Sri Mobiles - Multi Brand Mobile & Laptop Service Center, Hyderabad.',
};

export default function PrivacyPage() {
  return (
    <Section id="privacy" variant="default">
      <Container size="md" padding="lg">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2024</p>
          </div>

          <div className="max-w-none space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
              <p className="text-gray-500 leading-relaxed">
                When you visit our website or use our services, we may collect personal information including your name, email address, phone number, device details, and repair requirements. This information is collected through our contact forms, WhatsApp integration, and direct communication.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
              <ul className="text-gray-500 leading-relaxed space-y-2 list-disc list-inside">
                <li>To provide repair services and communicate about your device status</li>
                <li>To send service updates and notifications via SMS or WhatsApp</li>
                <li>To improve our services and customer experience</li>
                <li>To process payments and maintain service records</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">3. Data Security</h2>
              <p className="text-gray-500 leading-relaxed">
                We implement appropriate security measures to protect your personal information. Your device data is handled with strict confidentiality, and we never access, copy, or share personal data on your devices during repairs without explicit consent.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">4. Third-Party Sharing</h2>
              <p className="text-gray-500 leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside parties. We may share information with trusted partners who assist us in operating our website and servicing your devices, provided they agree to keep this information confidential.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">5. Your Rights</h2>
              <p className="text-gray-500 leading-relaxed">
                You have the right to access, correct, or delete your personal information.                 You may also opt out of receiving marketing communications. To exercise these rights, please contact us at srimobiles.dsnr@gmail.com or call us at 9948299426.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">6. Contact Us</h2>
              <p className="text-gray-500 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:<br />
                Sri Mobiles - Multi Brand Mobile & Laptop Service Center<br />
                Metro Pillar No.1563, Rajnigandha Complex, F209, 2nd Floor,<br />
                Dilsukh Nagar Main Rd, Chaitanyapuri, Hyderabad, Telangana 500060<br />
                Email: srimobiles.dsnr@gmail.com<br />
                Phone: 9948299426
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}