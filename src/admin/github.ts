// Minimal GitHub REST client for the admin panel: reads and writes the data
// files on the main branch with the editor's own fine-grained personal access
// token (repo matbar87/forge, Contents: read & write). A commit to main
// triggers the build workflow, which validates, rebuilds and publishes the
// site (and syncs the spreadsheets).
export const REPO = 'matbar87/forge';
export const BRANCH = 'main';
const API = 'https://api.github.com';

export class GitHubError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const describe = (status: number, fallback: string) => {
  if (status === 401) return 'Token jest nieprawidłowy albo wygasł.';
  if (status === 403) return 'Token nie ma uprawnienia do zapisu (Contents: Read and write) w repo forge.';
  if (status === 404) return 'Nie znaleziono repo albo pliku — czy token ma dostęp do repo matbar87/forge?';
  if (status === 409) return 'Plik zmienił się w międzyczasie (ktoś inny zapisał zmiany). Wczytaj dane ponownie i nanieś swoje zmiany jeszcze raz.';
  if (status === 422) return 'GitHub odrzucił zapis (najpewniej plik zmienił się w międzyczasie). Wczytaj dane ponownie.';
  return fallback;
};

async function request(token: string, path: string, init: RequestInit = {}) {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      },
    });
  } catch {
    // No response at all: offline, or the page's Content-Security-Policy
    // doesn't allow connecting to api.github.com.
    throw new GitHubError(
      'Brak połączenia z GitHubem. Sprawdź internet. Jeśli to się powtarza, strona może blokować połączenia z api.github.com ' +
        '(Content-Security-Policy) — otwórz panel pod adresem matbar87.github.io/forge/public_html/admin.',
      0
    );
  }
  if (!res.ok) {
    let msg = '';
    try {
      msg = (await res.json()).message ?? '';
    } catch {
      /* not JSON */
    }
    throw new GitHubError(describe(res.status, `Błąd GitHub ${res.status}${msg ? `: ${msg}` : ''}`), res.status);
  }
  return res.json();
}

const decode = (b64: string) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\n/g, '')), (c) => c.charCodeAt(0)));
const encode = (text: string) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};

export interface RepoFile {
  path: string;
  sha: string;
  text: string;
}

/** Checks the token can write to the repo; returns the GitHub login. */
export async function checkAccess(token: string): Promise<string> {
  const [user, repo] = await Promise.all([request(token, '/user').catch(() => null), request(token, `/repos/${REPO}`)]);
  if (repo.permissions && !repo.permissions.push) {
    throw new GitHubError('Token ma tylko odczyt — potrzebne jest uprawnienie Contents: Read and write.', 403);
  }
  return user?.login ?? '';
}

export async function readFile(token: string, path: string): Promise<RepoFile> {
  const data = await request(token, `/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  return { path, sha: data.sha, text: decode(data.content) };
}

/** Commits new content; returns the new blob sha and the commit URL. */
export async function writeFile(token: string, file: RepoFile, text: string, message: string) {
  const data = await request(token, `/repos/${REPO}/contents/${file.path}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: encode(text), sha: file.sha, branch: BRANCH }),
  });
  return { sha: data.content.sha as string, commitUrl: data.commit.html_url as string };
}

export const ACTIONS_URL = `https://github.com/${REPO}/actions`;
export const NEW_TOKEN_URL = 'https://github.com/settings/personal-access-tokens/new';
