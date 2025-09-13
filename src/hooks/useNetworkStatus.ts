import React, { useState, useEffect } from 'react';

/**
 * Custom hook to track the online/offline status of the browser.
 * It listens to 'online' and 'offline' events and provides a reactive
 * boolean indicating the current network status.
 *
 * returns {boolean} True if the browser is online, false otherwise.
 */


export const useNetworkStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Handler for when the browser comes online
    const handleOnline = () => setIsOnline(true);
    // Handler for when the browser goes offline
    const handleOffline = () => setIsOnline(false);

    // Add event listeners for network status changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup: Remove event listeners when the component unmounts
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return isOnline;
};