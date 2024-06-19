export const errorMessages = {
  userExist: "User already exist",
  serverError: "Server error",
  invalidCredentials: "Invalid credentials",
  emailNotConfirmed: "Email not confirmed",
  notFound(type: "User" | "Book") {
    return `${type} not found`;
  },
  emailConfirmed: "Email confirmed successfully",
  bookRemoved: "Book removed",
};
