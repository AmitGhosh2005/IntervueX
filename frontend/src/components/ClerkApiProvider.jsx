import { useAuth } from "@clerk/react";
import { setClerkTokenGetter } from "../lib/axios";

export default function ClerkApiProvider({ children }) {
  const { getToken, isLoaded } = useAuth();

  if (!isLoaded) return null;

  setClerkTokenGetter(getToken);

  return children;
}
