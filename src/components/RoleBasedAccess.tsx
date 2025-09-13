
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';

interface RoleBasedAccessProps {
  allowedRoles: ('owner' | 'worker')[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const RoleBasedAccess = ({ allowedRoles, children, fallback }: RoleBasedAccessProps) => {
  const { data: userRole, isLoading } = useUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="w-4 h-4 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!userRole || !allowedRoles.includes(userRole as 'owner' | 'worker')) {
    return fallback || (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          You don't have permission to access this feature.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedAccess;
