
import type {
	LinksFunction,
	LoaderFunctionArgs,
	TypedResponse,
  } from '@remix-run/node'
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	data
} from "@remix-run/react";
import { NuqsAdapter } from "nuqs/adapters/remix";
import stylesheet from "~/tailwind.css?url";
import { getDomainUrl } from "./shared/utils/misc.server";
import { authenticator } from './shared/utils/auth.server'

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
	{ rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
];

export type LoaderData = Exclude<
  Awaited<ReturnType<typeof loader>>,
  Response | TypedResponse<unknown>
>

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request)
  const user = sessionUser?.id
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })
    : null

  const locale = await i18nServer.getLocale(request)
  const { toast, headers: toastHeaders } = await getToastSession(request)
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()

  return data(
    {
      user,
      locale,
      toast,
      csrfToken,
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
        userPrefs: { theme: getTheme(request) },
      },
    } as const,
    {
      headers: combineHeaders(
        { 'Set-Cookie': await localeCookie.serialize(locale) },
        toastHeaders,
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
      ),
    },
  )
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<NuqsAdapter>
			<Outlet />
		</NuqsAdapter>
	);
}
