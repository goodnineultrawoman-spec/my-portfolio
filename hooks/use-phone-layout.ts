'use client';

import { useEffect, useState } from 'react';

// Matches the existing homepage opening breakpoint; desktop stays unchanged.
export function usePhoneLayout() {
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 700px)');
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return phone;
}
