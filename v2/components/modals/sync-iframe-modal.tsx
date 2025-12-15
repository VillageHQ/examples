"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  createWidgetUrl,
  createWidgetMessageListener,
  navigateWidget,
  WidgetEvents,
} from "@/lib/utils/iframe-messenger";
import type { ErrorPayload } from "@/lib/utils/iframe-messenger";

const VILLAGE_APP_URL =
  process.env.NEXT_PUBLIC_VILLAGE_APP_URL ?? "https://village.do";

interface SyncIframeModalProps {
  isOpen: boolean;
  token: string;
  onClose: () => void;
  onSyncComplete: () => void;
  onError?: (error: ErrorPayload) => void;
}

export function SyncIframeModal({
  isOpen,
  token,
  onClose,
  onSyncComplete,
  onError,
}: SyncIframeModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetUrl = createWidgetUrl(token);

  // Handle widget messages
  const handleReady = useCallback(() => {
    console.log("[Village] Widget ready, navigating to sync view");
    if (iframeRef.current) {
      navigateWidget(iframeRef.current, "sync");
    }
  }, []);

  const handleCloseRequested = useCallback(() => {
    console.log("[Village] Close requested");
    onClose();
  }, [onClose]);

  const handleError = useCallback(
    (error: ErrorPayload) => {
      console.error("[Village] Widget error:", error.code, error.message);
      onError?.(error);
    },
    [onError]
  );

  const handleViewChanged = useCallback(
    (payload: { view: string; previous?: string }) => {
      console.log("[Village] View changed:", payload.view);
      // If user completed sync and navigated away, trigger sync complete
      if (payload.previous === "sync" && payload.view !== "sync") {
        onSyncComplete();
      }
    },
    [onSyncComplete]
  );

  // Set up message listener
  useEffect(() => {
    if (!isOpen) return;

    const messageHandler = createWidgetMessageListener({
      onReady: handleReady,
      onCloseRequested: handleCloseRequested,
      onError: handleError,
      onViewChanged: handleViewChanged,
    });

    window.addEventListener("message", messageHandler);
    return () => window.removeEventListener("message", messageHandler);
  }, [
    isOpen,
    handleReady,
    handleCloseRequested,
    handleError,
    handleViewChanged,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <iframe
      ref={iframeRef}
      src={widgetUrl}
      className="fixed inset-0 z-[2147483647] h-full w-full border-0 bg-[rgba(0,0,0,0.24)]"
      style={{ colorScheme: "light" }}
      title="Village Sync"
      allow="clipboard-write"
    />
  );
}
