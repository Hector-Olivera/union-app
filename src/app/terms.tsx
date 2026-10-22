import { LegalScreen } from '@features/legal/components/LegalScreen';
import { getTermsDocument } from '@features/legal/content';

export default function TermsRoute() {
  return <LegalScreen content={getTermsDocument()} />;
}