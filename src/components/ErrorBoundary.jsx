import { Component } from "react";

// Class component required for React error boundaries
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("SceneForge runtime error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
          <div className="max-w-lg w-full space-y-6 text-center">
            <div className="text-6xl font-black text-amber-400">SF</div>
            <h1 className="text-2xl font-bold text-white">Noe gikk galt</h1>
            <p className="text-slate-400 text-sm">
              Et uventet feil oppstod. Last siden pa nytt for a prove igjen.
            </p>
            {this.state.error?.message && (
              <pre className="text-xs text-slate-500 text-left bg-slate-900 border border-slate-800 rounded-lg p-4 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-amber-400 text-slate-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-amber-300 transition-colors"
            >
              Last pa nytt
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
