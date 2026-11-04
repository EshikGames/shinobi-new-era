const messages = {
  loading: {
    label: "Checking access",
    detail: "Your supporter status is being verified.",
  },
  error: {
    label: "Verification unavailable",
    detail: "We could not check your access. Please try again later.",
  },
  unauthorized: {
    label: "Sign in required",
    detail: "Connect Patreon to check your current supporter access.",
  },
  active: {
    label: "Access active",
    detail: "Your current supporter status has been verified.",
  },
  expired: {
    label: "No eligible active subscription",
    detail:
      "Your account is signed in, but an active subscription in an eligible tier was not found.",
  },
  unavailable: {
    label: "Verification unavailable",
    detail:
      "Sign-in is not available right now. You can still visit the official supporter pages and public downloads.",
  },
};

export default function AccessStatus({ status = "unavailable" }) {
  const message = messages[status] ?? messages.error;
  return (
    <div
      className={`ea-status ea-status--${status}`}
      role="status"
      aria-live="polite"
    >
      <span className="ea-status__light" aria-hidden="true" />
      <div>
        <strong>{message.label}</strong>
        <p>{message.detail}</p>
      </div>
    </div>
  );
}
