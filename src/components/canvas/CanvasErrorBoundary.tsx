"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * WebGL can be missing or blocked (old devices, privacy settings, GPU blacklist).
 * The 3D layer is decorative: if it throws, we drop it and keep the site usable.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (process.env.NODE_ENV !== "production") console.warn("[canvas] disabled:", error, info);
  }

  override render(): ReactNode {
    return this.state.hasError ? null : this.props.children;
  }
}
