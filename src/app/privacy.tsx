import { LegalScreen } from '@features/legal/components/LegalScreen';
import { getPrivacyDocument } from '@features/legal/content';

export default function PrivacyRoute() {
  return <LegalScreen content={getPrivacyDocument()} />;
}