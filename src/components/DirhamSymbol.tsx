// Inline SVG rendering of the new UAE Dirham symbol.
// Sized in em units so it inherits from surrounding text.
// currentColor so it takes the parent's text colour.

type Props = {
  className?: string;
  'aria-label'?: string;
  title?: string;
};

export function DirhamSymbol({
  className,
  'aria-label': ariaLabel = 'Dirham',
  title,
}: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      fillRule="evenodd"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'inline-block',
        width: '0.9em',
        height: '0.9em',
        verticalAlign: '-0.08em',
        marginRight: '0.15em',
      }}
    >
      {title && <title>{title}</title>}
      {/* Compound D with hole (evenodd fill) */}
      <path
        d="M3 2 L3 22 L10 22 C18 22 21 18 21 12 C21 6 18 2 10 2 Z
           M6 5 L10 5 C15 5 18 8 18 12 C18 16 15 19 10 19 L6 19 Z"
      />
      {/* Two horizontal bars through the letter */}
      <rect x="0" y="10.3" width="22" height="1.4" />
      <rect x="0" y="13" width="22" height="1.4" />
    </svg>
  );
}
