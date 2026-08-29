import * as React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { safeStorage } from '../utils/safeStorage';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      safeStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0e0d0b] text-[#f3efe6] flex items-center justify-center p-6 font-mono">
          <div className="max-w-lg w-full bg-[#161512] border border-[#f3efe6]/20 p-8 rounded-xl shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h1 className="text-lg font-bold uppercase tracking-wider text-[#f3efe6]">
                  Master OS Recovery System
                </h1>
                <p className="text-xs text-[#f3efe6]/60 tracking-widest uppercase">
                  Runtime Exception Intercepted
                </p>
              </div>
            </div>

            <div className="bg-[#0e0d0b] p-4 rounded border border-[#f3efe6]/10 text-xs space-y-2 overflow-x-auto text-[#f3efe6]/80 max-h-48">
              <p className="font-semibold text-rose-400">
                {this.state.error?.name || 'Error'}: {this.state.error?.message || 'Unknown runtime error'}
              </p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-[#f3efe6]/40 leading-relaxed font-mono">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            <p className="text-xs text-[#f3efe6]/60 leading-relaxed">
              The application encountered an unexpected runtime state. You can reload the current view or reset local cache to restore standard operations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#f3efe6] text-[#0e0d0b] font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#201e1a] text-[#f3efe6] border border-[#f3efe6]/20 font-bold text-xs uppercase tracking-wider rounded-lg hover:border-[#f3efe6]/50 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
