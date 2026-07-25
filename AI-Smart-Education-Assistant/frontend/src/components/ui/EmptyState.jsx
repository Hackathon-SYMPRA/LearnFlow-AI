import React from "react";
import { Frown, PackageOpen } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/utils/format";

export const EmptyState = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-8 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
        {icon ?? <PackageOpen className="h-8 w-8" aria-hidden="true" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="mt-6 flex items-center gap-3">
          {action && (
            <Button
              variant={action.variant ?? "primary"}
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="ghost" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export const NoDocuments = ({ onUpload }) => (
  <EmptyState
    icon={<PackageOpen className="h-8 w-8" />}
    title="No documents uploaded"
    description="Upload your study materials like PDFs, notes, and documents to get started with AI-powered learning."
    action={{ label: "Upload Document", onClick: onUpload, variant: "primary" }}
  />
);

export const NoChatHistory = ({ onStartChat }) => (
  <EmptyState
    icon={<Frown className="h-8 w-8" />}
    title="No chat history yet"
    description="Start a conversation with AI to ask questions about your study materials."
    action={{ label: "Start a Chat", onClick: onStartChat, variant: "primary" }}
  />
);

export const NoQuizHistory = ({ onGenerate }) => (
  <EmptyState
    icon={<Frown className="h-8 w-8" />}
    title="No quiz history"
    description="Generate a quiz from your documents to test your knowledge and track your progress."
    action={{ label: "Generate Quiz", onClick: onGenerate, variant: "primary" }}
  />
);

export const NoFlashcards = ({ onGenerate }) => (
  <EmptyState
    icon={<Frown className="h-8 w-8" />}
    title="No flashcards available"
    description="Generate flashcards from your documents for efficient spaced repetition learning."
    action={{
      label: "Generate Flashcards",
      onClick: onGenerate,
      variant: "primary",
    }}
  />
);

export const NoSearchResults = ({ query }) => (
  <EmptyState
    icon={<Frown className="h-8 w-8" />}
    title={`No results for "${query}"`}
    description="Try using different keywords or check your spelling and try again."
  />
);
