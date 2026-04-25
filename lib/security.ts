/**
 * Simulates a URL scanning API (like Google Safe Browsing).
 * In production, you would replace this with a real API call.
 */
export async function isUrlSafe(url: string): Promise<boolean> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_SAFE_BROWSING_KEY is not set. Skipping URL scan.");
    return true;
  }

  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: {
            clientId: "endpnt",
            clientVersion: "1.0.0",
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }],
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("Failed to query Google Safe Browsing API:", await res.text());
      return true; // Fail open if the API is down, to avoid blocking valid URLs
    }

    const data = await res.json();

    // If matches array exists and has entries, the URL is flagged as unsafe
    if (data.matches && data.matches.length > 0) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking URL safety:", error);
    return true; // Fail open
  }
}
