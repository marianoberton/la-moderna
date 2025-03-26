'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  // No hacemos nada con el tema, siempre será 'light'
  useTheme();
  
  // No renderizamos nada
  return null;
} 