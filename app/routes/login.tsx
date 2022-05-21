import type { ActionFunction, LinksFunction } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { Link, useSearchParams } from '@remix-run/react';
import { json } from '@remix-run/node';

import { db } from '~/utils/db.server';
import { login } from '~/utils/session.server';
import stylesUrl from '../styles/login.css';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: stylesUrl }];
};

// 유효성 검사 함수
function validateUsername(username: any) {
    if (username.length < 3 || typeof username !== 'string') {
        return '유저네임은 3글자 이상입니다.'
    }
}

function validatePassword(password: any) {
    if (password.length < 6 || typeof password !== 'string') {
        return '비밀번호는 6글자 이상입니다.'
    }
}

function validateUrl(url: any) {
    console.log(url);
    let urls = ['/jokes', '/', 'https://remix.run'];
    if (urls.includes(url)) {
        return url;
    }
    return '/jokes';
}

type ActionData = {
    formError?: string;
    fieldErrors?: {
        username: string | undefined;
        password: string | undefined;
    };
    fields?: {
        loginType: string;
        username: string;
        password: string;
    };
}

const badRequest = (data: ActionData) => {
    return json(data, { status: 400 })
}

// action 은 loader보다 먼저 호출됨
export const action: ActionFunction = async ({
    request
}) => {
    const form = await request.formData();
    const loginType = form.get('loginType');
    const username = form.get('username');
    const password = form.get('password');
    const redirectTo = validateUrl(
        form.get('redirectTo') || '/jokes'
    );

    if (
        typeof loginType !== 'string' ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof redirectTo !== 'string'
    ) {
        return badRequest({
            formError: '잘못된 폼 데이터입니다.'
        });
    }

    const fields = { loginType, username, password };
    const fieldErrors = {
        username: validateUsername(username),
        password: validatePassword(password),
    };

    if (Object.values(fieldErrors).some(Boolean)) {
        return badRequest({ fieldErrors, fields })
    }

    // 리덕스에서 리듀서 만들때랑 비슷한 느낌
    switch (loginType) {
        case 'login': {
            const user = await login({ username, password });
            console.log({ user }); // 브라우저에서 실행되는게 아닌 loaders 서버에서 실행되는 코드이기에 터미널에 출력됨

            if (!user) {
                // 가입된 사용자가 없으면 field와 formError를 반환
                // 사용자가 있으면 session을 생성하고 '/jokes/로 리다이렉트
                return badRequest({
                    fields,
                    formError: 'Not implemented'
                });
            }
        }
        case 'register': {
            const userExists = await db.user.findFirst({
                where: { username },
            });
            if (userExists) {
                return badRequest({
                    fields,
                    formError: '이미 가입한 사용자입니다.'
                });
            }
            // 사용자 생성
            // session을 생성하고 '/jokes'로 리다이렉트 합니다
            return badRequest({
                fields,
                formError: "Not implemented"
            });
        }
        default: {
            return badRequest({
                fields,
                formError: '로그인 유형이 잘못되었습니다.'
            });
        }
    }
}

export default function Login() {
    const [searchParams] = useSearchParams(); // qs
    const actionData = useActionData<ActionData>();

    return (
        <div className="container">
            <div className="content" data-light="">
                <h1>Login</h1>
                <form method="post">
                    {/* 리다이렉트 할 위치를 기억 */}
                    <input
                        type="hidden"
                        name="redirectTo"
                        value={
                            searchParams.get("redirectTo") ?? undefined
                        }
                    />
                    <fieldset>
                        <legend className="sr-only">
                            Login or Register?
                        </legend>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="login"
                                defaultChecked={
                                    !actionData?.fields?.loginType ||
                                    actionData?.fields?.loginType === 'login'
                                }
                            />
                            Login
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="loginType"
                                value="register"
                                defaultChecked={
                                    actionData?.fields?.loginType === 'register'
                                }
                            />
                            Register
                        </label>
                    </fieldset>
                    <div>
                        <label htmlFor="username-input">Username</label>
                        <input
                            type="text"
                            id="username-input"
                            name="username"
                            defaultValue={actionData?.fields?.username}
                            aria-invalid={Boolean(
                                actionData?.fieldErrors?.username
                            )}
                            aria-errormessage={
                                actionData?.fieldErrors?.username
                                    ? "username-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.username ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="username-error"
                            >
                                {actionData.fieldErrors.username}
                            </p>
                        ) : null}
                    </div>
                    <div>
                        <label htmlFor="password-input">Password</label>
                        <input
                            id="password-input"
                            name="password"
                            type="password"
                            defaultValue={actionData?.fields?.password}
                            aria-invalid={
                                Boolean(
                                    actionData?.fieldErrors?.password
                                ) || undefined
                            }
                            aria-errormessage={
                                actionData?.fieldErrors?.password
                                    ? "password-error"
                                    : undefined
                            }
                        />
                        {actionData?.fieldErrors?.password ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                                id="password-error"
                            >
                                {actionData.fieldErrors.password}
                            </p>
                        ) : null}
                    </div>
                    <div id="form-error-message">
                        {actionData?.formError ? (
                            <p
                                className="form-validation-error"
                                role="alert"
                            >
                                {actionData.formError}
                            </p>
                        ) : null}
                    </div>
                    <button type="submit" className="button">
                        Submit
                    </button>
                </form>
            </div>
            <div className="links">
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/jokes">Jokes</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}