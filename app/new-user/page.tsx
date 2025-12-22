import { createNewUser } from "@/server/createNewUser";
import { styles } from "@/utils/styles";
import React from "react";

const WelcomeNewUser: React.FC = async () => {
  await createNewUser();
  return <div style={styles.container}>loading...</div>;
};
export default WelcomeNewUser;
