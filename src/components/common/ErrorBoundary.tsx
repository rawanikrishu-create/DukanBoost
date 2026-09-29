import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('DukaanBoost Caught Render Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Something went wrong</h2>
              <p className="text-xs text-slate-500 mt-1">
                An unexpected display issue occurred. Your dukaan data is completely safe.
              </p>
            </div>
            {this.state.error && (
              <div className="text-left text-xs bg-slate-100 p-3 rounded-lg text-slate-700 font-mono overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Dukaan</span>
              </button>
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch (e) {
                    console.warn(e);
                  }
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Reset to Clean Demo Store
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
