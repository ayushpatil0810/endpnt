'use client';

import { useEffect, useRef, useState } from 'react';
import { IconX, IconDownload, IconShare } from '@tabler/icons-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface ShareModalProps {
	isOpen: boolean;
	onClose: () => void;
	profileUrl: string;
	username: string;
}

export function ShareModal({ isOpen, onClose, profileUrl, username }: ShareModalProps) {
	const qrRef = useRef<HTMLDivElement>(null);
	const [qrCodeInstance, setQrCodeInstance] = useState<any>(null);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			import('qr-code-styling').then(({ default: QRCodeStyling }) => {
				const qrCode = new QRCodeStyling({
					width: 300,
					height: 300,
					data: profileUrl,
					image: '/logo.png',
					dotsOptions: {
						color: '#10172b',
						type: 'rounded',
					},
					cornersSquareOptions: {
						type: 'extra-rounded',
						color: '#ff6f31',
					},
					cornersDotOptions: {
						type: 'dot',
						color: '#11d7d1',
					},
					backgroundOptions: {
						color: '#ffffff',
					},
					imageOptions: {
						crossOrigin: 'anonymous',
						margin: 10,
					},
				});
				setQrCodeInstance(qrCode);
			});
		}
	}, [profileUrl]);

	useEffect(() => {
		if (qrCodeInstance) {
			qrCodeInstance.update({ data: profileUrl });
		}
	}, [profileUrl, qrCodeInstance]);

	useEffect(() => {
		if (qrRef.current && qrCodeInstance && isOpen) {
			qrRef.current.innerHTML = '';
			qrCodeInstance.append(qrRef.current);

			// Try to make the SVG responsive
			const svg = qrRef.current.querySelector('svg');
			if (svg) {
				svg.style.width = '100%';
				svg.style.height = '100%';
			}
		}
	}, [qrCodeInstance, isOpen]);

	const handleDownload = () => {
		if (qrCodeInstance) {
			qrCodeInstance.download({ name: `${username}-endpnt-qr`, extension: 'png' });
			toast.success('QR Code downloaded!');
		}
	};

	const handleCopyLink = () => {
		navigator.clipboard.writeText(profileUrl);
		toast.success('Link copied to clipboard!');
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-background/80 backdrop-blur-sm"
					/>

					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						className="relative w-full max-w-sm bg-card border border-border/40 rounded-none p-6 sm:p-8 flex flex-col items-center gap-6 shadow-2xl z-10"
					>
						<button
							onClick={onClose}
							className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
							aria-label="Close modal"
						>
							<IconX size={20} />
						</button>

						<div className="flex flex-col items-center gap-2 text-center mt-2">
							<h2 className="text-xl font-medium tracking-tight text-foreground normal-case">
								Share your profile
							</h2>
							<p className="text-sm text-muted-foreground/80 font-mono tracking-wide">
								@{username}
							</p>
						</div>

						{/* QR Code Container */}
						<div className="bg-[#ffffff] p-4 rounded-xl w-full aspect-square flex items-center justify-center border-4 border-[#10172b] shadow-[4px_4px_0_#10172b]">
							<div ref={qrRef} className="w-full h-full flex items-center justify-center" />
						</div>

						<div className="flex w-full gap-3 mt-2">
							<button
								onClick={handleCopyLink}
								className="flex-1 flex items-center justify-center gap-2 bg-muted/30 hover:bg-muted/50 text-foreground py-3 rounded-none text-[10px] uppercase font-medium tracking-widest transition-colors"
							>
								<IconShare size={16} />
								Copy Link
							</button>
							<button
								onClick={handleDownload}
								className="flex-1 flex items-center justify-center gap-2 bg-foreground hover:bg-foreground/90 text-background py-3 rounded-none text-[10px] uppercase font-medium tracking-widest transition-colors"
							>
								<IconDownload size={16} />
								Download
							</button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
