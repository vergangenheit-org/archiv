{
  dotenv.enable = true;

  languages.javascript.enable = true;
  languages.javascript.bun.enable = true;

  pre-commit.hooks = {
    astro-check = {
      enable = true;
      entry = "astro check";
      files = "\.(ts|astro)$";
      name = "astro check";
    };

    eslint = {
      enable = true;
      entry = "bun run eslint";
      files = "\.(ts|astro)$";
      name = "eslint";
    };

    prettier = {
      enable = true;
      entry = "prettier --ignore-unknown --write";
      files = ".*";
    };
  };

  scripts = {
    astro.exec = "bunx --bun astro $@";
    prettier.exec = "bunx --bun prettier $@";
    wrangler.exec = "bunx --bun wrangler $@";
    deploy.exec = "wrangler pages deploy --project-name=$CLOUDFLARE_PROJECT --branch=$CLOUDFLARE_BRANCH dist/";
  };
}
