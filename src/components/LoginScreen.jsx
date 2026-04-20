export default function LoginScreen({
  password,
  onPasswordChange,
  onSubmit,
  showError,
}) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <p className="login-greeting">Welcome Sparkbox</p>
        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          autoFocus
          className="login-input"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSubmit();
          }}
        />
        <button className="system-button" type="button" onClick={onSubmit}>
          OK
        </button>
        {showError && (
          <p className="login-error">ACCESS DENIED. TRY "sparkbox".</p>
        )}
      </div>
    </div>
  );
}
