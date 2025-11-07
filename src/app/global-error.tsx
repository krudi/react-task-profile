'use client';

import NextError from 'next/error';

export default function GlobalError({ reset }: { reset: () => void }) {
    return (
        <html>
            <body>
                <section aria-label="Globale Fehlermeldung mit Wiederholungsaktion">
                    <h1>Etwas ist schiefgelaufen!</h1>

                    <div>
                        <NextError statusCode={0} />
                    </div>

                    <button onClick={() => reset()}>Erneut versuchen</button>
                </section>
            </body>
        </html>
    );
}
