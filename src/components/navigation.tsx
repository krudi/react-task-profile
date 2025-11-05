import Link from 'next/link';

export default function Navigation() {
    return (
        <>
            <nav aria-label="Navigation">
                <ul role="list">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}
