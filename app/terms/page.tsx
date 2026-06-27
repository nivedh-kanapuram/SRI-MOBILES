import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Sri Mobiles - Multi Brand Mobile & Laptop Service Center, Hyderabad.',
};

export default function TermsPage() {
  return (
    <Section id="terms" variant="gradient">
      <Container size="md" padding="lg">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/" className="text-electric-400 hover:text-electric-300 text-sm transition-colors">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            <p className="text-dark-400 text-sm">Last updated: January 1, 2024</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">1. Service Agreement</h2>
              <p className="text-dark-400 leading-relaxed">
                By submitting your device for repair at Sri Mobiles, you agree to these Terms of Service. We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the current terms.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">2. Device Assessment & Quotation</h2>
              <p className="text-dark-400 leading-relaxed">
                All devices undergo a free diagnostic assessment. The repair quote provided is valid for 7 days from the date of assessment. Final charges may vary if additional issues are discovered during repair. You will be contacted for approval before any additional work is performed.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">3. Repair Timeline</h2>
              <p className="text-dark-400 leading-relaxed">
                While we strive to complete most repairs within the estimated timeframe, complex repairs may take longer. We will notify you via WhatsApp or phone if the timeline changes. Sri Mobiles is not liable for delays caused by parts unavailability or unforeseen technical complications.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">4. Warranty Terms</h2>
              <p className="text-dark-400 leading-relaxed">
                Warranty covers the specific repair performed and parts replaced. Warranty is void if: the device undergoes further repair by another party, the device is physically damaged after our repair, or the device is exposed to liquid or extreme conditions. See our <Link href="/warranty" className="text-electric-400 hover:text-electric-300">Warranty Policy</Link> for details.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">5. Liability</h2>
              <p className="text-dark-400 leading-relaxed">
                Sri Mobiles exercises maximum care while handling your device. However, we recommend backing up your data before submitting your device for repair. We are not responsible for data loss during repairs. Our maximum liability is limited to the repair charges paid.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">6. Unclaimed Devices</h2>
              <p className="text-dark-400 leading-relaxed">
                Devices not collected within 30 days of repair completion notification will be considered abandoned. Sri Mobiles reserves the right to dispose of unclaimed devices after this period. You will receive multiple reminders before this action is taken.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">7. Payment Terms</h2>
              <p className="text-dark-400 leading-relaxed">
                Payment is due upon device collection. We accept Cash, UPI, Credit/Debit Cards, and Net Banking. For corporate clients, invoice-based billing with 15-day credit terms is available upon approval.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">8. Contact</h2>
              <p className="text-dark-400 leading-relaxed">
                For questions about these Terms, contact us at srimobiles.dsnr@gmail.com or visit our center at Chaitanyapuri, Hyderabad.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}