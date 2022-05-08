import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from "@remix-run/react";
import type { Joke } from '@prisma/client';

import { db } from '~/utils/db.server';

type LoaderData = { joke: Joke };

export const loader: LoaderFunction = async ({
    params
}) => {
    const joke = await db.joke.findUnique({ // where에 적힌 조건으로 db에서 해당 조건에 맞는 하나의 데이터를 반환
        where: { id: params.jokeId },
    });
    if (!joke) {
        throw new Error('찾을 수 없습니다.');
    }

    const data: LoaderData = { joke };
    return json(data);
}

export default function JokeRoute() {
    const data = useLoaderData<LoaderData>();

    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>
                {data.joke.content}
            </p>
            <Link to=".">
                {data.joke.name} Permalink
            </Link>
        </div>
    );
}



