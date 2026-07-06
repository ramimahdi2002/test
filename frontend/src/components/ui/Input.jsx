import { cx } from './cx.js';

// Text input. Pass `label` to render a stacked label above the field.
export default function Input({ label, className, ...props }) {
  const input = <input className={cx('input', className)} {...props} />;

  if (!label) return input;

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {input}
    </label>
  );
}
