import React from 'react';
import { useMediaContext } from '../../src';

export const Volume = () => {
  const { muted, setMuted } = useMediaContext();
  const toggleMuted = () => setMuted(!muted);
  return <button onClick={toggleMuted}>Toggle Muted</button>;
};
