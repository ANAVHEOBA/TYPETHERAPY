import { NoInput, RequestSchema } from "../schema/common";
import { BadRequest } from "../services/custom-errors";
import jwtService, { JWTUser } from "../services/jwt";
import userRepository from "./user.crud";
import {
  authenticateUserInput,
  createUserInput,
  updateUserInput,
  userVerificationInput,
} from "./user.schema";

class UserController {
  createUser: RequestSchema<typeof createUserInput> = async (req, res) => {
    const { email, firstName, lastName, password } = req.body;

    await userRepository.confirmEmailDoesNotExists(email);

    const user = await userRepository.createUser({
      email,
      firstName,
      lastName,
      password,
    });

    const accessToken = jwtService.createAccessToken({
      email,
      id: user.id,
      verified: user.verified,
    });

    res
      .status(200)
      .json({ message: "User created successfully.", accessToken });
  };

  verifyUser: RequestSchema<typeof userVerificationInput, JWTUser> = async (
    req,
    res
  ) => {
    const { id } = res.locals.user;
    const { otp } = req.body;

    // hard coded for testing purpose
    if (otp !== "0000") {
      throw new BadRequest("Invalid OTP");
    }

    await userRepository.verifyUser(id);

    res.status(200).json({ message: "User has been verified" });
  };

  authenticateUser: RequestSchema<typeof authenticateUserInput> = async (
    req,
    res
  ) => {
    const { email, password } = req.body;

    const user = await userRepository.findUserIfCredentialsAreValid(
      email,
      password
    );

    const accessToken = jwtService.createAccessToken({
      email: user.email,
      id: user.id,
      verified: user.verified,
    });

    res.status(200).json({ accessToken });
  };

  getCurrentUser: RequestSchema<typeof NoInput, JWTUser> = async (req, res) => {
    const { id } = res.locals.user;

    const user = await userRepository.findUserById(id);

    res.status(200).json(user);
  };

  updateUser: RequestSchema<typeof updateUserInput, JWTUser> = async (
    req,
    res
  ) => {
    const { id } = res.locals.user;
    const {
      contact,
      dateOfBirth,
      firstName,
      gender,
      lastName,
      occupation,
      picture,
      bio,
    } = req.body;

    await userRepository.updateUser(id, {
      contact,
      dateOfBirth,
      firstName,
      gender,
      lastName,
      occupation,
      bio,
      picture,
    });

    res.status(200).json({ message: "User updated successfully." });
  };
}

const userController = new UserController();

export default userController;
