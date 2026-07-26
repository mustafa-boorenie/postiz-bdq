# BDQ Postiz Fork Notice

This repository is a modified version of Postiz, originally published at https://github.com/gitroomhq/postiz-app and licensed under the GNU Affero General Public License v3.0.

Modification dates: 2026-07-25 (branding), 2026-07-26 (Instagram published-post import).

Summary of modifications:
- Replaced the frontend logo, wordmark, and favicon with BDQ-branded assets.
- Replaced selected user-facing Postiz marketing copy with BDQ-branded copy.
- Removed the authentication-page third-party testimonial/user-count claim from the branded login layout.
- Added Instagram published-post import: an optional `fetchPublishedPosts` member on the social provider contract, an implementation for the Instagram and Instagram Standalone providers, `PostsService.importPublishedPosts`, the `POST /integrations/:id/import-history` route, a `canImportHistory` capability flag on the integrations list, a new `IMPORTED` value in the `CreationMethod` Prisma enum, and an "Import past posts" channel menu action.

The upstream AGPL-3.0 license remains in effect, and the Corresponding Source for this modified network service is available in this public repository under AGPL-3.0.
