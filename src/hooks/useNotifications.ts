"use client";

import { useCallback } from "react";
import { notifications } from "@mantine/notifications";

export function useNotifications() {
  const showSuccess = useCallback((message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);

    notifications.show({
      id,
      title: title || "Sucesso",
      message,
      color: "green",
      autoClose: 4000,
    });

    return id;
  }, []);

  const showError = useCallback((message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);

    notifications.show({
      id,
      title: title || "Erro",
      message,
      color: "red",
      autoClose: 6000,
    });

    return id;
  }, []);

  const showWarning = useCallback((message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);

    notifications.show({
      id,
      title: title || "Atenção",
      message,
      color: "orange",
      autoClose: 5000,
    });

    return id;
  }, []);

  const showInfo = useCallback((message: string, title?: string) => {
    const id = Math.random().toString(36).substr(2, 9);

    notifications.show({
      id,
      title: title || "Informação",
      message,
      color: "blue",
      autoClose: 4000,
    });

    return id;
  }, []);

  const hideNotification = useCallback((id: string) => {
    notifications.hide(id);
  }, []);

  const clearAll = useCallback(() => {
    notifications.clean();
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification,
    clearAll,
  };
}
