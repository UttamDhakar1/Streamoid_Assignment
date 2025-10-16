const { parseCsvFile } = require("../utils/csvParser");
const { validateProductRow } = require("../utils/validation")
const db = require("../db");
const path = require("path");
const fs = require("fs");

function insertProducts(validRows) {
  const insert = db.prepare(`
    INSERT INTO products
      (sku, name, brand, color, size, mrp, price, quantity)
    VALUES
      (@sku, @name, @brand, @color, @size, @mrp, @price, @quantity)
    ON CONFLICT(sku) DO UPDATE SET
      name = excluded.name,
      brand = excluded.brand,
      color = excluded.color,
      size = excluded.size,
      mrp = excluded.mrp,
      price = excluded.price,
      quantity = excluded.quantity
  `);
  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      insert.run(row);
    }
  });

  insertMany(validRows);
  return validRows.length;
}

const uploadCsv = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = req.file.path;
  let rows;
  try {
    rows = await parseCsvFile(filePath, { skipLines: 0 });
  } catch (err) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: "Failed to parse CSV", details: err.message });
  }

  const valid = [];
  const invalid = [];

  rows.forEach((row, idx) => {
    const { valid: ok, value, errors } = validateProductRow(row);
    if (ok) {
      valid.push(value);
    } else {
      invalid.push({
        row: idx + 1,
        original: row,
        errors,
      });
    }
  });
  
  let insertedCount = 0;
  try {
    insertedCount = insertProducts(valid);
  } catch (dbErr) {
    fs.unlinkSync(filePath);
    return res.status(500).json({ error: "DB insertion failed", details: dbErr.message });
  }

  fs.unlinkSync(filePath);

  res.json({
    insertedCount,
    invalidCount: invalid.length,
    invalidRows: invalid,
  });
}

function listProducts(req, res) {
  const {
    page = 1,
    limit = 10,
    brand,
    color,
    minPrice,
    maxPrice,
    sku,
    name,
  } = req.query;

  const offset = (page - 1) * limit;

  const conditions = [];
  const params = {};

  if (brand) {
    conditions.push("brand = @brand");
    params.brand = brand;
  }
  if (color) {
    conditions.push("color = @color");
    params.color = color;
  }
  if (minPrice) {
    conditions.push("price >= @minPrice");
    params.minPrice = Number(minPrice);
  }
  if (maxPrice) {
    conditions.push("price <= @maxPrice");
    params.maxPrice = Number(maxPrice);
  }
  if (sku) {
    conditions.push("sku = @sku");
    params.sku = sku;
  }
  if (name) {
    conditions.push("name LIKE @name");
    params.name = `%${name}%`;
  }

  let whereClause = "";
  if (conditions.length > 0) {
    whereClause = "WHERE " + conditions.join(" AND ");
  }

  const dataStmt = db.prepare(`
    SELECT * FROM products
    ${whereClause}
    ORDER BY id DESC
    LIMIT @limit OFFSET @offset
  `);
  params.limit = Number(limit);
  params.offset = Number(offset);

  const rows = dataStmt.all(params);

  res.json({
    page: Number(page),
    limit: Number(limit),
    data: rows,
  });
}

module.exports = { uploadCsv, 
    listProducts
};
