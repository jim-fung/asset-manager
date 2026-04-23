"use client";

import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container} role="alert">
          <div style={styles.card}>
            <h1 style={styles.title}>Er is iets misgegaan</h1>
            <p style={styles.message}>
              Er is een onverwachte fout opgetreden. Herlaad de pagina om het
              opnieuw te proberen.
            </p>
            <div style={styles.buttonGroup}>
              <button onClick={this.handleRetry} style={styles.secondaryButton}>
                Opnieuw proberen
              </button>
              <button onClick={this.handleReload} style={styles.button}>
                Herladen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: "#f9fafb",
    margin: 0,
    padding: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "48px 40px",
    maxWidth: "440px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    color: "#111827",
    margin: "0 0 12px 0",
  },
  message: {
    fontSize: "1rem",
    color: "#6b7280",
    lineHeight: 1.6,
    margin: "0 0 24px 0",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  button: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#ffffff",
    backgroundColor: "#2563eb",
    border: "none",
    borderRadius: "8px",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
  secondaryButton: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "#374151",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "10px 24px",
    cursor: "pointer",
    transition: "background-color 0.15s ease",
  },
};
