/* eslint-disable react-refresh/only-export-components */
import { ReactNode, createContext, useContext, useState } from "react";

export interface Error {
  showError: (message?: string) => void;
  error?: string;
}

const ErrorContext = createContext<Error | undefined>(undefined);

const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within a ErrorProvider");
  }
  return context;
};

const ErrorProvider = ({ children }: { children?: ReactNode }) => {
  const [error, setError] = useState<string | undefined>();

  return (
    <ErrorContext.Provider value={{ error, showError: setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorProvider, useError };
