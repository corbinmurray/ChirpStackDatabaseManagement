import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "postgres://chirpstack_as_events:dbpassword@localhost:5432/chirpstack_as_events"
);

export const getSequelize = () => {
  if (sequelize) return sequelize;
  return new Sequelize(
    "postgres://chirpstack_as_events:dbpassword@localhost:5432/chirpstack_as_events"
  );
};
