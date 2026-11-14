import { useEffect, useState } from "react";

/** False during SSR and the first client render, true after hydration. */
export function useIsClient() {
  const [client, setClient] = useState(false);
  useEffect(() => setClient(true), []);
  return client;
}
