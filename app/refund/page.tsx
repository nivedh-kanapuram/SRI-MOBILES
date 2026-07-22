import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for Sri Mobiles - Multi Brand Mobile & Laptop Service Center, Hyderabad.',
};

export default function RefundPage() {
  return (
    <Section id="refund" variant="default">
      <Container size="md" padding="lg">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2024</p>
          </div>

          <div className="max-w-none space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">1. No-Fix, No-Fee Policy</h2>
              <p className="text-gray-500 leading-relaxed">
                At Sri Mobiles, if we cannot fix your device, you don&apos;t pay. If our diagnostic determines that the repair cannot be performed or if the repair fails, you will receive a full refund of any advance payment made.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">2. Refund Eligibility</h2>
              <ul className="text-gray-500 leading-relaxed space-y-2 list-disc list-inside">
                <li>Device was assessed but repair was not performed</li>
                <li>Repair was attempted but unsuccessful</li>
                <li>Customer decided not to proceed before repair started (full refund)</li>
                <li>Customer decided not to proceed after partial repair (partial refund for completed work)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">3. Non-Refundable Situations</h2>
              <ul className="text-gray-500 leading-relaxed space-y-2 list-disc list-inside">
                <li>Diagnostic fee (waived if you proceed with repair)</li>
                <li>Repair charges after successful completion and device handover</li>
                <li>Shipping charges for pickup/delivery service</li>
                <li>Data recovery services (charges apply regardless of recovery success percentage)</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">4. Refund Process</h2>
              <ol className="text-gray-500 leading-relaxed space-y-2 list-decimal list-inside">
                <li>Refund requests must be made within 7 days of the original transaction</li>
                <li>Present your repair receipt or payment confirmation</li>
                <li>Refund will be processed within 3-5 business days</li>
                <li>Refunds are made via the original payment method (UPI/Card/Cash)</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">5. Damaged Device Compensation</h2>
              <p className="text-gray-500 leading-relaxed">
                In the rare event that a device is damaged during repair at our facility, Sri Mobiles will either repair the damage at no cost or provide fair compensation based on the device&apos;s current market value. All damage claims must be reported within 24 hours of device collection.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">6. Contact for Refunds</h2>
              <p className="text-gray-500 leading-relaxed">
                For refund requests or questions, contact us at:<br />
                Phone: 9948299426<br />
                WhatsApp: 9948299426<br />
                Email: srimobiles.dsnr@gmail.com<br />
                Visit: Metro Pillar No.1563, Rajnigandha Complex, F209, 2nd Floor, Dilsukh Nagar Main Rd, Chaitanyapuri, Hyderabad
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}