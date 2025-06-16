import type { GlobalProvider } from "@ladle/react";
import React from "react";
import "~/globals.css";

export const Provider: GlobalProvider = ({ children }) => {
  return <>{children}</>;
};
