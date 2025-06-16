import type { GlobalProvider } from "@ladle/react";
import "~/globals.css";

export const Provider: GlobalProvider = ({ children }) => {
  return <>{children}</>;
};
