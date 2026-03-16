// lib/mongo-utils.ts
import { ObjectId } from "mongodb";

export function toObjectId(id: any) {
  try {
    return typeof id === "string" ? new ObjectId(id) : id;
  } catch {
    return id;
  }
}
