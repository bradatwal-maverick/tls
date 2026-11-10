# Adding Google data to a client dashboard

This guide records how the Google Analytics card was added to the enquiry dashboard for Dan's site (Trade Licence Solutions). Use it to repeat the job for any future client site.

The card shows visitors, page views, enquiries, enquiry rate, the traffic split (Google Ads, organic, direct, other) and top pages, for the last 7 and 30 days. It sits on its own **Analytics** tab, and the **Enquiries** tab shows no analytics.

## Method, and why

Use a **sign-in refresh token** from an OAuth app. Don't use a service account key file.

Service account key files were blocked by a Google organisation policy (`iam.disableServiceAccountKeyCreation`). The Google account used for the build could not change that policy at organisation or project level, so the key route was dropped. The refresh token route needs no key file and is still read-only.

## Before you start

- The GA4 **numeric Property ID** (digits only, not the `G-` measurement ID).
- A Google account that has **Viewer** access to that GA4 property.
- Access to the Google Cloud console and the Cloudflare dashboard.

## Steps, in order

Do one step at a time, and check each one before moving on.

1. **Find the Property ID.** Open https://analytics.google.com/, click the gear icon (Admin), then Property settings. Copy the number under Property ID.
2. **Create a Google Cloud project.** Open https://console.cloud.google.com/, use the project picker at the top, then New project. Name it after the client, for example "TLS Dashboard".
3. **Turn on the Analytics Data API.** Open https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com and click Enable.
4. **Set up the sign-in app.** Open https://console.cloud.google.com/auth/branding. Enter an app name, a support email, choose Audience: External, add a developer contact email, then Save and continue.
5. **Add the read-only Analytics permission.** Open https://console.cloud.google.com/auth/scopes, click Add or remove scopes, paste `https://www.googleapis.com/auth/analytics.readonly`, tick it, then Update and Save.
6. **Create the OAuth client.** Open https://console.cloud.google.com/auth/clients, click Create client, choose Web application, and name it (for example "Dashboard Playground"). Under Authorised redirect URIs, add `https://developers.google.com/oauthplayground`, then Create. Keep the Client ID and Client secret ready. Do not paste them into chat.
7. **Publish the app.** Open https://console.cloud.google.com/auth/audience, click Publish app, then Confirm. An app left in Testing only lets listed test users in, and its refresh token expires after 7 days. A "unverified app" warning is expected for a single-owner app.
8. **Get the refresh token.** Open https://developers.google.com/oauthplayground. Click the gear icon, tick "Use your own OAuth credentials", and paste the Client ID and Client secret. In the scope list, find Google Analytics Data API v1 and tick `analytics.readonly`. Click Authorise APIs and sign in with the account that has Viewer access. Click Exchange authorisation code for tokens and copy the Refresh token.
9. **Save the Worker variables.** Open https://dash.cloudflare.com/, click Workers & Pages, then the site's Worker (for this site, trade-licence-solutions). Click Settings, then Variables and Secrets, and add:

   | Name | Type | Value |
   |---|---|---|
   | `GA4_PROPERTY_ID` | Text | the digits from step 1 |
   | `GA_CLIENT_ID` | Text | from step 6 |
   | `GA_CLIENT_SECRET` | Secret | from step 6 |
   | `GA_REFRESH_TOKEN` | Secret | from step 8 |

10. **Check the card.** Open the dashboard, tap the Analytics tab, and read what it says. Numbers mean it works. Any message names the fix (see the table below). New GA4 properties can take up to 48 hours to show the first visits.

## Keep these rules

- Store the Client secret and refresh token only as **Secrets**. Never paste them in chat, email or the code.
- Keep the Property ID, Client ID and variable names in **dashboard variables**, not in the Wrangler config file. A `vars` block in the config file overwrites dashboard values on each deploy.
- Saving a variable in the dashboard is enough. Don't run a deploy command for it.
- To revoke access, open https://myaccount.google.com/permissions and remove the app.

## Errors we hit, and the fix

| What the card or Google said | Cause | Fix |
|---|---|---|
| "Error 401: invalid_client" on the sign-in page | Playground is not using the new Client ID | Tick "Use your own OAuth credentials" and paste the right Client ID |
| "Error 403: access_denied" (app is being tested) | App still in Testing | Step 7, publish the app |
| "not connected yet. Missing settings: ..." | A variable is missing or has a different name | Check names in step 9 exactly |
| GA4 403 "cannot read this property" | Sign-in account has no access | In Google Analytics, Admin, Property access management, add that account as Viewer |
| GA4 404 "cannot find this property" | Wrong Property ID | Use the digits from step 1 |
| GA4 400 "Batch requests are limited to 5 requests" | Too many reports in one batch | Fixed in the code: two batches of three |
| Card still shows the old message after a change | Old version still cached | Wait a few minutes and reload |
| Card shows zeros | No visits yet, or GA4 is still processing | Wait up to 48 hours for a new property |

## How the code is organised

- `src/ga4.js`: reads the GA4 Data API, caches results for one hour, counts enquiries from the database, and turns errors into plain-words messages.
- `src/dashboard.js`: the `/dashboard/api/analytics` route, the Analytics tab, and the card.
- Enquiry counts come straight from the enquiries table, so they are always current. Only the Google numbers are cached.

## Next steps for this client

- **Google Ads.** Needs a developer token from the Google Ads account (Tools, then API Center). Approval can take time. The sign-in needs the read-only Google Ads scope. Then add a card for spend, clicks and conversions.
- **Search Console.** Needs the read-only scope `https://www.googleapis.com/auth/webmasters.readonly` added at step 5. Repeat steps 8 and 9 to get a new refresh token that includes it. The site must be verified in Search Console first.
