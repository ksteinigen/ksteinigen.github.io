(() => {
  const form = document.querySelector("#visit-form");
  const recordsBody = document.querySelector("#records-body");
  const recordCount = document.querySelector("#record-count");
  const emptyState = document.querySelector("#empty-state");
  const statusMessage = document.querySelector("#crud-status");
  const errorMessage = document.querySelector("#crud-error");
  const storageMessage = document.querySelector("#storage-message");
  const formTitle = document.querySelector("#form-title");
  const saveButton = document.querySelector("#save-visit");
  const cancelButton = document.querySelector("#cancel-edit");
  const dateInput = document.querySelector("#visit-date");
  let records = [];
  let editingId = null;

  const localToday = new Date();
  dateInput.min = new Date(localToday.getTime() - localToday.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function showError(error) {
    errorMessage.textContent = error.message;
    errorMessage.hidden = false;
  }

  function clearError() {
    errorMessage.textContent = "";
    errorMessage.hidden = true;
  }

  function formatDate(value) {
    return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function makeCell(value, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = value;
    return cell;
  }

  function render() {
    recordsBody.replaceChildren();
    const sortedRecords = [...records].sort((first, second) => first.date.localeCompare(second.date));

    sortedRecords.forEach((record) => {
      const row = document.createElement("tr");
      row.append(
        makeCell(record.petName),
        makeCell(record.parentName),
        makeCell(record.service),
        makeCell(formatDate(record.date))
      );

      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `status-badge status-${record.status.toLowerCase()}`;
      badge.textContent = record.status;
      statusCell.append(badge);
      row.append(statusCell);

      const actions = document.createElement("td");
      actions.className = "row-actions";
      const editButton = document.createElement("button");
      editButton.className = "table-action";
      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit ${record.petName}'s visit`);
      editButton.addEventListener("click", () => startEdit(record));
      const deleteButton = document.createElement("button");
      deleteButton.className = "table-action table-action-delete";
      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${record.petName}'s visit`);
      deleteButton.addEventListener("click", () => removeRecord(record));
      actions.append(editButton, deleteButton);
      row.append(actions);
      recordsBody.append(row);
    });

    recordCount.textContent = `${records.length} ${records.length === 1 ? "visit" : "visits"}`;
    emptyState.hidden = records.length !== 0;
  }

  function persistAndRender(message) {
    GoodkindData.save(records);
    clearError();
    render();
    statusMessage.textContent = message;
  }

  function startEdit(record) {
    editingId = record.id;
    form.elements.recordId.value = record.id;
    form.elements.petName.value = record.petName;
    form.elements.parentName.value = record.parentName;
    form.elements.service.value = record.service;
    form.elements.date.value = record.date;
    form.elements.status.value = record.status;
    formTitle.textContent = `Edit ${record.petName}'s visit`;
    saveButton.textContent = "Save changes";
    cancelButton.hidden = false;
    form.elements.petName.focus();
    statusMessage.textContent = `Editing ${record.petName}'s visit.`;
  }

  function resetForm() {
    form.reset();
    form.elements.recordId.value = "";
    editingId = null;
    formTitle.textContent = "Add a visit";
    saveButton.textContent = "Add visit";
    cancelButton.hidden = true;
  }

  function removeRecord(record) {
    if (!window.confirm(`Delete ${record.petName}'s ${record.service.toLowerCase()} visit?`)) return;
    const priorRecords = records;
    records = records.filter((item) => item.id !== record.id);
    try {
      persistAndRender(`${record.petName}'s visit was deleted.`);
      if (editingId === record.id) resetForm();
    } catch (error) {
      records = priorRecords;
      render();
      showError(error);
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const values = {
      petName: String(formData.get("petName")).trim(),
      parentName: String(formData.get("parentName")).trim(),
      service: String(formData.get("service")),
      date: String(formData.get("date")),
      status: String(formData.get("status"))
    };
    if (!values.petName || !values.parentName || !GoodkindData.services.includes(values.service) || !GoodkindData.statuses.includes(values.status)) {
      showError(new Error("Enter a pet name, pet parent's name, service, date, and valid status."));
      return;
    }

    const priorRecords = records;
    if (editingId) {
      records = records.map((record) => record.id === editingId ? { ...record, ...values } : record);
    } else {
      records = [...records, { id: `visit-${Date.now()}-${Math.random().toString(16).slice(2)}`, ...values }];
    }

    try {
      persistAndRender(editingId ? `${values.petName}'s visit was updated.` : `${values.petName}'s visit was added.`);
      resetForm();
    } catch (error) {
      records = priorRecords;
      render();
      showError(error);
    }
  });

  cancelButton.addEventListener("click", () => {
    resetForm();
    statusMessage.textContent = "Edit cancelled.";
  });

  try {
    records = GoodkindData.load();
    render();
    storageMessage.hidden = false;
  } catch (error) {
    showError(error);
    recordCount.textContent = "Unavailable";
  }
})();
