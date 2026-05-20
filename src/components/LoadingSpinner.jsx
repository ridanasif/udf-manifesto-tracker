const SIZE_CLASSES = {
  sm: "h-3.5 w-3.5 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-3"
};

export default function LoadingSpinner({ label = "Loading", size = "sm", className = "" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
    >
      <span
        aria-hidden="true"
        className={`${SIZE_CLASSES[size] || SIZE_CLASSES.sm} animate-spin rounded-full border-current border-t-transparent`}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
