const DEFAULT_PATTERNS = [
    /^kubectl\s/,
    /^docker\s/,
    /^git\s/,
    /^npm\s/,
    /^yarn\s/,
    /^pnpm\s/,
    /^curl\s/,
    /^wget\s/,
    /^aws\s/,
    /^gcloud\s/,
    /^az\s/,
    /^terraform\s/,
    /^helm\s/,
    /^make\s/,
    /^sudo\s/,
    /^ssh\s/,
    /^scp\s/,
    /^\.\//,
    /^cd\s/,
    /^ls\s/,
    /^cat\s/,
    /^grep\s/,
];
export function looksLikeCommand(text, patterns = DEFAULT_PATTERNS) {
    const trimmed = text.trim();
    return patterns.some((p) => p.test(trimmed));
}
