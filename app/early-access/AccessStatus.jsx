const messages = {
  loading: { label: "Checking access", detail: "Your supporter status is being verified." },
  error: { label: "Verification unavailable", detail: "We could not check your access. Please try again later." },
  unauthorized: { label: "Sign in required", detail: "Connect a supporter account to check access when verification is available." },
  active: { label: "Access active", detail: "Your current supporter status has been verified." },
  expired: { label: "Access expired", detail: "Your supporter access is no longer active." },
  unavailable: { label: "Verification coming later", detail: "Account linking and secure downloads are not available on this site yet. Visit your supporter platform for its current posts." },
};

export default function AccessStatus({ status = "unavailable" }) {
  const message = messages[status] ?? messages.error;
  return (
    <div className={`ea-status ea-status--${status}`} role="status" aria-live="polite">
      <span className="ea-status__light" aria-hidden="true" />
      <div>
        <strong>{message.label}</strong>
        <p>{message.detail}</p>
      </div>
    </div>
  );
}
