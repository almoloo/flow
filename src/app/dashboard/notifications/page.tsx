"use client";

import { useEffect, useState } from "react";
import { Notification } from "@/types";
import PageTitle from "@/components/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { authenticatedGet, authenticatedPut } from "@/lib/authenticatedFetch";
import { useToast } from "@/components/ui/use-toast";

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={`border-t border-x border-slate-200 p-4 first:rounded-t-lg last:border-b last:rounded-b-lg ${!notification.read ? "bg-slate-50" : ""}`}
    >
      <h3 className={`${!notification.read ? "font-semibold" : "font-normal"} `}>{notification.title}</h3>
      <p className="text-sm text-slate-600">{notification.message}</p>
      <p className="text-xs text-slate-400 mt-2">{new Date(notification.createdAt).toLocaleString()}</p>
    </div>
  );
}

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const res = await authenticatedGet("/api/notification");
        const data = (await res.json()) as Notification[];
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast({
          title: "Error",
          description: "There was an error fetching your notifications.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  useEffect(() => {
    async function markNotificationsAsRead() {
      try {
        await authenticatedPut("/api/notification", {});
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
    if (notifications.length > 0) {
      const unreadCount = notifications.filter((n) => !n.read).length;
      if (unreadCount > 0) {
        markNotificationsAsRead();
      }
    }
  }, [notifications]);

  return (
    <div>
      <PageTitle title="Notifications" />
      {isLoading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} className="h-16 w-full rounded-md" />
          ))}
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className="p-4 text-center text-slate-500">You have no notifications.</div>
      )}

      {!isLoading && notifications.length > 0 && (
        <div className="">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  );
}
