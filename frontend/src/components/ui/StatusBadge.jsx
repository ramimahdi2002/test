import { cx } from './cx.js';

// "In Progress" -> "in-progress"
function toModifier(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

export default function StatusBadge({ status }) {
  return <span className={cx('badge', toModifier(status))}>{status}</span>;
}
