export default function Header() {
  return (
    <header
      style={{
        height: "70px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
      }}
    >
      <h3>GlobalTech Solutions</h3>

      <div>
        <span>Utilisateur</span>
      </div>
    </header>
  );
}