/* UPSCGURUKUL_AUTO_LATEST_RELEASE_V1 */
(async function () {
  const api = "https://api.github.com/repos/pratyushswain01/UPSCstudyhub.github.io/releases/latest";
  const fallback = "https://github.com/pratyushswain01/UPSCstudyhub.github.io/releases/latest";

  try {
    const response = await fetch(api, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error("GitHub release lookup failed");

    const release = await response.json();
    const version = String(release.tag_name || "").replace(/^v/i, "");
    const apk = (release.assets || []).find(
      item => item.name === "app-release.apk"
    );
    const url = apk?.browser_download_url || fallback;

    if (!version) return;

    // Update the download buttons on both pages.
    document.querySelectorAll("a.button.primary, a.apk-download").forEach(link => {
      link.href = url;
      link.removeAttribute("download");
      link.setAttribute("aria-label", "Download UPSC Gurukul version " + version);
    });

    // Update version information on the download page.
    document.querySelectorAll(".note").forEach(note => {
      if (/Android APK|Version\s+\d/i.test(note.textContent)) {
        note.textContent = "Android APK · Version " + version +
          (apk ? " · Latest release" : " · Download from GitHub");
      }
    });

    // Update version labels explicitly marked for automatic updates.
    document.querySelectorAll("[data-upscgurukul-latest-version]").forEach(el => {
      el.textContent = version;
    });

    // Provide the latest release details to other page scripts if needed.
    window.UPSCGurukulLatestRelease = {
      version,
      url,
      releaseUrl: release.html_url || fallback
    };
    window.dispatchEvent(new CustomEvent("upscgurukul:latest-release", {
      detail: window.UPSCGurukulLatestRelease
    }));
  } catch (error) {
    console.warn("UPSC Gurukul: could not fetch latest release.", error);
  }
})();