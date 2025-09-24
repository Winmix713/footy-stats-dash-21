import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Hibakezelő komponens, amely elkapja a gyermek komponensekben keletkező hibákat
 * és egy fallback UI-t jelenít meg helyettük.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Frissíti az állapotot, hogy a következő renderelés a fallback UI-t jelenítse meg
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Hiba naplózása
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Egyedi fallback UI renderelése
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error);
      }
      
      // Alapértelmezett fallback UI
      return (
        <div className="p-4 text-red-700 bg-red-100 rounded-md border border-red-300">
          <h3 className="font-semibold mb-1">Hiba történt</h3>
          <p>{this.state.error?.message || 'Ismeretlen hiba'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}
