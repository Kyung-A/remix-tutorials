import type { LinksFunction, MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"

import stylesUrl from '~/styles/index.css';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const meta: MetaFunction = () => ({
    title: "농담 앱",
    description:
        "Remix jokes app. Learn Remix and laugh at the same time!",
});

export default function IndexRoute() {
    return (
        <div className="container">
            <div className="content">
                <h1>
                    Remix <span>Jokes!</span>
                </h1>

                <nav>
                    <ul>
                        <li>
                            <Link to="jokes">Read Jokes</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}