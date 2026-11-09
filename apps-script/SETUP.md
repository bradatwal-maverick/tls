# Enquiry email setup for Dan (one step at a time)

1. Open https://script.google.com/ and click **New project**. Name it "TLS Enquiry Email".
2. Delete the sample code. Paste in the whole of `apps-script/enquiry-email.gs`.
3. Change `CHANGE_ME_TO_A_LONG_RANDOM_KEY` to a long random word you make up. Keep it secret. Click the save icon.
4. Click **Deploy**, then **New deployment**. Choose **Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**. Click **Deploy**, then approve the Google prompts.
5. Copy the **Web app URL**. Send it to Brad with the key from step 3. Brad puts them in the Worker settings as `GMAIL_RELAY_URL` and `GMAIL_RELAY_KEY`.
6. Test: send an enquiry from the contact page. Dan should get an email he can reply to, and the enquiry appears in the dashboard.
