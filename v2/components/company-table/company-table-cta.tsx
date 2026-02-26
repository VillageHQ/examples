"use client";

import { useState, useCallback } from "react";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Facepile } from "@/components/ui/facepile";
import { UpsellModal } from "@/components/modals/upsell-modal";
import { PathsModal } from "@/components/modals/paths-modal";
import { useAuth } from "@/contexts/auth-context";
import { useCompanyPaths } from "@/hooks/use-company-paths";
import { useCompanyPathsCheck } from "@/hooks/use-company-paths-check";
import { widgetVisibleAtom } from "@/lib/store/widget-atoms";

type ModalState =
  | { type: "closed" }
  | { type: "upsell" }
  | { type: "paths" };

interface CompanyTableCtaProps {
  companyName: string;
  domain: string;
}

export function CompanyTableCta({ companyName, domain }: CompanyTableCtaProps) {
  const { isActiveCustomer, userNeedsSync } = useAuth();
  const setWidgetVisible = useSetAtom(widgetVisibleAtom);
  const [modalState, setModalState] = useState<ModalState>({ type: "closed" });

  const isPathsModalOpen = modalState.type === "paths";

  const {
    targetPeople,
    totalCount,
    company,
    summary,
    isLoading,
    error,
    hasNextPage,
    isLoadingMore,
    loadMore,
    refetch,
  } = useCompanyPaths(domain, { enabled: isPathsModalOpen });

  const shouldCheckPaths = isActiveCustomer && !userNeedsSync;
  const pathsCheck = useCompanyPathsCheck(domain, {
    enabled: shouldCheckPaths,
  });

  const handleClick = useCallback(() => {
    if (!isActiveCustomer) {
      setModalState({ type: "upsell" });
      return;
    }

    if (userNeedsSync) {
      setWidgetVisible(true);
      return;
    }

    setModalState({ type: "paths" });
  }, [isActiveCustomer, userNeedsSync, setWidgetVisible]);

  const handleCloseModal = useCallback(() => {
    setModalState({ type: "closed" });
  }, []);

  const handleRetryPaths = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  const hasPaths = pathsCheck.data?.has_paths ?? false;
  const pathsCount = pathsCheck.data?.count ?? 0;
  const avatars = pathsCheck.data?.avatars ?? [];

  const renderButtonContent = () => {
    if (!isActiveCustomer) {
      return "Find paths";
    }

    if (userNeedsSync) {
      return "Connect network";
    }

    if (hasPaths && avatars.length > 0) {
      return (
        <span className="flex items-center gap-2">
          <Facepile avatars={avatars} count={pathsCount} maxVisible={3} />
          <span>
            {pathsCount} {pathsCount === 1 ? "path" : "paths"}
          </span>
        </span>
      );
    }

    return "Find paths";
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={isActiveCustomer ? "primary" : "secondary"}
        size="sm"
        isLoading={isPathsModalOpen && isLoading}
      >
        {renderButtonContent()}
      </Button>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={modalState.type === "upsell"}
        onClose={handleCloseModal}
      />

      {/* Paths Modal */}
      <PathsModal
        isOpen={isPathsModalOpen}
        onClose={handleCloseModal}
        companyName={companyName}
        isLoading={isLoading}
        error={error}
        company={company}
        summary={summary}
        targetPeople={targetPeople}
        totalCount={totalCount}
        hasNextPage={hasNextPage ?? false}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
        onRetry={handleRetryPaths}
      />
    </>
  );
}
