import { pool } from "@workspace/db";

export const ensurePostgresSchema = async (): Promise<void> => {
  await Promise.race([
    pool.query(`
      CREATE TABLE IF NOT EXISTS firs (
        fir_id SERIAL PRIMARY KEY,
        district VARCHAR(64) NOT NULL,
        station_code VARCHAR(64) NOT NULL,
        bns_section VARCHAR(64) NOT NULL,
        ipc_section_legacy VARCHAR(64) NOT NULL,
        incident_date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        status VARCHAR(64) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS persons (
        person_id SERIAL PRIMARY KEY,
        full_name VARCHAR(256) NOT NULL,
        dob TIMESTAMP WITHOUT TIME ZONE NOT NULL,
        gender VARCHAR(32) NOT NULL,
        father_name VARCHAR(256) NOT NULL,
        clearance_level INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS locations (
        location_id SERIAL PRIMARY KEY,
        fir_id INTEGER NOT NULL REFERENCES firs(fir_id) ON DELETE CASCADE,
        latitude TEXT NOT NULL,
        longitude TEXT NOT NULL,
        address TEXT NOT NULL,
        district VARCHAR(64) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS vehicles (
        vehicle_id SERIAL PRIMARY KEY,
        fir_id INTEGER NOT NULL REFERENCES firs(fir_id) ON DELETE CASCADE,
        registration_number VARCHAR(64) NOT NULL,
        vehicle_type VARCHAR(64) NOT NULL,
        model VARCHAR(128) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS phone_accounts (
        phone_id SERIAL PRIMARY KEY,
        fir_id INTEGER NOT NULL REFERENCES firs(fir_id) ON DELETE CASCADE,
        phone_number VARCHAR(32) NOT NULL,
        imei VARCHAR(64) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bank_accounts (
        account_id SERIAL PRIMARY KEY,
        fir_id INTEGER NOT NULL REFERENCES firs(fir_id) ON DELETE CASCADE,
        bank_name VARCHAR(128) NOT NULL,
        account_number VARCHAR(64) NOT NULL,
        ifsc_code VARCHAR(32) NOT NULL
      );

      CREATE INDEX IF NOT EXISTS firs_district_idx ON firs(district);
      CREATE INDEX IF NOT EXISTS firs_incident_date_idx ON firs(incident_date);
      CREATE INDEX IF NOT EXISTS firs_bns_section_idx ON firs(bns_section);
    `),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("PostgreSQL connection timeout")), 3000),
    ),
  ]);
};
