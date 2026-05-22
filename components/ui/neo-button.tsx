import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const neoButtonVariants = cva(
	'group flex cursor-pointer items-center justify-center gap-2 rounded-full font-black transition-all duration-200 active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_#10172b] disabled:cursor-wait disabled:opacity-70',
	{
		variants: {
			variant: {
				primary: 'bg-[#11d7d1]',
				secondary: 'bg-white hover:bg-[#ffde7a]',
				accent: 'bg-[#ff6f31] text-white',
			},
			size: {
				sm: 'min-h-11 border-[3px] border-[#10172b] px-4 py-2 text-sm shadow-[4px_4px_0_#10172b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#10172b]',
				lg: 'min-h-14 w-full sm:w-auto border-[4px] border-[#10172b] px-7 py-4 text-base shadow-[7px_7px_0_#10172b] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#10172b]',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'sm',
		},
	}
);

type NeoButtonProps = React.ComponentProps<'button'> & VariantProps<typeof neoButtonVariants>;

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
	({ className, variant, size, ...props }, ref) => (
		<button ref={ref} className={cn(neoButtonVariants({ variant, size, className }))} {...props} />
	)
);

NeoButton.displayName = 'NeoButton';

export { NeoButton, neoButtonVariants };
