const { check } = require("express-validator");
const { validationResult } = require("express-validator");

exports.registerValidator = [
  check("fname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("First name is required!")
    .isString()
    .withMessage("must be a valid first name")
    .isLength({ min: 3, max: 25 })
    .withMessage("First name must be within 3 to 25 characters!"),
  check("lname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Last name is required!")
    .isString()
    .withMessage("must be a valid last name!")
    .isLength({ min: 3, max: 25 })
    .withMessage("Last name must be within 3 to 25 characters!"),
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid Email Address!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is Empty!")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6 characters"),
  check("cpassword")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Confirm Password is Required!")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Both passwords must be the same!");
      }
      return true;
    }),
];

exports.loginValidator = [
  check("email")
    .trim()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email and/or Password must be Correct!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Email and/or Password must be Correct!"),
];

exports.userValidation = (req, res, next) => {
  console.log("hey");
  const result = validationResult(req).array();
  console.log(result);
  if (!result.length) return next();
  const error = result[0].msg;
  req.error = error;
  next();
};
