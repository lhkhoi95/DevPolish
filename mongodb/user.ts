import { connectToDatabase } from "./database";

export async function addOrUpdateUser(userData: UserData) {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection("users");

    // Check if a user with the same githubUsername already exists
    const existingUser = await usersCollection.findOne({
      githubUsername: userData.githubUsername,
    });

    if (existingUser) {
      // If user exists, update the resumeText and return the updated document
      const updatedUser = await usersCollection.findOneAndUpdate(
        { githubUsername: userData.githubUsername },
        {
          $set: {
            resumeText: userData.resumeText,
          },
        },
        {
          returnDocument: "after",
        }
      );

      return updatedUser ? updatedUser : { error: "User not found." };
    }

    // If not, proceed with inserting the new user
    const result = await usersCollection.insertOne(userData);
    const newUser = await usersCollection.findOne({
      _id: result.insertedId,
    });
    console.log(`New user created with id: ${result.insertedId}`);
    return newUser; // Return the newly inserted user document
  } catch (error) {
    console.error("Error adding or updating user:", error);
    return { error: "An error occurred while adding or updating the user." };
  }
}

export async function retrieveUser(githubUsername: string) {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const usersCollection = db.collection("users");
    const user = usersCollection.findOne({ githubUsername });
    return user;
  } catch (error) {
    console.log("Error retrieving user:", error);
    return { error: "An error occurred while retrieving the user." };
  }
}
