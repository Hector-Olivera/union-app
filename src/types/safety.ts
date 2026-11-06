export type ReportReason = 'spam' | 'inappropriate' | 'harassment' | 'fraud' | 'other';
export type ReportTargetType = 'store' | 'user' | 'conversation';

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam o publicidad no deseada',
  inappropriate: 'Contenido inapropiado u ofensivo',
  harassment: 'Acoso o amenazas',
  fraud: 'Estafa o fraude',
  other: 'Otro motivo',
};

export type BlockedUser = {
  blockedId: string;
  blockedName: string;
  blockedAvatarUrl?: string;
};