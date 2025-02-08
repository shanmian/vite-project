import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationDataContextType {
  sharedData: Record<string, any>;
  updateData: (key: string, value: any) => void;
  clearData: () => void;
}

const NavigationDataContext = createContext<NavigationDataContextType>({
  sharedData: {},
  updateData: () => {},
  clearData: () => {},
});

export const NavigationDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sharedData, setSharedData] = useState<Record<string, any>>({});

  const updateData = (key: string, value: any) => {
    setSharedData(prev => ({ ...prev, [key]: value }));
  };

  const clearData = () => {
    setSharedData({});
  };

  return (
    <NavigationDataContext.Provider value={{ sharedData, updateData, clearData }}>
      {children}
    </NavigationDataContext.Provider>
  );
};

export const useNavigationData = () => useContext(NavigationDataContext);