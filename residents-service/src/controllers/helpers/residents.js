import { badRequest, notFound } from "./http.js";
import validator from "validator";

export const invalidPasswordResponse = () =>
  badRequest({
    message: "Password must be at least 6 charachters",
  });

export const invalidEmailResponse = () =>
  badRequest({
    message: "Not a valid email. Please provide a valid one",
  });

export const checkIfPasswordIsValid = (password) => password.length >= 6;

export const checkIfEmailIsValid = (email) => validator.isEmail(email);

export const residentNotFoundResponse = () =>
  notFound({ message: "User not found" });

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () =>
  badRequest({
    message: "The provided id is not valid",
  });
