"use client";

import React, { useEffect, useState } from "react";
import LoadingSVG from "@/components/LoadingSVG";
import { createNewUser } from "@/server/createNewUser";
import { styles } from "@/utils/styles";

const WelcomeNewUser: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        await createNewUser();
      } catch (error) {
        console.error("Error creating user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  if (loading) {
    return (
      <div style={styles.container} className="bg-background">
        <LoadingSVG />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <p>Welcome! Your account has been created.</p>
    </div>
  );
};

export default WelcomeNewUser;
