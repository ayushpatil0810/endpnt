'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IconAlertTriangle } from '@tabler/icons-react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallbackMessage?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center p-6 border border-red-500/20 bg-red-500/5 rounded-2xl gap-3 text-center min-h-[150px] w-full">
					<IconAlertTriangle size={24} className="text-red-500/70" />
					<p className="text-sm text-red-500/90 font-medium">
						{this.props.fallbackMessage || 'Failed to load content'}
					</p>
					<p className="text-xs text-muted-foreground/70 max-w-xs truncate">
						{this.state.error?.message}
					</p>
				</div>
			);
		}

		return this.props.children;
	}
}
