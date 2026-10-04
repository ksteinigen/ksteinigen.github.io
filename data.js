(() => {
  const storageKey = "goodkind-care-visits-v1";
  const services = ["Grooming", "Daycare", "Walk"];
  const statuses = ["Scheduled", "Complete", "Cancelled"];

  function demoRecords() {
    const today = new Date();
    const dateAfter = (days) => {
      const date = new Date(today);
      date.setDate(date.getDate() + days);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      return localDate.toISOString().slice(0, 10);
    };

    return [
      { id: "demo-1", petName: "Milo", parentName: "Sarah", service: "Daycare", date: dateAfter(1), status: "Scheduled" },
      { id: "demo-2", petName: "Luna", parentName: "Jordan", service: "Grooming", date: dateAfter(2), status: "Scheduled" },
      { id: "demo-3", petName: "Buddy", parentName: "Casey", service: "Walk", date: dateAfter(3), status: "Scheduled" },
      { id: "demo-4", petName: "Clover", parentName: "Morgan", service: "Daycare", date: dateAfter(-1), status: "Complete" },
      { id: "demo-5", petName: "Maple", parentName: "Taylor", service: "Grooming", date: dateAfter(4), status: "Scheduled" },
      { id: "demo-6", petName: "Otis", parentName: "Riley", service: "Walk", date: dateAfter(-2), status: "Complete" },
      { id: "demo-7", petName: "Poppy", parentName: "Avery", service: "Daycare", date: dateAfter(5), status: "Scheduled" },
      { id: "demo-8", petName: "Benny", parentName: "Jamie", service: "Grooming", date: dateAfter(-3), status: "Cancelled" },
      { id: "demo-9", petName: "Olive", parentName: "Drew", service: "Walk", date: dateAfter(6), status: "Scheduled" }
    ];
  }

  function isValidRecord(record) {
    return record
      && typeof record.id === "string"
      && typeof record.petName === "string"
      && typeof record.parentName === "string"
      && services.includes(record.service)
      && typeof record.date === "string"
      && statuses.includes(record.status);
  }

  function save(records) {
    if (!Array.isArray(records) || !records.every(isValidRecord)) {
      throw new Error("The care records could not be saved because their data is invalid.");
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(records));
    } catch (error) {
      throw new Error(`The browser could not save care records: ${error.message}`);
    }
  }

  function load() {
    let stored;
    try {
      stored = localStorage.getItem(storageKey);
    } catch (error) {
      throw new Error(`The browser could not read care records: ${error.message}`);
    }

    if (stored === null) {
      const initialRecords = demoRecords();
      save(initialRecords);
      return initialRecords;
    }

    let records;
    try {
      records = JSON.parse(stored);
    } catch {
      throw new Error("Saved care records could not be read. Clear this site's browser storage to reload the sample data.");
    }
    if (!Array.isArray(records) || !records.every(isValidRecord)) {
      throw new Error("Saved care records have an unexpected format. Clear this site's browser storage to reload the sample data.");
    }
    return records;
  }

  window.GoodkindData = { storageKey, services, statuses, load, save };
})();
