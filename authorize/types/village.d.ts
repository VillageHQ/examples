declare global {
  interface Window {
    Village: {
      identify: (id: string) => void;
      authorize: (token: string) => void;
      startAutopilot: (config?: {
        initialQuery?: string;
        criteria?: string[];
        onResultClick?: (result: any) => void;
        onComplete?: (data: any) => void;
        onClose?: () => void;
      }) => void;
      on: (event: string, callback: Function) => void;
      off: (event: string, callback: Function) => void;
    };
  }
}

export {};
