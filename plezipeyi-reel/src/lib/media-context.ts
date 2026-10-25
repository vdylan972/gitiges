import { createContext, useContext } from 'react';

/** Durées (s) des rushes présents, mesurées dans calculateMetadata. */
export const MediaDurationsContext = createContext<Record<string, number>>({});

export const useSourceDuration = (src: string): number | undefined => useContext(MediaDurationsContext)[src];
