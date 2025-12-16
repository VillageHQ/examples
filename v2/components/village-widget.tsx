"use client";

import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { widgetVisibleAtom, widgetTokenAtom } from "@/lib/store/widget-atoms";
import {
  createWidgetUrl,
  createWidgetMessageListener,
  navigateWidget,
} from "@/lib/utils/iframe-messenger";
import { useAuth } from "@/contexts/auth-context";

export function VillageWidget() {
  const token = useAtomValue(widgetTokenAtom);
  const isVisible = useAtomValue(widgetVisibleAtom);
  const setVisible = useSetAtom(widgetVisibleAtom);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { refreshAuth } = useAuth();

  // Handle widget messages
  useEffect(() => {
    if (!token) return;

    const handler = createWidgetMessageListener({
      onCloseRequested: () => setVisible(false),
      onSyncInit: () => {
        refreshAuth();
      },
      onSyncComplete: () => {
        refreshAuth();
        setVisible(false);
      },
    });

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [token, setVisible, refreshAuth]);

  // Navigate to sync view when becoming visible
  useEffect(() => {
    if (isVisible && iframeRef.current) {
      navigateWidget(iframeRef.current, "sync");
    }
  }, [isVisible]);

  if (!token) return null;

  return (
    <iframe
      ref={iframeRef}
      src={createWidgetUrl(token)}
      className="fixed inset-0 z-[2147483647] h-full w-full border-0 bg-[rgba(0,0,0,0.24)]"
      style={{ display: isVisible ? "block" : "none", colorScheme: "light" }}
      title="Village Sync"
      allow="clipboard-write"
    />
  );
}
