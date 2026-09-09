import styles from "./page.module.css";

export default function Home() {
  const env = process.env.VERCEL_ENV ?? "local";
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "—";
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "—";

  const label =
    env === "production"
      ? "This is production"
      : env === "preview"
        ? "This is a preview"
        : "This is local";

  return (
    <main className={styles.page} data-env={env}>
      <p className={styles.badge}>{label}</p>
      <h1 className={styles.title}>preview-lab</h1>
      <p className={styles.subtitle}>Blue background — feat/blue-background</p>
      <dl className={styles.meta}>
        <div>
          <dt>VERCEL_ENV</dt>
          <dd>{env}</dd>
        </div>
        <div>
          <dt>Branch</dt>
          <dd>{branch}</dd>
        </div>
        <div>
          <dt>Commit</dt>
          <dd>{sha}</dd>
        </div>
      </dl>
    </main>
  );
}
