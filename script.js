const queryType = document.getElementById("queryType");
const sections = {
  select: document.getElementById("selectFields"),
  join: document.getElementById("joinFields"),
  insert: document.getElementById("insertFields"),
  update: document.getElementById("updateFields"),
  delete: document.getElementById("deleteFields"),
};
const sqlOutput = document.getElementById("sqlOutput");
const generateBtn = document.getElementById("generateBtn");
const resetBtn = document.getElementById("resetBtn");
const copyBtn = document.getElementById("copyBtn");

const sqlKeywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP BY",
  "HAVING",
  "ORDER BY",
  "LIMIT",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "FULL",
  "ON",
];

function toggleSections() {
  const type = queryType.value;
  Object.values(sections).forEach((section) => section.classList.add("hidden"));

  if (type === "select") {
    sections.select.classList.remove("hidden");
    sections.join.classList.remove("hidden");
  } else {
    sections[type].classList.remove("hidden");
  }
}

function buildSelectQuery() {
  const table = document.getElementById("selectTable").value.trim();
  const columns = document.getElementById("selectColumns").value.trim() || "*";
  const whereColumn = document.getElementById("whereColumn").value.trim();
  const whereOperator = document.getElementById("whereOperator").value;
  const whereValue = document.getElementById("whereValue").value.trim();
  const groupBy = document.getElementById("groupBy").value.trim();
  const having = document.getElementById("having").value.trim();
  const orderBy = document.getElementById("orderBy").value.trim();
  const orderDirection = document.getElementById("orderDirection").value;
  const limit = document.getElementById("limit").value.trim();

  let query = `SELECT ${columns}\nFROM ${table || "table_name"}`;

  if (whereColumn && whereValue) {
    query += `\nWHERE ${whereColumn} ${whereOperator} ${whereValue}`;
  }

  if (groupBy) {
    query += `\nGROUP BY ${groupBy}`;
  }

  if (having) {
    query += `\nHAVING ${having}`;
  }

  if (orderBy) {
    query += `\nORDER BY ${orderBy} ${orderDirection}`;
  }

  if (limit) {
    query += `\nLIMIT ${limit}`;
  }

  query += ";";

  return query;
}

function buildJoinQuery() {
  const joinType = document.getElementById("joinType").value;
  const tableA = document.getElementById("joinTableA").value.trim() || "TableA";
  const tableB = document.getElementById("joinTableB").value.trim() || "TableB";
  const condition = document.getElementById("joinCondition").value.trim() || "A.id = B.id";

  return `SELECT A.column1, B.column2\nFROM ${tableA} A\n${joinType} ${tableB} B\nON ${condition};`;
}

function buildInsertQuery() {
  const table = document.getElementById("insertTable").value.trim() || "table_name";
  const columns = document.getElementById("insertColumns").value.trim() || "column1, column2";
  const values = document.getElementById("insertValues").value.trim() || "value1, value2";

  return `INSERT INTO ${table} (${columns})\nVALUES (${values});`;
}

function buildUpdateQuery() {
  const table = document.getElementById("updateTable").value.trim() || "table_name";
  const column = document.getElementById("updateColumn").value.trim() || "column";
  const value = document.getElementById("updateValue").value.trim() || "value";
  const where = document.getElementById("updateWhere").value.trim() || "condition";

  return `UPDATE ${table}\nSET ${column} = ${value}\nWHERE ${where};`;
}

function buildDeleteQuery() {
  const table = document.getElementById("deleteTable").value.trim() || "table_name";
  const where = document.getElementById("deleteWhere").value.trim() || "condition";

  return `DELETE FROM ${table}\nWHERE ${where};`;
}

function highlightSQL(sql) {
  let highlighted = sql;

  sqlKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    highlighted = highlighted.replace(regex, `<span class="kw">${keyword}</span>`);
  });

  highlighted = highlighted.replace(/('.*?')/g, `<span class="str">$1</span>`);
  highlighted = highlighted.replace(/\b(\d+)\b/g, `<span class="num">$1</span>`);

  return highlighted;
}

function generateQuery() {
  let query = "";
  const type = queryType.value;

  if (type === "select") {
    query = buildSelectQuery();
    query += "\n\n" + buildJoinQuery();
  }

  if (type === "insert") {
    query = buildInsertQuery();
  }

  if (type === "update") {
    query = buildUpdateQuery();
  }

  if (type === "delete") {
    query = buildDeleteQuery();
  }

  sqlOutput.innerHTML = highlightSQL(query);
}

function resetForm() {
  document.querySelectorAll("input").forEach((input) => (input.value = ""));
  document.querySelectorAll("select").forEach((select) => {
    if (select.id === "queryType") {
      select.value = "select";
    } else {
      select.selectedIndex = 0;
    }
  });

  toggleSections();
  sqlOutput.textContent = "-- Click \"Generate Query\" to see your SQL here.";
}

async function copyQuery() {
  const rawText = sqlOutput.textContent.trim();
  if (!rawText) return;

  try {
    await navigator.clipboard.writeText(rawText);
    copyBtn.textContent = "Copied";
    setTimeout(() => (copyBtn.textContent = "Copy Query"), 1500);
  } catch (error) {
    copyBtn.textContent = "Copy failed";
    setTimeout(() => (copyBtn.textContent = "Copy Query"), 1500);
  }
}

queryType.addEventListener("change", toggleSections);
generateBtn.addEventListener("click", generateQuery);
resetBtn.addEventListener("click", resetForm);
copyBtn.addEventListener("click", copyQuery);

// Initialize the default view.
toggleSections();
