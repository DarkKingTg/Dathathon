import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const firs = pgTable("firs", {
  fir_id: serial("fir_id").primaryKey(),
  district: varchar("district", { length: 64 }).notNull(),
  station_code: varchar("station_code", { length: 64 }).notNull(),
  bns_section: varchar("bns_section", { length: 64 }).notNull(),
  ipc_section_legacy: varchar("ipc_section_legacy", { length: 64 }).notNull(),
  incident_date: timestamp("incident_date", { mode: "string" }).notNull(),
  status: varchar("status", { length: 64 }).notNull(),
});

export const persons = pgTable("persons", {
  person_id: serial("person_id").primaryKey(),
  full_name: varchar("full_name", { length: 256 }).notNull(),
  dob: timestamp("dob", { mode: "string" }).notNull(),
  gender: varchar("gender", { length: 32 }).notNull(),
  father_name: varchar("father_name", { length: 256 }).notNull(),
  clearance_level: integer("clearance_level").notNull(),
});

export const locations = pgTable("locations", {
  location_id: serial("location_id").primaryKey(),
  fir_id: integer("fir_id").notNull().references(() => firs.fir_id),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  address: text("address").notNull(),
  district: varchar("district", { length: 64 }).notNull(),
});

export const vehicles = pgTable("vehicles", {
  vehicle_id: serial("vehicle_id").primaryKey(),
  fir_id: integer("fir_id").notNull().references(() => firs.fir_id),
  registration_number: varchar("registration_number", { length: 64 }).notNull(),
  vehicle_type: varchar("vehicle_type", { length: 64 }).notNull(),
  model: varchar("model", { length: 128 }).notNull(),
});

export const phone_accounts = pgTable("phone_accounts", {
  phone_id: serial("phone_id").primaryKey(),
  fir_id: integer("fir_id").notNull().references(() => firs.fir_id),
  phone_number: varchar("phone_number", { length: 32 }).notNull(),
  imei: varchar("imei", { length: 64 }).notNull(),
});

export const bank_accounts = pgTable("bank_accounts", {
  account_id: serial("account_id").primaryKey(),
  fir_id: integer("fir_id").notNull().references(() => firs.fir_id),
  bank_name: varchar("bank_name", { length: 128 }).notNull(),
  account_number: varchar("account_number", { length: 64 }).notNull(),
  ifsc_code: varchar("ifsc_code", { length: 32 }).notNull(),
});

export const insertFirSchema = createInsertSchema(firs).omit({ fir_id: true });
export const insertPersonSchema = createInsertSchema(persons).omit({ person_id: true });
export const insertLocationSchema = createInsertSchema(locations).omit({ location_id: true });
export const insertVehicleSchema = createInsertSchema(vehicles).omit({ vehicle_id: true });
export const insertPhoneAccountSchema = createInsertSchema(phone_accounts).omit({ phone_id: true });
export const insertBankAccountSchema = createInsertSchema(bank_accounts).omit({ account_id: true });

export type Fir = typeof firs.$inferSelect;
export type Person = typeof persons.$inferSelect;
export type Location = typeof locations.$inferSelect;
export type Vehicle = typeof vehicles.$inferSelect;
export type PhoneAccount = typeof phone_accounts.$inferSelect;
export type BankAccount = typeof bank_accounts.$inferSelect;
