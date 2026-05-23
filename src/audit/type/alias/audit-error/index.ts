import { ERROR } from "../../../const/object/error";

export type AuditError = (typeof ERROR)[keyof typeof ERROR];
