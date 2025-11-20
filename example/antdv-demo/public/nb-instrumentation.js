/**
 * Nanobrowser instrumentation (Ant Design Vue / AntDV)
 *
 * Purpose:
 * - Provide reliable, first-run interactions for AntDV components based on data-nb-* hints
 * - Cover common actions: click, input_text, select_dropdown_option, set_date_picker_value
 * - Implement robust open-and-pick flows for AntDV Select and Date/Time Picker
 *
 * Scope:
 * - This file currently targets AntDV only (selectors: .ant-select-*, .ant-picker-*)
 * - Designed to be extended for other UI libraries (e.g. Element Plus, JeecgBoot)
 *
 * Extension plan:
 * - Add library-specific open/pick helpers (e.g., openElSelect, pickElDate/Time)
 * - Detect active library via DOM markers, then route in runAction
 * - Keep setValue/input dispatch semantics consistent across libraries
 */
(function () {
  // AntDV Select helpers
  function hasAntSelectPanel() {
    var p = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
    return !!p;
  }
  function openAntSelect(target) {
    try {
      target.click();
      if (hasAntSelectPanel()) return true;
      var selector = target.querySelector('.ant-select-selector');
      if (selector) {
        selector.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        selector.click();
        if (hasAntSelectPanel()) return true;
      }
      var arrow = target.querySelector('.ant-select-arrow');
      if (arrow) {
        arrow.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        arrow.click();
        if (hasAntSelectPanel()) return true;
      }
      var input = target.querySelector('input.ant-select-selection-search-input');
      if (input) {
        try {
          input.focus();
          input.click();
        } catch (e) {}
        if (hasAntSelectPanel()) return true;
      }
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return hasAntSelectPanel();
    } catch (e) {
      return false;
    }
  }
  function cssSelector(el) {
    var dataId = el.getAttribute('data-nb-id');
    if (dataId) return '[data-nb-id="' + dataId + '"]';
    var id = el.id;
    if (id) return '#' + id;
    return el.tagName.toLowerCase();
  }
  function collect() {
    var nodes = Array.from(
      document.querySelectorAll('[data-nb-id], [data-nb-action], [data-nb-role], [data-nb-target], [data-nb-format]'),
    );
    return nodes.map(function (n) {
      return {
        id: n.getAttribute('data-nb-id') || undefined,
        action: n.getAttribute('data-nb-action') || undefined,
        role: n.getAttribute('data-nb-role') || undefined,
        target: n.getAttribute('data-nb-target') || undefined,
        format: n.getAttribute('data-nb-format') || undefined,
        selector: cssSelector(n),
        page: location.pathname,
      };
    });
  }
  function readMap() {
    var s = document.querySelector(
      '#nanobrowser-map, script[data-nb-map], script[type="application/json"][id="nanobrowser-map"]',
    );
    if (!s) {
      var g = window.NANOBROWSER_MAP;
      if (g) return g;
      return null;
    }
    try {
      return JSON.parse(s.textContent || '{}');
    } catch (e) {
      return null;
    }
  }
  // Generic input value setter with event dispatch
  function setValue(el, v) {
    try {
      var d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
      if (d && d.set) d.set.call(el, v);
      else el.value = v;
    } catch (e) {
      el.value = v;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }
  // AntDV Date/Time Picker helpers
  function hasAntPickerPanel() {
    var p = document.querySelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)');
    return !!p;
  }
  function openAntPicker(target) {
    try {
      target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      target.click();
      if (hasAntPickerPanel()) return true;
      var input = target.querySelector('input');
      if (input) {
        input.focus();
        input.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        input.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        input.click();
        if (hasAntPickerPanel()) return true;
      }
      var suffix = target.querySelector('.ant-picker-suffix');
      if (suffix) {
        suffix.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        suffix.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        suffix.click();
        if (hasAntPickerPanel()) return true;
      }
      var trigger = target.querySelector('.ant-picker');
      if (trigger) {
        trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        trigger.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        trigger.click();
        if (hasAntPickerPanel()) return true;
      }
      target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return hasAntPickerPanel();
    } catch (e) {
      return false;
    }
  }
  function pickAntDate(value) {
    var panel = document.querySelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)');
    if (!panel) return false;
    var v = String(value).trim();
    var cell = panel.querySelector(
      '[title="' + v + '"] .ant-picker-cell-inner, [aria-label="' + v + '"] .ant-picker-cell-inner',
    );
    if (cell) {
      cell.click();
      var ok = document.querySelector('.ant-picker-ok button, .ant-picker-ok');
      if (ok)
        setTimeout(function () {
          try {
            ok.click();
          } catch (e) {}
        }, 10);
      return true;
    }
    var parts = v.split('-');
    if (parts.length === 3) {
      var day = String(Number(parts[2]));
      var cells = panel.querySelectorAll('.ant-picker-cell-inner');
      for (var i = 0; i < cells.length; i++) {
        if (cells[i].textContent === day) {
          cells[i].click();
          var ok2 = document.querySelector('.ant-picker-ok button, .ant-picker-ok');
          if (ok2)
            setTimeout(function () {
              try {
                ok2.click();
              } catch (e) {}
            }, 10);
          return true;
        }
      }
    }
    return false;
  }
  function pickAntDateAdvanced(value) {
    var v = String(value || '').trim();
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return false;
    var Y = Number(m[1]);
    var M = Number(m[2]);
    var D = Number(m[3]);
    var yearBtn = document.querySelector('.ant-picker-dropdown .ant-picker-year-btn');
    if (yearBtn) yearBtn.click();
    function visibleYears() {
      var ys = [];
      var ysCells = document.querySelectorAll('.ant-picker-year-panel .ant-picker-cell-inner');
      for (var i = 0; i < ysCells.length; i++) {
        var t = Number((ysCells[i].textContent || '').trim());
        if (!isNaN(t)) ys.push(t);
      }
      return ys;
    }
    var guard = 0;
    while (guard++ < 20) {
      var ys = visibleYears();
      if (!ys.length) break;
      var minY = Math.min.apply(null, ys),
        maxY = Math.max.apply(null, ys);
      if (Y < minY) {
        var prevDec = document.querySelector('.ant-picker-year-panel .ant-picker-header-super-prev-btn');
        if (prevDec) {
          prevDec.click();
          continue;
        } else break;
      }
      if (Y > maxY) {
        var nextDec = document.querySelector('.ant-picker-year-panel .ant-picker-header-super-next-btn');
        if (nextDec) {
          nextDec.click();
          continue;
        } else break;
      }
      var yCells = document.querySelectorAll('.ant-picker-year-panel .ant-picker-cell-inner');
      var picked = false;
      for (var i = 0; i < yCells.length; i++) {
        if (Number((yCells[i].textContent || '').trim()) === Y) {
          yCells[i].click();
          picked = true;
          break;
        }
      }
      if (picked) break;
      else {
        var prevDec2 = document.querySelector('.ant-picker-year-panel .ant-picker-header-super-prev-btn');
        if (prevDec2) {
          prevDec2.click();
          continue;
        } else break;
      }
    }
    var monthBtn = document.querySelector('.ant-picker-dropdown .ant-picker-month-btn');
    if (monthBtn) monthBtn.click();
    var mCells = document.querySelectorAll('.ant-picker-month-panel .ant-picker-cell-inner');
    if (mCells && mCells.length >= M) {
      mCells[M - 1].click();
    }
    var okMonth = document.querySelector('.ant-picker-ok button, .ant-picker-ok');
    if (okMonth)
      setTimeout(function () {
        try {
          okMonth.click();
        } catch (e) {}
      }, 10);
    return pickAntDate(String(Y) + '-' + String(M).padStart(2, '0') + '-' + String(D).padStart(2, '0'));
  }
  function pickAntTime(value) {
    var parts = String(value || '').split(':');
    if (parts.length < 2) return false;
    var panel = document.querySelector('.ant-picker-dropdown:not(.ant-picker-dropdown-hidden)');
    if (!panel) return false;
    var cols = panel.querySelectorAll('.ant-picker-time-panel-column');
    var hh = parts[0],
      mm = parts[1],
      ss = parts[2] || '00';
    function pick(colIdx, val) {
      var col = cols[colIdx];
      if (!col) return false;
      var items = col.querySelectorAll('.ant-picker-time-panel-cell-inner');
      for (var i = 0; i < items.length; i++) {
        if (items[i].textContent === String(val)) {
          items[i].click();
          return true;
        }
      }
      return false;
    }
    var ok1 = pick(0, hh);
    var ok2 = pick(1, mm);
    var ok3 = pick(2, ss);
    var ok = document.querySelector('.ant-picker-ok button, .ant-picker-ok');
    if (ok)
      setTimeout(function () {
        try {
          ok.click();
        } catch (e) {}
      }, 10);
    return ok1 || ok2 || ok3;
  }
  function runAction(element, payload) {
    var target = document.querySelector(element.selector);
    if (!target) return false;
    var action = element.action || 'click';
    if (action === 'click') {
      target.click();
      return true;
    }
    if (action === 'input_text') {
      var v = (payload && payload.text) || '示例输入';
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        setValue(target, v);
        return true;
      }
      var inner = target.querySelector('input,textarea');
      if (inner) {
        setValue(inner, v);
        return true;
      }
      return false;
    }
    if (action === 'select_dropdown_option') {
      var v = (payload && payload.option) || '北京';
      if (target instanceof HTMLSelectElement) {
        target.value = v;
        target.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      var sel = target.querySelector('select');
      if (sel) {
        sel.value = v;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      var opened = openAntSelect(target);
      var tryPick = function () {
        var panel = document.querySelector('.ant-select-dropdown:not(.ant-select-dropdown-hidden)');
        if (!panel) return false;
        var items = panel.querySelectorAll('.ant-select-item-option');
        for (var i = 0; i < items.length; i++) {
          var txt = (items[i].querySelector('.ant-select-item-option-content') || items[i]).textContent || '';
          if (txt.trim() === String(v).trim()) {
            var el = items[i];
            if (el && el.click) el.click();
            else el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return true;
          }
        }
        return false;
      };
      if (opened && tryPick()) return true;
      setTimeout(function () {
        if (!hasAntSelectPanel()) openAntSelect(target);
        setTimeout(function () {
          tryPick();
        }, 60);
      }, 60);
      return true;
    }
    if (action === 'set_date_picker_value') {
      var v = (payload && payload.value) || (element.format === 'YYYY-MM-DD' ? '1990-01-01' : '12:00:00');
      var opened = openAntPicker(target);
      if (element.format === 'YYYY-MM-DD') {
        if (opened && (pickAntDate(v) || pickAntDateAdvanced(v))) return true;
        setTimeout(function () {
          if (!hasAntPickerPanel()) openAntPicker(target);
          setTimeout(function () {
            if (!(pickAntDate(v) || pickAntDateAdvanced(v))) {
              var input = target.querySelector('input');
              if (input) {
                try {
                  input.removeAttribute && input.removeAttribute('readonly');
                  input.focus();
                  setValue(input, v);
                  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                  if (input && input.blur) input.blur();
                } catch (e) {}
              }
            }
          }, 150);
        }, 150);
        return true;
      } else {
        if (opened && pickAntTime(v)) return true;
        setTimeout(function () {
          if (!hasAntPickerPanel()) openAntPicker(target);
          setTimeout(function () {
            if (!pickAntTime(v)) {
              var input = target.querySelector('input');
              if (input) {
                try {
                  input.removeAttribute && input.removeAttribute('readonly');
                  input.focus();
                  setValue(input, v);
                  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
                  if (input && input.blur) input.blur();
                } catch (e) {}
              }
            }
          }, 150);
        }, 150);
        return true;
      }
    }
    return false;
  }
  // Public API and auto-rescan on DOM mutations
  var state = { elements: [], map: null, lastScanAt: 0 };
  var api = {
    state: state,
    scan: function () {
      state.elements = collect();
      state.map = readMap();
      state.lastScanAt = Date.now();
      return state;
    },
    runById: function (id, payload) {
      var el = state.elements.find(function (x) {
        return x.id === id;
      });
      if (!el) return false;
      return runAction(el, payload || {});
    },
    runBySelector: function (selector, payload) {
      var el = state.elements.find(function (x) {
        return x.selector === selector;
      });
      if (!el) el = { selector: selector, action: 'click' };
      return runAction(el, payload || {});
    },
    runElement: function (rec, payload) {
      if (!rec || !rec.selector) return false;
      return runAction(rec, payload || {});
    },
  };
  window.__nbInstrumentation = api;
  api.scan();
  var mo = new MutationObserver(function () {
    api.scan();
  });
  mo.observe(document.documentElement, { subtree: true, childList: true, attributes: true });
})();
