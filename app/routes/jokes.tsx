import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import stylesUrl from '~/styles/jokes.css';
import { db } from "~/utils/db.server";
import { getUser } from '~/utils/session.server';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
    user: Awaited<ReturnType<typeof getUser>>;
    jokeListItems: Array<{ id: string; name: string }>;
};

// 데이터를 가져온다 (서버에서 실행되는 코드임)
// loader는 렌더링 하기 전에 서버에서 호출된다
export const loader: LoaderFunction = async ({ request }) => {
    const jokeListItems = await db.joke.findMany({
        take: 5,
        orderBy: { createAt: 'desc' },
        select: { id: true, name: true }
    });

    const user = await getUser(request);

    const data: LoaderData = {
        jokeListItems,
        user
    };
    return json(data);
}

export default function JokesRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div className="jokes-layout">
            <header className="jokes-header">
                <div className="container">
                    <h1 className="home-link">
                        <Link to="/" title="Remix Jokes">
                            <span className="logo">🤪</span>
                            <span className="logo-medium">J🤪KES</span>
                        </Link>
                    </h1>
                    {data.user ? (
                        <div className="user-info">
                            <span>{`Hi ${data.user.username}`}</span>
                            <form action='/logout' method="post">
                                <button type="submit" className="button">
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </header>

            <main className="jokes-main">
                <div className="container">
                    <div className="jokes-list">
                        {/* to="."은 jokes/index 파일을 가져옴 */}
                        <Link to=".">Get a random joke</Link>
                        <p>Here are a few more jokes to check out:</p>

                        <ul>
                            {data.jokeListItems.map((joke) => (
                                <li key={joke.id}>
                                    <Link to={joke.id}>
                                        {joke.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <Link to="new" className="button">
                            Add your own
                        </Link>
                    </div>
                    <div className="jokes-outlet">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}