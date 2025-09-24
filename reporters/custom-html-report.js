// reporters/custom-html-reporter.js
const fs = require('fs');
const path = require('path');

/**
 * CustomHtmlReporter
 * - Groups tests by titlePath (describe groups -> considered "Scenario")
 * - Writes a single HTML file with a summary + table:
 *    Scenario | Test Case | Status | Duration(ms) | Error (if failed) | Attachments
 *
 * Use via playwright.config.js or --reporter=./reporters/custom-html-reporter.js
 */
class CustomHtmlReporter {
  constructor(options = {}) {
    this.options = options;
    this.results = [];
    this.outputFile = options.outputFile || path.join(process.cwd(), 'custom-playwright-report.html');
  }

  onBegin(config, suite) {
    this.startTime = new Date();
    try { this.total = suite.allTests().length; } catch (e) { this.total = undefined; }
  }

  onTestEnd(test, result) {
    // test.titlePath() returns array of title path (file/describe/.../test)
    const titlePath = (typeof test.titlePath === 'function') ? test.titlePath() : (test.titlePath || [test.title]);
    const testCase = titlePath[titlePath.length - 1] || test.title;
    const scenario = titlePath.slice(0, -1).join(' › ') || (test.location && path.basename(test.location.file)) || 'root';

    const error = result.error ? {
      message: (result.error.message || '').toString(),
      stack: (result.error.stack || '').toString()
    } : null;

    // attachments may have { name, contentType, path } - path links to file if present.
    const attachments = (result.attachments || []).map(a => ({
      name: a.name,
      path: a.path || null,
      contentType: a.contentType || null
    }));

    this.results.push({
      scenario,
      testCase,
      status: result.status,         // 'passed' | 'failed' | 'skipped' | ...
      duration: result.duration || 0,
      error,
      attachments,
      titlePath
    });
  }

  onEnd(fullResult) {
    const meta = {
      startTime: this.startTime,
      finishTime: new Date(),
      total: this.total ?? this.results.length,
      passed: this.results.filter(r => r.status === 'passed').length,
      failed: this.results.filter(r => r.status === 'failed').length,
      skipped: this.results.filter(r => r.status === 'skipped').length
    };

    const html = buildHtml(this.results, meta);
    fs.writeFileSync(this.outputFile, html, 'utf8');
    // Inform user where the report is
    // Playwright will still print its own console output; our reporter just writes the file.
    console.log(`\nCustom HTML report written to: ${this.outputFile}\n`);
  }
}

function escapeHtml(s = '') {
  return s
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildHtml(results, meta) {
  // Group by scenario for a nicer table (scenario -> tests[])
  const groups = results.reduce((acc, r) => {
    acc[r.scenario] = acc[r.scenario] || [];
    acc[r.scenario].push(r);
    return acc;
  }, {});

  const rowsHtml = Object.entries(groups).map(([scenario, tests]) => {
    const testsRows = tests.map(t => {
      const errHtml = t.error ? `<details><summary>${escapeHtml(t.error.message)}</summary><pre>${escapeHtml(t.error.stack)}</pre></details>` : '';
      const attachHtml = (t.attachments.length === 0)
        ? ''
        : t.attachments.map(a => {
            if (a.path) {
              // link relative file path if available
              return `<div><a href="${encodeURI(a.path)}" target="_blank">${escapeHtml(a.name || a.path)}</a></div>`;
            } else {
              return `<div>${escapeHtml(a.name || 'attachment')}</div>`;
            }
          }).join('');
      const statusClass = t.status === 'passed' ? 'pass' : (t.status === 'failed' ? 'fail' : 'skip');

      return `
        <tr>
          <td class="scenario">${escapeHtml(scenario)}</td>
          <td class="case">${escapeHtml(t.testCase)}</td>
          <td class="status ${statusClass}">${escapeHtml(t.status)}</td>
          <td class="duration">${escapeHtml(String(t.duration || 0))}</td>
          <td class="error">${errHtml}</td>
          <td class="attachments">${attachHtml}</td>
        </tr>`;
    }).join('\n');

    return testsRows;
  }).join('\n');

  // small inline CSS for clarity
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Playwright — Custom HTML Report</title>
<meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  body{font-family:system-ui,Segoe UI,Roboto,Arial;margin:18px;color:#111}
  h1{font-size:20px}
  .summary {margin-bottom:12px}
  table{width:100%;border-collapse:collapse}
  th,td{padding:8px;border:1px solid #e5e7eb;text-align:left;vertical-align:top}
  th{background:#f3f4f6}
  .status.pass{color:green;font-weight:600}
  .status.fail{color:#b91c1c;font-weight:700}
  .status.skipped{color:#6b7280}
  details pre{white-space:pre-wrap;background:#111827;color:#f8fafc;padding:8px;border-radius:6px;overflow:auto}
  .scenario{width:22%}
  .case{width:28%}
  .duration{width:8%}
  .error{width:30%}
</style>
</head>
<body>
  <h1>Playwright — Custom HTML Report</h1>
  <div class="summary">
    <strong>Started:</strong> ${meta.startTime}<br/>
    <strong>Finished:</strong> ${meta.finishTime}<br/>
    <strong>Total:</strong> ${meta.total} &nbsp;&nbsp;
    <strong>Passed:</strong> ${meta.passed} &nbsp;&nbsp;
    <strong>Failed:</strong> ${meta.failed} &nbsp;&nbsp;
    <strong>Skipped:</strong> ${meta.skipped}
  </div>

  <table>
    <thead>
      <tr>
        <th>Scenario (describe)</th>
        <th>Test Case (title)</th>
        <th>Status</th>
        <th>Duration (ms)</th>
        <th>Error (if failed)</th>
        <th>Attachments</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml || `<tr><td colspan="6">No tests ran.</td></tr>`}
    </tbody>
  </table>
</body>
</html>`;
}

module.exports = CustomHtmlReporter;
