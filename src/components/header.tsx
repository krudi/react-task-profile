import Link from 'next/link';

export default function Header() {
    return (
        <header
            className="app-header"
            aria-label="Anwendungs-Hero"
        >
            <div className="app-header-wrapper">
                <span className="app-header-note">
                    Jedes Profil zeigt klar zugeordnete Aufgaben und Status.
                </span>

                <h1 className="app-header-title">
                    Erstelle Profile, ordne Aufgaben zu und verfolge
                    Fälligkeiten.
                </h1>

                <p className="app-header-subtitle">
                    Lege Profile für Teammitglieder an, plane Deadlines und
                    behalte den Fortschritt im Blick – zentral an einem Ort.
                </p>

                <div className="app-header-actions">
                    <Link
                        href="/profile"
                        scroll={false}
                        className="btn btn-primary"
                    >
                        Profile ansehen
                    </Link>
                </div>
            </div>
        </header>
    );
}
