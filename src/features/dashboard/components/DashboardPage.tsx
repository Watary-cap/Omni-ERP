export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Vue générale de l'entreprise</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div style={card}>
          <h3>Projets actifs</h3>
          <h2>0</h2>
        </div>

        <div style={card}>
          <h3>Employés</h3>
          <h2>0</h2>
        </div>

        <div style={card}>
          <h3>Clients</h3>
          <h2>0</h2>
        </div>

        <div style={card}>
          <h3>Produits</h3>
          <h2>0</h2>
        </div>
      </div>
    </div>
  );
}

const card = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};