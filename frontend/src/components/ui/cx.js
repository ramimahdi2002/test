// Join truthy class names into a single string.
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
