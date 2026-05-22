'use client';

import { useCallback } from 'react';
import { ProfileHeader } from '@/components/ProfileHeader';
import { useDashboardStore } from '@/lib/stores/dashboard-store-provider';
import { toast } from 'sonner';

export function ProfileTab() {
	const user = useDashboardStore((s) => s.user);
	const bio = useDashboardStore((s) => s.bio);
	const avatarUrl = useDashboardStore((s) => s.authUser.image ?? s.user.avatarUrl ?? null);
	const githubUsername = useDashboardStore((s) => s.githubUsername);
	const leetcodeUsername = useDashboardStore((s) => s.leetcodeUsername);
	const devtoUsername = useDashboardStore((s) => s.devtoUsername);
	const mediumUsername = useDashboardStore((s) => s.mediumUsername);
	const hashnodeUsername = useDashboardStore((s) => s.hashnodeUsername);

	const setBio = useDashboardStore((s) => s.setBio);
	const setGithubUsername = useDashboardStore((s) => s.setGithubUsername);
	const setLeetcodeUsername = useDashboardStore((s) => s.setLeetcodeUsername);
	const setDevtoUsername = useDashboardStore((s) => s.setDevtoUsername);
	const setMediumUsername = useDashboardStore((s) => s.setMediumUsername);
	const setHashnodeUsername = useDashboardStore((s) => s.setHashnodeUsername);

	const handleIntegrationSave = useCallback(async () => {
		try {
			const res = await fetch('/api/profile', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					githubUsername,
					leetcodeUsername,
					devtoUsername,
					mediumUsername,
					hashnodeUsername,
				}),
			});
			if (!res.ok) throw new Error('Failed to save profile');
			toast.success('Integrations updated!');
		} catch {
			toast.error('Failed to update integrations');
		}
	}, [githubUsername, leetcodeUsername, devtoUsername, mediumUsername, hashnodeUsername]);

	const labelClass = 'text-[10px] uppercase font-mono tracking-widest text-muted-foreground ml-1';
	const inputClass =
		'w-full bg-card/20 border border-border/60 hover:border-foreground/40 rounded-md px-4 py-3 text-sm focus:border-foreground focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/30 normal-case';

	return (
		<div className="flex flex-col gap-10">
			<div>
				<h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>
				<ProfileHeader
					username={user.username}
					bio={bio}
					avatarUrl={avatarUrl}
					onBioUpdate={setBio}
				/>
			</div>

			<div className="border-t border-border/40 pt-8">
				<h2 className="text-lg font-semibold text-foreground mb-6">Developer Integrations</h2>
				<div className="flex flex-col gap-5 max-w-xl">
					<div className="flex flex-col gap-2">
						<label className={labelClass}>GitHub Username</label>
						<input
							value={githubUsername}
							onChange={(e) => setGithubUsername(e.target.value)}
							placeholder="e.g. torvalds"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className={labelClass}>LeetCode Username</label>
						<input
							value={leetcodeUsername}
							onChange={(e) => setLeetcodeUsername(e.target.value)}
							placeholder="e.g. neetcode"
							className={inputClass}
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label className={labelClass}>Dev.to Username</label>
						<input
							value={devtoUsername}
							onChange={(e) => setDevtoUsername(e.target.value)}
							placeholder="e.g. ben"
							className={inputClass}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<label className={labelClass}>Medium</label>
							<input
								value={mediumUsername}
								onChange={(e) => setMediumUsername(e.target.value)}
								placeholder="e.g. jdoe"
								className={inputClass}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className={labelClass}>Hashnode</label>
							<input
								value={hashnodeUsername}
								onChange={(e) => setHashnodeUsername(e.target.value)}
								placeholder="e.g. jdoe"
								className={inputClass}
							/>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<button
						onClick={handleIntegrationSave}
						className="bg-foreground text-background px-6 py-2.5 rounded-md text-[10px] uppercase tracking-widest font-medium transition-colors hover:bg-foreground/90"
					>
						Save Integrations
					</button>
				</div>
			</div>
		</div>
	);
}
