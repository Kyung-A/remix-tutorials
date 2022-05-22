// action 함수를 사용해서 post 구현하기
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useActionData, useCatch } from "@remix-run/react"

import { db } from "~/utils/db.server"
import { getUserId, requireUserId } from '~/utils/session.server';


export const loader: LoaderFunction = async ({ request }) => {
    const userId = await getUserId(request);
    if (!userId) {
        throw new Response("Unauthorized", { status: 401 });
    }
    return json({});
}

// 유효성 검사 함수
function validateJokeContent(content: string) {
    if (content.length < 5) {
        return '내용이 너무 짧습니다.'
    }
}

function validateJokeName(name: string) {
    if (name.length < 3) {
        return '제목이 너무 짧습니다.'
    }
}

type ActionData = {
    formError?: string;
    fieldErrors?: {
        name: string | undefined;
        content: string | undefined;
    };
    fields?: {
        name: string;
        content: string;
    };
};


const badRequest = (data: ActionData) => {
    return json(data, { status: 400 });
}

export const action: ActionFunction = async ({
    request
}) => {
    const userId = await requireUserId(request);
    const form = await request.formData();
    const name = form.get('name');
    const content = form.get('content');

    // 타입 검사
    if (typeof name !== 'string' || typeof content !== 'string') {
        return badRequest({
            formError: '양식 제출이 올바르지 않습니다'
        })
    }

    const fieldErrors = {
        name: validateJokeName(name),
        content: validateJokeContent(content)
    };
    const fields = { name, content };

    // 객체의 value 값들만 뽑아서 배열로 반환 후 특정 조건을 만족하는 값을 반환
    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields });
    }

    const joke = await db.joke.create({ data: { ...fields, jokesterId: userId } });
    // 리믹스는 캐시 무효화를 자동으로 처리해준다 (캐시 값을 자동 갱신)
    return redirect(`/jokes/${joke.id}`);
}

export default function NewJokeRoute() {
    const actionData = useActionData<ActionData>();

    return (
        <div>
            <p>Add your own hilarious joke</p>

            <form method="post">
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            defaultValue={actionData?.fields?.name}
                            name="name"
                            aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
                            aria-errormessage={actionData?.fieldErrors?.name ? 'name-error' : undefined}
                        />
                    </label>
                    {
                        actionData?.fieldErrors?.content ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="name-error"
                            >
                                {actionData.fieldErrors.name}
                            </p>
                        ) : null
                    }
                </div>
                <div>
                    <label>
                        Content: <textarea name="content" defaultValue={actionData?.fields?.content} aria-invalid={Boolean(actionData?.fieldErrors?.content) || undefined} aria-errormessage={actionData?.fieldErrors?.content ? 'content-error' : undefined} />
                    </label>
                    {
                        actionData?.fieldErrors?.content ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="content-error"
                            >
                                {actionData.fieldErrors.content}
                            </p>
                        ) : null
                    }
                </div>
                <div>
                    {actionData?.formError ? (
                        <p
                            className="form-validation-error"
                            role="alert"
                        >
                            {actionData.formError}
                        </p>
                    ) : null}
                    <button type="submit" className="button">
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 401) {
        return (
            <div className="error-container">
                <p>You must be logged in to create a joke.</p>
                <Link to="/login">Login</Link>
            </div>
        );
    }
}


export function ErrorBoundary() {
    return (
        <div className="error-container">
            Something unexpected went wrong. Sorry about that.
        </div>
    );
}