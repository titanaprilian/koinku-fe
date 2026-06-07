import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyRole } from '../api';
import type { MyRolePermission } from '../types';
import { Loader2 } from 'lucide-react';

interface RbacContextValue {
  roleName?: string;
  permissions: MyRolePermission[];
  hasPermission: (featureName: string, action?: keyof Omit<MyRolePermission, 'featureId' | 'featureName'>) => boolean;
}

const RbacContext = createContext<RbacContextValue | null>(null);

export function RbacProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['myRole'],
    queryFn: getMyRole,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const roleData = data?.data;

  const hasPermission: RbacContextValue['hasPermission'] = (featureName, action = 'canRead') => {
    if (!roleData) return false;
    const perm = roleData.permissions.find(
      (p) => 
        p.featureName.toLowerCase() === featureName.toLowerCase() || 
        p.featureId.toLowerCase() === featureName.toLowerCase()
    );
    return perm ? Boolean(perm[action]) : false;
  };

  return (
    <RbacContext.Provider value={{ 
      roleName: roleData?.roleName, 
      permissions: roleData?.permissions || [], 
      hasPermission 
    }}>
      {children}
    </RbacContext.Provider>
  );
}

export function useRbac() {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
}
