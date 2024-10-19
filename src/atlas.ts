import { ModuleListResponse, PartialAtlasBundle } from "./types";

/**
 * Keep this path in sync with `app.json`'s `baseUrl`.
 * The base url is disabled when running webui in development, as `baseUrl` is for export only.
 *
 * @see https://docs.expo.dev/versions/latest/config/app/#baseurl
 */
const baseUrl = "http://127.0.0.1:8081/_expo/atlas/--";
// const baseUrl = "http://127.0.0.1:8081/--";

/**
 * Fetch data from the API routes, adding the `baseUrl` to all requests.
 */
function fetchApi<T>(path: string, options?: RequestInit) {
  if (path.startsWith(baseUrl)) {
    return fetch(path, options) as Promise<T | null>;
  }

  return fetch(
    path.startsWith("/") ? `${baseUrl}${path}` : `${baseUrl}/${path}`,
    options
  )
    .then(handleApiError)
    .then((res) => res?.json() as Promise<T | null>);
}

/**
 * Attempt to handle possible API errors, by returning:
 *   - the response for ok status codes
 *   - null for `404` status codes
 *   - throws response on other status codes
 */
function handleApiError(response: Response) {
  if (response.ok) return response;
  if (response.status === 404) return null;
  throw response;
}

export const getBundleData = async () => {
  const bundles = await fetchApi<PartialAtlasBundle[]>("/bundles");
  if (!bundles) return null;

  const bundleData = [];

  for (let i = 0; i < bundles.length; i++) {
    const bundle = bundles[i];
    if (bundle.environment !== "client") continue;

    const url = `/bundles/${bundle.id}/modules`;
    const modules = await fetchApi<ModuleListResponse>(url);

    bundleData.push({
      ...modules,
      bundle: { ...bundle, ...modules?.bundle },
      data: new Map(
        modules?.data?.map((module) => [module.absolutePath, module])
      ),
    });
  }

  return bundleData;
};
