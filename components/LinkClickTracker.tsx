'use client';

interface LinkClickTrackerProps {
	linkId: string;
}

export function LinkClickTracker({ linkId }: LinkClickTrackerProps) {
	return (
		<div
			className="absolute inset-0 z-10"
			onClick={() => {
				fetch(`/api/links/${linkId}/click`, { method: 'POST' }).catch(() => {});
			}}
			aria-hidden="true"
		/>
	);
}
