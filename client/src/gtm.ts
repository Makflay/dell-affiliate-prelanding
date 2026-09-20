const GTM_SCRIPT_ID = "google-tag-manager-script";

export const initializeGtm = () => {
  const gtmId = import.meta.env.VITE_GTM_ID;

  if (!gtmId) {
    console.warn("VITE_GTM_ID is not configured");
    return;
  }

  if (document.getElementById(GTM_SCRIPT_ID)) {
    return;
  }

  window.dataLayer ??= [];

  window.dataLayer.push({
    "gtm.start": Date.now(),
    event: "gtm.js",
  });

  const script = document.createElement("script");

  script.id = GTM_SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;

  document.head.appendChild(script);
};
