# Enquiry setup for Dan (one step at a time)

1. Open https://sheets.google.com and click **Blank** to make a new sheet. Name it "TLS Enquiries".
2. In the sheet, click **Extensions**, then **Apps Script**.
3. Delete the sample code. Paste in the whole of `apps-script/enquiry-to-sheet.gs`.
4. Change `CHANGE_ME_TO_A_LONG_RANDOM_KEY` to a long random word you make up. Keep it secret. Click the save icon.
5. Click **Deploy**, then **New deployment**. Choose **Web app**. Set **Execute as** to **Me** and **Who has access** to **Anyone**. Click **Deploy**, then approve the Google prompts.
6. Copy the **Web app URL**. Send it to Brad with the key from step 4. Brad puts them in the Worker settings as `GMAIL_RELAY_URL` and `GMAIL_RELAY_KEY`.
7. Test: send an enquiry from the contact page. A row should appear in the sheet, and Dan should get an email he can reply to.
