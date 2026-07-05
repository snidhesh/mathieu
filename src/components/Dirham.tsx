import { formatAmount } from '@/lib/formatters';
import { DirhamSymbol } from './DirhamSymbol';

// <Dirham amount={42500000} /> → 𐋅 42,500,000
//
// The symbol inherits the parent font colour and scales with font-size.
// Wrapped in a `whitespace-nowrap` span so the glyph and number never break.
export function Dirham({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span className={`whitespace-nowrap ${className ?? ''}`}>
      <DirhamSymbol />
      {formatAmount(amount)}
    </span>
  );
}
