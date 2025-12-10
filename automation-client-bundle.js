// automation-client-bundle.js
// IMPORTANT:
// - yeh file Vercel / Next.js server pe rahegi
// - isko API route as text/javascript bhejega
// - yeh Runway tab ke context mein eval hogi
// - yeh assume karta hai ke STATE, updateStatus, parseCSV, getAssetsInFolder,
//   ensureNetworkFast, performClick, etc. already global hain (contentScript se).

(function () {
  // ====== YAHAN APNA PURA AUTOMATION CODE PASTE KARO ======
  // Wo hi block jo tumne abhi contentScript se delete kiya:

  // 1) handleUpscaleStart
  async function handleUpscaleStart() {
    const rangeVal = document.getElementById("delayPreset").value;
    const parts = rangeVal.split("-");
    const min = parseInt(parts[0], 10) || 5;
    const max = parseInt(parts[1], 10) || 8;

    let batchCapacity = 3;
    const capEl = document.getElementById("upscaleBatchCapacity");
    if (capEl) {
      const parsed = parseInt(capEl.value, 10);
      if (parsed === 1 || parsed === 2 || parsed === 3) {
        batchCapacity = parsed;
      }
    }

    STATE.stopRequested = false;
    STATE.isPaused = false;

    updateStatus(
      `Starting Auto 4K Upscale (capacity: ${batchCapacity})...`,
      "#38bdf8"
    );
    await runUpscaleMode({ min, max, batchCapacity });
  }

  async function estimateUpscaleTargets() {
    if (STATE.stopRequested) return 0;

    const visited = new Set();
    const originalY = window.scrollY;

    try {
      window.scrollTo(0, 0);
      await sleep(300);

      let safety = 0;
      while (!STATE.stopRequested && safety < 50) {
        safety++;

        const allButtons = Array.from(
          document.querySelectorAll("button")
        );
        allButtons.forEach((b) => {
          const txt = (b.innerText || "")
            .trim()
            .toLowerCase();
          if (txt.includes("4k")) {
            visited.add(b);
          }
        });

        const prevY = window.scrollY;
        window.scrollBy(0, window.innerHeight);
        await sleep(400);
        if (window.scrollY === prevY) break;
      }
    } finally {
      window.scrollTo(0, originalY);
    }

    return visited.size;
  }

  async function runUpscaleMode(options) {
    const randomDelay =
      options && typeof options === "object" ? options : {};
    const rawCapacity =
      options && typeof options.batchCapacity === "number"
        ? options.batchCapacity
        : 3;
    const batchCapacity = [1, 2, 3].includes(rawCapacity)
      ? rawCapacity
      : 3;

    const randDelaySec = () => {
      if (
        !randomDelay ||
        typeof randomDelay.min !== "number" ||
        typeof randomDelay.max !== "number"
      ) {
        return 2;
      }
      return Math.floor(
        Math.random() *
          (randomDelay.max - randomDelay.min + 1) +
          randomDelay.min
      );
    };

    const LONG_COOLDOWN = 20;
    let batchClicks = 0;
    let doneCount = 0;

    const estimatedTotal = await estimateUpscaleTargets();
    if (estimatedTotal > 0) {
      updateStatus(
        `Found ~${estimatedTotal} 4K items. Starting...`,
        "#38bdf8"
      );
    }

    while (!STATE.stopRequested) {
      while (STATE.isPaused) {
        updateStatus("PAUSED (Upscale)", "#fbbf24");
        await sleep(1000);
      }

      let btn = null;

      while (!STATE.stopRequested && !btn) {
        const allButtons = Array.from(
          document.querySelectorAll("button")
        );
        const fourKButtons = allButtons.filter((b) => {
          const txt = (b.innerText || "")
            .trim()
            .toLowerCase();
          return txt.includes("4k") && !b.dataset.rwUpscaled;
        });

        if (fourKButtons.length > 0) {
          btn = fourKButtons[0];
          break;
        }

        const prevY = window.scrollY;
        window.scrollBy(0, window.innerHeight);
        updateStatus(
          "Scrolling to find more 4K buttons...",
          "#94a3b8"
        );
        await sleep(1500);

        if (window.scrollY === prevY) {
          updateStatus(
            "No more 4K buttons found.",
            "#22c55e"
          );
          return;
        }
      }

      if (!btn || STATE.stopRequested) break;

      btn.scrollIntoView({ block: "center", behavior: "smooth" });
      await sleep(200);

      while (!STATE.stopRequested) {
        const style = window.getComputedStyle(btn);
        const isDisabled =
          btn.disabled ||
          btn.hasAttribute("disabled") ||
          btn.getAttribute("aria-disabled") === "true" ||
          style.cursor === "not-allowed" ||
          style.pointerEvents === "none" ||
          style.opacity === "0.5";

        if (isDisabled) {
          updateStatus(
            "4K Queue Full... Waiting...",
            "#fbbf24"
          );
          await sleep(3000);
          continue;
        }

        const labelProgress =
          estimatedTotal > 0
            ? ` (${doneCount}/${estimatedTotal})`
            : "";

        updateStatus(
          "Clicking 4K Upscale..." + labelProgress,
          "#22c55e"
        );
        await ensureNetworkFast();
        btn.click();
        btn.dataset.rwUpscaled = "1";
        doneCount++;
        batchClicks++;
        break;
      }

      if (STATE.stopRequested) break;

      let waitTime = randDelaySec();
      let useLongCooldown = false;

      if (batchCapacity === 1) {
        useLongCooldown = true;
      } else if (batchCapacity === 2 && batchClicks >= 2) {
        useLongCooldown = true;
      } else if (batchCapacity >= 3 && batchClicks >= 3) {
        useLongCooldown = true;
      }

      if (useLongCooldown) {
        waitTime = LONG_COOLDOWN;
        batchClicks = 0;
      }

      for (let s = waitTime; s > 0; s--) {
        if (STATE.stopRequested) break;
        const label = useLongCooldown
          ? "4K Queue Cooldown"
          : "Upscale Cooldown";
        updateStatus(`${label}: ${s}s`, "#94a3b8");
        await sleep(1000);
      }
    }

    if (!STATE.stopRequested) {
      updateStatus("Auto 4K Upscale Complete.", "#22c55e");
    } else {
      updateStatus("Upscale Stopped.", "#ef4444");
    }
  }

  // ==== BULK CSV MODE (tumhara purana handleStart + runQueue) ====
  async function handleStart() {
    const folderId =
      document.getElementById("folderSelect").value;
    const fileInput = document.getElementById("csvFile");
    const styleKey =
      document.getElementById("promptStyle").value;

    if (!folderId || !fileInput.files[0])
      return alert(
        "Please select a Folder and Upload a CSV."
      );

    const res =
      await chrome.storage.local.get(["rw_selectors"]);
    const s = res.rw_selectors || {};
    if (!s.assets || !s.search || !s.prompt)
      return alert(
        "Please train Assets, Search, and Prompt buttons first."
      );

    STATE.stopRequested = false;
    STATE.isPaused = false;
    document.getElementById(
      "startAutoBtn"
    ).style.display = "none";

    try {
      const text = await fileInput.files[0].text();
      const csvRows = parseCSV(text);
      const assets = await getAssetsInFolder(folderId);
      if (assets.length === 0)
        throw new Error("Folder appears empty.");

      updateStatus("Matching files...", "#fbbf24");
      const queue = [];
      csvRows.forEach((row) => {
        const match = assets.find(
          (a) =>
            normalizeName(a.name).includes(row.cleanName) ||
            row.cleanName.includes(normalizeName(a.name))
        );
        if (match)
          queue.push({
            assetName: match.name,
            originalName: row.originalName,
            cleanName: row.cleanName,
            prompt:
              row[styleKey] ||
              row.medium ||
              row.low ||
              "",
          });
      });

      if (queue.length === 0)
        throw new Error(
          "No matches found in CSV/Folder."
        );

      const rangeVal =
        document.getElementById("delayPreset").value;
      const [min, max] = rangeVal.split("-").map(Number);

      const batchKey = `csv:${fileInput.files[0].name}|folder:${folderId}`;

      await runQueue(queue, { min, max }, s, batchKey);
    } catch (e) {
      updateStatus("Error: " + e.message, "#ef4444");
    } finally {
      document.getElementById(
        "startAutoBtn"
      ).style.display = "block";
      setTimeout(
        () =>
          document
            .getElementById("runway-status-pill")
            .classList.remove("visible"),
        5000
      );
    }
  }

  async function runQueue(queue, randomDelay, selectors, batchKey) {
    const randDelaySec = () => {
      if (
        !randomDelay ||
        typeof randomDelay.min !== "number" ||
        typeof randomDelay.max !== "number"
      ) {
        return 2;
      }
      return Math.floor(
        Math.random() *
          (randomDelay.max - randomDelay.min + 1) +
          randomDelay.min
      );
    };

    const assetsClicks = parseInt(
      document.getElementById("clicks-assets")?.value ||
        1
    );
    const remClicks = parseInt(
      document.getElementById("clicks-remove")?.value ||
        1
    );
    const historyMem = await chrome.storage.local.get([
      "rw_jobHistory",
    ]);
    const historyAll = historyMem.rw_jobHistory || {};
    const historyKey = batchKey || null;
    let doneSet = new Set();

    if (historyKey && Array.isArray(historyAll[historyKey])) {
      doneSet = new Set(historyAll[historyKey]);
    }

    function saveHistory() {
      if (!historyKey) return;
      historyAll[historyKey] = Array.from(doneSet);
      chrome.storage.local.set({
        rw_jobHistory: historyAll,
      });
    }

    function markDone(name) {
      if (!historyKey || !name) return;
      doneSet.add(name);
      saveHistory();
    }

    for (let i = 0; i < queue.length; i++) {
      if (STATE.stopRequested) break;
      while (STATE.isPaused) {
        updateStatus("PAUSED", "#fbbf24");
        await sleep(1000);
      }

      const item = queue[i];
      const historyName =
        item.cleanName ||
        item.assetName ||
        item.originalName;

      if (
        historyKey &&
        historyName &&
        doneSet.has(historyName)
      ) {
        updateStatus(
          `Skip (history): ${historyName}`,
          "#94a3b8"
        );
        await sleep(500);
        continue;
      }

      updateStatus(
        `Job ${i + 1}/${queue.length}: ${item.cleanName}`,
        "#38bdf8"
      );
      const prog = document.getElementById("rf-progress");
      if (prog)
        prog.style.width = `${
          ((i + 1) / queue.length) * 100
        }%`;

      while (
        document.body.innerText.includes("Queued") ||
        document.body.innerText.includes("Generating...")
      ) {
        if (STATE.stopRequested) break;
        updateStatus("Queue Busy...", "#fbbf24");
        await sleep(2000);
      }

      if (i > 0 && selectors.remove) {
        updateStatus(
          "Clearing previous result...",
          "#94a3b8"
        );
        await performClick(
          selectors.remove,
          1500,
          remClicks > 1
        );
        const waitAfterRemove = randDelaySec();
        await sleep(waitAfterRemove * 1000);
      }

      if (STATE.stopRequested) break;
      updateStatus("Opening Assets...", "#94a3b8");

      if (selectors.assets) {
        const ok = await performClick(
          selectors.assets,
          1000,
          assetsClicks > 1
        );
        if (!ok) {
          updateStatus(
            "Assets Button Missing",
            "#ef4444"
          );
          continue;
        }
      }

      const waitAfterAssets = randDelaySec();
      await sleep(waitAfterAssets * 1000);

      if (STATE.stopRequested) break;
      updateStatus("Searching...", "#94a3b8");

      if (await performClick(selectors.search, 1000)) {
        const [sx, sy] = selectors.search
          .split(":")[1]
          .split(",")
          .map(Number);
        let el = document.elementFromPoint(sx, sy);
        if (el && el.tagName !== "INPUT") {
          el =
            el.querySelector("input") ||
            el.closest("input");
        }
        if (el) {
          el.focus();
          document.execCommand("selectAll");
          document.execCommand("delete");
          await sleep(50);

          const baseName = (
            item.originalName || item.cleanName || ""
          ).replace(/\.[^.\s]+$/, "");
          document.execCommand(
            "insertText",
            false,
            baseName
          );

          el.dispatchEvent(
            new Event("input", { bubbles: true })
          );
          const waitAfterSearch = randDelaySec();
          await sleep(waitAfterSearch * 1000);
        }
      }

      updateStatus("Selecting Image...", "#38bdf8");
      let foundImg = false;
      const imgClicks = parseInt(
        document.getElementById("clicks-image")?.value ||
          2
      );

      if (selectors.image) {
        foundImg = await performClick(
          selectors.image,
          1000,
          imgClicks > 1
        );
      }

      if (!foundImg) {
        const gridItem = document.querySelector(
          'div[data-testid="asset-grid-item"]'
        );
        if (gridItem) {
          gridItem.scrollIntoView({
            block: "center",
          });
          await sleep(80);
          gridItem.click();
          if (imgClicks > 1) {
            await sleep(120);
            gridItem.click();
          }
          foundImg = true;
        }
      }

      if (!foundImg) {
        updateStatus("Img Not Found", "#ef4444");
        continue;
      }

      const waitAfterImage = randDelaySec();
      await sleep(waitAfterImage * 1000);

      updateStatus("Typing Prompt...", "#38bdf8");

      if (await performClick(selectors.prompt, 2000)) {
        const [px, py] = selectors.prompt
          .split(":")[1]
          .split(",")
          .map(Number);
        let el = document.elementFromPoint(px, py);
        if (el && el.tagName !== "TEXTAREA") {
          el =
            el.querySelector("textarea") ||
            el.closest("textarea") ||
            el;
        }
        el.focus();
        document.execCommand("selectAll");
        document.execCommand("delete");
        document.execCommand(
          "insertText",
          false,
          item.prompt.replace(/^"|"$/g, "")
        );
        const waitAfterPrompt = randDelaySec();
        await sleep(waitAfterPrompt * 1000);
      }

      updateStatus("Generating...", "#22c55e");

      while (true) {
        if (STATE.stopRequested) break;
        const btns = Array.from(
          document.querySelectorAll("button")
        );
        const genBtn = btns.find((b) =>
          b.innerText
            .trim()
            .toLowerCase()
            .startsWith("generate")
        );
        if (!genBtn) {
          await sleep(2000);
          continue;
        }
        const isDisabled =
          genBtn.disabled ||
          genBtn.hasAttribute("disabled") ||
          window.getComputedStyle(genBtn).cursor ===
            "not-allowed";
        if (isDisabled) {
          updateStatus(
            "Waiting for Button...",
            "#fbbf24"
          );
          await sleep(3000);
        } else {
          await ensureNetworkFast();
          genBtn.click();
          await sleep(2000);
          if (historyKey && historyName) {
            markDone(historyName);
          }
          break;
        }
      }

      const waitTime = Math.floor(
        Math.random() *
          (randomDelay.max - randomDelay.min + 1) +
          randomDelay.min
      );
      for (let s = waitTime; s > 0; s--) {
        if (STATE.stopRequested) break;
        updateStatus(`Cooldown: ${s}s`, "#fbbf24");
        await sleep(1000);
      }
    }

    updateStatus(
      STATE.stopRequested ? "Stopped." : "Batch Complete!",
      STATE.stopRequested ? "#ef4444" : "#22c55e"
    );
  }

  // Public hooks for contentScript
  window.rwServerAuto = window.rwServerAuto || {};
  window.rwServerAuto.handleStart = handleStart;
  window.rwServerAuto.handleUpscaleStart = handleUpscaleStart;
})();
