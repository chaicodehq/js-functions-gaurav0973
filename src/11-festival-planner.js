/**
 * 🎉 Festival Countdown Planner - Module Pattern
 *
 * Indian festivals ka planner bana! Module pattern use karna hai —
 * matlab ek function jo ek object return kare jisme public methods hain,
 * lekin andar ka data PRIVATE rahe (bahar se directly access na ho sake).
 *
 * Function: createFestivalManager()
 *
 * Returns an object with these PUBLIC methods:
 *
 *   - addFestival(name, date, type)
 *     date is "YYYY-MM-DD" string, type is "religious"/"national"/"cultural"
 *     Returns new total count of festivals
 *     Agar name empty or date not string or invalid type, return -1
 *     No duplicate names allowed (return -1 if exists)
 *
 *   - removeFestival(name)
 *     Returns true if removed, false if not found
 *
 *   - getAll()
 *     Returns COPY of all festivals array (not the actual private array!)
 *     Each festival: { name, date, type }
 *
 *   - getByType(type)
 *     Returns filtered array of festivals matching type
 *
 *   - getUpcoming(currentDate, n = 3)
 *     currentDate is "YYYY-MM-DD" string
 *     Returns next n festivals that have date >= currentDate
 *     Sorted by date ascending
 *
 *   - getCount()
 *     Returns total number of festivals
 *
 * PRIVATE STATE: festivals array should NOT be accessible from outside.
 *   manager.festivals should be undefined.
 *   getAll() must return a COPY so modifying it doesn't affect internal state.
 *   Two managers should be completely independent.
 *
 * Hint: This is the Module Pattern — a function that returns an object
 *   of methods, all closing over shared private variables.
 *
 * @example
 *   const mgr = createFestivalManager();
 *   mgr.addFestival("Diwali", "2025-10-20", "religious");   // => 1
 *   mgr.addFestival("Republic Day", "2025-01-26", "national"); // => 2
 *   mgr.getAll(); // => [{ name: "Diwali", ... }, { name: "Republic Day", ... }]
 *   mgr.getUpcoming("2025-01-01", 1); // => [{ name: "Republic Day", ... }]
 */
export function createFestivalManager() {
  let festivals = [];

  const validTypes = new Set(["religious", "national", "cultural"]);

  function isValidDateStr(d) {
    return typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
  }

  function addFestival(name, date, type) {
    if (
      !name ||
      typeof name !== "string" ||
      !isValidDateStr(date) ||
      !validTypes.has(type)
    ) {
      return -1;
    }

    for (let i = 0; i < festivals.length; i++) {
      if (festivals[i].name === name) return -1;
    }

    festivals.push({ name, date, type });
    return festivals.length;
  }

  function removeFestival(name) {
    for (let i = 0; i < festivals.length; i++) {
      if (festivals[i].name === name) {
        festivals = [
          ...festivals.slice(0, i),
          ...festivals.slice(i + 1)
        ];
        return true;
      }
    }
    return false;
  }

  function getAll() {
    const copy = [];
    for (let i = 0; i < festivals.length; i++) {
      const f = festivals[i];
      copy.push({ name: f.name, date: f.date, type: f.type });
    }
    return copy;
  }

  function getByType(type) {
    const res = [];
    for (let i = 0; i < festivals.length; i++) {
      if (festivals[i].type === type) {
        const f = festivals[i];
        res.push({ name: f.name, date: f.date, type: f.type });
      }
    }
    return res;
  }

  function getUpcoming(currentDate, n = 3) {
    if (!isValidDateStr(currentDate)) return [];

    const filtered = [];

    for (let i = 0; i < festivals.length; i++) {
      if (festivals[i].date >= currentDate) {
        const f = festivals[i];
        filtered.push({ name: f.name, date: f.date, type: f.type });
      }
    }

    filtered.sort((a, b) => a.date.localeCompare(b.date));

    return filtered.slice(0, n);
  }

  function getCount() {
    return festivals.length;
  }

  return {
    addFestival,
    removeFestival,
    getAll,
    getByType,
    getUpcoming,
    getCount
  };
}

