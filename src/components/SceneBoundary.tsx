import { Component, type ReactNode } from 'react';

interface Props { onError: () => void; children: ReactNode }
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: unknown) {
    console.warn('3D scene failed, using CSS starfield fallback:', error);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}
