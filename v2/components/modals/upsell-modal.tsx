"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpsellModal({ isOpen, onClose }: UpsellModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade Required" size="sm">
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        {/* Lock icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <p className="text-lg font-medium text-zinc-900 dark:text-white">
            This feature requires an active subscription
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Upgrade your plan to discover your connections to any company.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Maybe later
          </Button>
          <Button
            onClick={() => {
              // In production, this would link to your pricing page
              window.open("https://village.do/pricing", "_blank");
            }}
          >
            View plans
          </Button>
        </div>
      </div>
    </Modal>
  );
}
