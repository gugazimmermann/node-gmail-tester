declare module "node-gmail-tester" {
  export interface Email {
    from: string;
    receiver: string;
    subject: string;
    date: Date;
    body?: {
      html: string;
      text: string;
    };
    attachments?: {
      attachmentId?: string | null;
      data?: string | null;
      size?: number | null;
    }
  }

  export interface CheckInboxOptions {
    subject?: string;
    from?: string;
    to?: string;
    includeBody?: boolean;
    includeAttachments?: boolean;
    before?: Date;
    after?: Date;
    label?: string;
    waitTimeSec?: number;
    maxWaitTimeSec?: number;
  }

  export function checkInbox(options: CheckInboxOptions): Promise<Email[]>;

  export function refreshToken(): Promise<void>;
}