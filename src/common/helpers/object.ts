import { Model } from "objection";

export const isTrueModel = (obj: any) => obj instanceof Model && obj !== undefined;