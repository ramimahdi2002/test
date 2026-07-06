import { cx } from './cx.js';

// Bordered surface. Use `as` to render a different element, e.g. as="form".
export default function Card({ as: Component = 'div', className, ...props }) {
  return <Component className={cx('card', className)} {...props} />;
}
