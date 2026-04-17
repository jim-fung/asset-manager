import { Link } from "react-router";
import { Header } from "@/components/Header";

export function NotFoundPage() {
  return (
    <>
      <Header
        title="Pagina niet gevonden"
        subtitle="De gevraagde route of collectie bestaat niet in dit archief"
      />

      <div className="page-content">
        <section className="content-section">
          <div className="empty-state">
            <div className="empty-state-icon"></div>
            <div className="empty-state-text">
              Controleer de URL of ga terug naar het overzicht.
            </div>
            <Link to="/">Terug naar het overzicht</Link>
          </div>
        </section>
      </div>
    </>
  );
}
