import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--macaron-yellow))] p-4 text-center">
                    <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border-4 border-[hsl(var(--macaron-red))] max-w-md w-full">
                        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>

                        <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            哎呀！發生了一點問題
                        </h1>

                        <p className="text-gray-600 mb-6">
                            好像有什麼東西壞掉了，請嘗試重新整理頁面。
                        </p>

                        <Button
                            onClick={this.handleReload}
                            className="w-full bg-[hsl(var(--macaron-blue))] hover:bg-[hsl(var(--macaron-blue-dark))] text-white font-bold py-6 rounded-xl text-lg flex items-center justify-center gap-2 mb-4"
                        >
                            <RotateCw className="w-5 h-5" />
                            重新整理
                        </Button>

                        <div className="text-left mt-4 border-t pt-4">
                            <p className="text-xs text-gray-500 font-mono break-all mb-2">
                                錯誤訊息 (回報給管理員):
                            </p>
                            <div className="bg-gray-100 p-2 rounded text-xs font-mono text-red-600 overflow-auto max-h-32">
                                {this.state.error && this.state.error.toString()}
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
