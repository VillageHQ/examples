"use client";

import { useState, useCallback } from "react";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { UpsellModal } from "@/components/modals/upsell-modal";
import { PathsModal } from "@/components/modals/paths-modal";
import { useAuth } from "@/contexts/auth-context";
import { useCompanyPaths } from "@/hooks/use-company-paths";
import { widgetVisibleAtom } from "@/lib/store/widget-atoms";
import type { VillageCompanyPathsResponse } from "@/lib/types/village-api.types";

type ModalState =
  | { type: "closed" }
  | { type: "upsell" }
  | { type: "paths"; data?: VillageCompanyPathsResponse };

interface CompanyTableCtaProps {
  companyName: string;
  domain: string;
}

export function CompanyTableCta({ companyName, domain }: CompanyTableCtaProps) {
  const { isActiveCustomer, userNeedsSync } = useAuth();
  const setWidgetVisible = useSetAtom(widgetVisibleAtom);
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  const companyPathsMutation = useCompanyPaths({
    onSuccess: (data) => {
      setModalState({ type: "paths", data });
    },
    onError: (error) => {
      console.error("Failed to fetch paths:", error);
    },
  });

  const handleClick = useCallback(() => {
    // State 1: Not an active customer → show upsell
    if (!isActiveCustomer) {
      setModalState({ type: "upsell" });
      return;
    }

    // State 2: Has token but user doesn't exist in Village → show sync widget
    if (userNeedsSync) {
      setWidgetVisible(true);
      return;
    }

    // State 3: User exists → fetch and show paths
    setModalState({ type: "paths" });
    companyPathsMutation.mutate(domain);
  }, [isActiveCustomer, userNeedsSync, domain, companyPathsMutation, setWidgetVisible]);

  const handleCloseModal = useCallback(() => {
    setModalState({ type: "closed" });
  }, []);

  const handleRetryPaths = useCallback(() => {
    companyPathsMutation.mutate(domain);
  }, [domain, companyPathsMutation]);

  // Determine button text based on state
  const getButtonText = () => {
    if (!isActiveCustomer) return "Find paths";
    if (userNeedsSync) return "Connect network";
    return "Find paths";
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isActiveCustomer ? "primary" : "secondary"}
        size="sm"
        isLoading={
          modalState.type === "paths" && companyPathsMutation.isPending
        }
      >
        {getButtonText()}
      </Button>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={modalState.type === "upsell"}
        onClose={handleCloseModal}
      />

      {/* Paths Modal */}
      <PathsModal
        isOpen={modalState.type === "paths"}
        onClose={handleCloseModal}
        companyName={companyName}
        isLoading={companyPathsMutation.isPending}
        error={companyPathsMutation.error}
        data={modalState.type === "paths" ? modalState.data : undefined}
        onRetry={handleRetryPaths}
      />
    </>
  );
}
