declare global {
  interface Window {
    Village: {
      // Legacy method - identify with user reference and optional details
      identify: (userReference: string, details?: {
        email?: string;
        name?: string;
        team?: {
          id: string;
          name: string;
        };
      }) => Promise<void>;

      // Authorization - currently aliased to identify in SDK
      // Overloaded to support both legacy and potential future signatures
      authorize: {
        // Legacy signature (current SDK implementation via identify alias)
        (userReference: string, details?: {
          email?: string;
          name?: string;
          team?: {
            id: string;
            name: string;
          };
        }): Promise<void>;

        // Future token-based signature (not yet implemented in SDK)
        (token: string, domain?: string, refreshCallback?: () => Promise<string>): Promise<{
          ok: boolean;
          status: string;
          reason?: string;
          domain?: string;
        }>;
      };

      // Autopilot feature
      startAutopilot?: (config?: {
        initialQuery?: string;
        criteria?: string[];
        onResultClick?: (result: any) => void;
        onComplete?: (data: any) => void;
        onClose?: () => void;
      }) => void;

      // Event handling
      on: (event: string, callback: (data: any) => void) => void;
      off: (event: string, callback: (data: any) => void) => void;
      emit?: (event: string, data: any) => void;
      broadcast?: (event: string, data: any) => void;

      // Widget initialization
      init?: (publicKey: string, options?: {
        paths_cta?: Array<{
          label: string;
          callback: (...args: any[]) => void;
          style?: React.CSSProperties;
        }>;
      }) => void;

      // Internal properties
      loaded?: boolean;
      q?: any[];
    };
  }
}

export {};
