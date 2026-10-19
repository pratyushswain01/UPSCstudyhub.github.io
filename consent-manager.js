(function () {
  "use strict";

  var STORAGE_KEY = "upscgurukul_consent_v1";
  var current = null;

  function readChoice() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      if (!value) return null;

      var parsed = JSON.parse(value);
      if (parsed.version !== 1) return null;
      if (typeof parsed.essential !== "boolean") return null;
      if (typeof parsed.analytics !== "boolean") return null;
      if (typeof parsed.advertising !== "boolean") return null;

      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveChoice(choice) {
    current = {
      version: 1,
      essential: true,
      analytics: choice.analytics === true,
      advertising: choice.advertising === true,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch (error) {
      // If storage is unavailable, do not pretend consent was persisted.
      current = null;
      return false;
    }

    document.dispatchEvent(new CustomEvent("upscgurukul:consentchange", {
      detail: Object.assign({}, current)
    }));

    render();
    return true;
  }

  function element(tag, attributes, text) {
    var node = document.createElement(tag);
    Object.keys(attributes || {}).forEach(function (key) {
      if (key === "className") node.className = attributes[key];
      else node.setAttribute(key, attributes[key]);
    });
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addStyles() {
    if (document.getElementById("ug-consent-styles")) return;

    var style = element("style", { id: "ug-consent-styles" });
    style.textContent = [
      "#ug-consent-panel{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:760px;margin:auto;background:#fff;color:#172235;border:1px solid #cbd5e1;border-radius:14px;padding:20px;box-shadow:0 12px 40px #0003;font:15px/1.5 system-ui,sans-serif}",
      "#ug-consent-panel *{box-sizing:border-box}",
      "#ug-consent-panel h2{font-size:20px;margin:0 0 8px}",
      "#ug-consent-panel p{margin:8px 0}",
      "#ug-consent-panel .ug-consent-options{display:flex;flex-wrap:wrap;gap:14px;margin:14px 0}",
      "#ug-consent-panel label{display:flex;align-items:center;gap:7px}",
      "#ug-consent-panel input{width:17px;height:17px}",
      "#ug-consent-panel .ug-consent-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}",
      "#ug-consent-panel button,#ug-consent-preferences{font:inherit;cursor:pointer;border-radius:8px;padding:9px 13px;border:1px solid #0f766e;background:#fff;color:#115e59}",
      "#ug-consent-panel button.ug-primary{background:#0f766e;color:#fff}",
      "#ug-consent-preferences{position:fixed;z-index:2147482999;bottom:12px;right:12px;background:#fff;color:#115e59;box-shadow:0 2px 10px #0002}",
      "@media(prefers-color-scheme:dark){#ug-consent-panel,#ug-consent-preferences{background:#172235;color:#f8fafc;border-color:#475569}}"
    ].join("\n");

    /* UG_COMPACT_MOBILE_PATCH */
    style.textContent += "\n" + [
      "#ug-consent-panel{width:auto;max-width:760px;max-height:min(58dvh,520px);overflow-y:auto;overscroll-behavior:contain;padding:16px}",
      "#ug-consent-panel h2{font-size:19px;line-height:1.25}",
      "#ug-consent-panel p{font-size:14px;line-height:1.45;margin:8px 0}",
      "#ug-consent-panel .ug-consent-options{gap:10px;margin:10px 0}",
      "#ug-consent-panel .ug-consent-actions{gap:8px}",
      "#ug-consent-panel button{padding:9px 11px;font-size:14px;min-height:42px}",
      "@media(max-width:600px){#ug-consent-panel{left:10px;right:10px;bottom:10px;width:auto;max-height:54dvh;padding:14px;border-radius:18px}}",
      "@media(max-width:380px){#ug-consent-panel{padding:12px}#ug-consent-panel .ug-consent-actions{display:grid;grid-template-columns:1fr 1fr}#ug-consent-panel .ug-consent-actions button.ug-primary{grid-column:1/-1;grid-row:1}#ug-consent-panel h2{font-size:18px}}",
      "@media(max-height:600px){#ug-consent-panel{max-height:48dvh;padding:10px}#ug-consent-panel p{margin:5px 0}}"
    ].join("\n");

    document.head.appendChild(style);
  }

  function removePanel() {
    var old = document.getElementById("ug-consent-panel");
    if (old) old.remove();
  }

  function ensurePreferencesButton() {
    if (document.getElementById("ug-consent-preferences")) return;

    var button = element("button", {
      id: "ug-consent-preferences",
      type: "button",
      "aria-label": "Open privacy preferences"
    }, "Privacy preferences");

    button.addEventListener("click", function () {
      render(true);
    });

    document.body.appendChild(button);
  }

  function render(forceOpen) {
    if (!document.body) return;

    removePanel();

    if (current && !forceOpen) {
      ensurePreferencesButton();
      return;
    }

    var panel = element("section", {
      id: "ug-consent-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "ug-consent-title"
    });

    panel.appendChild(element("h2", { id: "ug-consent-title" },
      "Your privacy choices"));

    panel.appendChild(element("p", {},
      "UPSC गुरुकुल uses essential storage for site functions. You can choose whether to allow optional analytics and advertising. You can change your choice later."));

    var options = element("div", { className: "ug-consent-options" });

    options.appendChild(element("label", {},
      "Essential storage (always active)"));

    var analyticsLabel = element("label", {});
    var analytics = element("input", {
      type: "checkbox",
      id: "ug-consent-analytics"
    });
    analyticsLabel.appendChild(analytics);
    analyticsLabel.appendChild(document.createTextNode("Optional analytics"));
    options.appendChild(analyticsLabel);

    var adsLabel = element("label", {});
    var advertising = element("input", {
      type: "checkbox",
      id: "ug-consent-advertising"
    });
    adsLabel.appendChild(advertising);
    adsLabel.appendChild(document.createTextNode("Personalized advertising"));
    options.appendChild(adsLabel);

    panel.appendChild(options);

    panel.appendChild(element("p", {},
      "Choosing a category here records your preference. Optional services must separately check that preference before loading or collecting data."));

    var actions = element("div", { className: "ug-consent-actions" });

    var essentialButton = element("button", { type: "button" }, "Essential only");
    essentialButton.addEventListener("click", function () {
      saveChoice({ analytics: false, advertising: false });
    });

    var selectedButton = element("button", {
      type: "button",
      className: "ug-primary"
    }, "Accept selected");
    selectedButton.addEventListener("click", function () {
      saveChoice({
        analytics: analytics.checked,
        advertising: advertising.checked
      });
    });

    var allButton = element("button", { type: "button" }, "Accept all");
    allButton.addEventListener("click", function () {
      saveChoice({ analytics: true, advertising: true });
    });

    actions.appendChild(essentialButton);
    actions.appendChild(selectedButton);
    actions.appendChild(allButton);
    panel.appendChild(actions);

    var oldPreferences = document.getElementById("ug-consent-preferences");
    if (oldPreferences) oldPreferences.remove();

    document.body.appendChild(panel);

    if (current) {
      analytics.checked = current.analytics;
      advertising.checked = current.advertising;
    }
  }

  function init() {
    addStyles();
    current = readChoice();
    render();

    // Other scripts can inspect the current saved preference.
    window.UPSCGurukulConsent = {
      getChoice: function () {
        return current ? Object.assign({}, current) : null;
      },
      allows: function (category) {
        if (!current) return false;
        if (category === "essential") return true;
        if (category === "analytics") return current.analytics;
        if (category === "advertising") return current.advertising;
        return false;
      },
      openPreferences: function () {
        render(true);
      }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();