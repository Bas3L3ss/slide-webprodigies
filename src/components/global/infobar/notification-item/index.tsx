import { useNotificationsMutation } from "@/hooks/use-notifications";
import { Notification } from "@prisma/client";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import React from "react";

type Props = {
  notification: Notification;
};

const NotificationItem = ({ notification }: Props) => {
  const { deleteMutation, isDeleting, isMarking, markAsSeen } =
    useNotificationsMutation(notification.id);

  if (isDeleting) {
    return null; // Hide the notification while deleting
  }

  return (
    <div
      key={notification.id}
      className={`group relative flex flex-col gap-2 p-4 hover:bg-muted/50 transition-all duration-200 cursor-pointer ${
        !notification.isSeen ? "bg-muted border-l-2 border-primary" : ""
      } ${isMarking ? "opacity-50" : ""}`}
      onClick={() => {
        if (!notification.isSeen) {
          markAsSeen({ id: notification.id });
        }
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent onClick
          deleteMutation({ id: notification.id });
        }}
        className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="flex items-start justify-between gap-4">
        <p
          className={`text-sm ${
            !notification.isSeen
              ? "text-foreground font-medium"
              : "text-muted-foreground"
          }`}
        >
          {notification.content}
        </p>
        {!notification.isSeen && !isMarking && (
          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1 animate-pulse" />
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {format(new Date(notification.createdAt), "PPp")}
      </span>
    </div>
  );
};

export default NotificationItem;
