import type { HTMLAttributes } from 'react';
import { cn } from '../lib/utils';
import { GradientBorder } from './GradientBorder';

interface Props extends HTMLAttributes<HTMLDivElement> {
  border?: boolean;
  solid?: boolean;
}

export function GlassCard({ border = false, solid = false, className, children, ...rest }: Props) {
  return (
    <div className={cn(solid ? 'glass-solid' : 'glass', 'rounded-3xl', border && 'gb-host', className)} {...rest}>
      {border && <GradientBorder />}
      {children}
    </div>
  );
}
