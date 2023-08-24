import "./style.scss";

export default function AskLogin() {
  return (
    <div className="ask-login">
      <img src="/headset.svg" alt="headset" className="headset-icon" />
      <h1>Login required</h1>
      <p>Please use the /dashboard on Discord server to access dashboard</p>
    </div>
  );
}
