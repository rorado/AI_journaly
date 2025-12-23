import LoadingSVG from "@/components/LoadingSVG";
import { createNewUser } from "@/server/createNewUser";
import { styles } from "@/utils/styles";
import React from "react";

const WelcomeNewUser: React.FC = async () => {
  await createNewUser();
  return (
    <div style={styles.container}>
      <LoadingSVG />
    </div>
  );
};
export default WelcomeNewUser;
