# Product CSV Uploader & API Backend

A Node.js / Express backend service to allow sellers to upload product data via CSV, validate the data, store valid entries in a database, and provide APIs to list, search, and filter the stored products.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the Server](#running-the-server)  
- [API Endpoints](#api-endpoints)  
  - `POST /upload`  
  - `GET /products`  
  - `GET /products/search`  
- [Validation Rules](#validation-rules)  
- [Error Handling & Reporting](#error-handling--reporting)  
- [Database Schema](#database-schema)  
- [Pagination & Filtering](#pagination--filtering)  
- [Environment Variables](#environment-variables)  
- [Testing](#testing)  
- [Future Improvements / Roadmap](#future-improvements--roadmap)  
- [Contributing](#contributing)  
- [License](#license)  
- [Author / Contact](#author--contact)  

---

## Features

- Accepts CSV (comma-separated) files for bulk product upload  
- Parses CSV in streaming or batch mode  
- Validates each row based on schema + business rules  
- Returns a detailed response of how many records were stored vs how many failed (with row-level error info)  
- Stores valid product records in a database  
- Provides APIs to list all products (with pagination)  
- Provides APIs to search / filter products by brand, color, price range, etc.  
- Supports sorting in responses (optional)  
- Simple, modular structure for controllers, services, validation, etc.

---

## Tech Stack

- **Node.js**  
- **Express.js**  
- CSV parsing library (e.g. `csv-parser`, `fast-csv`)  
- Schema / validation library (e.g. `Joi`, `Zod`)  
- Database (e.g. PostgreSQL, MySQL, or SQLite) + ORM / query builder (e.g. `Sequelize`, `Knex`, `TypeORM`, or even plain `pg`)  
- (Optional) Testing: Jest, Mocha, etc.

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (v14+ or as per your choice)  
- npm or yarn  
- A running database (or local SQLite)  

### Installation

```bash
git clone https://github.com/UttamDhakar1/Streamoid_Assignment.git
cd csv-product-uploader
npm install
