import { LegalScreen } from '@features/legal/components/LegalScreen';
import { getDataDeletionDocument } from '@features/legal/content';

export default function DataDeletionRoute() {
  return <LegalScreen content={getDataDeletionDocument()} />;
}