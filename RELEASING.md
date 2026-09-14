# Release preparation

Publication is disabled by default. The workflow is restricted to this repository,
an exact version tag on `main` history, and requires
`THEME_NPM_PUBLISH_ENABLED=true`. A manual dispatch must run from `main` and name
that exact tag.

Before enabling the repository variable:

- Protect `main` with the required `validate` check and pull requests.
- Apply separate `v*` tag rules for immutable updates/deletions and controlled creation.
- Create the `npm-release` environment with the intended reviewer; allow the
  `main` branch for guarded manual dispatches and `v*` tags for tag-triggered releases.
- Configure npm trusted publishing for `LeMouf/konitif-theme`, workflow `publish.yml`, environment `npm-release`.

The first npm package creation may require a separate approved bootstrap step.
No bootstrap, tag, or npm publication is authorized by this document. Publish
only the verified archive with lifecycle scripts disabled.

The release job type-checks and tests the source package, validates package/tag
identity, verifies the physical archive and publishes those exact bytes using
OIDC. It never upgrades tools automatically.

Current preparation targets version `0.284.2` and retains the existing licence.
