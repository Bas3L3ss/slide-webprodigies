"use client";

import { Input } from "@/components/ui/input";
import { useKeywords } from "@/hooks/use-automations";
import { useMutationDataState } from "@/hooks/use-mutation-data";
import { useQueryAutomation } from "@/hooks/user-queries";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import React from "react";
import { useEditKeyword } from "@/hooks/use-keyword";

type Props = {
  id: string;
};

export const Keywords = ({ id }: Props) => {
  const { onValueChange, keyword, onKeyPress, deleteMutation } =
    useKeywords(id);
  const { latestVariable } = useMutationDataState(["add-keyword"]);
  const { latestVariable: latesDeleteVariable } = useMutationDataState([
    "delete-keyword",
  ]);
  const { data } = useQueryAutomation(id);

  return (
    <div className="bg-background-80 flex flex-col gap-y-3 p-3 rounded-xl">
      <div className="flex flex-wrap justify-start gap-2 items-center">
        {data?.data?.keywords &&
          data?.data?.keywords.length > 0 &&
          data?.data?.keywords.map(
            (word) =>
              word.id !== latestVariable?.variables?.id && (
                <KeywordItem
                  key={word.id}
                  word={word}
                  automationId={id}
                  isDeleting={latesDeleteVariable?.variables?.id === word.id}
                  onDelete={() => deleteMutation({ id: word.id })}
                />
              )
          )}
        {latestVariable && latestVariable.status === "pending" && (
          <div className="cursor-progress relative bg-background-90 flex items-center gap-x-2   text-text-secondary py-1 px-4 rounded-full">
            <div className="absolute inset-0 bg-gray-500 opacity-50 rounded-full" />
            <p>{latestVariable.variables.keyword}</p>
            <span className="text-white rounded-full">
              <Loader2 size={12} className="animate-spin" />
            </span>
          </div>
        )}
        <Input
          placeholder="Add keyword..."
          style={{
            width: Math.min(Math.max(keyword.length || 10, 2), 50) + "ch",
          }}
          value={keyword}
          className="p-0 bg-transparent ring-0 border-none outline-none"
          onChange={onValueChange}
          onKeyUp={onKeyPress}
        />
      </div>
    </div>
  );
};

interface KeywordItemProps {
  word: {
    id: string;
    word: string;
  };
  automationId: string;
  isDeleting: boolean;
  onDelete: () => void;
}

const KeywordItem = ({
  word,
  automationId,
  isDeleting,
  onDelete,
}: KeywordItemProps) => {
  const { EditContainer, isPending } = useEditKeyword(
    automationId,
    word.id,
    word.word
  );

  return (
    <div
      className={cn(
        "group bg-background-90 flex items-center gap-x-2   text-text-secondary py-1 px-4 rounded-full relative",
        isDeleting && "hidden",
        isPending && "opacity-50"
      )}
    >
      <EditContainer>
        <p>{word.word}</p>
      </EditContainer>
      <button
        className="group-hover:opacity-100 opacity-0 absolute top-0 right-0 rounded-full bg-red-500"
        onClick={onDelete}
        disabled={isPending}
      >
        <X className="text-white" size={12} />
      </button>
    </div>
  );
};

export default Keywords;
