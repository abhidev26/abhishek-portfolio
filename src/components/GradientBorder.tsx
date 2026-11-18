/** Animated Purple → Cyan → Pink → Blue border. Parent needs the `gb-host` class and a border-radius. */
export function GradientBorder() {
  return (
    <span className="gb-ring" aria-hidden="true">
      <span className="gb-spin" />
    </span>
  );
}
