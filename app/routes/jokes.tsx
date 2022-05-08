import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { Outlet, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

import stylesUrl from '~/styles/jokes.css';
import { db } from "~/utils/db.server";

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

type LoaderData = {
    jokeListItems: Array<{ id: string; name: string }>;
};

// 데이터를 가져온다 (서버에서 실행되는 코드임)
export const loader: LoaderFunction = async () => {
    const data: LoaderData = {
        jokeListItems: await db.joke.findMany(), // 조건에 맞는 객체들을 배열에 담아서 반환

        // 특정 항목 호출
        // jokeListItems: await db.joke.findMany({
        //     take: 3, // index 0~2만 받아옴
        //     select: { id: true, name: true }, // id, name key 받아와서 렌더링
        //     orderBy: { createAt: 'desc' }
        // })
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