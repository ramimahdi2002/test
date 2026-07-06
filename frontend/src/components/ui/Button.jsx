import { cx } from './cx.js';

// variant: 'primary' (default) | 'link'
export default function Button({ variant = 'primary', className, ...props }) {
  return <button className={cx('btn', `btn-${variant}`, className)} {...props} />;
}
