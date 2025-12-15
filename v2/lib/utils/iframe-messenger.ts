// Village Widget iframe communication utilities
// Mirrors the postMessage API from frontend-web

const VILLAGE_APP_URL =
  process.env.NEXT_PUBLIC_VILLAGE_APP_URL ?? "https://village.do";

// Widget events (from widget to parent)
export const WidgetEvents = {
  READY: "village:ready",
  CLOSE_REQUESTED: "village:close-requested",
  ERROR: "village:error",
  VIEW_CHANGED: "village:view.changed",
} as const;

// Widget commands (from parent to widget)
export const WidgetCommands = {
  NAVIGATE: "village:navigate",
  CLOSE: "village:close",
} as const;

// Message types
export interface VillageMessage<T = unknown> {
  type: string;
  payload?: T;
}

export interface ReadyPayload {
  version: string;
}

export interface CloseRequestedPayload {
  reason: "overlay_click" | "escape_key" | "user_action";
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ViewChangedPayload {
  view: string;
  previous?: string;
}

// Create widget URL with token
export function createWidgetUrl(token: string): string {
  return `${VILLAGE_APP_URL}/widget/v2?token=${encodeURIComponent(token)}`;
}

// Send command to widget iframe
export function sendWidgetCommand(
  iframe: HTMLIFrameElement,
  type: string,
  payload?: Record<string, unknown>
): void {
  if (!iframe.contentWindow) {
    console.warn("[Village] Cannot send command: iframe contentWindow is null");
    return;
  }

  const message: VillageMessage = { type, payload };
  iframe.contentWindow.postMessage(message, VILLAGE_APP_URL);
}

// Navigate widget to a specific view
export function navigateWidget(
  iframe: HTMLIFrameElement,
  view: string
): void {
  sendWidgetCommand(iframe, WidgetCommands.NAVIGATE, { view });
}

// Close widget
export function closeWidget(iframe: HTMLIFrameElement): void {
  sendWidgetCommand(iframe, WidgetCommands.CLOSE);
}

// Message handler options
export interface WidgetMessageHandlers {
  onReady?: (payload: ReadyPayload) => void;
  onCloseRequested?: (payload: CloseRequestedPayload) => void;
  onError?: (payload: ErrorPayload) => void;
  onViewChanged?: (payload: ViewChangedPayload) => void;
}

// Create a message listener for widget events
export function createWidgetMessageListener(
  handlers: WidgetMessageHandlers
): (event: MessageEvent) => void {
  return (event: MessageEvent) => {
    // Validate origin
    if (event.origin !== VILLAGE_APP_URL) {
      return;
    }

    const message = event.data as VillageMessage | undefined;
    if (!message || typeof message.type !== "string") {
      return;
    }

    switch (message.type) {
      case WidgetEvents.READY:
        handlers.onReady?.(message.payload as ReadyPayload);
        break;
      case WidgetEvents.CLOSE_REQUESTED:
        handlers.onCloseRequested?.(message.payload as CloseRequestedPayload);
        break;
      case WidgetEvents.ERROR:
        handlers.onError?.(message.payload as ErrorPayload);
        break;
      case WidgetEvents.VIEW_CHANGED:
        handlers.onViewChanged?.(message.payload as ViewChangedPayload);
        break;
    }
  };
}
