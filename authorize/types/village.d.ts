declare global {
  interface Window {
    Village: {
      init: (publicKey: string) => void;
      authorize: (
        token: string,
        domain?: string,
        refreshCallback?: () => Promise<string | null>
      ) => Promise<{
        ok: boolean;
        status: 'authorized' | 'unauthorized';
        reason?: string;
        domain?: string;
        expiresAt?: number;
      }>;
      startAutopilot: (config?: {
        initialQuery?: string;
        criteria?: string[];
        onResultClick?: (result: any) => void;
        onComplete?: (data: any) => void;
        onClose?: () => void;
      }) => void;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
      _isAuthorized?: boolean;
      loaded?: boolean;
    };
  }
}

export {};