import React, { createContext, useContext, useState } from "react";

type NavigationState = {
  level: "list" | "department" | "locality" | "neighborhood";
  data: any;
};

type NavigationContextType = {
  current: NavigationState;
  previous: NavigationState[];
  navigate: (newState: NavigationState) => void;
  goBack: () => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

export const NavigationProvider = ({ children }: any) => {
  const [current, setCurrent] = useState<NavigationState>({
    level: "list",
    data: {},
  });
  const [previous, setPrevious] = useState<NavigationState[]>([]);

  const navigate = (newState: NavigationState) => {
    setPrevious((prev) => [...prev, current]);
    setCurrent(newState);
  };

  const goBack = () => {
    setPrevious((prev) => {
      const last = prev.pop();
      if (last) {
        setCurrent(last);
      }
      return [...prev];
    });
  };

  return (
    <NavigationContext.Provider value={{ current, previous, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};
