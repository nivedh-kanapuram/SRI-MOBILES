import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Warranty Policy',
  description: 'Warranty Policy for Sri Mobiles - Multi Brand Mobile & Laptop Service Center, Hyderabad.',
};

export default function WarrantyPage() {
  return (
    <Section id="warranty" variant="default">
      <Container size="md" padding="lg">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/" className="text-sky-500 hover:text-sky-600 text-sm transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">Warranty Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: January 1, 2024</p>
          </div>

          <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200">
            <p className="text-sky-600 font-medium">
              At Sri Mobiles, we stand behind every repair with a comprehensive warranty for your peace of mind.
            </p>
          </div>

          <div className="max-w-none space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Warranty Coverage by Service Type</h2>
              <div className="grid gap-3">
                {[
                  { service: 'Mobile Screen Replacement', warranty: '6 months on parts & labor' },
                  { service: 'Laptop Screen Replacement', warranty: '1 year on parts & labor' },
                  { service: 'Battery Replacement', warranty: '3 months on battery & labor' },
                  { service: 'Charging Port Repair', warranty: '3 months on parts & labor' },
                  { service: 'Laptop Motherboard Repair', warranty: '6 months on parts & labor' },
                  { service: 'Data Recovery', warranty: 'No warranty on recovery (best effort basis)' },
                  { service: 'Liquid Damage Repair', warranty: '90 days on parts & labor' },
                  { service: 'RAM & Storage Upgrades', warranty: '1 year on parts & labor' },
                ].map((item) => (
                    <div key={item.service} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-900 font-medium text-sm">{item.service}</span>
                    <span className="text-sky-500 text-sm">{item.warranty}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">What&apos;s Covered</h2>
              <ul className="text-gray-500 leading-relaxed space-y-2 list-disc list-inside">
                <li>Defective parts used during the original repair</li>
                <li>Labor issues related to the original repair workmanship</li>
                <li>Same repair failing within the warranty period</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">What&apos;s NOT Covered</h2>
              <ul className="text-gray-500 leading-relaxed space-y-2 list-disc list-inside">
                <li>New accidental or physical damage after the repair</li>
                <li>Liquid or water damage occurring after the repair</li>
                <li>Software issues, virus damage, or data loss</li>
                <li>Repairs performed by another service center after our repair</li>
                <li>Normal wear and tear (battery degradation, screen scratches)</li>
                <li>Pre-existing issues unrelated to the repair performed</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">How to Claim Warranty</h2>
              <ol className="text-gray-500 leading-relaxed space-y-2 list-decimal list-inside">
                <li>Bring your device to our center along with the repair receipt</li>
                <li>Our technician will verify the warranty claim</li>
                <li>If covered, the repair will be performed at no additional cost</li>
                <li>If not covered, a new quotation will be provided</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Important Notes</h2>
              <p className="text-gray-500 leading-relaxed">
                Warranty is non-transferable and applies only to the original customer. The warranty receipt must be presented for any claim. Sri Mobiles reserves the right to determine whether a warranty claim is valid. Contact us at 9948299426 or visit our center for warranty assistance.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}